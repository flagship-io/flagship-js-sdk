import { FsLogger } from '@flagship.io/js-sdk-logs';
import { AxiosResponse } from 'axios';
import { EventEmitter } from 'events';
import Axios from '../../lib/axiosHelper';
import { internalConfig } from '../../config/default';
import { FlagshipSdkConfig, IFlagshipBucketing, IFsPanicMode, IFsCacheManager } from '../../types';
import loggerHelper from '../../lib/loggerHelper';
import { BucketingApiResponse } from './types';
import flagshipSdkHelper from '../../lib/flagshipSdkHelper';

class Bucketing extends EventEmitter implements IFlagshipBucketing {
    data: BucketingApiResponse | null;

    log: FsLogger;

    envId: string;

    cacheManager: IFsCacheManager;

    isPollingRunning: boolean;

    config: FlagshipSdkConfig;

    lastModifiedDate: string | null;

    panic: IFsPanicMode;

    constructor(
        envId: string,
        config: FlagshipSdkConfig,
        panic: IFsPanicMode,
        optional?: {
            localStorage?: IFsCacheManager | null;
        }
    ) {
        super();
        // const defaultOptionalValue = {
        //     localStorage: null
        // };
        // const { localStorage } = { ...defaultOptionalValue, ...optional };
        this.panic = panic;
        this.config = config;
        this.log = loggerHelper.getLogger(this.config, `Flagship SDK - Bucketing`);
        this.envId = envId;
        this.data = (config.initialBucketing && flagshipSdkHelper.checkBucketingApiResponse(config.initialBucketing, this.log)) || null;
        this.isPollingRunning = false;
        this.lastModifiedDate = (this.data && this.data.lastModifiedDate) || null;

        // init listeners
        this.on('launched', (/* {status} */) => {
            if (flagshipSdkHelper.checkPollingIntervalValue(this.config.pollingInterval) === 'ok' && this.isPollingRunning) {
                this.log.debug(`startPolling - polling finished successfully. Next polling in ${this.config.pollingInterval} minute(s)`);
                setTimeout(() => {
                    if (this.isPollingRunning) {
                        this.pollingMechanism();
                    } else {
                        this.log.debug('on("launched") listener - bucketing stop detected.');
                    }
                }, (this.config.pollingInterval as number) * 1000); // nbSeconds * 1000 ms
            } // no need to do logs on "else" statement because already done before
        });

        this.on('error', (error: Error) => {
            if (flagshipSdkHelper.checkPollingIntervalValue(this.config.pollingInterval) === 'ok' && this.isPollingRunning) {
                this.log.error(
                    `startPolling - polling failed with error "${error}". Next polling in ${this.config.pollingInterval} minute(s)`
                );
                setTimeout(() => {
                    this.pollingMechanism();
                }, (this.config.pollingInterval as number) * 60 * 1000);
            }
        });
    }

    private static validateStatus(status): boolean {
        return status < 400; // Resolve only if the status code is less than 400
    }

    public callApi(): Promise<BucketingApiResponse | void> {
        const axiosConfig = {
            headers: {
                'If-Modified-Since': this.lastModifiedDate !== null ? this.lastModifiedDate : ''
            },
            validateStatus: Bucketing.validateStatus
        };
        const url = internalConfig.bucketingEndpoint.replace('@ENV_ID@', this.envId);
        return Axios.get(url, axiosConfig)
            .then(({ data: bucketingData, status, ...other }: AxiosResponse<BucketingApiResponse>) => {
                this.panic.checkPanicMode(bucketingData);
                if (!this.panic.enabled) {
                    if (status === 304) {
                        this.log.info(`callApi - current bucketing up to date (api status=304)`);
                    } else if (status === 200) {
                        if (!other.headers['last-modified']) {
                            this.log.warn(`callApi - http GET request (url="${url}") did not return attribute "last-modified"`);
                        } else {
                            this.lastModifiedDate = other.headers['last-modified'];
                        }
                        this.log.info(`callApi - current bucketing updated`);
                        this.data = { ...bucketingData, lastModifiedDate: this.lastModifiedDate };
                    } else {
                        this.log.error(`callApi - unexpected status (="${status}") received. This polling will be ignored.`);
                    }
                }
                this.emit('launched', { status });
                return bucketingData;
            })
            .catch((response: Error) => {
                this.log.fatal('An error occurred while fetching using bucketing...');
                this.emit('error', response);
            });
    }

    public stopPolling(): void {
        this.isPollingRunning = false;
    }

    private pollingMechanism(): void {
        switch (flagshipSdkHelper.checkPollingIntervalValue(this.config.pollingInterval)) {
            case 'ok':
                this.isPollingRunning = true;
                this.log.debug(`startPolling - starting a new polling...`);
                this.callApi();
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
                    `startPolling - The "pollingInterval" setting is below the limit (${internalConfig.pollingIntervalMinValue} second). The setting will be ignored and the bucketing api will be called only once for initialization.`
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
