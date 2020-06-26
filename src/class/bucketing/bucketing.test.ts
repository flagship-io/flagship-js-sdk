import mockAxios from 'jest-mock-axios';
import { FlagshipVisitorContext } from '../flagshipVisitor/flagshipVisitor.d';
import { BucketingApiResponse } from './bucketing.d';
import { FlagshipSdkConfig, IFlagshipVisitor, IFlagshipBucketing, IFlagship } from '../../index.d';

import flagshipSdk from '../../index';
import demoData from '../../../test/mock/demoData';
import testConfig from '../../config/test';
import { internalConfig } from '../../config/default';
import Bucketing from './bucketing';

let sdk: IFlagship;
let visitorInstance: IFlagshipVisitor;
let bucketInstance: IFlagshipBucketing;
let responseObject: object;

let spyWarnLogs;
let spyErrorLogs;
let spyFatalLogs;
let spyInfoLogs;
let spyDebugLogs;

let bucketSpy;
let spyThen;
let spyCatch;

let bucketingApiMockResponse: BucketingApiResponse;

const bucketingApiMockOtherResponse: { status: number; headers: { 'Last-Modified': string } } = {
    status: 200,
    headers: { 'Last-Modified': 'Wed, 18 Mar 2020 23:29:16 GMT' }
};

const mockComputedData = {
    campaigns: [
        {
            id: 'bptggipaqi903f3haq0g',
            variation: { id: 'bptggipaqi903f3haq2g', modifications: { type: 'JSON', value: { testCache: 'value' } } },
            variationGroupId: 'bptggipaqi903f3haq1g'
        },
        {
            id: 'bq4sf09oet0006cfihd0',
            variation: {
                id: 'bq4sf09oet0006cfihf0',
                modifications: {
                    type: 'JSON',
                    value: { 'btn-color': 'green', 'btn-text': 'Buy now with discount !', 'txt-color': '#A3A3A3' }
                }
            },
            variationGroupId: 'bq4sf09oet0006cfihe0'
        }
    ],
    visitorId: 'test-perf'
};

const bucketingConfig: FlagshipSdkConfig = {
    ...testConfig,
    fetchNow: true,
    decisionMode: 'Bucketing'
};

const initSpyLogs = (bInstance) => {
    spyWarnLogs = jest.spyOn(bInstance.log, 'warn');
    spyErrorLogs = jest.spyOn(bInstance.log, 'error');
    spyFatalLogs = jest.spyOn(bInstance.log, 'fatal');
    spyInfoLogs = jest.spyOn(bInstance.log, 'info');
    spyDebugLogs = jest.spyOn(bInstance.log, 'debug');
};

const expectedRequestHeaderFirstCall = { headers: { 'If-Modified-Since': '' } };
const expectedRequestHeaderNotFirstCall = { headers: { 'If-Modified-Since': 'Wed, 18 Mar 2020 23:29:16 GMT' } };

describe('Bucketing used from visitor instance', () => {
    beforeEach(() => {
        //
    });
    afterEach(() => {
        sdk = null;
        bucketingApiMockResponse = null;
        visitorInstance = null;
        bucketInstance = null;
        mockAxios.reset();
    });

    it('should have correct behavior when there is an error during bucketing + activate', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.initSdk(demoData.envId[0], { ...bucketingConfig, fetchNow: false });
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        initSpyLogs(visitorInstance);
        visitorInstance.getAllModifications(true).catch((err) => {
            expect(err).toEqual('bucketing server crash');
            expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'fetchAllModifications - initializing a new bucket');
            expect(spyDebugLogs).toHaveBeenNthCalledWith(2, 'Saving in cache those modifications: "null"');
            expect(spyInfoLogs).toHaveBeenCalledTimes(0);
            expect(spyErrorLogs).toHaveBeenCalledTimes(0);
            expect(spyFatalLogs).toHaveBeenNthCalledWith(1, 'fetchAllModifications - activate canceled due to errors...');
            expect(spyWarnLogs).toHaveBeenCalledTimes(0);
            expect(visitorInstance.bucket instanceof Bucketing).toEqual(true);
            done();
        });
        mockAxios.mockError('bucketing server crash');
        expect(mockAxios.get).toHaveBeenNthCalledWith(
            1,
            internalConfig.bucketingEndpoint.replace('@ENV_ID@', visitorInstance.envId),
            expectedRequestHeaderFirstCall
        );
        visitorInstance.on('ready', () => {
            try {
                expect(visitorInstance.fetchedModifications).toEqual(null);
            } catch (error) {
                done.fail(error);
            }
        });
    });

    it('should have correct behavior for bucketing cache api handling', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.initSdk(demoData.envId[0], bucketingConfig);
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        initSpyLogs(visitorInstance);
        expect(visitorInstance.bucket instanceof Bucketing).toEqual(true);
        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse });
        visitorInstance.on('ready', () => {
            try {
                initSpyLogs(visitorInstance);
                visitorInstance.getAllModifications(false, { force: true }).then((data) => {
                    expect(data).toEqual({
                        data: {
                            campaigns: [
                                {
                                    id: 'bptggipaqi903f3haq0g',
                                    variation: {
                                        id: 'bptggipaqi903f3haq2g',
                                        modifications: { type: 'JSON', value: { testCache: 'value' } }
                                    },
                                    variationGroupId: 'bptggipaqi903f3haq1g'
                                },
                                {
                                    id: 'bq4sf09oet0006cfihd0',
                                    variation: {
                                        id: 'bq4sf09oet0006cfihf0',
                                        modifications: {
                                            type: 'JSON',
                                            value: { 'btn-color': 'green', 'btn-text': 'Buy now with discount !', 'txt-color': '#A3A3A3' }
                                        }
                                    },
                                    variationGroupId: 'bq4sf09oet0006cfihe0'
                                }
                            ],
                            visitorId: 'test-perf'
                        }
                    });
                    expect(spyDebugLogs).toHaveBeenCalledTimes(7);
                    expect(spyDebugLogs).toHaveBeenNthCalledWith(
                        3,
                        'fetchAllModifications - already initialized bucket detected. With visitor context: {"pos":"es"}'
                    );
                    expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                    expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                    expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                    expect(spyWarnLogs).toHaveBeenCalledTimes(0);
                    done();
                });
                mockAxios.mockResponse({ data: {}, ...bucketingApiMockOtherResponse, status: 304 });
            } catch (error) {
                done.fail(error);
            }
        });
    });

    it('should warn when synchronizing and no fetch have been done before', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.initSdk(demoData.envId[0], { ...bucketingConfig, fetchNow: false });
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        initSpyLogs(visitorInstance);
        expect(visitorInstance.bucket).toEqual(null);
        expect(visitorInstance.fetchedModifications).toEqual(null);
        visitorInstance.synchronizeModifications().then(() => {
            try {
                expect(mockAxios.get).toHaveBeenNthCalledWith(
                    1,
                    internalConfig.bucketingEndpoint.replace('@ENV_ID@', visitorInstance.envId),
                    expectedRequestHeaderFirstCall
                );

                expect(spyDebugLogs).toHaveBeenCalledTimes(3);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    1,
                    'synchronizeModifications - trying to synchronize modifications in bucketing mode but bucket is null. You might have call synchronizeModifications too early. A new bucket will be initialized.'
                );
                expect(spyWarnLogs).toHaveBeenCalledTimes(1);
                expect(visitorInstance.fetchedModifications[0].id === demoData.bucketing.classical.campaigns[0].id).toEqual(true);
                expect(visitorInstance.fetchedModifications[1].id === demoData.bucketing.classical.campaigns[1].id).toEqual(true);
                expect(visitorInstance.bucket instanceof Bucketing).toEqual(true);
                done();
            } catch (error) {
                done.fail(error);
            }
        });
        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse });
    });

    it('should consider bucketing cache behavior + new visitor context when sync modifs and bucketing already init', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.initSdk(demoData.envId[0], bucketingConfig);
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        expect(visitorInstance.bucket instanceof Bucketing).toEqual(true);
        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse });
        expect(mockAxios.get).toHaveBeenNthCalledWith(
            1,
            internalConfig.bucketingEndpoint.replace('@ENV_ID@', visitorInstance.envId),
            expectedRequestHeaderFirstCall
        );
        const nextStep = () => {
            const newVisitorContext = { foo1: 'yes1' };
            visitorInstance.updateContext(newVisitorContext); // simulate new visitor context
            bucketingApiMockResponse = demoData.bucketing.oneCampaignOneVgMultipleTgg as BucketingApiResponse;
            initSpyLogs(visitorInstance);
            visitorInstance.synchronizeModifications().then(() => {
                expect(mockAxios.get).toHaveBeenNthCalledWith(
                    1,
                    internalConfig.bucketingEndpoint.replace('@ENV_ID@', visitorInstance.envId),
                    expectedRequestHeaderFirstCall
                );

                expect(spyDebugLogs).toHaveBeenCalledTimes(6);
                expect(spyDebugLogs).toHaveBeenNthCalledWith(
                    1,
                    `synchronizeModifications - updating bucketing visitor context from {"pos":"es"} to ${JSON.stringify(
                        newVisitorContext
                    )}`
                );
                expect(spyDebugLogs).toHaveBeenNthCalledWith(
                    2,
                    `fetchAllModifications - already initialized bucket detected. With visitor context: ${JSON.stringify(
                        newVisitorContext
                    )}`
                );
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(
                    visitorInstance.fetchedModifications[0].id === demoData.bucketing.oneCampaignOneVgMultipleTgg.campaigns[0].id
                ).toEqual(true);
                expect(visitorInstance.fetchedModifications.length).toEqual(1);
                expect(visitorInstance.bucket instanceof Bucketing).toEqual(true);
                expect(visitorInstance.bucket.visitorContext).toEqual(newVisitorContext);
                done();
            });

            mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse });
        };
        visitorInstance.on('ready', () => {
            try {
                expect(visitorInstance.fetchedModifications[0].id === demoData.bucketing.classical.campaigns[0].id).toEqual(true);
                expect(visitorInstance.fetchedModifications[1].id === demoData.bucketing.classical.campaigns[1].id).toEqual(true);
                nextStep();
            } catch (error) {
                done.fail(error);
            }
        });
    });

    it('should trigger bucketing behavior when creating new visitor with config having "bucketing" in decision mode + fetchNow=true', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.initSdk(demoData.envId[0], bucketingConfig);
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        expect(visitorInstance.bucket instanceof Bucketing).toEqual(true);
        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse });
        expect(mockAxios.get).toHaveBeenNthCalledWith(
            1,
            internalConfig.bucketingEndpoint.replace('@ENV_ID@', visitorInstance.envId),
            expectedRequestHeaderFirstCall
        );
        visitorInstance.on('ready', () => {
            try {
                expect(visitorInstance.fetchedModifications[0].id === demoData.bucketing.classical.campaigns[0].id).toEqual(true);
                expect(visitorInstance.fetchedModifications[1].id === demoData.bucketing.classical.campaigns[1].id).toEqual(true);
                done();
            } catch (error) {
                done.fail(error);
            }
        });
    });

    it('should NOT trigger bucketing behavior when creating new visitor with config having "bucketing" in decision mode + fetchNow=false', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.initSdk(demoData.envId[0], { ...bucketingConfig, fetchNow: false });
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        expect(visitorInstance.bucket).toEqual(null);
        expect(mockAxios.get).toHaveBeenCalledTimes(0);
        visitorInstance.on('ready', () => {
            try {
                expect(visitorInstance.fetchedModifications).toEqual(null);
                done();
            } catch (error) {
                done.fail(error);
            }
        });
    });
});

describe('Bucketing - callApi', () => {
    beforeEach(() => {
        spyCatch = jest.fn();
        spyThen = jest.fn();
    });
    afterEach(() => {
        sdk = null;
        bucketingApiMockResponse = null;
        visitorInstance = null;
        bucketInstance = null;

        mockAxios.reset();
    });

    it('should report some logs when bucket api do not return "Last-modified" attribute', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig);

        expect(bucketInstance.data).toEqual(null);

        initSpyLogs(bucketInstance);

        bucketInstance.on('launched', () => {
            try {
                expect(mockAxios.get).toHaveBeenNthCalledWith(
                    1,
                    internalConfig.bucketingEndpoint.replace('@ENV_ID@', bucketInstance.envId),
                    expectedRequestHeaderFirstCall
                );

                expect(spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(1);
                expect(spyWarnLogs).toHaveBeenCalledTimes(1);

                expect(spyInfoLogs).toHaveBeenNthCalledWith(1, 'callApi - current bucketing updated');
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    1,
                    'callApi - http GET request (url="http://cdn.flagship.io/bn1ab7m56qolupi5sa0g/bucketing.json") did not return attribute "Last-Modified"'
                );

                expect(bucketInstance.data).toEqual(bucketingApiMockResponse);

                done();
            } catch (error) {
                done.fail(error);
            }
        });

        bucketInstance.on('error', () => {
            done.fail('not supposed to be here');
        });

        bucketInstance.callApi();
        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse, headers: {} });
    });

    it('should works with "classical" bucket api response', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig);

        expect(bucketInstance.data).toEqual(null);

        initSpyLogs(bucketInstance);

        bucketInstance.on('launched', () => {
            try {
                expect(mockAxios.get).toHaveBeenNthCalledWith(
                    1,
                    internalConfig.bucketingEndpoint.replace('@ENV_ID@', bucketInstance.envId),
                    expectedRequestHeaderFirstCall
                );

                expect(spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(1);

                expect(spyInfoLogs).toHaveBeenNthCalledWith(1, 'callApi - current bucketing updated');

                expect(bucketInstance.data).toEqual(bucketingApiMockResponse);

                done();
            } catch (error) {
                done.fail(error);
            }
        });

        bucketInstance.on('error', () => {
            done.fail('not supposed to be here');
        });

        bucketInstance.callApi();
        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse });
    });

    it('should handle status=304', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig);

        // simulate already a previous call - BEGIN
        bucketInstance.lastModifiedDate = 'Wed, 18 Mar 2020 23:29:16 GMT';
        bucketInstance.data = bucketingApiMockResponse;
        // simulate already a previous call - END

        initSpyLogs(bucketInstance);
        bucketInstance.callApi();

        bucketInstance.on('launched', () => {
            try {
                expect(mockAxios.get).toHaveBeenNthCalledWith(
                    1,
                    internalConfig.bucketingEndpoint.replace('@ENV_ID@', bucketInstance.envId),
                    expectedRequestHeaderNotFirstCall
                );

                expect(spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(1);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyInfoLogs).toHaveBeenNthCalledWith(1, 'callApi - current bucketing up to date (api status=304)');
                done();
            } catch (error) {
                done.fail(error);
            }
        });

        bucketInstance.on('error', () => {
            done.fail('not supposed to be here');
        });

        mockAxios.mockResponse({ data: {}, ...bucketingApiMockOtherResponse, status: 304 });
    });

    it('should detect when bucket api response return panic mode', (done) => {
        bucketingApiMockResponse = demoData.bucketing.panic as BucketingApiResponse;
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig);
        initSpyLogs(bucketInstance);

        bucketInstance.on('launched', () => {
            try {
                expect(mockAxios.get).toHaveBeenNthCalledWith(
                    1,
                    internalConfig.bucketingEndpoint.replace('@ENV_ID@', bucketInstance.envId),
                    expectedRequestHeaderFirstCall
                );

                expect(spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenNthCalledWith(1, 'Panic mode detected, running SDK in safe mode...');
                done();
            } catch (error) {
                done.fail(error);
            }
        });

        bucketInstance.on('error', () => {
            done.fail('not suppose to be here');
        });

        bucketInstance.callApi();
        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse });
    });
    it('should log an error when bucketing api fail', (done) => {
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig);
        initSpyLogs(bucketInstance);
        bucketInstance.on('error', (err) => {
            try {
                expect(mockAxios.get).toHaveBeenNthCalledWith(
                    1,
                    internalConfig.bucketingEndpoint.replace('@ENV_ID@', bucketInstance.envId),
                    expectedRequestHeaderFirstCall
                );
                expect(err).toEqual('server crashed');
                expect(spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(1);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyFatalLogs).toHaveBeenNthCalledWith(1, 'An error occurred while fetching using bucketing...');
                done();
            } catch (error) {
                done.fail(error);
            }
        });
        bucketInstance.on('launched', () => {
            done.fail('not supposed to be launched');
        });
        bucketInstance.callApi();
        mockAxios.mockError('server crashed');
    });
});

describe('Bucketing initialization', () => {
    beforeEach(() => {
        spyCatch = jest.fn();
        spyThen = jest.fn();
    });
    afterEach(() => {
        sdk = null;
        bucketingApiMockResponse = null;
        visitorInstance = null;
        bucketInstance = null;

        mockAxios.reset();
    });
    it('should init the bucketing class when arguments are correct', (done) => {
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig);
        expect(bucketInstance instanceof Bucketing).toEqual(true);

        expect(bucketInstance.data).toEqual(null);
        expect(bucketInstance.log).toBeDefined();
        expect(bucketInstance.envId).toEqual(demoData.envId[0]);
        expect(bucketInstance.isPollingRunning).toEqual(false);
        expect(bucketInstance.config).toEqual(bucketingConfig);
        expect(bucketInstance.lastModifiedDate).toEqual(null);
        done();
    });
});
