import flagship from './index';
import Flagship from './class/flagship/flagship';
import testConfig from './config/test';
import defaultConfig, { internalConfig } from './config/default';
import demoData from '../test/mock/demoData';

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
        const sdk = flagship.start(randomUUID, demoData.apiKey[0], testConfig);
        expect(sdk).toBeInstanceOf(Flagship);
    });

    it('start should take default config if none is set', () => {
        const sdk = flagship.start(randomUUID, demoData.apiKey[0]);
        expect(sdk.config).toMatchObject({ ...defaultConfig, apiKey: demoData.apiKey[0], flagshipApi: internalConfig.apiV2 });
    });

    it('start should consider custom config if exist and override default config', () => {
        const customConfig = { ...testConfig, nodeEnv: 'debug' };
        const sdk = flagship.start(randomUUID, demoData.apiKey[0], customConfig);
        expect(sdk.config).toMatchObject({
            ...defaultConfig,
            ...customConfig,
            apiKey: demoData.apiKey[0],
            flagshipApi: internalConfig.apiV2
        });
    });

    it('start should log when a setting is not recognized except for React special settings', () => {
        const customConfig = {
            ...testConfig,
            nodeEnv: 'debug',
            enableConsoleLogs: true,
            unknownSettings: 'hello world'
        };
        const sdk = flagship.start(randomUUID, demoData.apiKey[0], customConfig);
        const splitElement1 = spyWarnLogs.mock.calls[0][0].split(' - ');
        expect(sdk.config).toEqual({
            activateNow: false,
            apiKey: demoData.apiKey[0],
            decisionMode: 'API',
            enableConsoleLogs: true,
            fetchNow: false,
            pollingInterval: null,
            flagshipApi: internalConfig.apiV2,
            initialModifications: null,
            nodeEnv: 'debug'
        });
        expect(spyWarnLogs).toHaveBeenCalledTimes(1);

        expect(splitElement1[2]).toEqual('Unknown key "unknownSettings" detected (with value="hello world"). This key has been ignored...');
    });

    it('start should warn deprecated start even if apiKey is defined in the settings', () => {
        const customConfig = {
            ...testConfig,
            nodeEnv: 'debug',
            enableConsoleLogs: true,
            apiKey: demoData.apiKey[0],
            unknownSettings: 'hello world'
        };
        const sdk = flagship.start(randomUUID, customConfig);
        const splitElement1 = spyWarnLogs.mock.calls[0][0].split(' - ');
        const splitElement2 = spyWarnLogs.mock.calls[1][0].split(' - ');
        expect(sdk.config).toEqual({
            activateNow: false,
            apiKey: demoData.apiKey[0],
            decisionMode: 'API',
            enableConsoleLogs: true,
            fetchNow: false,
            pollingInterval: null,
            flagshipApi: 'https://decision-api.flagship.io/v1/',
            initialBucketing: null,
            initialModifications: null,
            nodeEnv: 'debug'
        });
        expect(spyWarnLogs).toHaveBeenCalledTimes(2);

        // TODO: temporary until major release
        expect(splitElement1[2]).toEqual(
            'WARNING: "start" function signature will change in the next major release. "start(envId, settings)" will be "start(envId, apiKey, settings)", please make this change ASAP!'
        );
        expect(splitElement2[2]).toEqual('Unknown key "unknownSettings" detected (with value="hello world"). This key has been ignored...');
    });
});
