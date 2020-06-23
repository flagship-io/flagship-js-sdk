import mockAxios from 'jest-mock-axios';
import demoData from '../../../test/mock/demoData';
import testConfig from '../../config/test';
import Flagship from './flagship';
import flagshipSdk from '../../index';

let sdk: Flagship;
let visitorInstance;

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
            sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, fetchNow: false });
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
            sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, fetchNow: true });
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
            sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, fetchNow: true });
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
            sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, fetchNow: true });
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
            sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, fetchNow: true });
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
            sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, fetchNow: true });
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            expect(visitorInstance.config).toMatchObject({ ...testConfig, fetchNow: true });
            visitorInstance.once('ready', () => {
                done();
            });
            mockAxios.mockResponse(responseObj);
            expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data.campaigns);
        });

        it('should create a Visitor with modifications already loaded and activated if config "activateNow=true"', (done) => {
            sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, activateNow: true });
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            expect(visitorInstance.config).toMatchObject({ ...testConfig, activateNow: true });
            visitorInstance.once('ready', () => {
                try {
                    expect(visitorInstance.fetchedModifications).not.toBe(null);
                    expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
                        vaid: 'blntcamqmdvg04g371hg',
                        cid: 'bn1ab7m56qolupi5sa0g',
                        caid: 'blntcamqmdvg04g371h0',
                        vid: 'test-perf'
                    });
                    expect(mockAxios.post).toHaveBeenNthCalledWith(3, 'https://decision-api.flagship.io/v1/activate', {
                        vaid: 'bmjdprsjan0g01uq2ctg',
                        cid: 'bn1ab7m56qolupi5sa0g',
                        caid: 'bmjdprsjan0g01uq2csg',
                        vid: 'test-perf'
                    });
                    expect(mockAxios.post).toHaveBeenNthCalledWith(4, 'https://decision-api.flagship.io/v1/activate', {
                        vaid: 'bmjdprsjan0g01uq1ctg',
                        cid: 'bn1ab7m56qolupi5sa0g',
                        caid: 'bmjdprsjan0g01uq2ceg',
                        vid: 'test-perf'
                    });
                    done();
                } catch (error) {
                    done.fail(error);
                }
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(
                1,
                `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`,
                { context: demoData.visitor.cleanContext, trigger_hit: true, visitor_id: demoData.visitor.id[0] }
            );
            expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data.campaigns);
        });

        it('should use correct endpoint when "flagshipApi" is set in config', (done) => {
            const mockEndpoint = 'https://decision-api.flagship.io/v999/';
            sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, activateNow: true, flagshipApi: mockEndpoint });
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            expect(visitorInstance.config).toMatchObject({ ...testConfig, activateNow: true, flagshipApi: mockEndpoint });
            visitorInstance.once('ready', () => {
                try {
                    expect(visitorInstance.fetchedModifications).not.toBe(null);
                    expect(mockAxios.post).toHaveBeenNthCalledWith(2, `${mockEndpoint}activate`, {
                        vaid: 'blntcamqmdvg04g371hg',
                        cid: 'bn1ab7m56qolupi5sa0g',
                        caid: 'blntcamqmdvg04g371h0',
                        vid: 'test-perf'
                    });
                    expect(mockAxios.post).toHaveBeenNthCalledWith(3, `${mockEndpoint}activate`, {
                        vaid: 'bmjdprsjan0g01uq2ctg',
                        cid: 'bn1ab7m56qolupi5sa0g',
                        caid: 'bmjdprsjan0g01uq2csg',
                        vid: 'test-perf'
                    });
                    expect(mockAxios.post).toHaveBeenNthCalledWith(4, `${mockEndpoint}activate`, {
                        vaid: 'bmjdprsjan0g01uq1ctg',
                        cid: 'bn1ab7m56qolupi5sa0g',
                        caid: 'bmjdprsjan0g01uq2ceg',
                        vid: 'test-perf'
                    });
                    done();
                } catch (error) {
                    done.fail(error);
                }
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(1, `${mockEndpoint}${demoData.envId[0]}/campaigns?mode=normal`, {
                context: demoData.visitor.cleanContext,
                trigger_hit: true,
                visitor_id: demoData.visitor.id[0]
            });
            expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data.campaigns);
        });

        it('should add "x-api-key" in modifications queries when "apiKey" is set in config', (done) => {
            const mockApiKey = 'toto';
            const endPoint = 'https://decision-api.flagship.io/v1/';
            sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, activateNow: true, apiKey: mockApiKey });
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            expect(visitorInstance.config).toMatchObject({ ...testConfig, activateNow: true, apiKey: mockApiKey });
            visitorInstance.once('ready', () => {
                try {
                    expect(visitorInstance.fetchedModifications).not.toBe(null);
                    expect(mockAxios.post).toHaveBeenNthCalledWith(2, `${endPoint}activate`, {
                        vaid: 'blntcamqmdvg04g371hg',
                        cid: 'bn1ab7m56qolupi5sa0g',
                        caid: 'blntcamqmdvg04g371h0',
                        vid: 'test-perf'
                    });
                    expect(mockAxios.post).toHaveBeenNthCalledWith(3, `${endPoint}activate`, {
                        vaid: 'bmjdprsjan0g01uq2ctg',
                        cid: 'bn1ab7m56qolupi5sa0g',
                        caid: 'bmjdprsjan0g01uq2csg',
                        vid: 'test-perf'
                    });
                    expect(mockAxios.post).toHaveBeenNthCalledWith(4, `${endPoint}activate`, {
                        vaid: 'bmjdprsjan0g01uq1ctg',
                        cid: 'bn1ab7m56qolupi5sa0g',
                        caid: 'bmjdprsjan0g01uq2ceg',
                        vid: 'test-perf'
                    });
                    done();
                } catch (error) {
                    done.fail(error);
                }
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(1, `${endPoint}${demoData.envId[0]}/campaigns?mode=normal`, {
                context: demoData.visitor.cleanContext,
                trigger_hit: true,
                visitor_id: demoData.visitor.id[0],
                'x-api-key': 'toto'
            });
            expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data.campaigns);
        });

        it('should use default config even if user has set empty/undefined values', (done) => {
            responseObj = {
                data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
                status: 200,
                statusText: 'OK'
            };
            const emptyConfig = {
                activateNow: false,
                apiKey: undefined,
                enableConsoleLogs: false,
                enableErrorLayout: true, // simulate extra config from other SDK
                enableSafeMode: false,
                fetchNow: true,
                flagshipApi: undefined,
                nodeEnv: 'production'
            };
            sdk = flagshipSdk.initSdk(demoData.envId[0], { ...emptyConfig });
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            expect(visitorInstance.config).toEqual({
                activateNow: false,
                apiKey: null,
                enableConsoleLogs: false,
                fetchNow: true,
                decisionMode: 'API',
                flagshipApi: 'https://decision-api.flagship.io/v1/',
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
    it('should have setting "initialModifications" working correctly', (done) => {
        const defaultCacheData = demoData.decisionApi.normalResponse.manyModifInManyCampaigns.campaigns;
        sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, fetchNow: false, initialModifications: defaultCacheData });
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
        sdk = flagshipSdk.initSdk(demoData.envId[0], {
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
        sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, fetchNow: true, initialModifications: defaultCacheData });
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
