import axios, { CancelToken } from 'axios';

import { FlagshipSdkConfig, IFlagshipVisitor } from '../../src/types';
import FlagshipVisitor from '../../src/class/flagshipVisitor/flagshipVisitor';

const assertionHelper = {
    getActivateApiCommonBody: (visitorInstance: IFlagshipVisitor): { [key: string]: string } => {
        return {
            aid: visitorInstance.anonymousId,
            cid: visitorInstance.envId,
            vid: visitorInstance.id
        };
    },
    getApiKeyHeader: (apiKey: string): { headers: { 'x-api-key': string }; cancelToken: CancelToken } => {
        return {
            headers: {
                'x-api-key': apiKey
            },
            cancelToken: axios.CancelToken.source().token
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
        return spyConsoleLogs.mock.calls.filter((call) => call[0].includes(message));
    }
};

export default assertionHelper;
