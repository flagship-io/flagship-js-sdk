import mockAxios from 'jest-mock-axios';
import { FlagshipVisitorContext } from '../flagshipVisitor/flagshipVisitor.d';
import { BucketingApiResponse } from './bucketing.d';
import { FlagshipSdkConfig, IFlagshipVisitor, IFlagshipBucketing, IFlagship } from '../../index.d';

import flagshipSdk from '../../index';
import demoData from '../../../test/mock/demoData';
import testConfig from '../../config/test';
import { internalConfig } from '../../config/default';
import Bucketing from './bucketing';
import BucketingVisitor from '../bucketingVisitor/bucketingVisitor';

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
            expect(spyInfoLogs).toHaveBeenCalledTimes(1);
            expect(spyErrorLogs).toHaveBeenCalledTimes(0);
            expect(spyWarnLogs).toHaveBeenCalledTimes(0);
            expect(spyFatalLogs).toHaveBeenCalledTimes(1);
            expect(spyDebugLogs).toHaveBeenCalledTimes(1);

            expect(spyFatalLogs).toHaveBeenNthCalledWith(1, 'fetchAllModifications - bucketing failed with error "bucketing server crash"');
            expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'saveModificationsInCache - saving in cache those modifications: "null"');
            done();
        });
        sdk.eventEmitter.emit('bucketPollingFailed', 'bucketing server crash');
        visitorInstance.on('ready', () => {
            try {
                expect(visitorInstance.fetchedModifications).toEqual(null);
            } catch (error) {
                done.fail(error);
            }
        });
    });

    it('should not erase previous fetched modification (when exist) and bucket has failed', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.initSdk(demoData.envId[0], { ...bucketingConfig, fetchNow: false });
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        visitorInstance.fetchedModifications = demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign.campaigns;
        initSpyLogs(visitorInstance);
        try {
            visitorInstance.synchronizeModifications(true).catch((err) => {
                expect(err).toEqual('bucketing server crash');
                expect(spyInfoLogs).toHaveBeenCalledTimes(2);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(1);
                expect(spyDebugLogs).toHaveBeenCalledTimes(0);

                expect(spyInfoLogs).toHaveBeenNthCalledWith(
                    2,
                    'saveModificationsInCache - keeping previous cache since bucketing did not return data'
                );
                expect(spyFatalLogs).toHaveBeenNthCalledWith(
                    1,
                    'fetchAllModifications - bucketing failed with error "bucketing server crash"'
                );
                done();
            });
            sdk.eventEmitter.emit('bucketPollingFailed', 'bucketing server crash');
        } catch (error) {
            done.fail(error);
        }
    });

    it('should have correct behavior for bucketing cache api handling', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.initSdk(demoData.envId[0], bucketingConfig);
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        initSpyLogs(visitorInstance);
        expect(visitorInstance.bucket instanceof BucketingVisitor).toEqual(true);
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
                    expect(spyDebugLogs).toHaveBeenNthCalledWith(3, 'fetchAllModifications - bucket start detected');
                    expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                    expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                    expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                    expect(spyWarnLogs).toHaveBeenCalledTimes(0);
                    done();
                });
                sdk.eventEmitter.emit('bucketPollingSuccess', {});
            } catch (error) {
                done.fail(error);
            }
        });
    });

    it('should warn when synchronizing and no fetch have been done before. + should wait a bucket polling', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.initSdk(demoData.envId[0], { ...bucketingConfig, fetchNow: false });
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        initSpyLogs(visitorInstance);
        expect(visitorInstance.bucket instanceof BucketingVisitor).toEqual(true);
        expect(visitorInstance.fetchedModifications).toEqual(null);
        visitorInstance.synchronizeModifications().then(() => {
            try {
                expect(spyDebugLogs).toHaveBeenCalledTimes(4);
                expect(spyInfoLogs).toHaveBeenCalledTimes(1);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyInfoLogs).toHaveBeenNthCalledWith(
                    1,
                    'fetchAllModifications - no data in current bucket, waiting for bucket to start...'
                );

                expect(spyDebugLogs).toHaveBeenNthCalledWith(3, 'fetchAllModifications - bucket start detected');

                expect(visitorInstance.fetchedModifications[0].id === demoData.bucketing.classical.campaigns[0].id).toEqual(true);
                expect(visitorInstance.fetchedModifications[1].id === demoData.bucketing.classical.campaigns[1].id).toEqual(true);
                expect(visitorInstance.bucket instanceof BucketingVisitor).toEqual(true);
                done();
            } catch (error) {
                done.fail(error);
            }
        });
        sdk.eventEmitter.emit('bucketPollingSuccess', { ...bucketingApiMockResponse });
    });

    it('should consider new visitor context when sync modifs and bucketing already init', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.initSdk(demoData.envId[0], bucketingConfig);
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);

        expect(visitorInstance.bucket instanceof BucketingVisitor).toEqual(true);
        expect(sdk.bucket instanceof Bucketing).toEqual(true);

        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse });

        expect(mockAxios.get).toHaveBeenNthCalledWith(
            1,
            internalConfig.bucketingEndpoint.replace('@ENV_ID@', visitorInstance.envId),
            expectedRequestHeaderFirstCall
        );

        const nextStep = (): void => {
            const newVisitorContext = { foo1: 'yes1' };
            visitorInstance.updateContext(newVisitorContext); // simulate new visitor context
            initSpyLogs(visitorInstance);
            visitorInstance.synchronizeModifications().then(() => {
                expect(mockAxios.get).toHaveBeenCalledTimes(1);

                expect(spyDebugLogs).toHaveBeenCalledTimes(2);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(visitorInstance.fetchedModifications[0].id === demoData.bucketing.classical.campaigns[0].id).toEqual(true);
                expect(visitorInstance.bucket instanceof BucketingVisitor).toEqual(true);
                expect(visitorInstance.bucket.visitorContext).toEqual(newVisitorContext);
                done();
            });
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

    it('should consider new campaigns from bucket api when sync modifs and bucketing already init', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.initSdk(demoData.envId[0], bucketingConfig);
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);

        expect(visitorInstance.bucket instanceof BucketingVisitor).toEqual(true);
        expect(sdk.bucket instanceof Bucketing).toEqual(true);

        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse });

        expect(mockAxios.get).toHaveBeenNthCalledWith(
            1,
            internalConfig.bucketingEndpoint.replace('@ENV_ID@', visitorInstance.envId),
            expectedRequestHeaderFirstCall
        );

        const nextStep = (): void => {
            // simulate new visitor context - begin
            sdk.bucket.data = demoData.bucketing.oneCampaignOneVgMultipleTgg as BucketingApiResponse;
            visitorInstance.bucket.updateCache(demoData.bucketing.oneCampaignOneVgMultipleTgg as BucketingApiResponse);
            // simulate new visitor context - end

            initSpyLogs(visitorInstance);
            visitorInstance.synchronizeModifications().then(() => {
                expect(mockAxios.get).toHaveBeenCalledTimes(1);

                expect(spyDebugLogs).toHaveBeenCalledTimes(2);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'saveModificationsInCache - saving in cache those modifications: "[]"');

                expect(visitorInstance.fetchedModifications).toEqual([]);
                expect(visitorInstance.bucket instanceof BucketingVisitor).toEqual(true);
                expect(visitorInstance.bucket.visitorContext).toEqual(demoData.visitor.cleanContext);
                done();
            });
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
        expect(visitorInstance.bucket instanceof BucketingVisitor).toEqual(true);
        expect(sdk.bucket instanceof Bucketing).toEqual(true);
        let called = 0;
        sdk.eventEmitter.on('bucketPollingSuccess', () => {
            called += 1;
        });
        sdk.eventEmitter.on('bucketPollingFailed', () => {
            done.fail('not supposed to be here');
        });

        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse });

        expect(mockAxios.get).toHaveBeenNthCalledWith(
            1,
            internalConfig.bucketingEndpoint.replace('@ENV_ID@', visitorInstance.envId),
            expectedRequestHeaderFirstCall
        );

        visitorInstance.on('ready', () => {
            try {
                expect(called).toEqual(1);
                expect(visitorInstance.fetchedModifications[0].id === demoData.bucketing.classical.campaigns[0].id).toEqual(true);
                expect(visitorInstance.fetchedModifications[1].id === demoData.bucketing.classical.campaigns[1].id).toEqual(true);
                done();
            } catch (error) {
                done.fail(error);
            }
        });
    });

    it('should trigger bucketing behavior when creating new visitor with config having "bucketing" in decision mode + fetchNow=true + activate=true', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.initSdk(demoData.envId[0], { ...bucketingConfig, activateNow: true });
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        expect(visitorInstance.bucket instanceof BucketingVisitor).toEqual(true);
        expect(sdk.bucket instanceof Bucketing).toEqual(true);
        let called = 0;
        sdk.eventEmitter.on('bucketPollingSuccess', () => {
            called += 1;
        });
        sdk.eventEmitter.on('bucketPollingFailed', () => {
            done.fail('not supposed to be here');
        });

        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse });
        mockAxios.mockResponse();
        mockAxios.mockResponse();
        mockAxios.mockResponse();
        mockAxios.mockResponse();
        expect(mockAxios.get).toHaveBeenNthCalledWith(
            1,
            internalConfig.bucketingEndpoint.replace('@ENV_ID@', visitorInstance.envId),
            expectedRequestHeaderFirstCall
        );

        visitorInstance.on('ready', () => {
            try {
                expect(called).toEqual(1);
                expect(visitorInstance.fetchedModifications[0].id === demoData.bucketing.classical.campaigns[0].id).toEqual(true);
                expect(visitorInstance.fetchedModifications[1].id === demoData.bucketing.classical.campaigns[1].id).toEqual(true);

                // expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                // expect(spyDebugLogs).toHaveBeenCalledTimes(2);
                // expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                // expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                // expect(spyWarnLogs).toHaveBeenCalledTimes(0);
                const activateUrl = 'https://decision-api.flagship.io/v1/activate';

                expect(mockAxios.post).toHaveBeenNthCalledWith(1, activateUrl, {
                    caid: 'bptggipaqi903f3haq1g',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    vaid: 'bptggipaqi903f3haq2g',
                    vid: 'test-perf'
                });
                expect(mockAxios.post).toHaveBeenNthCalledWith(2, activateUrl, {
                    caid: 'bq4sf09oet0006cfihe0',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    vaid: 'bq4sf09oet0006cfihf0',
                    vid: 'test-perf'
                });
                expect(mockAxios.post).toHaveBeenNthCalledWith(3, activateUrl, {
                    caid: 'bptggipaqi903f3haq1g',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    vaid: 'bptggipaqi903f3haq2g',
                    vid: 'test-perf'
                });
                expect(mockAxios.post).toHaveBeenNthCalledWith(4, activateUrl, {
                    caid: 'bq4sf09oet0006cfihe0',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    vaid: 'bq4sf09oet0006cfihf0',
                    vid: 'test-perf'
                });

                done();
            } catch (error) {
                done.fail(error);
            }
        });
    });

    it('should NOT trigger bucketing behavior when creating new visitor with config having "bucketing" in decision mode + fetchNow=false', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.initSdk(demoData.envId[0], { ...bucketingConfig, fetchNow: false });
        sdk.eventEmitter.on('bucketPollingSuccess', () => {
            done.fail('not supposed to be here');
        });
        sdk.eventEmitter.on('bucketPollingFailed', () => {
            done.fail('not supposed to be here');
        });
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        expect(visitorInstance.bucket.data).toEqual(null);
        expect(mockAxios.get).toHaveBeenCalledTimes(0);
        visitorInstance.on('ready', () => {
            try {
                expect(visitorInstance.fetchedModifications).toEqual(null);
                expect(mockAxios.get).not.toHaveBeenCalled();
                done();
            } catch (error) {
                done.fail(error);
            }
        });
    });
});

describe('Bucketing - polling', () => {
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

    it('should work when correctly set + fetchNow=true', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.initSdk(demoData.envId[0], { ...bucketingConfig, pollingInterval: 222 });
        initSpyLogs(sdk.bucket);
        let pollingLoop = 0;
        sdk.eventEmitter.on('bucketPollingSuccess', () => {
            pollingLoop += 1;

            if (pollingLoop > 1) {
                try {
                    expect(mockAxios.get).toHaveBeenNthCalledWith(
                        1,
                        internalConfig.bucketingEndpoint.replace('@ENV_ID@', demoData.envId[0]),
                        expectedRequestHeaderFirstCall
                    );

                    expect(spyDebugLogs).toHaveBeenCalledTimes(4);
                    expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                    expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                    expect(spyInfoLogs).toHaveBeenCalledTimes(2);
                    expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                    expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'startPolling - starting a new polling...');
                    expect(spyDebugLogs).toHaveBeenNthCalledWith(2, 'startPolling - polling finished successfully');
                    expect(spyDebugLogs).toHaveBeenNthCalledWith(3, 'startPolling - starting a new polling...');
                    expect(spyDebugLogs).toHaveBeenNthCalledWith(4, 'startPolling - polling finished successfully');
                    expect(spyInfoLogs).toHaveBeenNthCalledWith(1, 'callApi - current bucketing updated');
                    expect(spyInfoLogs).toHaveBeenNthCalledWith(2, 'callApi - current bucketing updated');

                    expect(sdk.bucket.data).toEqual(bucketingApiMockResponse);

                    done();
                } catch (error) {
                    done.fail(error);
                }
            }
        });
        const mock = (): void => {
            try {
                mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse });
                if (pollingLoop < 2) {
                    mock();
                }
            } catch (error) {
                if (error.message === 'No request to respond to!') {
                    setTimeout(() => {
                        mock();
                    }, 111);
                } else {
                    done.fail(`mock ${error}`);
                }
            }
        };
        mock();
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
