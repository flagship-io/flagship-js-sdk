import { EventEmitter } from 'events';
import { FsLogger } from '@flagship.io/js-sdk-logs';
import { BucketingApiResponse } from '../bucketing/bucketing.d';
import { FlagshipSdkConfig, IFlagship, IFlagshipVisitor, IFlagshipBucketing } from '../../index.d';
import loggerHelper from '../../lib/loggerHelper';
import flagshipSdkHelper from '../../lib/flagshipSdkHelper';
import { FlagshipVisitorContext, DecisionApiResponseData } from '../flagshipVisitor/flagshipVisitor.d';
import FlagshipVisitor from '../flagshipVisitor/flagshipVisitor';
import defaultConfig from '../../config/default';
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
            this.bucket = new Bucketing(this.envId, this.config, this.envId);

            if (this.config.fetchNow) {
                this.startBucketingPolling();
            }
        }
        flagshipSdkHelper.logIgnoredAttributesFromObject(ignoredConfig, this.log, 'custom flagship SDK config');
    }

    public newVisitor(id: string, context: FlagshipVisitorContext): IFlagshipVisitor {
        this.log.info(`Creating new visitor (id="${id}")`);
        const flagshipVisitorInstance = new FlagshipVisitor(this.envId, this.config, this.eventEmitter, this.bucket, id, context);

        if (this.config.fetchNow || this.config.activateNow) {
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
        const pollingMechanism = () => {
            setTimeout(() => {
                this.log.debug(`bucketingPolling - starting a new polling...`);
                if (this.bucket === null) {
                    this.log.error("bucketingPolling - can't poll because bucket is null");
                } else {
                    this.bucket.launch();
                }
            }, this.config.pollingInterval);
        };

        if ((this.bucket as IFlagshipBucketing).data === null) {
            this.log.debug('bucketingPolling - initializing a new bucket');
        }

        (this.bucket as IFlagshipBucketing).on('launched', () => {
            // const transformedBucketingData = (this.bucket as IFlagshipBucketing).computedData as DecisionApiResponseData;
            // this.saveModificationsInCache(transformedBucketingData.campaigns);
            // resolve(
            //     this.fetchAllModificationsPostProcess(transformedBucketingData, {
            //         ...defaultArgs,
            //         ...args
            //     }) as DecisionApiResponse
            // );
            this.log.debug('bucketingPolling - polling finished successfully');
            this.eventEmitter.emit('bucketPollingSuccess', (this.bucket as IFlagshipBucketing).data as BucketingApiResponse);
            pollingMechanism();
        });
        (this.bucket as IFlagshipBucketing).on('error', (error: Error) => {
            // this.saveModificationsInCache(null);
            // if (activate) {
            //     this.log.fatal('fetchAllModifications - activate canceled due to errors...');
            // }
            // reject(error);
            this.log.error(`bucketingPolling - polling failed with error "${error}"`);
            this.eventEmitter.emit('bucketPollingFailed');
        });
        pollingMechanism();
    }
}

export default Flagship;
