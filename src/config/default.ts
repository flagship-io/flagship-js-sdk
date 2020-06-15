import { FlagshipSdkInternalConfig, FlagshipSdkConfig } from '../index.d';


const defaultConfig: FlagshipSdkConfig = {
  fetchNow: false,
  activateNow: false,
  enableConsoleLogs: false,
  decisionMode: 'API',
  nodeEnv: 'production',
  flagshipApi: 'https://decision-api.flagship.io/v1/',
  apiKey: null,
  initialModifications: null,
};

export const internalConfig: FlagshipSdkInternalConfig = {
  bucketingEndpoint: 'http://cdn.flagship.io/@ENV_ID@/bucketing.json',
};

export default defaultConfig;
