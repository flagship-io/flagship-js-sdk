import { FsLogger } from '@flagship.io/js-sdk-logs';
import { EventEmitter } from 'events';

import defaultConfig, { internalConfig } from '../../config/default';
import { FlagshipSdkConfig, IFlagship, IFlagshipBucketing, IFlagshipVisitor, IFsPanicMode } from '../../types';
import flagshipSdkHelper from '../../lib/flagshipSdkHelper';
import loggerHelper from '../../lib/loggerHelper';
import Bucketing from '../bucketing/bucketing';
import { BucketingApiResponse } from '../bucketing/types';
import FlagshipVisitor from '../flagshipVisitor/flagshipVisitor';
import { FlagshipVisitorContext } from '../flagshipVisitor/types';
import PanicMode from '../panicMode/panicMode';
import utilsHelper from '../../lib/utils';

class Flagship implements IFlagship {
    config: FlagshipSdkConfig;

    log: FsLogger;

    eventEmitter: EventEmitter;

    bucket: IFlagshipBucketing | null;

    envId: string;

    panic: IFsPanicMode;

    constructor(envId: string, apiKey?: string, config: { [key: string]: any } = {}) {
        const { cleanConfig: cleanCustomConfig, ignoredConfig } = flagshipSdkHelper.checkConfig(config, apiKey);
        this.config = { ...defaultConfig, ...cleanCustomConfig };
        this.log = loggerHelper.getLogger(this.config);
        this.eventEmitter = new EventEmitter();
        this.bucket = null;
        this.panic = new PanicMode(this.config);
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
            this.bucket = new Bucketing(this.envId, this.config, this.panic);

            if (this.config.fetchNow) {
                this.startBucketingPolling();
            }
        }

        // logs adjustment made on settings
        flagshipSdkHelper.logIgnoredAttributesFromObject(ignoredConfig, this.log, 'custom flagship SDK config');

        if (config.timeout && config.timeout !== this.config.timeout) {
            this.log.warn(
                `"timeout" setting is incorrect (value specified =>"${config.timeout}"). The default value (=${this.config.timeout} seconds) has been set instead.`
            );
        }
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
                newVisitorInfo: `new visitor (id="${id}") check for existing bucketing data (waiting to be ready...)`,
                modificationSuccess: `new visitor (id="${id}") (ready !)`
            }
        };

        this.log.info(`Creating new visitor (id="${id}")`);
        const flagshipVisitorInstance = new FlagshipVisitor(this.envId, this.config, this.bucket, id, context, this.panic);
        if (this.config.fetchNow || this.config.activateNow) {
            this.log.info(logBook[this.config.decisionMode].newVisitorInfo);
            flagshipVisitorInstance
                .getAllModifications(this.config.activateNow, { force: true })
                .then(() => {
                    this.log.info(logBook[this.config.decisionMode].modificationSuccess);
                    (flagshipVisitorInstance as any).callEventEndpoint();
                    flagshipVisitorInstance.emit('ready');
                })
                .catch((response) => {
                    if (this.config.decisionMode !== 'Bucketing') {
                        this.log.fatal(logBook[this.config.decisionMode].modificationFailed(response));
                    }
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

    // Pre-req: envId + visitorId must be the same
    /**
     * @returns {IFlagshipVisitor}
     * @description Used internally only. Don't use it outside the SDK !
     */
    public updateVisitor(visitorInstance: IFlagshipVisitor, context: FlagshipVisitorContext): IFlagshipVisitor {
        this.log.debug(`updateVisitor - updating visitor (id="${visitorInstance.id}")`);
        const flagshipVisitorInstance = new FlagshipVisitor(
            this.envId,
            this.config,
            this.bucket,
            visitorInstance.id,
            context,
            this.panic,
            visitorInstance
        );
        if (
            ((!utilsHelper.deepCompare(visitorInstance.context, context) || flagshipVisitorInstance.fetchedModifications === null) &&
                this.config.fetchNow) ||
            this.config.activateNow
        ) {
            this.log.debug(
                `updateVisitor - visitor(id="${visitorInstance.id}") does not have modifications or context has changed + (fetchNow=${this.config.fetchNow} || activateNow=${this.config.activateNow}) detected, trying a synchronize...`
            );
            flagshipVisitorInstance
                .synchronizeModifications(this.config.activateNow)
                .then(() => {
                    flagshipVisitorInstance.emit('ready');
                })
                .catch(() => {
                    flagshipVisitorInstance.emit('ready');
                });
        } else {
            flagshipVisitorInstance.once('newListener', (event, listener) => {
                if (event === 'ready') {
                    listener();
                }
            });
        }

        return flagshipVisitorInstance;
    }

    public startBucketingPolling(): { success: boolean; reason?: string } {
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
            return {
                success: true
            };
        }
        if (this.bucket !== null && this.bucket.isPollingRunning) {
            this.log.warn(
                `startBucketingPolling - bucket already polling with interval set to "${this.config.pollingInterval}" minute(s).`
            );
            return {
                success: false,
                reason: `startBucketingPolling - bucket already polling with interval set to "${this.config.pollingInterval}" minute(s).`
            };
        }
        this.log.error('startBucketingPolling - bucket not initialized, make sure "decisionMode" is set to "Bucketing"');
        return {
            success: false,
            reason: 'startBucketingPolling - bucket not initialized, make sure "decisionMode" is set to "Bucketing"'
        };
    }

    public stopBucketingPolling(): { success: boolean; reason?: string } {
        if (this.bucket !== null && this.bucket.isPollingRunning) {
            this.bucket.stopPolling();
            this.log.info('stopBucketingPolling - bucketing is stopped');
            return {
                success: true
            };
        }
        this.log.info('stopBucketingPolling - bucketing is already stopped');
        return {
            success: false,
            reason: 'stopBucketingPolling - bucketing is already stopped'
        };
    }
}

export default Flagship;
