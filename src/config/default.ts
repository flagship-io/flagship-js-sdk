import { FlagshipSdkInternalConfig, FlagshipSdkConfig } from '../types';

const defaultConfig: FlagshipSdkConfig = {
    fetchNow: true,
    activateNow: false,
    enableConsoleLogs: false,
    decisionMode: 'API',
    nodeEnv: 'production',
    flagshipApi: 'https://decision-api.flagship.io/v1/',
    pollingInterval: null,
    apiKey: null, // TODO: remove next major release
    timeout: 60, // seconds
    initialBucketing: null,
    initialModifications: null,
    internal: {
        react: null,
        reactNative: {
            httpCallback: null
        }
    }
};

export const internalConfig: FlagshipSdkInternalConfig = {
    campaignNormalEndpoint: '@API_URL@@ENV_ID@/campaigns?mode=normal',
    bucketingEndpoint: 'https://cdn.flagship.io/@ENV_ID@/bucketing.json',
    apiV1: 'https://decision-api.flagship.io/v1/',
    apiV2: 'https://decision.flagship.io/v2/',
    pollingIntervalMinValue: 1 // (= 1 sec)
};

export default defaultConfig;
