import { FsLogger } from '@flagship.io/js-sdk-logs';
import { EventEmitter } from 'events';

import defaultConfig, { internalConfig } from '../../config/default';
import { FlagshipSdkConfig, IFlagship, IFlagshipBucketing, IFlagshipVisitor } from '../../types';
import flagshipSdkHelper from '../../lib/flagshipSdkHelper';
import loggerHelper from '../../lib/loggerHelper';
import Bucketing from '../bucketing/bucketing';
import { BucketingApiResponse } from '../bucketing/types';
import FlagshipVisitor from '../flagshipVisitor/flagshipVisitor';
import { FlagshipVisitorContext } from '../flagshipVisitor/types';

class Flagship implements IFlagship {
    config: FlagshipSdkConfig;

    log: FsLogger;

    eventEmitter: EventEmitter;

    bucket: IFlagshipBucketing | null;

    envId: string;

    constructor(envId: string, apiKey?: string, config = {}) {
        const { cleanConfig: cleanCustomConfig, ignoredConfig } = flagshipSdkHelper.checkConfig(config, apiKey);
        this.config = { ...defaultConfig, ...cleanCustomConfig };
        this.log = loggerHelper.getLogger(this.config);
        this.eventEmitter = new EventEmitter();
        this.bucket = null;
        this.envId = envId;
        if (!apiKey) {
            this.log.warn(
                'WARNING: "start" function signature will change in the next major release. "start(envId, settings)" will be "start(envId, apiKey, settings)", please make this change ASAP!'
            );
        } else if (this.config && this.config.apiKey && flagshipSdkHelper.isUsingFlagshipApi('v1', this.config)) {
            // force API v2 if apiKey is set, whatever how
            this.config.flagshipApi = internalConfig.apiV2;
            this.log.debug('apiKey detected, forcing the use of Flagship api V2');
        }
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
        const logBook = {
            API: {
                newVisitorInfo: `new visitor (id="${id}") calling decision API for initialization (waiting to be ready...)`,
                modificationSuccess: `new visitor (id="${id}") decision API finished (ready !)`,
                modificationFailed: (error: Error): string =>
                    `new visitor (id="${id}") decision API failed during initialization with error "${error}"`
            },
            Bucketing: {
                newVisitorInfo: `new visitor (id="${id}") calling bucketing API for initialization (waiting to be ready...)`,
                modificationSuccess: `new visitor (id="${id}") bucketing API finished (ready !)`,
                modificationFailed: (error: Error): string =>
                    `new visitor (id="${id}") bucket API failed during initialization with error "${error}"`
            }
        };

        this.log.info(`Creating new visitor (id="${id}")`);
        const flagshipVisitorInstance = new FlagshipVisitor(this.envId, this.config, this.eventEmitter, this.bucket, id, context);
        if (this.config.fetchNow || this.config.activateNow) {
            this.log.info(logBook[this.config.decisionMode].newVisitorInfo);
            flagshipVisitorInstance
                .getAllModifications(this.config.activateNow, { force: true })
                .then(() => {
                    this.log.info(logBook[this.config.decisionMode].modificationSuccess);
                    flagshipVisitorInstance.emit('ready');
                })
                .catch((response) => {
                    this.log.fatal(logBook[this.config.decisionMode].modificationFailed(response));
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

    public startBucketingPolling(): void {
        if (this.bucket !== null && !this.bucket.isPollingRunning) {
            this.bucket.startPolling();
            this.bucket.on('launched', ({ status }) => {
                this.eventEmitter.emit('bucketPollingSuccess', {
                    status,
                    payload: (this.bucket as IFlagshipBucketing).data as BucketingApiResponse
                });
            });
            this.bucket.on('error', (error: Error) => {
                this.eventEmitter.emit('bucketPollingFailed', error);
            });
        } else if (this.bucket !== null && this.bucket.isPollingRunning) {
            this.log.warn(
                `startBucketingPolling - bucket already polling with interval set to "${this.config.pollingInterval}" minute(s).`
            );
        } else {
            this.log.error('startBucketingPolling - bucket not initialized, make sure "decisionMode" is set to "Bucketing"');
        }
    }
}

export default Flagship;
