import mockAxios from 'jest-mock-axios';
import { IFlagshipVisitor, IFlagship } from '../../index.d';

import demoData from '../../../test/mock/demoData';
import testConfig from '../../config/test';
import flagshipSdk from '../../index';
import FlagshipVisitor from './flagshipVisitor';
import flagshipSdkHelper from '../../lib/flagshipSdkHelper';

let sdk: IFlagship;
let visitorInstance: IFlagshipVisitor;
let spyActivateCampaign;
let spyGenerateCustomTypeParamsOf;
let responseObject;
let spyWarnLogs;
let spyErrorLogs;
let spyFatalLogs;
let spyInfoLogs;
let spyDebugLogs;

const initSpyLogs = (vInstance): void => {
    spyFatalLogs = jest.spyOn(vInstance.log, 'fatal');
    spyWarnLogs = jest.spyOn(vInstance.log, 'warn');
    spyInfoLogs = jest.spyOn(vInstance.log, 'info');
    spyDebugLogs = jest.spyOn(vInstance.log, 'debug');
    spyErrorLogs = jest.spyOn(vInstance.log, 'error');
};

describe('FlagshipVisitor', () => {
    beforeAll(() => {
        sdk = flagshipSdk.initSdk(demoData.envId[0], testConfig);
    });
    afterEach(() => {
        mockAxios.reset();
    });

    it('should create a Visitor instance with clean context', () => {
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        expect(visitorInstance).toBeInstanceOf(FlagshipVisitor);
    });

    describe('ActivateCampaign function', () => {
        beforeEach(() => {
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            spyActivateCampaign = jest.spyOn(visitorInstance, 'activateCampaign');
        });
        it('should call Api Decision Activate url', () => {
            const responseObj = {
                data: null,
                status: 200,
                statusText: 'OK'
            };
            visitorInstance.activateCampaign('123456789', '987654321');
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
                vid: visitorInstance.id,
                cid: visitorInstance.envId,
                vaid: '123456789',
                caid: '987654321'
            });
        });
        it('should report error when Api Decision Activate fails', (done) => {
            initSpyLogs(visitorInstance);
            visitorInstance.activateCampaign('123456789', '987654321').then((data) => {
                expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
                    vid: visitorInstance.id,
                    cid: visitorInstance.envId,
                    vaid: '123456789',
                    caid: '987654321'
                });
                expect(data).toEqual('server crashed');
                expect(spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(1);
                expect(spyFatalLogs).toHaveBeenNthCalledWith(
                    1,
                    'Trigger activate of variationId "123456789" failed with error "server crashed"'
                );
                done();
            });
            mockAxios.mockError('server crashed');
        });
    });

    describe('SynchronizeModifications function', () => {
        it('should always init "fetchedModifications" attribute when decision API succeed', (done) => {
            const responseObj = {
                data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
                status: 200,
                statusText: 'OK'
            };
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            expect(visitorInstance.fetchedModifications).toBe(null);
            visitorInstance.synchronizeModifications().then((response) => {
                try {
                    expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data.campaigns);
                    expect(response).toBe(responseObj.status);
                } catch (error) {
                    done.fail(error);
                }
                done();
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(
                1,
                `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`,
                { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] }
            );
        });
        it('should always call Decision API even if "fetchedModifications" already set before', (done) => {
            const responseObj = {
                data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
                status: 200,
                statusText: 'OK'
            };
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            visitorInstance.fetchedModifications = demoData.decisionApi.normalResponse.manyModifInManyCampaigns.campaigns; // Mock a previous fetch
            visitorInstance.synchronizeModifications().then((response) => {
                try {
                    expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data.campaigns);
                    expect(response).toBe(responseObj.status);
                } catch (error) {
                    done.fail(error);
                }
                done();
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(
                1,
                `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`,
                { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] }
            );
        });
        it('should always init "fetchedModifications" to "null" if decision API failed', (done) => {
            const responseObj = {
                data: 'Oh no, error is coming !',
                status: '422',
                source: { pointer: '/data/attributes/envId' },
                title: 'Invalid Attribute',
                detail: 'Env id must contain at least three characters.'
            };
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            visitorInstance.fetchedModifications = { someStuff: 1234 }; // Mock it to consider it initialized
            expect(visitorInstance.fetchedModifications).toEqual({ someStuff: 1234 }); // Just checking...
            visitorInstance.synchronizeModifications().catch(() => {
                try {
                    expect(visitorInstance.fetchedModifications).toBe(null);
                } catch (error) {
                    done.fail(error);
                }
                done();
            });
            mockAxios.mockError(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(
                1,
                `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`,
                { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] }
            );
        });
        it('should always init "fetchedModifications" attribute when decision API succeed (even with no modifs)', (done) => {
            const responseObj = {
                data: { ...demoData.decisionApi.normalResponse.noModif },
                status: 200,
                statusText: 'OK'
            };
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            expect(visitorInstance.fetchedModifications).toBe(null);
            visitorInstance.synchronizeModifications().then((response) => {
                try {
                    expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data.campaigns);
                    expect(response).toBe(responseObj.status);
                } catch (error) {
                    done.fail(error);
                }
                done();
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(
                1,
                `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`,
                { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] }
            );
        });
        it('should always NOT init "fetchedModifications" attribute when decision API succeed and has a weird answer', (done) => {
            const responseObj = {
                data: { ...demoData.decisionApi.badResponse.weirdAnswer },
                status: 200,
                statusText: 'OK'
            };
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            const spyCheckFormat = jest.spyOn(flagshipSdkHelper, 'checkDecisionApiResponseFormat');
            spyWarnLogs = jest.spyOn(visitorInstance.log, 'warn');
            expect(visitorInstance.fetchedModifications).toBe(null);
            visitorInstance.synchronizeModifications().then((responseStatus) => {
                try {
                    expect(visitorInstance.fetchedModifications).toBe(null);
                    expect(spyCheckFormat).toHaveReturnedWith(null);
                    expect(spyWarnLogs).toHaveBeenCalledTimes(2);
                    expect(spyWarnLogs).toHaveBeenNthCalledWith(1, 'No modification(s) found');
                    expect(spyWarnLogs).toHaveBeenNthCalledWith(2, 'Unknow Decision Api response received or error happened');
                    expect(responseStatus).toBe(200);
                } catch (error) {
                    done.fail(error);
                }
                done();
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(
                1,
                `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`,
                { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] }
            );
        });
    });

    describe('FetchAllModifications function', () => {
        beforeEach(() => {
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            spyActivateCampaign = jest.spyOn(visitorInstance, 'activateCampaign');
            initSpyLogs(visitorInstance);
        });
        it('should log an error when trying to hack args and the cache is null', (done) => {
            visitorInstance.fetchedModifications = null;
            const cacheResponse = visitorInstance.fetchAllModifications({ loadFromCache: true, force: true });
            try {
                expect(mockAxios.post).toHaveBeenCalledTimes(0);

                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);
                expect(spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenNthCalledWith(
                    1,
                    'fetchAllModifications - loadFromCache enabled but no data in cache. Make sure you fetched at least once before.'
                );

                expect(visitorInstance.fetchedModifications).toEqual(null);
                expect(cacheResponse).toEqual({ campaigns: null, visitorId: 'test-perf' });
                done();
            } catch (error) {
                done.fail(error);
            }
        });
        it('should return decision API response (mode=normal) when there is no optional argument set', () => {
            visitorInstance.fetchAllModifications();
            expect(mockAxios.post).toHaveBeenCalledWith(`https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, {
                context: demoData.visitor.cleanContext,
                trigger_hit: false,
                visitor_id: demoData.visitor.id[0]
            });
            expect(spyActivateCampaign).toHaveBeenCalledTimes(0);
        });

        it('should logs specifically when error and already fetched before and forced', (done) => {
            const responseObj = {
                data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
                status: 200,
                statusText: 'OK'
            };
            const errorObj = {
                data: 'Oh no, error is coming !',
                status: '422',
                source: { pointer: '/data/attributes/envId' },
                title: 'Invalid Attribute',
                detail: 'Env id must contain at least three characters.'
            };
            visitorInstance.fetchedModifications = responseObj.data.campaigns;
            spyInfoLogs = jest.spyOn(visitorInstance.log, 'info');
            const spyThen = jest.fn();
            visitorInstance
                .fetchAllModifications({
                    activate: false,
                    campaignCustomID: 'bmjdprsjan0g01uq2ceg',
                    force: true
                })
                .then(spyThen)
                .catch((errorResponse) => {
                    try {
                        expect(errorResponse).toEqual(errorObj);
                        expect(spyWarnLogs).toHaveBeenCalledTimes(0);
                        expect(spyFatalLogs).toHaveBeenCalledTimes(1);
                        expect(spyFatalLogs).toHaveBeenNthCalledWith(1, 'fetchAllModifications - an error occurred while fetching...');
                        done();
                    } catch (error) {
                        done.fail(error);
                    }
                });
            mockAxios.mockError(errorObj);
            expect(spyThen).toHaveBeenCalledTimes(0);
            expect(mockAxios.post).toHaveBeenCalledTimes(1);
        });

        it('should logs specifically when error and try to activate', (done) => {
            const errorObj = {
                data: 'Oh no, error is coming !',
                status: '422',
                source: { pointer: '/data/attributes/envId' },
                title: 'Invalid Attribute',
                detail: 'Env id must contain at least three characters.'
            };
            const spyThen = jest.fn();
            visitorInstance
                .fetchAllModifications({
                    activate: true,
                    campaignCustomID: 'bmjdprsjan0g01uq2ceg',
                    force: true
                })
                .then(spyThen)
                .catch((errorResponse) => {
                    try {
                        expect(errorResponse).toEqual(errorObj);
                        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                        expect(spyFatalLogs).toHaveBeenNthCalledWith(1, 'fetchAllModifications - an error occurred while fetching...');
                        expect(spyFatalLogs).toHaveBeenNthCalledWith(2, 'fetchAllModifications - activate canceled due to errors...');
                        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                        expect(spyDebugLogs).toHaveBeenNthCalledWith(
                            1,
                            'saveModificationsInCache - saving in cache those modifications: "null"'
                        );
                        expect(spyWarnLogs).toHaveBeenCalledTimes(0);
                        done();
                    } catch (error) {
                        done.fail(error);
                    }
                });
            mockAxios.mockError(errorObj);
            expect(spyThen).toHaveBeenCalledTimes(0);
            expect(mockAxios.post).toHaveBeenCalledTimes(1);
        });

        it('should return correct modification found for a specific campaign', (done) => {
            const responseObj = {
                data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
                status: 200,
                statusText: 'OK'
            };
            visitorInstance
                .fetchAllModifications({
                    campaignCustomID: 'bmjdprsjan0g01uq2ceg'
                })
                .then(({ data, status }) => {
                    try {
                        expect(data).toEqual({
                            campaigns: [
                                {
                                    id: 'bmjdprsjan0g01uq2ceg',
                                    variation: {
                                        id: 'bmjdprsjan0g01uq1ctg',
                                        modifications: {
                                            type: 'JSON',
                                            value: {
                                                algorithmVersion: 'yolo2',
                                                psp: 'yolo',
                                                hello: 'world'
                                            }
                                        }
                                    },
                                    variationGroupId: 'bmjdprsjan0g01uq2ceg'
                                }
                            ],
                            visitorId: demoData.visitor.id[0]
                        });
                        expect(status).toBe(200);
                        expect(spyActivateCampaign).toHaveBeenCalledTimes(0);
                        expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data.campaigns);
                    } catch (error) {
                        done.fail(error);
                    }
                    done();
                });
            mockAxios.mockResponse(responseObj);
        });

        it('should return empty array if no modification found for a specific campaign', (done) => {
            const responseObj = {
                data: [],
                status: 200,
                statusText: 'OK'
            };
            visitorInstance.fetchAllModifications({ campaignCustomID: 'unknowId' }).then(({ data, status }) => {
                try {
                    expect(data).toEqual({ campaigns: [], visitorId: demoData.visitor.id[0] });
                    expect(status).toBe(200);
                    expect(spyActivateCampaign).toHaveBeenCalledTimes(0);
                    done();
                } catch (error) {
                    done.fail(error);
                }
            });
            mockAxios.mockResponse(responseObj);
        });

        it('should call activate only ONCE when specific campaign is set', (done) => {
            const responseObj = {
                data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
                status: 200,
                statusText: 'OK'
            };
            visitorInstance.fetchAllModifications({ activate: true, campaignCustomID: 'bmjdprsjan0g01uq2ceg' }).then(({ data, status }) => {
                expect(status).toBe(200);
                expect(spyActivateCampaign).toHaveBeenCalledTimes(1);
                done();
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(
                1,
                `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`,
                { context: demoData.visitor.cleanContext, trigger_hit: true, visitor_id: demoData.visitor.id[0] }
            );
        });

        it('should get all modifications and then activate individually each campaign if activate=true', (done) => {
            const responseObj = {
                data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
                status: 200,
                statusText: 'OK'
            };
            visitorInstance.fetchAllModifications({ activate: true }).then(({ data, status }) => {
                expect(status).toBe(200);
                expect(spyActivateCampaign).toHaveBeenCalledTimes(3);
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
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(
                1,
                `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`,
                { context: demoData.visitor.cleanContext, trigger_hit: true, visitor_id: demoData.visitor.id[0] }
            );
        });

        it('should not call decision API if already fetched before', (done) => {
            const responseObj = {
                data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
                status: 200,
                statusText: 'OK'
            };
            spyInfoLogs = jest.spyOn(visitorInstance.log, 'info');
            visitorInstance.fetchedModifications = responseObj.data.campaigns; // Mock a already fetch
            visitorInstance.fetchAllModifications().then(({ data }) => {
                try {
                    expect(data.campaigns).toMatchObject(visitorInstance.fetchedModifications);
                    expect(spyInfoLogs).toBeCalledWith(
                        'fetchAllModifications - no calls to the Decision API because it has already been fetched before'
                    );
                    expect(spyActivateCampaign).toHaveBeenCalledTimes(0);
                } catch (error) {
                    done.fail(error);
                }
                done();
            });
            expect(mockAxios.post).not.toHaveBeenCalled();
        });

        it('should call decision API if already fetched before and need to activate', (done) => {
            const responseObj = {
                data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
                status: 200,
                statusText: 'OK'
            };
            spyInfoLogs = jest.spyOn(visitorInstance.log, 'info');
            visitorInstance.fetchedModifications = responseObj.data.campaigns; // Mock a already fetch
            visitorInstance.fetchAllModifications({ activate: true }).then(({ data }) => {
                try {
                    expect(data.campaigns).toMatchObject(visitorInstance.fetchedModifications);
                    expect(spyInfoLogs).toHaveBeenCalledWith(
                        'fetchAllModifications - no calls to the Decision API because it has already been fetched before'
                    );
                    expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
                        vaid: 'blntcamqmdvg04g371hg',
                        cid: 'bn1ab7m56qolupi5sa0g',
                        caid: 'blntcamqmdvg04g371h0',
                        vid: 'test-perf'
                    });
                    expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
                        vaid: 'bmjdprsjan0g01uq2ctg',
                        cid: 'bn1ab7m56qolupi5sa0g',
                        caid: 'bmjdprsjan0g01uq2csg',
                        vid: 'test-perf'
                    });
                    expect(mockAxios.post).toHaveBeenNthCalledWith(3, 'https://decision-api.flagship.io/v1/activate', {
                        vaid: 'bmjdprsjan0g01uq1ctg',
                        cid: 'bn1ab7m56qolupi5sa0g',
                        caid: 'bmjdprsjan0g01uq2ceg',
                        vid: 'test-perf'
                    });
                } catch (error) {
                    done.fail(error);
                }
                done();
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).not.toHaveBeenCalledWith(
                `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`
            );
        });
    });

    describe('updateContext funcion', () => {
        it('should update current visitor context', () => {
            const newContext = {
                pos: 'fl',
                alt: 'nh',
                rot: 'deg'
            };

            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            expect(visitorInstance.context).toMatchObject(demoData.visitor.cleanContext);
            visitorInstance.updateContext(newContext);
            expect(visitorInstance.context).toMatchObject(newContext);
        });
    });

    describe('TriggerActivateIfNeeded function', () => {
        it('should logs an error when the api failed', () => {
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            initSpyLogs(visitorInstance);
            visitorInstance.triggerActivateIfNeeded(
                demoData.flagshipVisitor.getModifications.detailsModifications.oneModifInMoreThanOneCampaign
            );

            mockAxios.mockResponse({ status: 200, data: {} });
            mockAxios.mockError('server crashed');

            expect(spyFatalLogs).toHaveBeenCalledTimes(1);
            expect(spyFatalLogs).toHaveBeenNthCalledWith(
                1,
                'Trigger activate of modification key "algorithmVersion" failed. failed with error "server crashed"'
            );
            expect(spyErrorLogs).toHaveBeenCalledTimes(0);
            expect(spyInfoLogs).toHaveBeenCalledTimes(0);
            expect(spyDebugLogs).toHaveBeenCalledTimes(2);
            expect(spyDebugLogs).toHaveBeenNthCalledWith(
                1,
                'checkCampaignsActivatedMultipleTimes: Error this.fetchedModifications is empty'
            );
            expect(spyDebugLogs).toHaveBeenNthCalledWith(2, 'Modification key "psp" successfully activate. with status code "200"');
            expect(spyWarnLogs).toHaveBeenCalledTimes(0);

            expect(mockAxios.post).toHaveBeenCalledTimes(2);

            expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
                vaid: 'blntcamqmdvg04g371hg',
                cid: demoData.envId[0],
                caid: 'blntcamqmdvg04g371h0',
                vid: demoData.visitor.id[0]
            });
            expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
                vaid: 'bmjdprsjan0g01uq2ctg',
                cid: demoData.envId[0],
                caid: 'bmjdprsjan0g01uq2csg',
                vid: demoData.visitor.id[0]
            });
        });

        it('should not trigger twice activate for a modification which is in more than one campaign (1st use case)', () => {
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            visitorInstance.triggerActivateIfNeeded(
                demoData.flagshipVisitor.getModifications.detailsModifications.oneModifInMoreThanOneCampaign
            );
            expect(mockAxios.post).toHaveBeenCalledTimes(2);

            expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
                vaid: 'blntcamqmdvg04g371hg',
                cid: demoData.envId[0],
                caid: 'blntcamqmdvg04g371h0',
                vid: demoData.visitor.id[0]
            });
            expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
                vaid: 'bmjdprsjan0g01uq2ctg',
                cid: demoData.envId[0],
                caid: 'bmjdprsjan0g01uq2csg',
                vid: demoData.visitor.id[0]
            });
        });

        it('should not trigger twice activate for a modification which is in more than one campaign (2nd use case)', () => {
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            visitorInstance.triggerActivateIfNeeded(
                demoData.flagshipVisitor.getModifications.detailsModifications.manyModifInManyCampaigns
            );
            expect(mockAxios.post).toHaveBeenCalledTimes(1);

            expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
                vaid: 'blntcamqmdvg04g371hg',
                cid: demoData.envId[0],
                caid: 'blntcamqmdvg04g371h0',
                vid: demoData.visitor.id[0]
            });
        });
    });

    describe('GetModificationsForCampaign function', () => {
        beforeEach(() => {
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        });
        it('should return the data of only one campaign', (done) => {
            const responseObj = {
                data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
                status: 200,
                statusText: 'OK'
            };
            const spyFetchAll = jest.spyOn(visitorInstance, 'fetchAllModifications');
            const campaignId = 'blntcamqmdvg04g371f0';
            visitorInstance.getModificationsForCampaign(campaignId).then((response) => {
                try {
                    expect(response.data.campaigns).toMatchObject(responseObj.data.campaigns.filter((item) => item.id === campaignId));
                    expect(response.data.visitorId).toBe(visitorInstance.id);
                    expect(spyFetchAll).toHaveBeenCalled();
                } catch (error) {
                    done.fail(error);
                }
                done();
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(
                1,
                `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`,
                { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] }
            );
        });
        it('should return empty array if no match', (done) => {
            const responseObj = {
                data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
                status: 200,
                statusText: 'OK'
            };
            const spyFetchAll = jest.spyOn(visitorInstance, 'fetchAllModifications');
            const campaignId = '123456';
            visitorInstance.getModificationsForCampaign(campaignId).then((response) => {
                try {
                    expect(response.data.campaigns).toEqual([]);
                    expect(response.data.visitorId).toBe(visitorInstance.id);
                    expect(spyFetchAll).toHaveBeenCalled();
                    done();
                } catch (error) {
                    done.fail(error);
                }
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(
                1,
                `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`,
                { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] }
            );
        });
    });

    describe('GetModificationInfo function', () => {
        beforeEach(() => {
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            spyWarnLogs = jest.spyOn(visitorInstance.log, 'warn');
            spyErrorLogs = jest.spyOn(visitorInstance.log, 'error');
            spyFatalLogs = jest.spyOn(visitorInstance.log, 'fatal');
            spyInfoLogs = jest.spyOn(visitorInstance.log, 'info');
            spyDebugLogs = jest.spyOn(visitorInstance.log, 'debug');
        });
        it('should return all info of a modification if key match one campaigns', (done) => {
            const responseObj = {
                data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
                status: 200,
                statusText: 'OK'
            };
            visitorInstance.getModificationInfo('hello').then((response) => {
                try {
                    expect(response).toEqual({
                        campaignId: 'bmjdprsjan0g01uq2ceg',
                        variationGroupId: 'bmjdprsjan0g01uq2ceg',
                        variationId: 'bmjdprsjan0g01uq1ctg'
                    });
                } catch (error) {
                    done.fail(error);
                }
                done();
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(
                1,
                `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`,
                { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] }
            );
        });
        it('should return all info of first modification if key match FURTHER campaigns', (done) => {
            const responseObj = {
                data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
                status: 200,
                statusText: 'OK'
            };
            visitorInstance.getModificationInfo('psp').then((response) => {
                try {
                    expect(response).toEqual({
                        campaignId: 'blntcamqmdvg04g371f0',
                        variationGroupId: 'blntcamqmdvg04g371h0',
                        variationId: 'blntcamqmdvg04g371hg'
                    });
                    const spyObject = spyWarnLogs.mock.calls[0];
                    expect(spyObject[0]).toEqual(
                        'Modification "psp" has further values because the modification is involved in campaigns with (id="blntcamqmdvg04g371f0,bmjdprsjan0g01uq2ceg"). Modification value kept is psp="dalenys"'
                    );
                } catch (error) {
                    done.fail(error);
                }
                done();
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(
                1,
                `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`,
                { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] }
            );
        });
        it('should return null if key does not match any campaigns', (done) => {
            const responseObj = {
                data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
                status: 200,
                statusText: 'OK'
            };
            visitorInstance.getModificationInfo('nothing').then((response) => {
                try {
                    expect(response).toEqual(null);
                } catch (error) {
                    done.fail(error);
                }
                done();
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(
                1,
                `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`,
                { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] }
            );
        });
    });

    describe('GetAllModifications function', () => {
        beforeEach(() => {
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        });
        it('should receive all modifications from visitor', (done) => {
            const responseObj = {
                data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
                status: 200,
                statusText: 'OK'
            };
            const spyFetchAll = jest.spyOn(visitorInstance, 'fetchAllModifications');
            visitorInstance.getAllModifications().then((response) => {
                try {
                    expect(response).toMatchObject(responseObj);
                    expect(spyFetchAll).toHaveBeenCalled();
                } catch (error) {
                    done.fail(error);
                }
                done();
            });
            mockAxios.mockResponse(responseObj);
            expect(mockAxios.post).toHaveBeenNthCalledWith(
                1,
                `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`,
                { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] }
            );
        });
    });

    describe('ActivateModifications function', () => {
        let spyExtractDesiredModifications;
        let spyTriggerActivateIfNeeded;
        beforeEach(() => {
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            spyExtractDesiredModifications = jest.spyOn(visitorInstance, 'extractDesiredModifications');
            spyTriggerActivateIfNeeded = jest.spyOn(visitorInstance, 'triggerActivateIfNeeded');
            spyWarnLogs = jest.spyOn(visitorInstance.log, 'warn');
            spyErrorLogs = jest.spyOn(visitorInstance.log, 'error');
            spyFatalLogs = jest.spyOn(visitorInstance.log, 'fatal');
            spyInfoLogs = jest.spyOn(visitorInstance.log, 'info');
            spyDebugLogs = jest.spyOn(visitorInstance.log, 'debug');
            responseObject = {
                data: demoData.flagshipVisitor.activateModifications.fetchedModifications.basic,
                status: 200,
                statusText: 'OK'
            };
        });
        it('should warn if requested key does not match any campaign', (done) => {
            visitorInstance.fetchedModifications = responseObject.data.campaigns; // Mock a previous fetch
            visitorInstance.activateModifications([...demoData.flagshipVisitor.activateModifications.args.basic, { key: 'xoxo' }]);
            try {
                expect(mockAxios.post).toHaveBeenCalledTimes(2);
                expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
                    vaid: '5e26ccd8445a622037b1bc3b',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    caid: '5e26ccd8cc00f72d5f3cb177',
                    vid: 'test-perf'
                });
                expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
                    vaid: '5e26ccd828feadeb6d9b8414',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    caid: '5e26ccd8d4106bb1ae2b6455',
                    vid: 'test-perf'
                });
                expect(spyExtractDesiredModifications).toHaveBeenCalledWith(responseObject.data.campaigns, [
                    { activate: true, defaultValue: '', key: 'toto' },
                    { activate: true, defaultValue: '', key: 'tata' },
                    { activate: true, defaultValue: '', key: 'xoxo' }
                ]);
                // expect(spyTriggerActivateIfNeeded).toHaveBeenCalledWith(""); // DEBUG ONLY
                expect(spyWarnLogs).toHaveBeenCalledTimes(1);
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    1,
                    'Unable to activate modification "xoxo" because it does not exist on any existing campaign...'
                );
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyDebugLogs).toHaveBeenCalledTimes(2);
                // expect(spyDebugLogs).toHaveBeenNthCalledWith(1, '');
                done();
            } catch (error) {
                done.fail(error);
            }
        });
        it('should not activate all campaigns matching requesting key when there is a campaign conflict + notify with logs', (done) => {
            visitorInstance.fetchedModifications =
                demoData.flagshipVisitor.activateModifications.fetchedModifications.oneKeyConflict.campaigns; // Mock a previous fetch
            visitorInstance.activateModifications(demoData.flagshipVisitor.activateModifications.args.basic);
            try {
                expect(mockAxios.post).toHaveBeenCalledTimes(2);
                expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
                    vaid: '5e26ccd828feadeb6d9b8414',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    caid: '5e26ccd8d4106bb1ae2b6455',
                    vid: 'test-perf'
                });
                expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
                    vaid: '5e26ccd89609296ae8430037',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    caid: '5e26ccd8fcde4be7ffe5476f',
                    vid: 'test-perf'
                });
                expect(spyExtractDesiredModifications).toHaveBeenCalledWith(
                    demoData.flagshipVisitor.activateModifications.fetchedModifications.oneKeyConflict.campaigns,
                    [
                        { activate: true, defaultValue: '', key: 'toto' },
                        { activate: true, defaultValue: '', key: 'tata' }
                    ]
                );
                // expect(spyTriggerActivateIfNeeded).toHaveBeenCalledWith(""); // DEBUG ONLY
                expect(spyWarnLogs).toHaveBeenCalledTimes(2);
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    2,
                    'Key "toto" has been activated 2 times because it was in conflict in further campaigns (debug logs for more details)'
                );
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyDebugLogs).toHaveBeenCalledTimes(2);
                expect(spyDebugLogs).toHaveBeenNthCalledWith(
                    2,
                    'Here the details:,\n- because key "toto" is also include inside campaign id="5e26ccd803533a89c3acda5c" where key(s) "tata " is/are also requested.'
                );
                done();
            } catch (error) {
                done.fail(error);
            }
        });
        it('should not activate all campaigns matching requesting key when there is a campaign conflict', (done) => {
            visitorInstance.fetchedModifications =
                demoData.flagshipVisitor.activateModifications.fetchedModifications.oneKeyConflict.campaigns; // Mock a previous fetch
            visitorInstance.activateModifications([{ key: 'toto' }]);
            try {
                expect(mockAxios.post).toHaveBeenCalledTimes(1);
                expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
                    vaid: '5e26ccd828feadeb6d9b8414',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    caid: '5e26ccd8d4106bb1ae2b6455',
                    vid: 'test-perf'
                });
                expect(spyExtractDesiredModifications).toHaveBeenCalledWith(
                    demoData.flagshipVisitor.activateModifications.fetchedModifications.oneKeyConflict.campaigns,
                    [{ activate: true, defaultValue: '', key: 'toto' }]
                );
                // expect(spyTriggerActivateIfNeeded).toHaveBeenCalledWith(""); // DEBUG ONLY
                expect(spyWarnLogs).toHaveBeenCalledTimes(1);
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    1,
                    'Modification "toto" has further values because the modification is involved in campaigns with (id="5e26ccd821f4634cf53d4cc0,5e26ccd8dcbd133baaa425b8,5e26ccd803533a89c3acda5c"). Modification value kept is toto="55"'
                );
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyDebugLogs).toHaveBeenCalledTimes(1);
                done();
            } catch (error) {
                done.fail(error);
            }
        });
        it('should not activate all campaigns matching requesting key when there is a campaign conflict + notify with logs (part 2)', (done) => {
            visitorInstance.fetchedModifications =
                demoData.flagshipVisitor.activateModifications.fetchedModifications.multipleKeyConflict.campaigns; // Mock a previous fetch
            visitorInstance.activateModifications(demoData.flagshipVisitor.activateModifications.args.all);
            try {
                expect(mockAxios.post).toHaveBeenCalledTimes(3);
                expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
                    vaid: '5e26ccd8445a622037b1bc3b',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    caid: '5e26ccd8cc00f72d5f3cb177',
                    vid: 'test-perf'
                });
                expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
                    vaid: '5e26ccd828feadeb6d9b8414',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    caid: '5e26ccd8d4106bb1ae2b6455',
                    vid: 'test-perf'
                });
                expect(mockAxios.post).toHaveBeenNthCalledWith(3, 'https://decision-api.flagship.io/v1/activate', {
                    vaid: '5e26ccd89609296ae8430037',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    caid: '5e26ccd8fcde4be7ffe5476f',
                    vid: 'test-perf'
                });
                expect(spyExtractDesiredModifications).toHaveBeenCalledWith(
                    demoData.flagshipVisitor.activateModifications.fetchedModifications.multipleKeyConflict.campaigns,
                    [
                        { activate: true, defaultValue: '', key: 'toto' },
                        { activate: true, defaultValue: '', key: 'tata' },
                        { activate: true, defaultValue: '', key: 'titi' }
                    ]
                );
                // expect(spyTriggerActivateIfNeeded).toHaveBeenCalledWith(""); // DEBUG ONLY
                expect(spyWarnLogs).toHaveBeenCalledTimes(5);
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    4,
                    'Key "toto" has been activated 2 times because it was in conflict in further campaigns (debug logs for more details)'
                );
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    5,
                    'Key "titi" has been activated 2 times because it was in conflict in further campaigns (debug logs for more details)'
                );
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyDebugLogs).toHaveBeenCalledTimes(3);
                expect(spyDebugLogs).toHaveBeenNthCalledWith(
                    2,
                    'Here the details:,,\n- because key "toto" is also include inside campaign id="5e26ccd803533a89c3acda5c" where key(s) "tata " is/are also requested.'
                );
                expect(spyDebugLogs).toHaveBeenNthCalledWith(
                    3,
                    'Here the details:,,\n- because key "titi" is also include inside campaign id="5e26ccd803533a89c3acda5c" where key(s) "tata " is/are also requested.'
                );
                done();
            } catch (error) {
                done.fail(error);
            }
        });
        it('should correctly handle conflicts due to further other requested keys', () => {
            visitorInstance.fetchedModifications =
                demoData.flagshipVisitor.activateModifications.fetchedModifications.multipleKeyConflict.campaigns; // Mock a previous fetch
            visitorInstance.activateModifications(demoData.flagshipVisitor.activateModifications.args.over9000);
            expect(mockAxios.post).toHaveBeenCalledTimes(4);
            expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
                vaid: '5e26ccd8445a622037b1bc3b',
                cid: 'bn1ab7m56qolupi5sa0g',
                caid: '5e26ccd8cc00f72d5f3cb177',
                vid: 'test-perf'
            });
            expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
                vaid: '5e26ccd828feadeb6d9b8414',
                cid: 'bn1ab7m56qolupi5sa0g',
                caid: '5e26ccd8d4106bb1ae2b6455',
                vid: 'test-perf'
            });
            expect(mockAxios.post).toHaveBeenNthCalledWith(3, 'https://decision-api.flagship.io/v1/activate', {
                vaid: '5e26ccd89609296ae8430037',
                cid: 'bn1ab7m56qolupi5sa0g',
                caid: '5e26ccd8fcde4be7ffe5476f',
                vid: 'test-perf'
            });
            expect(mockAxios.post).toHaveBeenNthCalledWith(4, 'https://decision-api.flagship.io/v1/activate', {
                vaid: '5e26ccd89609296ae8430137',
                cid: 'bn1ab7m56qolupi5sa0g',
                caid: '5e26ccd8fcde4be7ff55476f',
                vid: 'test-perf'
            });
            expect(spyExtractDesiredModifications).toHaveBeenCalledWith(
                demoData.flagshipVisitor.activateModifications.fetchedModifications.multipleKeyConflict.campaigns,
                [
                    { activate: true, defaultValue: '', key: 'toto' },
                    { activate: true, defaultValue: '', key: 'tata' },
                    { activate: true, defaultValue: '', key: 'titi' },
                    { activate: true, defaultValue: '', key: 'tyty' }
                ]
            );
            // expect(spyTriggerActivateIfNeeded).toHaveBeenCalledWith(""); // DEBUG ONLY
            expect(spyWarnLogs).toHaveBeenCalledTimes(6);
            expect(spyWarnLogs).toHaveBeenNthCalledWith(
                4,
                'Key "toto" has been activated 3 times because it was in conflict in further campaigns (debug logs for more details)'
            );
            expect(spyWarnLogs).toHaveBeenNthCalledWith(
                5,
                'Key "titi" has been activated 2 times because it was in conflict in further campaigns (debug logs for more details)'
            );
            expect(spyWarnLogs).toHaveBeenNthCalledWith(
                6,
                'Key "tata" has been activated 2 times because it was in conflict in further campaigns (debug logs for more details)'
            );
            expect(spyErrorLogs).toHaveBeenCalledTimes(0);
            expect(spyFatalLogs).toHaveBeenCalledTimes(0);
            expect(spyInfoLogs).toHaveBeenCalledTimes(0);
            expect(spyDebugLogs).toHaveBeenCalledTimes(4);
            expect(spyDebugLogs).toHaveBeenNthCalledWith(
                2,
                expect.stringContaining(
                    'because key "toto" is also include inside campaign id="5e26ccd803533a89c3acda5c" where key(s) "tata " is/are also requested.'
                )
            );
            expect(spyDebugLogs).toHaveBeenNthCalledWith(
                2,
                expect.stringContaining(
                    'because key "toto" is also include inside campaign id="5e26ccd803533a89c3acbbbb" where key(s) "tyty " is/are also requested'
                )
            );
            expect(spyDebugLogs).toHaveBeenNthCalledWith(
                3,
                expect.stringContaining(
                    'because key "titi" is also include inside campaign id="5e26ccd803533a89c3acda5c" where key(s) "tata " is/are also requested'
                )
            );
            expect(spyDebugLogs).toHaveBeenNthCalledWith(
                4,
                expect.stringContaining(
                    'because key "tata" is also include inside campaign id="5e26ccd803533a89c3acbbbb" where key(s) "tyty " is/are also requested'
                )
            );
        });
        it('should not activate all campaigns matching requesting key when there is a campaign conflict + notify with logs (part 3)', (done) => {
            visitorInstance.fetchedModifications =
                demoData.flagshipVisitor.activateModifications.fetchedModifications.multipleKeyConflict.campaigns; // Mock a previous fetch
            visitorInstance.activateModifications(demoData.flagshipVisitor.activateModifications.args.basic);
            try {
                expect(mockAxios.post).toHaveBeenCalledTimes(2);
                expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
                    vaid: '5e26ccd8445a622037b1bc3b',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    caid: '5e26ccd8cc00f72d5f3cb177',
                    vid: 'test-perf'
                });
                expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
                    vaid: '5e26ccd89609296ae8430037',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    caid: '5e26ccd8fcde4be7ffe5476f',
                    vid: 'test-perf'
                });
                expect(spyExtractDesiredModifications).toHaveBeenCalledWith(
                    demoData.flagshipVisitor.activateModifications.fetchedModifications.multipleKeyConflict.campaigns,
                    [
                        { activate: true, defaultValue: '', key: 'toto' },
                        { activate: true, defaultValue: '', key: 'tata' }
                    ]
                );
                // expect(spyTriggerActivateIfNeeded).toHaveBeenCalledWith(""); // DEBUG ONLY
                expect(spyWarnLogs).toHaveBeenCalledTimes(3);
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    1,
                    'Modification "toto" has further values because the modification is involved in campaigns with (id="5e26ccd8dcbd133baaa425b8,5e26ccd803533a89c3acda5c,5e26ccd803533a89c3acbbbb"). Modification value kept is toto="2"'
                );
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    2,
                    'Modification "tata" has further values because the modification is involved in campaigns with (id="5e26ccd803533a89c3acda5c,5e26ccd803533a89c3acbbbb"). Modification value kept is tata="2"'
                );
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    3,
                    'Key "toto" has been activated 2 times because it was in conflict in further campaigns (debug logs for more details)'
                );
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyDebugLogs).toHaveBeenCalledTimes(2);
                expect(spyDebugLogs).toHaveBeenNthCalledWith(
                    2,
                    'Here the details:,\n- because key "toto" is also include inside campaign id="5e26ccd803533a89c3acda5c" where key(s) "tata " is/are also requested.'
                );
                done();
            } catch (error) {
                done.fail(error);
            }
        });
        it('should not activate all campaigns matching requesting key when there is a campaign conflict (part 2)', (done) => {
            visitorInstance.fetchedModifications =
                demoData.flagshipVisitor.activateModifications.fetchedModifications.multipleKeyConflict.campaigns; // Mock a previous fetch
            visitorInstance.activateModifications([{ key: 'toto' }]);
            try {
                expect(mockAxios.post).toHaveBeenCalledTimes(1);
                expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
                    vaid: '5e26ccd8445a622037b1bc3b',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    caid: '5e26ccd8cc00f72d5f3cb177',
                    vid: 'test-perf'
                });
                expect(spyExtractDesiredModifications).toHaveBeenCalledWith(
                    demoData.flagshipVisitor.activateModifications.fetchedModifications.multipleKeyConflict.campaigns,
                    [{ activate: true, defaultValue: '', key: 'toto' }]
                );
                // expect(spyTriggerActivateIfNeeded).toHaveBeenCalledWith(""); // DEBUG ONLY
                expect(spyWarnLogs).toHaveBeenCalledTimes(1);
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    1,
                    'Modification "toto" has further values because the modification is involved in campaigns with (id="5e26ccd8dcbd133baaa425b8,5e26ccd803533a89c3acda5c,5e26ccd803533a89c3acbbbb"). Modification value kept is toto="2"'
                );
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyDebugLogs).toHaveBeenCalledTimes(1);
                done();
            } catch (error) {
                done.fail(error);
            }
        });
        it('should get corresponding campaigns exactly same as getModifications function And then should activate them', (done) => {
            visitorInstance.fetchedModifications = responseObject.data.campaigns; // Mock a previous fetch
            visitorInstance.activateModifications(demoData.flagshipVisitor.activateModifications.args.basic);
            try {
                expect(mockAxios.post).toHaveBeenCalledTimes(2);
                expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
                    vaid: '5e26ccd8445a622037b1bc3b',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    caid: '5e26ccd8cc00f72d5f3cb177',
                    vid: 'test-perf'
                });
                expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
                    vaid: '5e26ccd828feadeb6d9b8414',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    caid: '5e26ccd8d4106bb1ae2b6455',
                    vid: 'test-perf'
                });
                expect(spyExtractDesiredModifications).toHaveBeenCalledWith(responseObject.data.campaigns, [
                    { activate: true, defaultValue: '', key: 'toto' },
                    { activate: true, defaultValue: '', key: 'tata' }
                ]);
                // expect(spyTriggerActivateIfNeeded).toHaveBeenCalledWith(""); // DEBUG ONLY
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyDebugLogs).toHaveBeenCalledTimes(1);
                // expect(spyDebugLogs).toHaveBeenNthCalledWith(1, '');
                done();
            } catch (error) {
                done.fail(error);
            }
        });
    });

    describe('SendHit function', () => {
        beforeEach(() => {
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            spyGenerateCustomTypeParamsOf = jest.spyOn(visitorInstance, 'generateCustomTypeParamsOf');
            spyWarnLogs = jest.spyOn(visitorInstance.log, 'warn');
            spyErrorLogs = jest.spyOn(visitorInstance.log, 'error');
            spyFatalLogs = jest.spyOn(visitorInstance.log, 'fatal');
            spyInfoLogs = jest.spyOn(visitorInstance.log, 'info');
            responseObject = {
                data: null,
                status: 200,
                statusText: 'OK'
            };
        });
        it('should work - transaction hit', (done) => {
            visitorInstance.sendHit(demoData.hit.transaction).then((response) => {
                try {
                    expect(response).not.toBeDefined();
                    expect(spyInfoLogs).toHaveBeenNthCalledWith(1, 'sendHits - hit (type"TRANSACTION") send successfully');
                    expect(spyWarnLogs).toBeCalledTimes(0);
                    expect(spyErrorLogs).toBeCalledTimes(0);
                    expect(spyFatalLogs).toBeCalledTimes(0);
                } catch (error) {
                    done.fail(error);
                }
                done();
            });

            mockAxios.mockResponse();
            expect(mockAxios.post).toBeCalledTimes(1);
        });
    });
    describe('SendHits function', () => {
        beforeEach(() => {
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            spyGenerateCustomTypeParamsOf = jest.spyOn(visitorInstance, 'generateCustomTypeParamsOf');
            spyWarnLogs = jest.spyOn(visitorInstance.log, 'warn');
            spyErrorLogs = jest.spyOn(visitorInstance.log, 'error');
            spyFatalLogs = jest.spyOn(visitorInstance.log, 'fatal');
            spyInfoLogs = jest.spyOn(visitorInstance.log, 'info');
            responseObject = {
                data: null,
                status: 200,
                statusText: 'OK'
            };
        });
        it('should send hit of type "transaction" + "item" + "event" + "page" + "screen" if there are in the array argument', (done) => {
            try {
                visitorInstance
                    .sendHits([demoData.hit.event, demoData.hit.item, demoData.hit.screen, demoData.hit.transaction])
                    .then((response) => {
                        try {
                            expect(response).not.toBeDefined();
                            expect(spyInfoLogs).toHaveBeenNthCalledWith(1, 'sendHits - hit (type"EVENT") send successfully');
                            expect(spyInfoLogs).toHaveBeenNthCalledWith(2, 'sendHits - hit (type"ITEM") send successfully');
                            expect(spyInfoLogs).toHaveBeenNthCalledWith(3, 'sendHits - hit (type"SCREENVIEW") send successfully');
                            expect(spyInfoLogs).toHaveBeenNthCalledWith(4, 'sendHits - hit (type"TRANSACTION") send successfully');
                            expect(spyWarnLogs).toBeCalledTimes(0);
                            expect(spyErrorLogs).toBeCalledTimes(0);
                            expect(spyFatalLogs).toBeCalledTimes(0);
                            done();
                        } catch (error) {
                            done.fail(error);
                        }
                    })
                    .catch((error) => {
                        done.fail(error);
                    });
                mockAxios.mockResponse();
                mockAxios.mockResponse();
                mockAxios.mockResponse();
                mockAxios.mockResponse();
                // mockAxios.mockResponse()
                expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://ariane.abtasty.com', {
                    cid: 'bn1ab7m56qolupi5sa0g',
                    vid: 'test-perf',
                    ds: 'APP',
                    ea: 'signOff',
                    dl: 'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
                    ec: 'User Engagement',
                    el: 'yolo label ;)',
                    ev: 123,
                    pt: 'YoloTitle',
                    t: 'EVENT'
                });
                expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://ariane.abtasty.com', {
                    cid: 'bn1ab7m56qolupi5sa0g',
                    ds: 'APP',
                    ic: 'yoloCode',
                    dl: 'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
                    in: 'yoloItem',
                    ip: 999,
                    iq: 1234444,
                    iv: 'yoloCategory',
                    pt: 'YoloScreen',
                    t: 'ITEM',
                    tid: '12451342423',
                    vid: 'test-perf'
                });
                expect(mockAxios.post).toHaveBeenNthCalledWith(3, 'https://ariane.abtasty.com', {
                    cid: 'bn1ab7m56qolupi5sa0g',
                    dl: 'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
                    ds: 'APP',
                    t: 'SCREENVIEW',
                    vid: 'test-perf',
                    pt: 'YoloScreen'
                });
                expect(mockAxios.post).toHaveBeenNthCalledWith(4, 'https://ariane.abtasty.com', {
                    cid: 'bn1ab7m56qolupi5sa0g',
                    ds: 'APP',
                    pt: 'YoloScreen',
                    tid: '12451342423',
                    vid: 'test-perf',
                    dl: 'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
                    icn: 2,
                    pm: 'yoloPaymentMethod',
                    sm: 'yoloShippingMethod',
                    t: 'TRANSACTION',
                    ta: 'yoloAffiliation',
                    tc: 'yoloCurrency',
                    tcc: 'YOLOCOUPON',
                    tr: 999,
                    ts: 888,
                    tt: 1234444
                });
                expect(mockAxios.post).toHaveBeenCalledTimes(4);
            } catch (error) {
                done.fail(error);
            }
        });
        it('should have correct behavior when trying to send a hit where type does not exist', (done) => {
            try {
                visitorInstance
                    .sendHits([{ ...demoData.hit.event, type: 'toto' }])
                    .then((response) => {
                        try {
                            expect(response).not.toBeDefined();
                            expect(spyInfoLogs).toBeCalledTimes(0);
                            expect(spyWarnLogs).toBeCalledTimes(0);
                            expect(spyErrorLogs).toHaveBeenNthCalledWith(
                                1,
                                'sendHits - no type found for hit: "{"type":"toto","data":{"category":"User Engagement","action":"signOff","label":"yolo label ;)","value":123,"documentLocation":"http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F","pageTitle":"YoloTitle"}}"'
                            );
                            expect(spyFatalLogs).toBeCalledTimes(0);
                            done();
                        } catch (error) {
                            done.fail(error);
                        }
                    })
                    .catch((error) => {
                        done.fail(error);
                    });
                expect(mockAxios.post).not.toHaveBeenCalled();
            } catch (error) {
                done.fail(error);
            }
        });
        it('should logs error when hit api failed', (done) => {
            visitorInstance.sendHits([demoData.hit.event]).catch((err) => {
                expect(err).toEqual('server crashed');
                expect(spyInfoLogs).toBeCalledTimes(0);
                expect(spyWarnLogs).toBeCalledTimes(0);
                expect(spyErrorLogs).toBeCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenNthCalledWith(1, 'sendHits - fail with error: "server crashed"');
                done();
            });
            mockAxios.mockError('server crashed');
        });
        it('should logs error when hit "event" not set correctly', (done) => {
            const brokenEvent1 = { ...demoData.hit.event, data: { ...demoData.hit.event.data, action: null } };
            const brokenEvent2 = { ...demoData.hit.event, data: { ...demoData.hit.event.data, category: null } };
            visitorInstance.sendHits([brokenEvent1, brokenEvent2]).then((response) => {
                try {
                    expect(response).not.toBeDefined();
                    expect(spyInfoLogs).toBeCalledTimes(0);
                    expect(spyWarnLogs).toBeCalledTimes(0);
                    expect(spyErrorLogs).toHaveBeenNthCalledWith(
                        2,
                        'sendHits(Event) - failed because following required attribute "category" is missing...'
                    );
                    expect(spyErrorLogs).toHaveBeenNthCalledWith(
                        1,
                        'sendHits(Event) - failed because following required attribute "action" is missing...'
                    );
                    expect(spyErrorLogs).toBeCalledTimes(2);
                    expect(spyFatalLogs).toBeCalledTimes(0);
                } catch (error) {
                    done.fail(error);
                }
                done();
            });
            expect(mockAxios.post).toBeCalledTimes(0);
        });
        it('should logs error when hit "screen" not set correctly', (done) => {
            const brokenHit1 = { ...demoData.hit.screen, data: { ...demoData.hit.screen.data, pageTitle: null } };
            const brokenHit2 = { ...demoData.hit.screen, data: { ...demoData.hit.screen.data, documentLocation: null } };
            visitorInstance.sendHits([brokenHit1, brokenHit2]).then((response) => {
                try {
                    expect(response).not.toBeDefined();
                    expect(spyInfoLogs).toBeCalledTimes(0);
                    expect(spyWarnLogs).toBeCalledTimes(0);
                    expect(spyErrorLogs).toHaveBeenNthCalledWith(
                        1,
                        'sendHits(ScreenView) - failed because following required attribute "pageTitle" is missing...'
                    );
                    expect(spyErrorLogs).toHaveBeenNthCalledWith(
                        2,
                        'sendHits(ScreenView) - failed because following required attribute "documentLocation" is missing...'
                    );
                    expect(spyErrorLogs).toBeCalledTimes(2);
                    expect(spyFatalLogs).toBeCalledTimes(0);
                } catch (error) {
                    done.fail(error);
                }
                done();
            });
            expect(mockAxios.post).toBeCalledTimes(0);
        });
        it('should logs error when hit "item" not set correctly', (done) => {
            visitorInstance
                .sendHits([
                    { ...demoData.hit.item, data: { ...demoData.hit.item.data, transactionId: null } },
                    { ...demoData.hit.item, data: { ...demoData.hit.item.data, name: null } },
                    { ...demoData.hit.item, data: { ...demoData.hit.item.data, code: null } }
                ])
                .then((response) => {
                    try {
                        expect(response).not.toBeDefined();
                        expect(spyInfoLogs).toBeCalledTimes(0);
                        expect(spyWarnLogs).toBeCalledTimes(0);
                        expect(spyErrorLogs).toHaveBeenNthCalledWith(
                            1,
                            'sendHits(Item) - failed because following required attribute "transactionId" is missing...'
                        );
                        expect(spyErrorLogs).toHaveBeenNthCalledWith(
                            2,
                            'sendHits(Item) - failed because following required attribute "name" is missing...'
                        );
                        expect(spyErrorLogs).toHaveBeenNthCalledWith(
                            3,
                            'sendHits(Item) - failed because following required attribute "code" is missing...'
                        );
                        expect(spyErrorLogs).toBeCalledTimes(3);
                        expect(spyFatalLogs).toBeCalledTimes(0);
                    } catch (error) {
                        done.fail(error);
                    }
                    done();
                });
            expect(mockAxios.post).toBeCalledTimes(0);
        });
        it('should logs error when hit "transaction" not set correctly', (done) => {
            visitorInstance
                .sendHits([
                    { ...demoData.hit.transaction, data: { ...demoData.hit.transaction.data, transactionId: null } },
                    { ...demoData.hit.transaction, data: { ...demoData.hit.transaction.data, affiliation: null } }
                ])
                .then((response) => {
                    try {
                        expect(response).not.toBeDefined();
                        expect(spyInfoLogs).toBeCalledTimes(0);
                        expect(spyWarnLogs).toBeCalledTimes(0);
                        expect(spyErrorLogs).toHaveBeenNthCalledWith(
                            1,
                            'sendHits(Transaction) - failed because following required attribute "transactionId" is missing...'
                        );
                        expect(spyErrorLogs).toHaveBeenNthCalledWith(
                            2,
                            'sendHits(Transaction) - failed because following required attribute "affiliation" is missing...'
                        );
                        expect(spyErrorLogs).toBeCalledTimes(2);
                        expect(spyFatalLogs).toBeCalledTimes(0);
                    } catch (error) {
                        done.fail(error);
                    }
                    done();
                });
            expect(mockAxios.post).toBeCalledTimes(0);
        });
    });

    describe('getModifications function', () => {
        let spyFetchModifs;
        beforeEach(() => {
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            spyGenerateCustomTypeParamsOf = jest.spyOn(visitorInstance, 'generateCustomTypeParamsOf');
            spyWarnLogs = jest.spyOn(visitorInstance.log, 'warn');
            spyErrorLogs = jest.spyOn(visitorInstance.log, 'error');
            spyFatalLogs = jest.spyOn(visitorInstance.log, 'fatal');
            spyInfoLogs = jest.spyOn(visitorInstance.log, 'info');
            spyDebugLogs = jest.spyOn(visitorInstance.log, 'debug');
            spyFetchModifs = jest.spyOn(visitorInstance, 'fetchAllModifications');
            responseObject = {
                data: null,
                status: 200,
                statusText: 'OK'
            };
        });
        it('should not activate a nonexisting key + return default value', (done) => {
            responseObject.data = demoData.decisionApi.normalResponse.manyModifInManyCampaigns;
            visitorInstance.fetchedModifications = responseObject.data.campaigns; // Mock a previous fetch
            const cacheResponse = visitorInstance.getModifications(
                demoData.flagshipVisitor.getModifications.args.requestOneUnexistingKeyWithActivate
            );
            try {
                expect(mockAxios.post).toHaveBeenCalledTimes(0);
                expect(spyFetchModifs).toHaveBeenCalledWith({ activate: false, loadFromCache: true });
                expect(spyFetchModifs).toHaveBeenCalledTimes(1);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(1);
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    1,
                    'Unable to activate modification "testUnexistingKey" because it does not exist on any existing campaign...'
                );
                expect(spyDebugLogs).toHaveBeenCalledTimes(4);
                expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'fetchAllModifications - loadFromCache enabled');
                expect(visitorInstance.fetchedModifications).toMatchObject(responseObject.data.campaigns);
                expect(cacheResponse).toMatchObject({ testUnexistingKey: 'NOOOOO' });
                done();
            } catch (error) {
                done.fail(error);
            }
        });
        it('should not use promise when fetching modifications', (done) => {
            responseObject.data = demoData.decisionApi.normalResponse.manyModifInManyCampaigns;
            visitorInstance.fetchedModifications = responseObject.data.campaigns; // Mock a previous fetch
            const cacheResponse = visitorInstance.getModifications(demoData.flagshipVisitor.getModifications.args.noActivate);
            try {
                expect(mockAxios.post).toHaveBeenCalledTimes(0);
                expect(spyFetchModifs).toHaveBeenCalledWith({ activate: false, loadFromCache: true });
                expect(spyFetchModifs).toHaveBeenCalledTimes(1);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(2); // because of key conflict (checked in another UT)
                expect(spyDebugLogs).toHaveBeenCalledWith('fetchAllModifications - loadFromCache enabled');
                expect(visitorInstance.fetchedModifications).toMatchObject(responseObject.data.campaigns);
                expect(cacheResponse).toMatchObject({ algorithmVersion: 'new', psp: 'dalenys', testUnexistingKey: 'YOLOOOO' });
                done();
            } catch (error) {
                done.fail(error);
            }
        });
        it('should checkCampaignsActivatedMultipleTimes log an error if two campaigns have same id', (done) => {
            responseObject.data = demoData.decisionApi.badResponse.twoCampaignsWithSameId;
            visitorInstance.fetchedModifications = responseObject.data.campaigns; // Mock a previous fetch

            const cacheResponse = visitorInstance.getModifications(demoData.flagshipVisitor.getModifications.args.default);
            try {
                expect(mockAxios.post).toHaveBeenCalledTimes(1);
                expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
                    vaid: 'blntcamqmdvg04g371hg',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    caid: 'blntcamqmdvg04g371h0',
                    vid: 'test-perf'
                });
                expect(spyFetchModifs).toHaveBeenCalledWith({ activate: false, loadFromCache: true });
                expect(spyFetchModifs).toHaveBeenCalledTimes(1);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(1);
                expect(spyDebugLogs).toHaveBeenCalledTimes(6);
                expect(spyDebugLogs).toHaveBeenNthCalledWith(
                    6,
                    'extractModificationIndirectKeysFromCampaign - detected more than one campaign with same id "bmjdprsjan0g01uq2crg"'
                );
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'fetchAllModifications - loadFromCache enabled');
                expect(visitorInstance.fetchedModifications).toMatchObject(responseObject.data.campaigns);
                expect(cacheResponse).toMatchObject({ algorithmVersion: 'new', psp: 'dalenys', testUnexistingKey: 'YOLOOOO' });
                done();
            } catch (error) {
                done.fail(error);
            }
        });
        it('should not activate two different campaign if two requested keys are in same campaign', (done) => {
            responseObject.data = demoData.decisionApi.normalResponse.manyModifInManyCampaigns;
            visitorInstance.fetchedModifications = responseObject.data.campaigns; // Mock a previous fetch

            const cacheResponse = visitorInstance.getModifications(demoData.flagshipVisitor.getModifications.args.default);
            try {
                expect(mockAxios.post).toHaveBeenCalledTimes(1);
                expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
                    vaid: 'blntcamqmdvg04g371hg',
                    cid: 'bn1ab7m56qolupi5sa0g',
                    caid: 'blntcamqmdvg04g371h0',
                    vid: 'test-perf'
                });
                expect(spyFetchModifs).toHaveBeenCalledWith({ activate: false, loadFromCache: true });
                expect(spyFetchModifs).toHaveBeenCalledTimes(1);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(3);
                expect(spyDebugLogs).toHaveBeenCalledTimes(5);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);

                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    1,
                    'Modification "psp" has further values because the modification is involved in campaigns with (id="blntcamqmdvg04g371f0,bmjdprsjan0g01uq2crg,bmjdprsjan0g01uq2ceg"). Modification value kept is psp="dalenys"'
                );
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    2,
                    'Modification "algorithmVersion" has further values because the modification is involved in campaigns with (id="blntcamqmdvg04g371f0,bmjdprsjan0g01uq2crg,bmjdprsjan0g01uq2ceg"). Modification value kept is algorithmVersion="new"'
                );
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    3,
                    'Unable to activate modification "testUnexistingKey" because it does not exist on any existing campaign...'
                );
                expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'fetchAllModifications - loadFromCache enabled');
                expect(visitorInstance.fetchedModifications).toMatchObject(responseObject.data.campaigns);
                expect(cacheResponse).toMatchObject({ algorithmVersion: 'new', psp: 'dalenys', testUnexistingKey: 'YOLOOOO' });
                done();
            } catch (error) {
                done.fail(error);
            }
        });
        it('should return empty object if nothing in cache', (done) => {
            const cacheResponse = visitorInstance.getModifications(demoData.flagshipVisitor.getModifications.args.noActivate);
            try {
                expect(mockAxios.post).toHaveBeenCalledTimes(0);
                expect(spyFetchModifs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(1);
                expect(spyWarnLogs).toHaveBeenNthCalledWith(1, 'No modifications found in cache...');
                expect(cacheResponse).toMatchObject({ algorithmVersion: 'NOOOOO', psp: 'YESESES', testUnexistingKey: 'YOLOOOO' });
                done();
            } catch (error) {
                done.fail(error);
            }
        });
        it('should return default values if nothing in cache (+ activate requested)', (done) => {
            const cacheResponse = visitorInstance.getModifications(demoData.flagshipVisitor.getModifications.args.default);
            try {
                expect(mockAxios.post).toHaveBeenCalledTimes(0);
                expect(spyFetchModifs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(4);
                expect(spyWarnLogs).toHaveBeenNthCalledWith(1, 'No modifications found in cache...');
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    2,
                    'Unable to activate modification "algorithmVersion" because it does not exist on any existing campaign...'
                );
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    3,
                    'Unable to activate modification "psp" because it does not exist on any existing campaign...'
                );
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    4,
                    'Unable to activate modification "testUnexistingKey" because it does not exist on any existing campaign...'
                );
                expect(cacheResponse).toMatchObject({ algorithmVersion: 'NOOOOO', psp: 'YESESES', testUnexistingKey: 'YOLOOOO' });
                done();
            } catch (error) {
                done.fail(error);
            }
        });
        it('should return empty object if cache not null but empty (+ undefined requested modifs) (+ full activate requested)', (done) => {
            visitorInstance.fetchedModifications = [];
            const cacheResponse = visitorInstance.getModifications(undefined, true);
            try {
                expect(spyFetchModifs).toHaveBeenCalledTimes(1);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);
                expect(spyErrorLogs).toHaveBeenCalledTimes(1);
                expect(spyErrorLogs).toHaveBeenNthCalledWith(
                    1,
                    'Requesting some specific modifications but the "modificationsRequested" argument is "undefined"...'
                );
                expect(cacheResponse).toMatchObject({});
                expect(mockAxios.post).toHaveBeenCalledTimes(0);
                done();
            } catch (error) {
                done.fail(error);
            }
        });
        it('should return empty object if no modificationsRequested specified', (done) => {
            visitorInstance.fetchedModifications = demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign.campaigns;
            const cacheResponse = visitorInstance.getModifications();
            try {
                expect(spyFetchModifs).toHaveBeenCalledTimes(1);
                expect(spyFetchModifs).toHaveBeenNthCalledWith(1, { activate: false, loadFromCache: true });
                expect(spyErrorLogs).toHaveBeenCalledTimes(1);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);
                expect(cacheResponse).toMatchObject({});
                expect(mockAxios.post).toHaveBeenCalledTimes(0);
                done();
            } catch (error) {
                done.fail(error);
            }
        });
    });

    describe('CheckContext function', () => {
        it('should not send warn logs if visitor context is clean', (done) => {
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
            spyWarnLogs = jest.spyOn(visitorInstance.log, 'warn');
            visitorInstance.on('ready', () => {
                try {
                    expect(spyWarnLogs).toBeCalledTimes(0);
                    flagshipSdkHelper.checkVisitorContext(demoData.visitor.cleanContext, visitorInstance.log);
                    expect(spyWarnLogs).toBeCalledTimes(0);
                    done();
                } catch (error) {
                    done.fail(error);
                }
            });
        });
        it('should send warn logs if visitor context has array<string | bool | number> attribute', (done) => {
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.contextWithGoodArrayAttributes);
            spyWarnLogs = jest.spyOn(visitorInstance.log, 'warn');
            visitorInstance.on('ready', () => {
                try {
                    expect(spyWarnLogs).toBeCalledTimes(0);
                    flagshipSdkHelper.checkVisitorContext(demoData.visitor.contextWithGoodArrayAttributes, visitorInstance.log);
                    expect(spyWarnLogs).toBeCalledTimes(1);
                    expect(spyWarnLogs).toHaveBeenCalledWith(
                        'Context key "badAttribute" is an array which is not supported. This key will be ignored...'
                    );
                    done();
                } catch (error) {
                    done.fail(error);
                }
            });
        });
        it('should send warn logs if visitor context has object attribute', (done) => {
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.contextWithObjectAttributes);
            spyWarnLogs = jest.spyOn(visitorInstance.log, 'warn');
            visitorInstance.on('ready', () => {
                try {
                    expect(visitorInstance.context).toEqual({ pos: 'es' });
                    flagshipSdkHelper.checkVisitorContext(demoData.visitor.contextWithObjectAttributes, visitorInstance.log);
                    expect(spyWarnLogs).toBeCalledTimes(1);
                    expect(spyWarnLogs).toHaveBeenCalledWith(
                        'Context key "badAttribute" is an object (json) which is not supported. This key will be ignored...'
                    );
                    done();
                } catch (error) {
                    done.fail(error);
                }
            });
        });
        it('should send warn logs if visitor context has array<object> attribute', (done) => {
            visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.contextWithBadArrayAttributes);
            spyWarnLogs = jest.spyOn(visitorInstance.log, 'warn');
            visitorInstance.on('ready', () => {
                try {
                    expect(visitorInstance.context).toEqual({ pos: 'es' });
                    flagshipSdkHelper.checkVisitorContext(demoData.visitor.contextWithBadArrayAttributes, visitorInstance.log);
                    expect(spyWarnLogs).toBeCalledTimes(1);
                    expect(spyWarnLogs).toHaveBeenCalledWith(
                        'Context key "badAttribute" is an array which is not supported. This key will be ignored...'
                    );
                    done();
                } catch (error) {
                    done.fail(error);
                }
            });
        });
    });
});
