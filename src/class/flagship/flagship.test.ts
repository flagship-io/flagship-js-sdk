import mockAxios from 'jest-mock-axios';
import { internalConfig } from '../../config/default';
import { IFlagshipVisitor } from '../../types';
import demoData from '../../../test/mock/demoData';
import testConfig from '../../config/test';
import Flagship from './flagship';
import flagshipSdk from '../../index';

let sdk: Flagship;
let visitorInstance: IFlagshipVisitor;

let responseObj = {
    data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
    status: 200,
    statusText: 'OK'
};
let spyWarnConsoleLogs;
let spyErrorConsoleLogs;
let spyInfoConsoleLogs;

let spyWarnLogs;
let spyErrorLogs;
let spyFatalLogs;
let spyInfoLogs;
let spyDebugLogs;

const initSpyLogs = (classInstance) => {
    spyWarnLogs = jest.spyOn(classInstance.log, 'warn');
    spyErrorLogs = jest.spyOn(classInstance.log, 'error');
    spyFatalLogs = jest.spyOn(classInstance.log, 'fatal');
    spyInfoLogs = jest.spyOn(classInstance.log, 'info');
    spyDebugLogs = jest.spyOn(classInstance.log, 'debug');
    return {
        spyWarnLogs,
        spyErrorLogs,
        spyFatalLogs,
        spyInfoLogs,
        spyDebugLogs
    };
};

describe('FlagshipVisitor', () => {
    beforeEach(() => {
        spyWarnConsoleLogs = jest.spyOn(console, 'warn').mockImplementation();
        spyErrorConsoleLogs = jest.spyOn(console, 'error').mockImplementation();
        spyInfoConsoleLogs = jest.spyOn(console, 'log').mockImplementation();
    });
    afterEach(() => {
        spyWarnConsoleLogs.mockRestore();
        spyErrorConsoleLogs.mockRestore();
        spyInfoConsoleLogs.mockRestore();
        mockAxios.reset();
    });
    describe('newVisitor function', () => {
        it('should have .once("ready") triggered also when fetchNow=false', (done) => {
            const mockFn = jest.fn();
            sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...testConfig, fetchNow: false });
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            visitorInstance.on('ready', () => {
                try {
                    mockFn();
                    expect(mockFn).toHaveBeenCalledTimes(1);
                    done();
                } catch (error) {
                    done.fail(error);
                }
            });
        });

        it('should have .on("saveCache") triggered when initializing with a fetchNow=true', (done) => {
            const mockFn = jest.fn();
            let modificationsWhichWillBeSavedInCache;
            sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...testConfig, fetchNow: true });
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            visitorInstance.on('saveCache', (args) => {
                try {
                    mockFn();
                    expect(mockFn).toHaveBeenCalledTimes(1);
                    expect(typeof args.saveInCacheModifications).toEqual('function');
                    expect(typeof args.modifications).toEqual('object');
                    expect(Object.prototype.hasOwnProperty.call(args.modifications, 'before')).toEqual(true);
                    expect(Object.prototype.hasOwnProperty.call(args.modifications, 'after')).toEqual(true);
                    expect(Object.keys(args.modifications).length).toEqual(2);
                    expect(Object.keys(args).length).toEqual(2);
                    modificationsWhichWillBeSavedInCache = args.modifications.after;
                } catch (error) {
                    done.fail(error);
                }
            });
            visitorInstance.once('ready', () => {
                try {
                    expect(visitorInstance.fetchedModifications).toEqual(modificationsWhichWillBeSavedInCache);
                    done();
                } catch (error) {
                    done.fail(error);
                }
            });
            mockAxios.mockResponse(responseObj);
        });

        it('should log fatal error when decision api failed during a fetchNow=true', (done) => {
            sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...testConfig, fetchNow: true });
            initSpyLogs(sdk);
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            visitorInstance.once('ready', () => {
                try {
                    expect(spyInfoLogs).toHaveBeenNthCalledWith(1, 'Creating new visitor (id="test-perf")');
                    expect(spyInfoLogs).toHaveBeenNthCalledWith(
                        2,
                        'new visitor (id="test-perf") calling decision API for initialization (waiting to be ready...)'
                    );
                    expect(spyDebugLogs).toHaveBeenCalledTimes(0);
                    expect(spyWarnLogs).toHaveBeenCalledTimes(0);
                    expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                    expect(spyFatalLogs).toHaveBeenNthCalledWith(
                        1,
                        'new visitor (id="test-perf") decision API failed during initialization with error "server crashed"'
                    );
                    expect(visitorInstance.fetchedModifications).toEqual(null);
                    done();
                } catch (error) {
                    done.fail(error);
                }
            });
            mockAxios.mockError('server crashed');
        });

        it('should have ability to return custom modifications with "saveCache" event', (done) => {
            const mockFn = jest.fn();
            const modificationsWhichWillBeSavedInCache = demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign.campaigns;
            sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...testConfig, fetchNow: true });
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            visitorInstance.on('saveCache', (args) => {
                try {
                    mockFn();
                    expect(mockFn).toHaveBeenCalledTimes(1);
                    expect(typeof args.saveInCacheModifications).toEqual('function');
                    expect(typeof args.modifications).toEqual('object');
                    expect(Object.prototype.hasOwnProperty.call(args.modifications, 'before')).toEqual(true);
                    expect(Object.prototype.hasOwnProperty.call(args.modifications, 'after')).toEqual(true);
                    expect(Object.keys(args.modifications).length).toEqual(2);
                    expect(Object.keys(args).length).toEqual(2);
                    args.saveInCacheModifications(modificationsWhichWillBeSavedInCache);
                } catch (error) {
                    done.fail(error);
                }
            });
            visitorInstance.once('ready', () => {
                try {
                    expect(visitorInstance.fetchedModifications).toEqual(modificationsWhichWillBeSavedInCache);
                    done();
                } catch (error) {
                    done.fail(error);
                }
            });
            mockAxios.mockResponse(responseObj);
        });

        it('should return default modifications if user badly use "saveCache" event', (done) => {
            const mockFn = jest.fn();
            let modificationsWhichWillBeSavedInCache;
            sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...testConfig, fetchNow: true });
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            visitorInstance.on('saveCache', (args) => {
                try {
                    mockFn();
                    expect(mockFn).toHaveBeenCalledTimes(1);
                    expect(typeof args.saveInCacheModifications).toEqual('function');
                    expect(typeof args.modifications).toEqual('object');
                    expect(Object.prototype.hasOwnProperty.call(args.modifications, 'before')).toEqual(true);
                    expect(Object.prototype.hasOwnProperty.call(args.modifications, 'after')).toEqual(true);
                    expect(Object.keys(args.modifications).length).toEqual(2);
                    expect(Object.keys(args).length).toEqual(2);
                    modificationsWhichWillBeSavedInCache = args.modifications.after;
                    args.saveInCacheModifications();
                } catch (error) {
                    done.fail(error);
                }
            });
            visitorInstance.once('ready', () => {
                try {
                    expect(visitorInstance.fetchedModifications).toEqual(modificationsWhichWillBeSavedInCache);
                    done();
                } catch (error) {
                    done.fail(error);
                }
            });
            mockAxios.mockResponse(responseObj);
        });

        it('should create a Visitor with modifications already loaded if config "fetchNow=true"', (done) => {
            responseObj = {
                data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
                status: 200,
                statusText: 'OK'
            };
            sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...testConfig, fetchNow: true });
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            expect(visitorInstance.config).toMatchObject({
                ...testConfig,
                fetchNow: true,
                apiKey: demoData.apiKey[0],
                flagshipApi: internalConfig.apiV2
            });
            visitorInstance.once('ready', () => {
                done();
            });
            mockAxios.mockResponse(responseObj);
            expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data.campaigns);
        });

        it('should create a Visitor with modifications already loaded and activated if config "activateNow=true"', (done) => {
            sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...testConfig, activateNow: true });
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            expect(visitorInstance.config).toMatchObject({
                ...testConfig,
                activateNow: true,
                apiKey: demoData.apiKey[0],
                flagshipApi: internalConfig.apiV2
            });
            visitorInstance.once('ready', () => {
                try {
                    expect(visitorInstance.fetchedModifications).not.toBe(null);
                    expect(mockAxios.post).toHaveBeenNthCalledWith(
                        2,
                        `${internalConfig.apiV2}activate`,
                        {
                            vaid: 'blntcamqmdvg04g371hg',
                            cid: 'bn1ab7m56qolupi5sa0g',
                            caid: 'blntcamqmdvg04g371h0',
                            vid: 'test-perf',
                            'x-api-key': demoData.apiKey[0]
                        },
                        {}
                    );
                    expect(mockAxios.post).toHaveBeenNthCalledWith(
                        3,
                        `${internalConfig.apiV2}activate`,
                        {
                            vaid: 'bmjdprsjan0g01uq2ctg',
                            cid: 'bn1ab7m56qolupi5sa0g',
                            caid: 'bmjdprsjan0g01uq2csg',
                            vid: 'test-perf',
                            'x-api-key': demoData.apiKey[0]
                        },
                        {}
                    );
                    expect(mockAxios.post).toHaveBeenNthCalledWith(
                        4,
                        `${internalConfig.apiV2}activate`,
                        {
                            vaid: 'bmjdprsjan0g01uq1ctg',
                            cid: 'bn1ab7m56qolupi5sa0g',
                            caid: 'bmjdprsjan0g01uq2ceg',
                            vid: 'test-perf',
                            'x-api-key': demoData.apiKey[0]
                        },
                        {}
                    );
                    done();
                } catch (error) {
                    done.fail(error);
                }
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(
                1,
                `${internalConfig.apiV2}${demoData.envId[0]}/campaigns?mode=normal`,
                {
                    context: demoData.visitor.cleanContext,
                    trigger_hit: true,
                    visitor_id: demoData.visitor.id[0],
                    'x-api-key': demoData.apiKey[0]
                },
                { params: { exposeAllKeys: true } }
            );
            expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data.campaigns);
        });

        it('should use correct endpoint when "flagshipApi" is set in config', (done) => {
            const mockEndpoint = 'https://decision-api.flagship.io/v999/';
            sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...testConfig, activateNow: true, flagshipApi: mockEndpoint });
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            expect(visitorInstance.config).toMatchObject({
                ...testConfig,
                activateNow: true,
                flagshipApi: mockEndpoint,
                apiKey: demoData.apiKey[0]
            });
            visitorInstance.once('ready', () => {
                try {
                    expect(visitorInstance.fetchedModifications).not.toBe(null);
                    expect(mockAxios.post).toHaveBeenNthCalledWith(
                        2,
                        `${mockEndpoint}activate`,
                        {
                            vaid: 'blntcamqmdvg04g371hg',
                            cid: 'bn1ab7m56qolupi5sa0g',
                            caid: 'blntcamqmdvg04g371h0',
                            vid: 'test-perf',
                            'x-api-key': demoData.apiKey[0]
                        },
                        {}
                    );
                    expect(mockAxios.post).toHaveBeenNthCalledWith(
                        3,
                        `${mockEndpoint}activate`,
                        {
                            vaid: 'bmjdprsjan0g01uq2ctg',
                            cid: 'bn1ab7m56qolupi5sa0g',
                            caid: 'bmjdprsjan0g01uq2csg',
                            vid: 'test-perf',
                            'x-api-key': demoData.apiKey[0]
                        },
                        {}
                    );
                    expect(mockAxios.post).toHaveBeenNthCalledWith(
                        4,
                        `${mockEndpoint}activate`,
                        {
                            vaid: 'bmjdprsjan0g01uq1ctg',
                            cid: 'bn1ab7m56qolupi5sa0g',
                            caid: 'bmjdprsjan0g01uq2ceg',
                            vid: 'test-perf',
                            'x-api-key': demoData.apiKey[0]
                        },

                        {}
                    );
                    done();
                } catch (error) {
                    done.fail(error);
                }
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(
                1,
                `${mockEndpoint}${demoData.envId[0]}/campaigns?mode=normal`,
                {
                    context: demoData.visitor.cleanContext,
                    trigger_hit: true,
                    visitor_id: demoData.visitor.id[0],
                    'x-api-key': demoData.apiKey[0]
                },
                { params: { exposeAllKeys: true } }
            );
            expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data.campaigns);
        });

        it('should add "x-api-key" in modifications queries when "apiKey" is set in config and api is not V1', (done) => {
            const mockApiKey = demoData.apiKey[0];
            const endPoint = demoData.api.v2;
            sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], {
                ...testConfig,
                activateNow: true,
                flagshipApi: endPoint
            });
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            expect(visitorInstance.config).toMatchObject({ ...testConfig, activateNow: true, apiKey: mockApiKey, flagshipApi: endPoint });
            visitorInstance.once('ready', () => {
                try {
                    expect(visitorInstance.fetchedModifications).not.toBe(null);
                    expect(mockAxios.post).toHaveBeenNthCalledWith(
                        2,
                        `${endPoint}activate`,
                        {
                            vaid: 'blntcamqmdvg04g371hg',
                            cid: 'bn1ab7m56qolupi5sa0g',
                            caid: 'blntcamqmdvg04g371h0',
                            'x-api-key': demoData.apiKey[0],
                            vid: 'test-perf'
                        },
                        {}
                    );
                    expect(mockAxios.post).toHaveBeenNthCalledWith(
                        3,
                        `${endPoint}activate`,
                        {
                            vaid: 'bmjdprsjan0g01uq2ctg',
                            cid: 'bn1ab7m56qolupi5sa0g',
                            caid: 'bmjdprsjan0g01uq2csg',
                            'x-api-key': demoData.apiKey[0],
                            vid: 'test-perf'
                        },
                        {}
                    );
                    expect(mockAxios.post).toHaveBeenNthCalledWith(
                        4,
                        `${endPoint}activate`,
                        {
                            vaid: 'bmjdprsjan0g01uq1ctg',
                            cid: 'bn1ab7m56qolupi5sa0g',
                            caid: 'bmjdprsjan0g01uq2ceg',
                            'x-api-key': demoData.apiKey[0],
                            vid: 'test-perf'
                        },
                        {}
                    );
                    done();
                } catch (error) {
                    done.fail(error);
                }
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(
                1,
                `${endPoint}${demoData.envId[0]}/campaigns?mode=normal`,
                {
                    context: demoData.visitor.cleanContext,

                    trigger_hit: true,
                    visitor_id: demoData.visitor.id[0],
                    'x-api-key': demoData.apiKey[0]
                },
                { params: { exposeAllKeys: true } }
            );
            expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data.campaigns);
        });

        it('if happens, should report that "x-api-key" is missing when api v2 detected', (done) => {
            sdk = flagshipSdk.start(demoData.envId[0], undefined, {
                ...testConfig,
                fetchNow: false,
                flagshipApi: internalConfig.apiV2
            });
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            initSpyLogs(visitorInstance);
            visitorInstance.once('ready', () => {
                try {
                    visitorInstance
                        .synchronizeModifications()
                        .then(() => {
                            expect(spyFatalLogs).toHaveBeenCalledTimes(1);
                            expect(spyFatalLogs).toHaveBeenNthCalledWith(
                                1,
                                'initialization - flagshipApi v2 detected but required setting "apiKey" is missing !'
                            );
                            done();
                        })
                        .catch((e) => {
                            done.fail(`unexpected ${e}`);
                        });
                } catch (error) {
                    done.fail(error);
                }
            });

            mockAxios.mockResponse(responseObj);
        });

        it('should report error logs when a Visitor instance has bad context', (done) => {
            sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...testConfig });
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], {
                nullKey: null,
                undefinedKey: undefined,
                ...demoData.visitor.cleanContext
            });
            visitorInstance.once('ready', () => {
                try {
                    expect(visitorInstance.context).toEqual({ pos: 'es' });
                    done();
                } catch (error) {
                    done.fail(error);
                }
            });
        });
        it('should use default config even if user has set empty/undefined values', (done) => {
            responseObj = {
                data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
                status: 200,
                statusText: 'OK'
            };
            const emptyConfig = {
                activateNow: false,
                enableConsoleLogs: false,
                enableErrorLayout: true, // simulate extra config from other SDK
                enableSafeMode: false,
                fetchNow: true,
                flagshipApi: undefined,
                nodeEnv: 'production'
            };
            sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...emptyConfig });
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            expect(visitorInstance.config).toEqual({
                activateNow: false,
                enableConsoleLogs: false,
                fetchNow: true,
                decisionMode: 'API',
                apiKey: demoData.apiKey[0],
                pollingInterval: null,
                flagshipApi: internalConfig.apiV2,
                initialBucketing: null,
                initialModifications: null,
                nodeEnv: 'production'
            });
            visitorInstance.once('ready', () => {
                done();
            });
            mockAxios.mockResponse(responseObj);
            expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data.campaigns);
        });
    });
    describe('bucketing', () => {
        it('should report an error if trying to start bucketing but decisionMode is not set to "Bucketing"', (done) => {
            sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...testConfig, fetchNow: false });
            initSpyLogs(sdk);
            sdk.startBucketingPolling();

            expect(spyWarnLogs).toHaveBeenCalledTimes(0);
            expect(spyDebugLogs).toHaveBeenCalledTimes(0);
            expect(spyErrorLogs).toHaveBeenCalledTimes(1);
            expect(spyFatalLogs).toHaveBeenCalledTimes(0);
            expect(spyInfoLogs).toHaveBeenCalledTimes(0);

            expect(spyErrorLogs).toHaveBeenNthCalledWith(
                1,
                'startBucketingPolling - bucket not initialized, make sure "decisionMode" is set to "Bucketing"'
            );

            expect(sdk.bucket).toEqual(null);
            done();
        });
    });
    it('should have setting "initialModifications" working correctly', (done) => {
        const defaultCacheData = demoData.decisionApi.normalResponse.manyModifInManyCampaigns.campaigns;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], {
            ...testConfig,
            fetchNow: false,
            initialModifications: defaultCacheData
        });
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        visitorInstance.on('ready', () => {
            try {
                expect(mockAxios.post).toHaveBeenCalledTimes(0);
                expect(visitorInstance.fetchedModifications).toEqual(defaultCacheData);
                done();
            } catch (error) {
                done.fail(error);
            }
        });
    });
    it('should not consider setting "initialModifications" if not set correctly', (done) => {
        const defaultCacheData = [
            {
                toto: 123
            },
            {
                id: 'blntcamqmdvg04g371f0',
                variation: {
                    id: 'blntcamqmdvg04g371hg',
                    modifications: {
                        type: 'FLAG',
                        value: {
                            psp: 'dalenys',
                            algorithmVersion: 'new'
                        }
                    }
                }
            }
        ];
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], {
            ...testConfig,
            enableConsoleLogs: true,
            fetchNow: false,
            initialModifications: defaultCacheData
        });
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);

        visitorInstance.on('ready', () => {
            try {
                expect(mockAxios.post).toHaveBeenCalledTimes(0);
                expect(visitorInstance.fetchedModifications).toEqual(null);
                expect(spyErrorConsoleLogs).toHaveBeenCalledTimes(1);

                const spyResult = spyErrorConsoleLogs.mock.calls[0][0];
                expect(spyResult.includes('Decision Api data does not have correct format')).toBe(true);
                // expect(spyResult).toBe(true);
                expect(spyResult.includes('Element at index=0:')).toBe(true);
                expect(spyResult.includes('- "id" Id is missing.')).toBe(true);
                expect(spyResult.includes('- "variationGroupId" Variation group id is missing.')).toBe(true);
                expect(spyResult.includes('- "variation.id" Variation id is missing.')).toBe(true);
                expect(spyResult.includes('- "variation.modifications.type" Variation modifications type is missing.')).toBe(true);
                expect(spyResult.includes('- "variation.modifications.value" Variation modifications value is missing.')).toBe(true);
                expect(spyResult.includes('Element at index=1:')).toBe(true);
                expect(spyResult.includes('- "variationGroupId" Variation group id is missing.')).toBe(true);
                expect(spyResult.includes('Element at index=0:')).toBe(true);
                expect(spyResult.includes('Element at index=0:')).toBe(true);
                expect(spyResult.includes('Element at index=0:')).toBe(true);
                expect(spyResult.includes('Element at index=0:')).toBe(true);

                done();
            } catch (error) {
                done.fail(error);
            }
        });
    });
    it('should fetch decision api if "initialModifications" and "fetchNow" are set', (done) => {
        const defaultCacheData = demoData.decisionApi.normalResponse.manyModifInManyCampaigns.campaigns;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], {
            ...testConfig,
            fetchNow: true,
            initialModifications: defaultCacheData
        });
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        visitorInstance.on('ready', () => {
            try {
                expect(mockAxios.post).toHaveBeenCalledTimes(1);
                expect(visitorInstance.fetchedModifications).toEqual(
                    demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign.campaigns
                );
                done();
            } catch (error) {
                done.fail(error);
            }
        });

        mockAxios.mockResponse(responseObj);
    });
});
