import mockAxios from 'jest-mock-axios';
import { HttpResponse } from 'jest-mock-axios/dist/lib/mock-axios-types';
import testConfig, { demoPollingInterval } from '../../config/test';

import flagshipSdk from '../..';
import demoData from '../../../test/mock/demoData';
import defaultConfig, { internalConfig } from '../../config/default';

import { FlagshipSdkConfig, IFlagship, IFlagshipBucketing, IFlagshipVisitor } from '../../types';
import BucketingVisitor from '../bucketingVisitor/bucketingVisitor';
import Bucketing from './bucketing';
import { BucketingApiResponse } from './types';
import flagshipSdkHelper from '../../lib/flagshipSdkHelper';
import assertionHelper from '../../../test/helper/assertion';
import mockGenerator from '../../../test/helper/mockGenerator';

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
let bucketingEventMockResponse: HttpResponse;

const bucketingApiMockOtherResponse200: { status: number; headers: { 'last-modified': string } } = {
    status: 200,
    headers: { 'last-modified': demoData.bucketing.headers.lastModified[0] }
};

const bucketingApiMockOtherResponse304: { status: number; headers: {} } = {
    status: 304,
    headers: {} // NOTE: 'last-modified' does not exist on 304
};

const mockPollingRequest = (
    done,
    getPollingLoop: () => number,
    loopScheduler: (HttpResponse | string)[],
    envId = demoData.envId[0]
): void => {
    try {
        if (loopScheduler.length < getPollingLoop()) {
            return;
        }

        if (typeof loopScheduler[getPollingLoop()] === 'string') {
            mockAxios.mockError(loopScheduler[getPollingLoop()]);
        } else {
            mockAxios.mockResponseFor(
                internalConfig.bucketingEndpoint.replace('@ENV_ID@', envId),
                loopScheduler[getPollingLoop()] as HttpResponse
            );
        }

        if (getPollingLoop() < loopScheduler.length) {
            mockPollingRequest(done, getPollingLoop, loopScheduler);
        }
    } catch (error) {
        if (error.message === 'No request to respond to!') {
            setTimeout(() => {
                mockPollingRequest(done, getPollingLoop, loopScheduler);
            }, demoPollingInterval - 50);
        } else {
            done.fail(`mock ${error}`);
        }
    }
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

    return {
        spyWarnLogs,
        spyErrorLogs,
        spyFatalLogs,
        spyInfoLogs,
        spyDebugLogs
    };
};

const expectedRequestHeaderFirstCall = { headers: { 'If-Modified-Since': '' }, validateStatus: expect.any(Function) };
const expectedRequestHeaderNotFirstCall = {
    headers: { 'If-Modified-Since': 'Wed, 18 Mar 2020 23:29:16 GMT' },
    validateStatus: expect.any(Function)
};

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

    it('should validate status below 400', () => {
        expect(Bucketing.validateStatus(399)).toEqual(true);
        expect(Bucketing.validateStatus(201)).toEqual(true);
        expect(Bucketing.validateStatus(101)).toEqual(true);
        expect(Bucketing.validateStatus(400)).toEqual(false);
        expect(Bucketing.validateStatus(500)).toEqual(false);
    });
    it('should have correct behavior when there is an error during bucketing + activate', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...bucketingConfig, fetchNow: false });
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
                done.fail(error.stack);
            }
        });
    });

    it('should not erase previous fetched modification (when exist) and bucket has failed', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...bucketingConfig, fetchNow: false });
        sdk.bucket.isPollingRunning = true; // mock
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        visitorInstance.fetchedModifications = demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign.campaigns;
        initSpyLogs(visitorInstance);
        try {
            visitorInstance.synchronizeModifications(true).catch((err) => {
                expect(err).toEqual('bucketing server crash');
                expect(spyInfoLogs).toHaveBeenCalledTimes(3);
                expect(spyErrorLogs).toHaveBeenCalledTimes(1);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyDebugLogs).toHaveBeenCalledTimes(0);

                expect(spyInfoLogs).toHaveBeenNthCalledWith(
                    2,
                    'saveModificationsInCache - keeping previous cache since bucketing did not return data'
                );
                expect(spyErrorLogs).toHaveBeenNthCalledWith(
                    1,
                    'fetchAllModifications - bucketing failed with error "bucketing server crash", keeping previous modifications in cache. Should not have any impact on the visitor.'
                );
                done();
            });
            sdk.eventEmitter.emit('bucketPollingFailed', 'bucketing server crash');
        } catch (error) {
            done.fail(error.stack);
        }
    });

    it('should report an error if apiMode is "Bucketing" and it failed during first call', (done) => {
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], bucketingConfig);
        const sdkLogs = initSpyLogs(sdk);
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        initSpyLogs(visitorInstance);
        mockAxios.mockError('Error api bucket');
        visitorInstance.on('ready', () => {
            try {
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);
                expect(spyDebugLogs).toHaveBeenCalledTimes(1);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(1);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);

                expect(spyFatalLogs).toHaveBeenNthCalledWith(1, 'fetchAllModifications - bucketing failed with error "Error api bucket"');
                expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'saveModificationsInCache - saving in cache those modifications: "null"');

                expect(sdkLogs.spyWarnLogs).toHaveBeenCalledTimes(0);
                expect(sdkLogs.spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(sdkLogs.spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(sdkLogs.spyFatalLogs).toHaveBeenCalledTimes(1);
                expect(sdkLogs.spyInfoLogs).toHaveBeenCalledTimes(2);

                expect(sdkLogs.spyFatalLogs).toHaveBeenNthCalledWith(
                    1,
                    'new visitor (id="test-perf") bucket API failed during initialization with error "Error api bucket"'
                );
                expect(sdkLogs.spyInfoLogs).toHaveBeenNthCalledWith(1, 'Creating new visitor (id="test-perf")');
                expect(sdkLogs.spyInfoLogs).toHaveBeenNthCalledWith(
                    2,
                    'new visitor (id="test-perf") calling bucketing API for initialization (waiting to be ready...)'
                );

                done();
            } catch (error) {
                done.fail(error.stack);
            }
        });
    });

    it('should have correct behavior for bucketing cache api handling', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], bucketingConfig);
        visitorInstance = sdk.newVisitor(demoData.bucketing.functions.murmur.allocation[68].visitorId, demoData.visitor.cleanContext);
        initSpyLogs(visitorInstance);
        expect(visitorInstance.bucket instanceof BucketingVisitor).toEqual(true);
        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200 });
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
                                    variationGroupId: demoData.bucketing.functions.murmur.allocation[68].variationGroup
                                },
                                {
                                    id: 'bq4sf09oet0006cfihd0',
                                    variation: {
                                        id: 'bq4sf09oet0006cfiheg',
                                        modifications: {
                                            type: 'JSON',
                                            value: { 'btn-color': 'red', 'btn-text': 'Buy now !', 'txt-color': '#fff' }
                                        }
                                    },
                                    variationGroupId: demoData.bucketing.functions.murmur.allocation[17].variationGroup
                                }
                            ],
                            visitorId: demoData.bucketing.functions.murmur.allocation[68].visitorId
                        }
                    });
                    expect(spyDebugLogs).toHaveBeenCalledTimes(4);
                    expect(spyDebugLogs).toHaveBeenNthCalledWith(3, 'fetchAllModifications - bucket start detected');
                    expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                    expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                    expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                    expect(spyWarnLogs).toHaveBeenCalledTimes(0);
                    done();
                });
                sdk.eventEmitter.emit('bucketPollingSuccess', { payload: {}, status: 304 });
            } catch (error) {
                done.fail(error.stack);
            }
        });
    });

    it('should warn when synchronizing and no fetch have been done before. + should wait a bucket polling', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...bucketingConfig, fetchNow: false });
        sdk.bucket.isPollingRunning = true; // mock
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        initSpyLogs(visitorInstance);
        expect(visitorInstance.bucket instanceof BucketingVisitor).toEqual(true);
        expect(visitorInstance.fetchedModifications).toEqual(null);
        visitorInstance.synchronizeModifications().then(() => {
            try {
                expect(spyDebugLogs).toHaveBeenCalledTimes(3);
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
                done.fail(error.stack);
            }
        });
        sdk.eventEmitter.emit('bucketPollingSuccess', { payload: { ...bucketingApiMockResponse }, status: 200 });
    });

    it('should warn when receiving unexpected polling status code', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...bucketingConfig, fetchNow: false });
        sdk.bucket.isPollingRunning = true; // mock
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        initSpyLogs(visitorInstance);
        expect(visitorInstance.bucket instanceof BucketingVisitor).toEqual(true);
        expect(visitorInstance.fetchedModifications).toEqual(null);
        visitorInstance.synchronizeModifications().then(() => {
            try {
                expect(spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(1);
                expect(spyErrorLogs).toHaveBeenCalledTimes(2);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyErrorLogs).toHaveBeenNthCalledWith(1, 'unexpected status (="999") received. This polling will be ignored.');
                expect(spyErrorLogs).toHaveBeenNthCalledWith(
                    2,
                    `fetchAllModifications - bucket start detected but no data received from bucketing. It might due to an error (see previous logs).`
                );
                expect(spyInfoLogs).toHaveBeenNthCalledWith(
                    1,
                    'fetchAllModifications - no data in current bucket, waiting for bucket to start...'
                );

                expect(visitorInstance.fetchedModifications).toEqual(null);
                expect(visitorInstance.bucket instanceof BucketingVisitor).toEqual(true);
                done();
            } catch (error) {
                done.fail(error.stack);
            }
        });
        sdk.eventEmitter.emit('bucketPollingSuccess', { payload: { ...bucketingApiMockResponse }, status: 999 });
    });

    it('should consider new visitor context when sync modifs and bucketing already init', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], bucketingConfig);
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);

        expect(visitorInstance.bucket instanceof BucketingVisitor).toEqual(true);
        expect(sdk.bucket instanceof Bucketing).toEqual(true);

        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200 });

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

                expect(spyDebugLogs).toHaveBeenCalledTimes(1);
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
                done.fail(error.stack);
            }
        });
    });

    it('should consider new campaigns from bucket api when sync modifs and bucketing already init', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], bucketingConfig);
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);

        expect(visitorInstance.bucket instanceof BucketingVisitor).toEqual(true);
        expect(sdk.bucket instanceof Bucketing).toEqual(true);

        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200 });

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

                expect(spyDebugLogs).toHaveBeenCalledTimes(1);
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
                done.fail(error.stack);
            }
        });
    });

    it('should trigger bucketing behavior when creating new visitor with config having "bucketing" in decision mode + fetchNow=true', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], bucketingConfig);
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        expect(visitorInstance.bucket instanceof BucketingVisitor).toEqual(true);
        expect(sdk.bucket instanceof Bucketing).toEqual(true);
        let called = 0;
        sdk.eventEmitter.on('bucketPollingSuccess', () => {
            called += 1;
        });
        sdk.eventEmitter.on('bucketPollingFailed', (e) => {
            done.fail(`not supposed to be here: ${e.stack}`);
        });

        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200 });

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
                done.fail(error.stack);
            }
        });
    });

    it('should trigger bucketing behavior when creating new visitor with config having "bucketing" in decision mode + fetchNow=true + activate=true', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...bucketingConfig, activateNow: true });
        visitorInstance = sdk.newVisitor(demoData.bucketing.functions.murmur.allocation[68].visitorId, demoData.visitor.cleanContext);
        expect(visitorInstance.bucket instanceof BucketingVisitor).toEqual(true);
        expect(sdk.bucket instanceof Bucketing).toEqual(true);
        let called = 0;
        sdk.eventEmitter.on('bucketPollingSuccess', () => {
            called += 1;
        });
        sdk.eventEmitter.on('bucketPollingFailed', (e) => {
            done.fail(`not supposed to be here ${e.stack}`);
        });

        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200 });
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
                const activateUrl = `${internalConfig.apiV2}activate`;

                expect(mockAxios.post).toHaveBeenCalledTimes(3);

                expect(mockAxios.post).toHaveBeenNthCalledWith(
                    3,
                    `${visitorInstance.config.flagshipApi + visitorInstance.envId}/events`,
                    {
                        data: {
                            ...visitorInstance.context
                        },
                        type: 'CONTEXT',
                        visitor_id: demoData.bucketing.functions.murmur.allocation[68].visitorId
                    },
                    {
                        ...assertionHelper.getApiKeyHeader(demoData.apiKey[0])
                    }
                );

                expect(mockAxios.post).toHaveBeenNthCalledWith(
                    1,
                    activateUrl,
                    {
                        caid: demoData.bucketing.functions.murmur.allocation[68].variationGroup,
                        cid: 'bn1ab7m56qolupi5sa0g',
                        vaid: 'bptggipaqi903f3haq2g',
                        vid: demoData.bucketing.functions.murmur.allocation[68].visitorId
                    },
                    {
                        ...assertionHelper.getApiKeyHeader(demoData.apiKey[0])
                    }
                );
                expect(mockAxios.post).toHaveBeenNthCalledWith(
                    2,
                    activateUrl,
                    {
                        caid: demoData.bucketing.functions.murmur.allocation[17].variationGroup,
                        cid: 'bn1ab7m56qolupi5sa0g',
                        vaid: 'bq4sf09oet0006cfiheg',
                        vid: demoData.bucketing.functions.murmur.allocation[68].visitorId // same id as demoData.bucketing.functions.murmur.allocation[17].visitorId
                    },
                    {
                        ...assertionHelper.getApiKeyHeader(demoData.apiKey[0])
                    }
                );

                done();
            } catch (error) {
                done.fail(error.stack);
            }
        });
    });

    it('should NOT trigger bucketing behavior when creating new visitor with config having "bucketing" in decision mode + fetchNow=false', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...bucketingConfig, fetchNow: false });
        sdk.eventEmitter.on('bucketPollingSuccess', () => {
            done.fail('not supposed to be here');
        });
        sdk.eventEmitter.on('bucketPollingFailed', (e) => {
            done.fail(`not supposed to be here: ${e.stack}`);
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
                done.fail(error.stack);
            }
        });
    });
});

describe('Bucketing - startPolling', () => {
    beforeEach(() => {
        spyCatch = jest.fn();
        spyThen = jest.fn();
    });
    afterEach(() => {
        if (sdk) {
            sdk.eventEmitter.removeAllListeners();
        }
        if (visitorInstance) {
            visitorInstance.removeAllListeners();
        }
        if (bucketInstance) {
            bucketInstance.removeAllListeners();
        }
        sdk = null;
        bucketingApiMockResponse = null;
        visitorInstance = null;
        bucketInstance = null;

        mockAxios.reset();
    });
    it('should notify if polling already started before', (done) => {
        const tempConfig = { ...bucketingConfig, pollingInterval: demoPollingInterval };
        bucketInstance = new Bucketing(demoData.envId[0], tempConfig, mockGenerator.createPanicModeMock(tempConfig));
        initSpyLogs(bucketInstance);

        bucketInstance.startPolling();
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);

        bucketInstance.startPolling();
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(1);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);

        expect(spyWarnLogs).toHaveBeenNthCalledWith(1, 'startPolling - already running');
        done();
    });
});

describe('Bucketing - polling', () => {
    beforeEach(() => {
        spyCatch = jest.fn();
        spyThen = jest.fn();
    });
    afterEach(() => {
        if (sdk) {
            sdk.eventEmitter.removeAllListeners();
        }
        if (visitorInstance) {
            visitorInstance.removeAllListeners();
        }
        if (bucketInstance) {
            bucketInstance.removeAllListeners();
        }
        sdk = null;
        bucketingApiMockResponse = null;
        visitorInstance = null;
        bucketInstance = null;

        mockAxios.reset();
    });

    it('should work when correctly set + fetchNow=true', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...bucketingConfig, pollingInterval: demoPollingInterval });
        initSpyLogs(sdk.bucket);
        let pollingLoop = 0;
        sdk.eventEmitter.on('bucketPollingSuccess', () => {
            pollingLoop += 1;

            if (pollingLoop >= 1 && spyInfoLogs.mock.calls.length >= 1 && spyDebugLogs.mock.calls.length >= 1) {
                try {
                    expect(sdk.bucket.isPollingRunning).toEqual(true);

                    expect(spyDebugLogs).toHaveBeenCalledTimes(1);
                    expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                    expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                    expect(spyInfoLogs).toHaveBeenCalledTimes(1);
                    expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                    expect(spyDebugLogs).toHaveBeenNthCalledWith(
                        1,
                        `startPolling - polling finished successfully. Next polling in ${demoPollingInterval} minute(s)`
                    );
                    expect(spyInfoLogs).toHaveBeenNthCalledWith(1, 'callApi - current bucketing updated');

                    expect(sdk.bucket.data).toEqual(bucketingApiMockResponse);

                    done();
                } catch (error) {
                    done.fail(error.stack);
                }
            }
        });

        mockPollingRequest(done, () => pollingLoop, [
            { data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200 },
            { data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200 }
        ]);
    });

    it('should run bucketing then stop (after specified) so that the infinite loop is killed', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], { ...bucketingConfig, pollingInterval: demoPollingInterval });
        const spySdkLogs = initSpyLogs(sdk);
        initSpyLogs(sdk.bucket);
        let pollingLoop = 0;
        sdk.eventEmitter.on('bucketPollingSuccess', () => {
            pollingLoop += 1;

            // after one polling, stop the bucketing
            if (pollingLoop >= 1 && spyInfoLogs.mock.calls.length >= 1 && spyDebugLogs.mock.calls.length >= 1) {
                try {
                    sdk.stopBucketingPolling();
                    setTimeout(() => {
                        expect(spyDebugLogs).toHaveBeenCalledTimes(2);
                        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                        expect(spyInfoLogs).toHaveBeenCalledTimes(1);
                        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                        expect(spyDebugLogs).toHaveBeenNthCalledWith(2, 'on("launched") listener - bucketing stop detected.');

                        expect(spySdkLogs.spyInfoLogs).toHaveBeenCalledTimes(1);
                        sdk.stopBucketingPolling();
                        expect(spySdkLogs.spyInfoLogs).toHaveBeenCalledTimes(2);
                        expect(spySdkLogs.spyInfoLogs).toHaveBeenNthCalledWith(2, 'stopBucketingPolling - bucketing is already stopped');

                        done();
                    }, Math.floor(60000 * demoPollingInterval * 1.5));
                } catch (error) {
                    done.fail(error.stack);
                }
            }
        });

        mockPollingRequest(done, () => pollingLoop, [
            { data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200 },
            { data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200 }
        ]);
    });

    it('should warn a log when trying to start polling and it has been already launched', async (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], {
            ...bucketingConfig,
            pollingInterval: demoPollingInterval,
            fetchNow: false
        });
        const spySdkLogs = initSpyLogs(sdk);
        initSpyLogs(sdk.bucket);
        let pollingLoop = 0;

        sdk.startBucketingPolling();
        sdk.eventEmitter.on('bucketPollingSuccess', () => {
            if (pollingLoop === 0) {
                sdk.startBucketingPolling();
            }
            pollingLoop += 1;
            if (pollingLoop > 1 && spyInfoLogs.mock.calls.length >= 2 && spyDebugLogs.mock.calls.length >= 4) {
                try {
                    expect(sdk.bucket.isPollingRunning).toEqual(true);

                    expect(spySdkLogs.spyWarnLogs).toHaveBeenCalledTimes(1);
                    expect(spySdkLogs.spyErrorLogs).toHaveBeenCalledTimes(0);
                    expect(spySdkLogs.spyFatalLogs).toHaveBeenCalledTimes(0);

                    expect(spySdkLogs.spyWarnLogs).toHaveBeenNthCalledWith(
                        1,
                        `startBucketingPolling - bucket already polling with interval set to "${demoPollingInterval}" minute(s).`
                    );

                    expect(sdk.bucket.data).toEqual(bucketingApiMockResponse);

                    done();
                } catch (error) {
                    done.fail(error.stack);
                }
            }
        });

        mockPollingRequest(done, () => pollingLoop, [
            { data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200 },
            { data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200 }
        ]);
    }, 20000); // adjust timeout to 20 sec since the test takes about 13 sec

    it('should have correct behavior when failure', async (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], {
            ...bucketingConfig,
            pollingInterval: demoPollingInterval,
            fetchNow: false
        });
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        const spySdkLogs = initSpyLogs(sdk);
        const spyVisitorLogs = initSpyLogs(visitorInstance);
        initSpyLogs(sdk.bucket);
        let pollingLoop = 0;

        sdk.startBucketingPolling();
        sdk.eventEmitter.on('bucketPollingFailed', () => {
            pollingLoop += 1;

            if (pollingLoop > 1) {
                try {
                    expect(sdk.bucket.isPollingRunning).toEqual(true);

                    expect(spySdkLogs.spyDebugLogs).toHaveBeenCalledTimes(0);
                    expect(spySdkLogs.spyErrorLogs).toHaveBeenCalledTimes(0);
                    expect(spySdkLogs.spyFatalLogs).toHaveBeenCalledTimes(0);
                    expect(spySdkLogs.spyInfoLogs).toHaveBeenCalledTimes(0);
                    expect(spySdkLogs.spyWarnLogs).toHaveBeenCalledTimes(0);

                    expect(spyVisitorLogs.spyDebugLogs).toHaveBeenCalledTimes(0);
                    expect(spyVisitorLogs.spyErrorLogs).toHaveBeenCalledTimes(0);
                    expect(spyVisitorLogs.spyFatalLogs).toHaveBeenCalledTimes(0);
                    expect(spyVisitorLogs.spyInfoLogs).toHaveBeenCalledTimes(0);
                    expect(spyVisitorLogs.spyWarnLogs).toHaveBeenCalledTimes(0);

                    expect(spyDebugLogs).toHaveBeenCalledTimes(3);
                    expect(spyErrorLogs).toHaveBeenCalledTimes(2);
                    expect(spyFatalLogs).toHaveBeenCalledTimes(2);
                    expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                    expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                    expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'startPolling - initializing bucket');
                    expect(spyDebugLogs).toHaveBeenNthCalledWith(2, 'startPolling - starting a new polling...');
                    expect(spyDebugLogs).toHaveBeenNthCalledWith(3, 'startPolling - starting a new polling...');

                    expect(spyErrorLogs).toHaveBeenNthCalledWith(
                        1,
                        `startPolling - polling failed with error "server crashed". Next polling in ${demoPollingInterval} minute(s)`
                    );
                    expect(spyErrorLogs).toHaveBeenNthCalledWith(
                        2,
                        `startPolling - polling failed with error "server crashed a lot". Next polling in ${demoPollingInterval} minute(s)`
                    );

                    expect(spyFatalLogs).toHaveBeenNthCalledWith(1, 'An error occurred while fetching using bucketing...');
                    expect(spyFatalLogs).toHaveBeenNthCalledWith(2, 'An error occurred while fetching using bucketing...');

                    expect(sdk.bucket.data).toEqual(null);

                    done();
                } catch (error) {
                    done.fail(error.stack);
                }
            }
        });

        mockPollingRequest(done, () => pollingLoop, ['server crashed', 'server crashed a lot']);
    }, 20000); // adjust timeout to 20 sec since the test takes about 13 sec

    it('should work when correctly set + fetchNow=false', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], {
            ...bucketingConfig,
            fetchNow: false,
            pollingInterval: demoPollingInterval
        });
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        const spySdkLogs = initSpyLogs(sdk);
        const spyVisitorLogs = initSpyLogs(visitorInstance);
        initSpyLogs(sdk.bucket);
        let pollingLoop = 0;
        sdk.eventEmitter.on('bucketPollingSuccess', () => {
            pollingLoop += 1;

            if (pollingLoop > 1 && spyDebugLogs.mock.calls.length >= 5 && spyInfoLogs.mock.calls.length >= 2) {
                try {
                    expect(spySdkLogs.spyInfoLogs).toHaveBeenCalledTimes(0);
                    expect(spySdkLogs.spyDebugLogs).toHaveBeenCalledTimes(0);
                    expect(spySdkLogs.spyErrorLogs).toHaveBeenCalledTimes(0);
                    expect(spySdkLogs.spyFatalLogs).toHaveBeenCalledTimes(0);
                    expect(spySdkLogs.spyWarnLogs).toHaveBeenCalledTimes(0);

                    expect(spyVisitorLogs.spyInfoLogs).toHaveBeenCalledTimes(0);
                    expect(spyVisitorLogs.spyDebugLogs).toHaveBeenCalledTimes(2);
                    expect(spyVisitorLogs.spyErrorLogs).toHaveBeenCalledTimes(0);
                    expect(spyVisitorLogs.spyFatalLogs).toHaveBeenCalledTimes(0);
                    expect(spyVisitorLogs.spyWarnLogs).toHaveBeenCalledTimes(0);

                    expect(spyVisitorLogs.spyDebugLogs).toHaveBeenNthCalledWith(1, 'bucketing polling with fresh data detected.');
                    expect(spyVisitorLogs.spyDebugLogs).toHaveBeenNthCalledWith(2, 'bucketing polling with fresh data detected.');

                    expect(spyDebugLogs).toHaveBeenCalledTimes(5);
                    expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                    expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                    expect(spyInfoLogs).toHaveBeenCalledTimes(2);
                    expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                    expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'startPolling - initializing bucket');
                    expect(spyDebugLogs).toHaveBeenNthCalledWith(2, 'startPolling - starting a new polling...');
                    expect(spyDebugLogs).toHaveBeenNthCalledWith(
                        3,
                        `startPolling - polling finished successfully. Next polling in ${demoPollingInterval} minute(s)`
                    );
                    expect(spyDebugLogs).toHaveBeenNthCalledWith(4, 'startPolling - starting a new polling...');
                    expect(spyDebugLogs).toHaveBeenNthCalledWith(
                        5,
                        `startPolling - polling finished successfully. Next polling in ${demoPollingInterval} minute(s)`
                    );
                    expect(spyInfoLogs).toHaveBeenNthCalledWith(1, 'callApi - current bucketing updated');
                    expect(visitorInstance.fetchedModifications).toEqual(null);
                    expect(sdk.bucket.data).toEqual(bucketingApiMockResponse);

                    done();
                } catch (error) {
                    done.fail(error.stack);
                }
            }
        });
        visitorInstance.on('ready', () => {
            try {
                expect(visitorInstance.fetchedModifications).toEqual(null);
                expect(sdk.bucket.isPollingRunning).toEqual(false);
                sdk.startBucketingPolling(); // manually start polling
                mockPollingRequest(done, () => pollingLoop, [
                    { data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200 },
                    { data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200 }
                ]);
            } catch (error) {
                done.fail(error.stack);
            }
        });
    });

    it('should behave nicely when api bucketing fail during polling', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], {
            ...bucketingConfig,
            fetchNow: false,
            pollingInterval: demoPollingInterval
        });
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        const spySdkLogs = initSpyLogs(sdk);
        const spyVisitorLogs = initSpyLogs(visitorInstance);
        initSpyLogs(sdk.bucket);
        let pollingLoop = 0;
        sdk.eventEmitter.on('bucketPollingFailed', (e) => {
            pollingLoop += 1;
            try {
                expect(e).toEqual('server crashed');
                expect(spySdkLogs.spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spySdkLogs.spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(spySdkLogs.spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spySdkLogs.spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spySdkLogs.spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyVisitorLogs.spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyVisitorLogs.spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(spyVisitorLogs.spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyVisitorLogs.spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyVisitorLogs.spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyDebugLogs).toHaveBeenCalledTimes(2);
                expect(spyErrorLogs).toHaveBeenCalledTimes(1);
                expect(spyFatalLogs).toHaveBeenCalledTimes(1);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'startPolling - initializing bucket');
                expect(spyDebugLogs).toHaveBeenNthCalledWith(2, 'startPolling - starting a new polling...');
                expect(spyErrorLogs).toHaveBeenNthCalledWith(
                    1,
                    `startPolling - polling failed with error "server crashed". Next polling in ${demoPollingInterval} minute(s)`
                );
                expect(spyFatalLogs).toHaveBeenNthCalledWith(1, 'An error occurred while fetching using bucketing...');

                expect(sdk.bucket.data).toEqual(null);
                expect(visitorInstance.fetchedModifications).toEqual(null);

                done();
            } catch (error) {
                done.fail(error.stack);
            }
        });

        visitorInstance.on('ready', () => {
            try {
                expect(visitorInstance.fetchedModifications).toEqual(null);
                expect(sdk.bucket.isPollingRunning).toEqual(false);
                sdk.startBucketingPolling(); // manually start polling
                mockPollingRequest(done, () => pollingLoop, ['server crashed']);
            } catch (error) {
                done.fail(error.stack);
            }
        });
    });

    // TODO: waiting to solve https://github.com/knee-cola/jest-mock-axios/issues/55 because conflict with mock ERROR
    // it('should keep the last valid data when api bucketing fail during polling', (done) => {
    //     bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
    //     sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...bucketingConfig, fetchNow: false, pollingInterval: demoPollingInterval });
    //     visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
    //     const spySdkLogs = initSpyLogs(sdk);
    //     const spyVisitorLogs = initSpyLogs(visitorInstance);
    //     initSpyLogs(sdk.bucket);
    //     let pollingLoop = 0;
    //     sdk.eventEmitter.on('bucketPollingFailed', (e) => {
    //         pollingLoop += 1;
    //         try {
    //             expect(e).toEqual('server crashed');
    //             expect(spySdkLogs.spyInfoLogs).toHaveBeenCalledTimes(0);
    //             expect(spySdkLogs.spyDebugLogs).toHaveBeenCalledTimes(0);
    //             expect(spySdkLogs.spyErrorLogs).toHaveBeenCalledTimes(0);
    //             expect(spySdkLogs.spyFatalLogs).toHaveBeenCalledTimes(0);
    //             expect(spySdkLogs.spyWarnLogs).toHaveBeenCalledTimes(0);

    //             expect(spyVisitorLogs.spyInfoLogs).toHaveBeenCalledTimes(0);
    //             expect(spyVisitorLogs.spyDebugLogs).toHaveBeenCalledTimes(1);
    //             expect(spyVisitorLogs.spyErrorLogs).toHaveBeenCalledTimes(0);
    //             expect(spyVisitorLogs.spyFatalLogs).toHaveBeenCalledTimes(0);
    //             expect(spyVisitorLogs.spyWarnLogs).toHaveBeenCalledTimes(0);

    //             expect(spyVisitorLogs.spyDebugLogs).toHaveBeenNthCalledWith(1, 'bucketing polling with fresh data detected.');

    //             expect(spyDebugLogs).toHaveBeenCalledTimes(4);
    //             expect(spyErrorLogs).toHaveBeenCalledTimes(1);
    //             expect(spyFatalLogs).toHaveBeenCalledTimes(1);
    //             expect(spyInfoLogs).toHaveBeenCalledTimes(1);
    //             expect(spyWarnLogs).toHaveBeenCalledTimes(0);

    //             expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'startPolling - initializing bucket');
    //             expect(spyDebugLogs).toHaveBeenNthCalledWith(2, 'startPolling - starting a new polling...');
    //             expect(spyInfoLogs).toHaveBeenNthCalledWith(1, 'callApi - current bucketing updated');

    //             expect(sdk.bucket.data).toEqual(bucketingApiMockResponse);
    //             expect(visitorInstance.fetchedModifications).toEqual(null); // because we didn't do synchronize

    //             done();
    //         } catch (error) {
    //             done.fail(`bucketPollingFailed ${error}`);
    //         }
    //     });

    //     sdk.eventEmitter.on('bucketPollingSuccess', () => {
    //         try {
    //             pollingLoop += 1;
    //             expect(sdk.bucket.data).toEqual(bucketingApiMockResponse);
    //             expect(visitorInstance.fetchedModifications).toEqual(null); // because we didn't do synchronize
    //         } catch (error) {
    //             done.fail(`bucketPollingSuccess ${error}`);
    //         }
    //     });

    //     visitorInstance.on('ready', () => {
    //         try {
    //             expect(visitorInstance.fetchedModifications).toEqual(null);
    //             expect(sdk.bucket.isPollingRunning).toEqual(false);
    //             sdk.startBucketingPolling(); // manually start polling
    //             mockPollingRequest(done, () => pollingLoop, [
    //                 { data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse },
    //                 'server crasheeeed'
    //             ]);
    //         } catch (error) {
    //             done.fail(`on ready ${error}`);
    //         }
    //     });
    // });

    it('should report an error if pollingInterval is below limit', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...bucketingConfig, fetchNow: false, pollingInterval: 0.1 });
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        const spySdkLogs = initSpyLogs(sdk);
        const spyVisitorLogs = initSpyLogs(visitorInstance);
        initSpyLogs(sdk.bucket);
        let pollingLoop = 0;
        sdk.eventEmitter.on('bucketPollingSuccess', () => {
            pollingLoop += 1;
            try {
                expect(spySdkLogs.spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spySdkLogs.spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(spySdkLogs.spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spySdkLogs.spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spySdkLogs.spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyVisitorLogs.spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyVisitorLogs.spyDebugLogs).toHaveBeenCalledTimes(1);
                expect(spyVisitorLogs.spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyVisitorLogs.spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyVisitorLogs.spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyVisitorLogs.spyDebugLogs).toHaveBeenNthCalledWith(1, 'bucketing polling with fresh data detected.');

                expect(spyDebugLogs).toHaveBeenCalledTimes(1);
                expect(spyErrorLogs).toHaveBeenCalledTimes(1);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(1);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'startPolling - initializing bucket');
                expect(spyInfoLogs).toHaveBeenNthCalledWith(1, 'callApi - current bucketing updated');
                expect(spyErrorLogs).toHaveBeenNthCalledWith(
                    1,
                    `startPolling - The "pollingInterval" setting is below the limit (${internalConfig.pollingIntervalMinValue} minute). The setting will be ignored and the bucketing api will be called only once for initialization.`
                );

                expect(sdk.bucket.data).toEqual(bucketingApiMockResponse);

                done();
            } catch (error) {
                done.fail(error.stack);
            }
        });

        visitorInstance.on('ready', () => {
            try {
                expect(visitorInstance.fetchedModifications).toEqual(null);
                expect(sdk.bucket.isPollingRunning).toEqual(false);
                sdk.startBucketingPolling(); // manually start polling
                mockPollingRequest(done, () => pollingLoop, [{ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200 }]);
            } catch (error) {
                done.fail(error.stack);
            }
        });
    });

    it('should report an error if pollingInterval is not supported format', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], {
            ...bucketingConfig,
            fetchNow: false,
            pollingInterval: 'hello world'
        });
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        const spySdkLogs = initSpyLogs(sdk);
        const spyVisitorLogs = initSpyLogs(visitorInstance);
        initSpyLogs(sdk.bucket);
        let pollingLoop = 0;
        sdk.eventEmitter.on('bucketPollingSuccess', () => {
            pollingLoop += 1;
            try {
                expect(spySdkLogs.spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spySdkLogs.spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(spySdkLogs.spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spySdkLogs.spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spySdkLogs.spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyVisitorLogs.spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyVisitorLogs.spyDebugLogs).toHaveBeenCalledTimes(1);
                expect(spyVisitorLogs.spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyVisitorLogs.spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyVisitorLogs.spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyVisitorLogs.spyDebugLogs).toHaveBeenNthCalledWith(1, 'bucketing polling with fresh data detected.');

                expect(spyDebugLogs).toHaveBeenCalledTimes(1);
                expect(spyErrorLogs).toHaveBeenCalledTimes(1);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(1);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'startPolling - initializing bucket');
                expect(spyInfoLogs).toHaveBeenNthCalledWith(1, 'callApi - current bucketing updated');
                expect(spyErrorLogs).toHaveBeenNthCalledWith(
                    1,
                    'startPolling - The "pollingInterval" setting has value="hello world" and type="string" which is not supported. The setting will be ignored and the bucketing api will be called only once for initialization.)'
                );

                expect(sdk.bucket.data).toEqual(bucketingApiMockResponse);

                done();
            } catch (error) {
                done.fail(error.stack);
            }
        });

        visitorInstance.on('ready', () => {
            try {
                expect(visitorInstance.fetchedModifications).toEqual(null);
                expect(sdk.bucket.isPollingRunning).toEqual(false);
                sdk.startBucketingPolling(); // manually start polling
                mockPollingRequest(done, () => pollingLoop, [{ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200 }]);
            } catch (error) {
                done.fail(error.stack);
            }
        });
    });

    it('should report an error if pollingInterval is null', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.start(demoData.envId[0], demoData.apiKey[0], { ...bucketingConfig, fetchNow: false, pollingInterval: null });
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        const spySdkLogs = initSpyLogs(sdk);
        const spyVisitorLogs = initSpyLogs(visitorInstance);
        initSpyLogs(sdk.bucket);
        let pollingLoop = 0;
        sdk.eventEmitter.on('bucketPollingSuccess', () => {
            pollingLoop += 1;
            try {
                expect(spySdkLogs.spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spySdkLogs.spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(spySdkLogs.spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spySdkLogs.spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spySdkLogs.spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyVisitorLogs.spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyVisitorLogs.spyDebugLogs).toHaveBeenCalledTimes(1);
                expect(spyVisitorLogs.spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyVisitorLogs.spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyVisitorLogs.spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyVisitorLogs.spyDebugLogs).toHaveBeenNthCalledWith(1, 'bucketing polling with fresh data detected.');

                expect(spyDebugLogs).toHaveBeenCalledTimes(1);
                expect(spyErrorLogs).toHaveBeenCalledTimes(1);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(1);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'startPolling - initializing bucket');
                expect(spyInfoLogs).toHaveBeenNthCalledWith(1, 'callApi - current bucketing updated');
                expect(spyErrorLogs).toHaveBeenNthCalledWith(
                    1,
                    'startPolling - The "pollingInterval" setting has value="null" and type="object" which is not supported. The setting will be ignored and the bucketing api will be called only once for initialization.)'
                );

                expect(sdk.bucket.data).toEqual(bucketingApiMockResponse);

                done();
            } catch (error) {
                done.fail(error.stack);
            }
        });

        visitorInstance.on('ready', () => {
            try {
                expect(visitorInstance.fetchedModifications).toEqual(null);
                expect(sdk.bucket.isPollingRunning).toEqual(false);
                sdk.startBucketingPolling(); // manually start polling
                mockPollingRequest(done, () => pollingLoop, [{ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200 }]);
            } catch (error) {
                done.fail(error.stack);
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

    it('should report some logs when bucket api do not return "last-modified" attribute', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig, mockGenerator.createPanicModeMock(bucketingConfig));

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
                    'callApi - http GET request (url="https://cdn.flagship.io/bn1ab7m56qolupi5sa0g/bucketing.json") did not return attribute "last-modified"'
                );

                expect(bucketInstance.data).toEqual({ ...bucketingApiMockResponse, lastModifiedDate: null });

                done();
            } catch (error) {
                done.fail(error.stack);
            }
        });

        bucketInstance.on('error', () => {
            done.fail(`not supposed to be here: ${e.stack}`);
        });

        bucketInstance.callApi();
        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200, headers: {} });
    });

    it('should works with "classical" bucket api response', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig, mockGenerator.createPanicModeMock(bucketingConfig));

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
                done.fail(error.stack);
            }
        });

        bucketInstance.on('error', () => {
            done.fail('not supposed to be here');
        });

        bucketInstance.callApi();
        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200 });
    });

    it('should handle status=304', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig, mockGenerator.createPanicModeMock(bucketingConfig));

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
                done.fail(error.stack);
            }
        });

        bucketInstance.on('error', () => {
            done.fail('not supposed to be here');
        });

        mockAxios.mockResponse({ data: {}, ...bucketingApiMockOtherResponse304 });
    });

    it('should detect when bucket api response return panic mode', (done) => {
        bucketingApiMockResponse = demoData.bucketing.panic as BucketingApiResponse;
        let pmSpy;
        const panicModeInstance = mockGenerator.createPanicModeMock(bucketingConfig, false, (PM) => {
            pmSpy = initSpyLogs(PM);
            return PM;
        });
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig, panicModeInstance);
        initSpyLogs(bucketInstance);
        expect(panicModeInstance.enabled).toEqual(false);
        bucketInstance.on('launched', () => {
            try {
                expect(mockAxios.get).toHaveBeenNthCalledWith(
                    1,
                    internalConfig.bucketingEndpoint.replace('@ENV_ID@', bucketInstance.envId),
                    expectedRequestHeaderFirstCall
                );

                expect(panicModeInstance.enabled).toEqual(true);
                expect(pmSpy.spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(pmSpy.spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(pmSpy.spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(pmSpy.spyInfoLogs).toHaveBeenCalledTimes(1);
                expect(pmSpy.spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(pmSpy.spyInfoLogs).toHaveBeenNthCalledWith(1, 'panic mode is ENABLED. SDK will turn into safe mode.');

                // TODO: to improve

                expect(spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(1);
                expect(spyInfoLogs).toHaveBeenNthCalledWith(1, 'panic mode is ENABLED. SDK will turn into safe mode.');
                done();
            } catch (error) {
                done.fail(error.stack);
            }
        });

        bucketInstance.on('error', () => {
            done.fail('not suppose to be here');
        });

        bucketInstance.callApi();
        mockAxios.mockResponse({ data: bucketingApiMockResponse, ...bucketingApiMockOtherResponse200 });
    });
    it('should log an error when bucketing api fail', (done) => {
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig, mockGenerator.createPanicModeMock(bucketingConfig));
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
                done.fail(error.stack);
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
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig, mockGenerator.createPanicModeMock(bucketingConfig));
        expect(bucketInstance instanceof Bucketing).toEqual(true);

        expect(bucketInstance.data).toEqual(null);
        expect(bucketInstance.log).toBeDefined();
        expect(bucketInstance.envId).toEqual(demoData.envId[0]);
        expect(bucketInstance.isPollingRunning).toEqual(false);
        expect(bucketInstance.config).toEqual(bucketingConfig);
        expect(bucketInstance.lastModifiedDate).toEqual(null);
        done();
    });
    it('should preset bucketing if "initialBucketing" is set correctly', (done) => {
        const tempConfig = {
            ...bucketingConfig,
            initialBucketing: demoData.bucketing.classical
        } as FlagshipSdkConfig;
        bucketInstance = new Bucketing(demoData.envId[0], tempConfig, mockGenerator.createPanicModeMock(tempConfig));
        expect(bucketInstance instanceof Bucketing).toEqual(true);

        expect(bucketInstance.data).toEqual(demoData.bucketing.classical);
        expect(bucketInstance.log).toBeDefined();
        expect(bucketInstance.envId).toEqual(demoData.envId[0]);
        expect(bucketInstance.isPollingRunning).toEqual(false);
        expect(bucketInstance.lastModifiedDate).toEqual(demoData.bucketing.classical.lastModifiedDate);

        done();
    });

    it('should NOT preset bucketing if "initialBucketing" is NOT set correctly', (done) => {
        const helperSpy = jest.spyOn(flagshipSdkHelper, 'generateValidateError');
        const tempConfig = {
            ...bucketingConfig,
            initialBucketing: { test: 'oops' }
        } as FlagshipSdkConfig;
        bucketInstance = new Bucketing(demoData.envId[0], tempConfig, mockGenerator.createPanicModeMock(tempConfig));
        expect(bucketInstance instanceof Bucketing).toEqual(true);

        expect(bucketInstance.data).toEqual(null);
        expect(bucketInstance.log).toBeDefined();
        expect(bucketInstance.envId).toEqual(demoData.envId[0]);
        expect(bucketInstance.isPollingRunning).toEqual(false);
        expect(bucketInstance.lastModifiedDate).toEqual(null);

        expect(helperSpy).toHaveBeenCalledTimes(1);
        expect(helperSpy.mock.results[0].value.replace(/\n|\r/g, '')).toEqual(
            'Element:- "campaigns" Campaigns is missing.- "panic" Panic is missing.- "lastModifiedDate" Last modified date is missing.'
        );
        done();
    });
    it('should NOT preset bucketing if "initialBucketing" is NOT set correctly - part 2', (done) => {
        const helperSpy = jest.spyOn(flagshipSdkHelper, 'generateValidateError');
        const tempConfig = {
            ...bucketingConfig,
            initialBucketing: { panic: false, lastModifiedDate: 'oops2', campaigns: [{ test: 'toos' }] }
        } as FlagshipSdkConfig;
        bucketInstance = new Bucketing(demoData.envId[0], tempConfig, mockGenerator.createPanicModeMock(tempConfig));
        expect(bucketInstance instanceof Bucketing).toEqual(true);

        expect(bucketInstance.data).toEqual(null);
        expect(bucketInstance.log).toBeDefined();
        expect(bucketInstance.envId).toEqual(demoData.envId[0]);
        expect(bucketInstance.isPollingRunning).toEqual(false);
        expect(bucketInstance.lastModifiedDate).toEqual(null);

        expect(helperSpy).toHaveBeenCalledTimes(2);
        expect(helperSpy.mock.results[1].value.replace(/\n|\r/g, '')).toEqual(
            'Element at index=0:- "id" Id is missing.- "type" Type is missing.- "variationGroups" Variation groups is missing.'
        );
        done();
    });
});
