import { FlagshipSdkInternalConfig, FlagshipSdkConfig } from '../types';

const defaultConfig: FlagshipSdkConfig = {
    fetchNow: false,
    activateNow: false,
    enableConsoleLogs: false,
    decisionMode: 'API',
    nodeEnv: 'production',
    flagshipApi: 'https://decision-api.flagship.io/v1/',
    pollingInterval: null,
    apiKey: null, // TODO: remove next major release
    initialModifications: null
};

export const internalConfig: FlagshipSdkInternalConfig = {
    bucketingEndpoint: 'https://cdn.flagship.io/@ENV_ID@/bucketing.json',
    apiV1: 'https://decision-api.flagship.io/v1/',
    apiV2: 'https://decision.flagship.io/v2/',
    pollingIntervalMinValue: 1 // (= 1 min)
};

export default defaultConfig;
