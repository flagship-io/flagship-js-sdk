import flagship from './index';
import Flagship from './class/flagship/flagship';
import testConfig from './config/test';
import defaultConfig from './config/default';

const randomUUID = 'e375004d-1fe3-4dc4-ba28-32b7fdf363ed';

describe('Flagship initialization', () => {
  it('initSdk should return a Flagship instance', () => {
    const sdk = flagship.start(randomUUID, testConfig);
    expect(sdk).toBeInstanceOf(Flagship);
  });

  it('initSdk should take default config if none is set', () => {
    const sdk = flagship.start(randomUUID);
    expect(sdk.config).toMatchObject(defaultConfig);
  });

  it('initSdk should consider custom config if exist and override default config', () => {
    const customConfig = { ...testConfig, nodeEnv: 'debug' };
    const sdk = flagship.start(randomUUID, customConfig);
    expect(sdk.config).toMatchObject({ ...defaultConfig, ...customConfig });
  });
});
