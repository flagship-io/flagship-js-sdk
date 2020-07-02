import { FsLogger } from '@flagship.io/js-sdk-logs';
import Axios, { AxiosResponse } from 'axios';
import { EventEmitter } from 'events';

import { internalConfig } from '../../config/default';
import { FlagshipSdkConfig, IFlagshipBucketing } from '../../types';
import loggerHelper from '../../lib/loggerHelper';
import { BucketingApiResponse } from './types';
import flagshipSdkHelper from '../../lib/flagshipSdkHelper';

class Bucketing extends EventEmitter implements IFlagshipBucketing {
    data: BucketingApiResponse | null;

    log: FsLogger;

    envId: string;

    isPollingRunning: boolean;

    config: FlagshipSdkConfig;

    lastModifiedDate: string | null;

    constructor(envId: string, config: FlagshipSdkConfig) {
        super();
        this.config = config;
        this.log = loggerHelper.getLogger(this.config, `Flagship SDK - Bucketing`);
        this.envId = envId;
        this.data = null;
        this.isPollingRunning = false;
        this.lastModifiedDate = null;

        // init listeners
        this.on('launched', () => {
            if (flagshipSdkHelper.checkPollingIntervalValue(this.config.pollingInterval) === 'ok' && this.isPollingRunning) {
                this.log.debug('startPolling - polling finished successfully');
                this.pollingMechanism();
            } // no need to do logs on "else" statement because already done before
        });

        this.on('error', (error: Error) => {
            if (flagshipSdkHelper.checkPollingIntervalValue(this.config.pollingInterval) === 'ok' && this.isPollingRunning) {
                this.log.error(`startPolling - polling failed with error "${error}"`);
                this.pollingMechanism();
            }
        });
    }

    public callApi(): Promise<BucketingApiResponse | void> {
        const axiosConfig = {
            headers: {
                'If-Modified-Since': this.lastModifiedDate !== null ? this.lastModifiedDate : ''
            }
        };
        const url = internalConfig.bucketingEndpoint.replace('@ENV_ID@', this.envId);
        return Axios.get(url, axiosConfig)
            .then(({ data: bucketingData, status, ...other }: AxiosResponse<BucketingApiResponse>) => {
                if (bucketingData.panic) {
                    this.log.warn('Panic mode detected, running SDK in safe mode...');
                } else {
                    if (!other.headers['Last-Modified']) {
                        this.log.warn(`callApi - http GET request (url="${url}") did not return attribute "Last-Modified"`);
                    } else {
                        this.lastModifiedDate = other.headers['Last-Modified'];
                    }
                    if (status === 304) {
                        this.log.info(`callApi - current bucketing up to date (api status=304)`);
                    } else {
                        this.log.info(`callApi - current bucketing updated`);
                        this.data = { ...bucketingData };
                    }
                }
                this.emit('launched');
                return bucketingData;
            })
            .catch((response: Error) => {
                this.log.fatal('An error occurred while fetching using bucketing...');
                this.emit('error', response);
            });
    }

    private pollingMechanism(): void {
        switch (flagshipSdkHelper.checkPollingIntervalValue(this.config.pollingInterval)) {
            case 'ok':
                this.isPollingRunning = true;
                setTimeout(() => {
                    this.log.debug(`startPolling - starting a new polling...`);
                    this.callApi();
                }, (this.config.pollingInterval as number) * 1000);
                break;

            case 'notSupported':
                this.isPollingRunning = false;
                this.log.error(
                    `startPolling - The "pollingInterval" setting has value="${this.config.pollingInterval}" and type="${typeof this.config
                        .pollingInterval}" which is not supported. The setting will be ignored and the bucketing api will be called only once for initialization.)`
                );
                this.callApi();
                break;
            case 'underLimit':
            default:
                this.isPollingRunning = false;
                this.log.error(
                    `startPolling - The "pollingInterval" setting is below the limit (${internalConfig.pollingIntervalMinValue}minute(s). The setting will be ignored and the bucketing api will be called only once for initialization.)`
                );
                this.callApi();
        }
    }

    public startPolling(): void {
        if (this.isPollingRunning) {
            this.log.warn('startPolling - already running');
            return;
        }

        if (this.data === null) {
            this.log.debug('startPolling - initializing bucket');
        }

        this.pollingMechanism();
    }
}

export default Bucketing;
