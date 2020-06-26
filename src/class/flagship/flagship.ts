import { EventEmitter } from 'events';
import { FsLogger } from '@flagship.io/js-sdk-logs';
import defaultConfig, { internalConfig } from '../../config/default';
import { BucketingApiResponse } from '../bucketing/bucketing.d';
import { FlagshipSdkConfig, IFlagship, IFlagshipVisitor, IFlagshipBucketing } from '../../index.d';
import loggerHelper from '../../lib/loggerHelper';
import flagshipSdkHelper from '../../lib/flagshipSdkHelper';
import { FlagshipVisitorContext, DecisionApiResponseData } from '../flagshipVisitor/flagshipVisitor.d';
import FlagshipVisitor from '../flagshipVisitor/flagshipVisitor';

import Bucketing from '../bucketing/bucketing';

class Flagship implements IFlagship {
    config: FlagshipSdkConfig;

    log: FsLogger;

    eventEmitter: EventEmitter;

    bucket: IFlagshipBucketing | null;

    envId: string;

    constructor(envId: string, config = {}) {
        const { cleanConfig: cleanCustomConfig, ignoredConfig } = flagshipSdkHelper.checkConfig(config);
        this.config = { ...defaultConfig, ...cleanCustomConfig };
        this.log = loggerHelper.getLogger(this.config);
        this.eventEmitter = new EventEmitter();
        this.bucket = null;
        this.envId = envId;
        if (cleanCustomConfig) {
            this.log.debug('Custom flagship SDK config attribute(s) detected');
        }
        if (this.config.decisionMode === 'Bucketing') {
            this.bucket = new Bucketing(this.envId, this.config);

            if (this.config.fetchNow) {
                this.startBucketingPolling();
            }
        }
        flagshipSdkHelper.logIgnoredAttributesFromObject(ignoredConfig, this.log, 'custom flagship SDK config');
    }

    public newVisitor(id: string, context: FlagshipVisitorContext): IFlagshipVisitor {
        this.log.info(`Creating new visitor (id="${id}")`);
        const flagshipVisitorInstance = new FlagshipVisitor(this.envId, this.config, this.eventEmitter, this.bucket, id, context);
        if (this.config.decisionMode === 'Bucketing') {
            this.eventEmitter.once('bucketPollingSuccess', () => {
                flagshipVisitorInstance.emit('ready');
            });
            this.eventEmitter.once('bucketPollingFailed', (error) => {
                this.log.fatal(`new visitor (id="${id}") decision API failed during initialization with error "${error}"`);
                flagshipVisitorInstance.emit('ready');
            });
        } else if (this.config.fetchNow || this.config.activateNow) {
            this.log.info(`new visitor (id="${id}") calling decision API for initialization (waiting to be ready...)`);
            flagshipVisitorInstance
                .getAllModifications(this.config.activateNow, { force: true })
                .then(() => {
                    this.log.info(`new visitor (id="${id}") decision API finished (ready !)`);
                    flagshipVisitorInstance.emit('ready');
                })
                .catch((response) => {
                    this.log.fatal(
                        `new visitor (id="${id}") decision API failed during initialization with error "${
                            response && ((response.data && response.data.toString()) || response.toString())
                        }"`
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

    private startBucketingPolling(): void {
        const pollingMechanism = (): void => {
            const callBucketing = (): void => {
                if (this.bucket === null) {
                    this.log.error("bucketingPolling - can't poll because bucket is null");
                } else {
                    this.bucket.launch();
                }
            };
            switch (flagshipSdkHelper.checkPollingIntervalValue(this.config.pollingInterval)) {
                case 'ok':
                    setTimeout(() => {
                        this.log.debug(`bucketingPolling - starting a new polling...`);
                        callBucketing();
                    }, this.config.pollingInterval as number);
                    break;
                case 'notDefined':
                    this.log.info(
                        `startBucketingPolling - No "pollingInterval" attribute set, the bucketing api will be called only once for initialization.`
                    );
                    callBucketing();
                    break;
                case 'underLimit':
                default:
                    this.log.error(
                        `startBucketingPolling - The "pollingInterval" setting is below the limit (${internalConfig.pollingIntervalMinValue}ms. The setting will be ignored and the bucketing api will be called only once for initialization.)`
                    );
                    callBucketing();
            }
        };

        if ((this.bucket as IFlagshipBucketing).data === null) {
            this.log.debug('bucketingPolling - initializing a new bucket');
        }

        (this.bucket as IFlagshipBucketing).on('launched', () => {
            this.log.debug('bucketingPolling - polling finished successfully');
            this.eventEmitter.emit('bucketPollingSuccess', (this.bucket as IFlagshipBucketing).data as BucketingApiResponse);
            if (flagshipSdkHelper.checkPollingIntervalValue(this.config.pollingInterval) === 'ok') {
                pollingMechanism();
            }
        });

        (this.bucket as IFlagshipBucketing).on('error', (error: Error) => {
            this.log.error(`bucketingPolling - polling failed with error "${error}"`);
            this.eventEmitter.emit('bucketPollingFailed');
            if (flagshipSdkHelper.checkPollingIntervalValue(this.config.pollingInterval) === 'ok') {
                pollingMechanism();
            }
        });
        pollingMechanism();
    }
}

export default Flagship;
