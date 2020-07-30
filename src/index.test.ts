import flagship from './index';
import Flagship from './class/flagship/flagship';
import testConfig from './config/test';
import defaultConfig from './config/default';

const randomUUID = 'e375004d-1fe3-4dc4-ba28-32b7fdf363ed';

describe('Flagship initialization', () => {
    let spyWarnLogs;
    let spyErrorLogs;
    let spyInfoLogs;
    beforeEach(() => {
        spyWarnLogs = jest.spyOn(console, 'warn').mockImplementation();
        spyErrorLogs = jest.spyOn(console, 'error').mockImplementation();
        spyInfoLogs = jest.spyOn(console, 'log').mockImplementation();
    });
    afterEach(() => {
        spyWarnLogs.mockRestore();
        spyErrorLogs.mockRestore();
        spyInfoLogs.mockRestore();
    });
    it('start should return a Flagship instance', () => {
        const sdk = flagship.start(randomUUID, testConfig);
        expect(sdk).toBeInstanceOf(Flagship);
    });

    it('start should take default config if none is set', () => {
        const sdk = flagship.start(randomUUID);
        expect(sdk.config).toMatchObject(defaultConfig);
    });

    it('start should consider custom config if exist and override default config', () => {
        const customConfig = { ...testConfig, nodeEnv: 'debug' };
        const sdk = flagship.start(randomUUID, customConfig);
        expect(sdk.config).toMatchObject({ ...defaultConfig, ...customConfig });
    });

    it('start should log when a setting is not recognized except for React special settings', () => {
        const customConfig = {
            ...testConfig,
            nodeEnv: 'debug',
            enableConsoleLogs: true,
            unknownSettings: 'hello world'
        };
        const sdk = flagship.start(randomUUID, customConfig);
        const splitElement = spyWarnLogs.mock.calls[0][0].split(' - ');
        expect(sdk.config).toEqual({
            activateNow: false,
            apiKey: null,
            decisionMode: 'API',
            enableConsoleLogs: true,
            fetchNow: false,
            pollingInterval: null,
            flagshipApi: 'https://decision-api.flagship.io/v1/',
            initialModifications: null,
            nodeEnv: 'debug'
        });
        expect(spyWarnLogs).toHaveBeenCalledTimes(1);
        expect(splitElement[2]).toEqual('Unknown key "unknownSettings" detected (with value="hello world"). This key has been ignored...');
    });
});
