import axios, { CancelToken } from 'axios';

import { FlagshipSdkConfig } from '../../src/types';

const assertionHelper = {
    getCommonEmptyHeaders: (): { headers: {}; cancelToken: CancelToken } => {
        return {
            headers: {},
            cancelToken: axios.CancelToken.source().token
        }
    },
    getApiKeyHeader: (apiKey: string): { headers: { 'x-api-key': string }; cancelToken: CancelToken } => {
        return {
            headers: {
                'x-api-key': apiKey
            },
            cancelToken: axios.CancelToken.source().token
        };
    },
    getCampaignsQueryParams: (): { params: { exposeAllKeys: boolean; sendContextEvent: boolean } } => {
        return {
            params: {
                exposeAllKeys: true,
                sendContextEvent: false
            }
        };
    },
    getTimeout: (url: string, config: FlagshipSdkConfig): { timeout: number } => {
        return { timeout: url.includes('/campaigns') ? config.timeout * 1000 : undefined };
    }
};

export default assertionHelper;
