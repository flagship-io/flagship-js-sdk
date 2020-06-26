import { FlagshipSdkInternalConfig, FlagshipSdkConfig } from '../index.d';

const defaultConfig: FlagshipSdkConfig = {
    fetchNow: false,
    activateNow: false,
    enableConsoleLogs: false,
    decisionMode: 'API',
    nodeEnv: 'production',
    flagshipApi: 'https://decision-api.flagship.io/v1/',
    pollingInterval: null,
    apiKey: null,
    initialModifications: null
};

export const internalConfig: FlagshipSdkInternalConfig = {
    bucketingEndpoint: 'http://cdn.flagship.io/@ENV_ID@/bucketing.json',
    pollingIntervalMinValue: 120000 // ms (= 2 min)
};

export default defaultConfig;
