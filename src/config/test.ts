import defaultConfig from './default';

const testConfig = {
  ...defaultConfig,
  logPathName: 'test/flagshipNodeSdkLogs',
  nodeEnv: 'development',
};

export default testConfig;
