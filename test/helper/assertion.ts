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
    }
};

export default assertionHelper;
