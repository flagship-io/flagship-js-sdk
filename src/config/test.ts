import defaultConfig from './default';

const testConfig = {
    ...defaultConfig,
    nodeEnv: 'development'
};

export const demoPollingInterval = 0.005; // 60 000 * 0.022 = 1320 ms (1.3 sec)

export default testConfig;
