import { FsLogger } from '@flagship.io/js-sdk-logs';
import { FlagshipSdkConfig, IFlagship, IFlagshipVisitor } from '../../index.d';
import loggerHelper from '../../lib/loggerHelper';
import flagshipSdkHelper from '../../lib/flagshipSdkHelper';
import { FlagshipVisitorContext } from '../flagshipVisitor/flagshipVisitor.d';
import FlagshipVisitor from '../flagshipVisitor/flagshipVisitor';
import defaultConfig from '../../config/default';

class Flagship implements IFlagship {
  config: FlagshipSdkConfig;

  log: FsLogger;

  envId: string;

  constructor(envId: string, config = {}) {
    const { cleanConfig: cleanCustomConfig, ignoredConfig } = flagshipSdkHelper.checkConfig(config);
    this.config = { ...defaultConfig, ...cleanCustomConfig };
    this.log = loggerHelper.getLogger(this.config);
    this.envId = envId;
    if (cleanCustomConfig) {
      this.log.debug('Custom flagship SDK config attribute(s) detected');
    }
    flagshipSdkHelper.logIgnoredAttributesFromObject(ignoredConfig, this.log, 'custom flagship SDK config');
  }

  public newVisitor(id: string, context: FlagshipVisitorContext): IFlagshipVisitor {
    this.log.info(`Creating new visitor (id="${id}")`);
    const flagshipVisitorInstance = new FlagshipVisitor(this.envId, this.config, id, context);

    if (this.config.fetchNow || this.config.activateNow) {
      this.log.info(`new visitor (id="${id}") calling decision API for initialization (waiting to be ready...)`);
      flagshipVisitorInstance.getAllModifications(this.config.activateNow, { force: true })
        .then(() => {
          this.log.info(`new visitor (id="${id}") decision API finished (ready !)`);
          flagshipVisitorInstance.emit('ready');
        }).catch((response) => {
          this.log.fatal(
            `new visitor (id="${id}") decision API failed during initialization with error ${response && ((response.data && response.data.toString()) || response.toString())}`,
          );
          flagshipVisitorInstance.emit('ready');
        });
    } else {
      // Before emit('ready'), make sure there is listener to it
      flagshipVisitorInstance.once('newListener', (event, listener) => {
        if (event === 'ready') {
          listener();
        }
      });
    }
    return flagshipVisitorInstance;
  }
}

export default Flagship;
