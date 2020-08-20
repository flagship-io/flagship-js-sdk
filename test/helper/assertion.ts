const assertionHelper = {
    getApiKeyHeader: (apiKey: string): { headers: { 'x-api-key': string } } => {
        return {
            headers: {
                'x-api-key': apiKey
            }
        };
    }
};

export default assertionHelper;
