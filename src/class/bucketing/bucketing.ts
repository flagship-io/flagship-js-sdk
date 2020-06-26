import { FsLogger } from '@flagship.io/js-sdk-logs';
import Axios, { AxiosResponse } from 'axios';
import { EventEmitter } from 'events';

import { internalConfig } from '../../config/default';
import { FlagshipSdkConfig, IFlagshipBucketing } from '../../index.d';
import loggerHelper from '../../lib/loggerHelper';
import { BucketingApiResponse } from './bucketing.d';

class Bucketing extends EventEmitter implements IFlagshipBucketing {
    data: BucketingApiResponse | null;

    log: FsLogger;

    envId: string;

    config: FlagshipSdkConfig;

    lastModifiedDate: string | null;

    constructor(envId: string, config: FlagshipSdkConfig) {
        super();
        this.config = config;
        this.log = loggerHelper.getLogger(this.config, `Flagship SDK - Bucketing`);
        this.envId = envId;
        this.data = null;
        this.lastModifiedDate = null;
    }

    public launch(): Promise<BucketingApiResponse | void> {
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
                        this.log.warn(`launch - http GET request (url="${url}") did not return attribute "Last-Modified"`);
                    } else {
                        this.lastModifiedDate = other.headers['Last-Modified'];
                    }
                    if (status === 301) {
                        this.log.info(`launch - current bucketing up to date (api status=304)`);
                    } else {
                        this.log.info(`launch - current bucketing updated`);
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
}

export default Bucketing;
