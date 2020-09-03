import { FlagshipSdkConfig } from '../../src/types';

const assertionHelper = {
    getApiKeyHeader: (apiKey: string): { headers: { 'x-api-key': string } } => {
        return {
            headers: {
                'x-api-key': apiKey
            }
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
