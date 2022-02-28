import { CancelToken } from 'axios';
import { version } from '../../package.json';
import { defaultAxios } from '../../src/lib/axiosHelper';

import { FlagshipSdkConfig, IFlagshipVisitor } from '../../src/types';

const assertionHelper = {
    getActivateApiCommonBody: (visitorInstance: IFlagshipVisitor): { [key: string]: string } => {
        return {
            aid: visitorInstance.anonymousId,
            cid: visitorInstance.envId,
            vid: visitorInstance.id
        };
    },
    getCommonEmptyHeaders: (): { headers: {}; cancelToken: CancelToken; timeout: undefined } => {
        return {
            headers: {
                'x-sdk-client': 'js',
                'x-sdk-version': version
            },
            timeout: undefined,
            cancelToken: defaultAxios.CancelToken.source().token
        };
    },
    getApiKeyHeader: (
        apiKey: string
    ): { headers: { 'x-api-key': string; 'x-sdk-client': string; 'x-sdk-version': string }; cancelToken: CancelToken } => {
        return {
            headers: {
                'x-api-key': apiKey,
                'x-sdk-client': 'js',
                'x-sdk-version': version
            },
            cancelToken: defaultAxios.CancelToken.source().token
        };
    },
    getCampaignsCommonBody: (visitorInstance: IFlagshipVisitor): { [key: string]: any } => {
        return {
            context: visitorInstance.context,
            trigger_hit: visitorInstance.config.activateNow,
            visitor_id: visitorInstance.id,
            anonymous_id: visitorInstance.anonymousId
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
    },
    extractLogsThatReportedMessage: (message: string, spyConsoleLogs: any): any[] => {
        return spyConsoleLogs.mock.calls.filter((call) => (call[0] as string).toLowerCase().includes(message.toLowerCase()));
    },
    containsLogThatContainingMessage: (message: string, spyTypeLog: any): string[] => {
        return spyTypeLog?.mock?.calls?.filter((log) => log[0].includes(message)).map((log) => log[0]) || [];
    }
};

export default assertionHelper;
