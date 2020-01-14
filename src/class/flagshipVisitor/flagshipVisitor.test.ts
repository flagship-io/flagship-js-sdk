import mockAxios from 'jest-mock-axios';
import demoData from '../../../test/mock/demoData';
import testConfig from '../../config/test';
import flagshipSdk from '../../index';
import Flagship from '../flagship/flagship';
import FlagshipVisitor from './flagshipVisitor';
import flagshipSdkHelper from '../../lib/flagshipSdkHelper';


let sdk: Flagship;
let visitorInstance;
let spyActivateCampaign;
let spyGenerateCustomTypeParamsOf;
let responseObject;
let spyWarnLogs;
let spyErrorLogs;
let spyFatalLogs;
let spyInfoLogs;
const getModifsDefaultParam = [
  {
    key: 'algorithmVersion',
    defaultValue: 'NOOOOO',
    activate: true,
  },
  {
    key: 'psp',
    defaultValue: 'YESESES',
    activate: true,
  },
  {
    key: 'pspezrze',
    defaultValue: 'YOLOOOO',
    activate: true,
  },
];

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
        statusText: 'OK',
      };
      visitorInstance.activateCampaign('123456789', '987654321');
      mockAxios.mockResponse(responseObj);
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate',
        {
          vid: visitorInstance.id,
          cid: visitorInstance.envId,
          caid: '123456789',
          vaid: '987654321',
        });
    });
  });

  describe('SynchronizeModifications function', () => {
    it('should always init "fetchedModifications" attribute when decision API succeed', (done) => {
      const responseObj = {
        data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
        status: 200,
        statusText: 'OK',
      };
      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      expect(visitorInstance.fetchedModifications).toBe(null);
      visitorInstance.synchronizeModifications().then((response) => {
        try {
          expect(visitorInstance.fetchedModifications).toMatchObject(responseObj);
          expect(response).toBe(responseObj.status);
        } catch (error) {
          done.fail(error);
        }
        done();
      });
      mockAxios.mockResponse(responseObj);
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] });
    });
    it('should always call Decision API even if "fetchedModifications" already set before', (done) => {
      const responseObj = {
        data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
        status: 200,
        statusText: 'OK',
      };
      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      visitorInstance.fetchedModifications = { ...responseObj, data: { ...demoData.decisionApi.normalResponse.manyModifInManyCampaigns } }; // Mock a previous fetch
      visitorInstance.synchronizeModifications().then((response) => {
        try {
          expect(visitorInstance.fetchedModifications).toMatchObject(responseObj);
          expect(response).toBe(responseObj.status);
        } catch (error) {
          done.fail(error);
        }
        done();
      });
      mockAxios.mockResponse(responseObj);
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] });
    });
    it('should always init "fetchedModifications" to "null" if decision API failed', (done) => {
      const responseObj = {
        data: 'Oh no, error is coming !',
        status: '422',
        source: { pointer: '/data/attributes/envId' },
        title: 'Invalid Attribute',
        detail: 'Env id must contain at least three characters.',
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
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] });
    });
    it('should always init "fetchedModifications" attribute when decision API succeed (even with no modifs)', (done) => {
      const responseObj = {
        data: { ...demoData.decisionApi.normalResponse.noModif },
        status: 200,
        statusText: 'OK',
      };
      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      expect(visitorInstance.fetchedModifications).toBe(null);
      visitorInstance.synchronizeModifications().then((response) => {
        try {
          expect(visitorInstance.fetchedModifications).toMatchObject(responseObj);
          expect(response).toBe(responseObj.status);
        } catch (error) {
          done.fail(error);
        }
        done();
      });
      mockAxios.mockResponse(responseObj);
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] });
    });
    it('should always NOT init "fetchedModifications" attribute when decision API succeed and has a weird answer', (done) => {
      const responseObj = {
        data: { ...demoData.decisionApi.normalResponse.weirdAnswer },
        status: 200,
        statusText: 'OK',
      };
      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      const spyCheckFormat = jest.spyOn(flagshipSdkHelper, 'checkDecisionApiResponseFormat');
      spyWarnLogs = jest.spyOn(visitorInstance.log, 'warn');
      expect(visitorInstance.fetchedModifications).toBe(null);
      visitorInstance.synchronizeModifications().then((responseStatus) => {
        try {
          expect(visitorInstance.fetchedModifications).toBe(null);
          expect(spyCheckFormat).toHaveReturnedWith(null);
          expect(spyWarnLogs).toBeCalledWith('Unknow Decision Api response received');
          expect(responseStatus).toBe(200);
        } catch (error) {
          done.fail(error);
        }
        done();
      });
      mockAxios.mockResponse(responseObj);
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] });
    });
  });

  describe('FetchAllModifications function', () => {
    beforeEach(() => {
      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      spyActivateCampaign = jest.spyOn(visitorInstance, 'activateCampaign');
      spyFatalLogs = jest.spyOn(visitorInstance.log, 'fatal');
    });
    it('should return decision API response (mode=normal) when there is no optional argument set', () => {
      visitorInstance.fetchAllModifications();
      expect(mockAxios.post).toHaveBeenCalledWith(`https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] });
      expect(spyActivateCampaign).toHaveBeenCalledTimes(0);
    });
    it('should logs specifically when error and already fetched before and forced', (done) => {
      const responseObj = {
        data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
        status: 200,
        statusText: 'OK',
      };
      const errorObj = {
        data: 'Oh no, error is coming !',
        status: '422',
        source: { pointer: '/data/attributes/envId' },
        title: 'Invalid Attribute',
        detail: 'Env id must contain at least three characters.',
      };
      visitorInstance.fetchedModifications = responseObj;
      spyInfoLogs = jest.spyOn(visitorInstance.log, 'info');
      const spyThen = jest.fn();
      visitorInstance.fetchAllModifications({
        activate: false,
        campaignCustomID: 'bmjdprsjan0g01uq2ceg',
        force: true,
      }).then(spyThen).catch((errorResponse) => {
        try {
          expect(errorResponse).toEqual({ ...errorObj, fail: true });
          expect(spyFatalLogs).toHaveBeenCalledTimes(1);
          expect(spyFatalLogs).toHaveBeenNthCalledWith(1, 'No modification(s) found for campaignId="bmjdprsjan0g01uq2ceg"');
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
        statusText: 'OK',
      };
      visitorInstance.fetchAllModifications({
        campaignCustomID: 'bmjdprsjan0g01uq2ceg',
      }).then(({ data, status }) => {
        try {
          expect(data).toEqual({
            campaigns: [{
              id: 'bmjdprsjan0g01uq2ceg',
              variation: {
                id: 'bmjdprsjan0g01uq1ctg',
                modifications: {
                  type: 'JSON',
                  value: {
                    algorithmVersion: 'yolo2',
                    psp: 'yolo',
                    hello: 'world',
                  },
                },
              },
              variationGroupId: 'bmjdprsjan0g01uq2ceg',
            }],
            visitorId: demoData.visitor.id[0],
          });
          expect(status).toBe(200);
          expect(spyActivateCampaign).toHaveBeenCalledTimes(0);
          expect(visitorInstance.fetchedModifications).toMatchObject(responseObj);
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
        statusText: 'OK',
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
        statusText: 'OK',
      };
      visitorInstance.fetchAllModifications({ activate: true, campaignCustomID: 'bmjdprsjan0g01uq2ceg' }).then(({ data, status }) => {
        expect(status).toBe(200);
        expect(spyActivateCampaign).toHaveBeenCalledTimes(1);
        done();
      });
      mockAxios.mockResponse(responseObj);
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] });
    });
    it('should set activate param to "true" if set and no specific campaign requested', (done) => {
      const responseObj = {
        data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
        status: 200,
        statusText: 'OK',
      };
      visitorInstance.fetchAllModifications({ activate: true }).then(({ data, status }) => {
        expect(status).toBe(200);
        expect(spyActivateCampaign).toHaveBeenCalledTimes(0);
        done();
      });
      mockAxios.mockResponse(responseObj);
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: true, visitor_id: demoData.visitor.id[0] });
    });
    it('should not call decision API if already fetched before', (done) => {
      const responseObj = {
        data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
        status: 200,
        statusText: 'OK',
      };
      spyInfoLogs = jest.spyOn(visitorInstance.log, 'info');
      visitorInstance.fetchedModifications = responseObj; // Mock a already fetch
      visitorInstance.fetchAllModifications().then(({ data, status }) => {
        try {
          expect(status).toBe(200);
          expect(data).toMatchObject(visitorInstance.fetchedModifications.data);
          expect(spyInfoLogs).toBeCalledWith('fetchAllModifications: no calls to the Decision API because it has already been fetched before');
          expect(spyActivateCampaign).toHaveBeenCalledTimes(0);
        } catch (error) {
          done.fail(error);
        }
        done();
      });
      expect(mockAxios.post).not.toHaveBeenCalled();
    });
    it('should call decision API if already fetched before and need to activate (fetchMode=Normal)', (done) => {
      const responseObj = {
        data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
        status: 200,
        statusText: 'OK',
      };
      spyInfoLogs = jest.spyOn(visitorInstance.log, 'info');
      visitorInstance.fetchedModifications = responseObj; // Mock a already fetch
      visitorInstance.fetchAllModifications({ activate: true }).then(({ data, status }) => {
        try {
          expect(status).toBe(200);
          expect(data).toMatchObject(visitorInstance.fetchedModifications.data);
          expect(spyInfoLogs).not.toHaveBeenCalledWith('fetchAllModifications: no calls to the Decision API because it has already been fetched before');
          expect(spyActivateCampaign).toHaveBeenCalledTimes(0);
        } catch (error) {
          done.fail(error);
        }
        done();
      });
      mockAxios.mockResponse(responseObj);
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: true, visitor_id: demoData.visitor.id[0] });
    });
  });

  describe('SetContext funcion', () => {
    it('should update current visitor context', () => {
      const newContext = {
        pos: 'fl',
        alt: 'nh',
        rot: 'deg',
      };

      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      expect(visitorInstance.context).toMatchObject(demoData.visitor.cleanContext);
      visitorInstance.setContext(newContext);
      expect(visitorInstance.context).toMatchObject(newContext);
    });
  });

  describe('GetModifications function', () => {
    beforeEach(() => {
      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      spyFatalLogs = jest.spyOn(visitorInstance.log, 'fatal');
    });
    it('should return empty object if decision API had an error', (done) => {
      const thenGetModification = jest.fn();
      const spyFetchAllModifications = jest.spyOn(visitorInstance, 'fetchAllModifications');
      const responseObj = {
        data: 'Oh no, error is coming !',
        status: '422',
        source: { pointer: '/data/attributes/envId' },
        title: 'Invalid Attribute',
        detail: 'Env id must contain at least three characters.',
      };
      const spyGetModifs = jest.spyOn(visitorInstance, 'getModifications');
      const spyModifsDetails = jest.spyOn(visitorInstance, 'extractDesiredModifications');
      const spyTriggerActivateIfNeeded = jest.spyOn(visitorInstance, 'triggerActivateIfNeeded');

      visitorInstance.getModifications(getModifsDefaultParam).then(() => thenGetModification).catch((errorResponse) => {
        try {
          expect(errorResponse).toMatchObject(responseObj);
          expect(visitorInstance.fetchedModifications).toBe(null);
          expect(spyFatalLogs).toHaveBeenNthCalledWith(1, 'fetchAllModifications: an error occurred while fetching...');
          expect(spyFatalLogs).toHaveBeenNthCalledWith(2, `Get modifications failed with error:\n${responseObj.status}`);
          expect(spyFetchAllModifications).toHaveBeenCalledWith({ activate: false });
        } catch (error) {
          done.fail(error);
        }
        done();
      });
      expect(mockAxios.post).toHaveBeenCalledWith(`https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] });
      mockAxios.mockError(responseObj);

      expect(thenGetModification).not.toHaveBeenCalled(); // NOTE: catch should not be triggered because getModifications does not throw an error
      expect(spyGetModifs).toHaveBeenCalled();
      expect(spyTriggerActivateIfNeeded).toHaveBeenCalledTimes(0);
      expect(spyModifsDetails).toHaveReturnedTimes(0);
    });

    it('should return empty object if decision API did not find any modifications', (done) => {
      const catchGetModification = jest.fn();
      const thenGetModification = jest.fn();
      const responseObj = {
        data: [],
        status: 200,
        statusText: 'OK',
      };

      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);

      const spyGetModifs = jest.spyOn(visitorInstance, 'getModifications');
      const spyModifsDetails = jest.spyOn(visitorInstance, 'extractDesiredModifications');
      const spyTriggerActivateIfNeeded = jest.spyOn(visitorInstance, 'triggerActivateIfNeeded');

      visitorInstance.getModifications(getModifsDefaultParam).then((response) => {
        try {
          expect(response).toEqual({});
        } catch (error) {
          done.fail(error);
        }
        done();
      }).catch(catchGetModification);
      expect(mockAxios.post).toHaveBeenCalledWith(`https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] });
      mockAxios.mockResponse(responseObj);

      expect(catchGetModification).not.toHaveBeenCalled();
      expect(spyGetModifs).toHaveBeenCalled();
      expect(spyTriggerActivateIfNeeded).toHaveBeenCalledTimes(0);
      expect(spyModifsDetails).toHaveReturnedTimes(0);
    });

    it('should return a bundle of modifications with correct params (oneModifInMoreThanOneCampaign)', (done) => {
      const catchGetModification = jest.fn();
      const responseObj = {
        data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
        status: 200,
        statusText: 'OK',
      };

      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);

      const spyGetModifs = jest.spyOn(visitorInstance, 'getModifications');
      const spyModifsDetails = jest.spyOn(visitorInstance, 'extractDesiredModifications');
      const spyTriggerActivateIfNeeded = jest.spyOn(visitorInstance, 'triggerActivateIfNeeded');

      visitorInstance.getModifications(getModifsDefaultParam).then(
        (response) => {
          try {
            expect(response).toEqual({ algorithmVersion: 'new', psp: 'dalenys', pspezrze: 'YOLOOOO' });
            expect(spyGetModifs).toHaveBeenCalled();
            expect(spyTriggerActivateIfNeeded).toHaveBeenCalledTimes(1);
            expect(spyModifsDetails).toHaveReturnedWith(
              expect.objectContaining({ detailsModifications: demoData.flagshipVisitor.getModifications.detailsModifications.oneModifInMoreThanOneCampaign }),
            );
            expect(visitorInstance.fetchedModifications).toMatchObject(responseObj);
          } catch (error) {
            done.fail(error);
          }
          done();
        },
      ).catch(catchGetModification);
      expect(mockAxios.post).toHaveBeenCalledWith(`https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] });
      mockAxios.mockResponse(responseObj);

      expect(catchGetModification).not.toHaveBeenCalled();
    });

    it('should return a bundle of modifications with correct params (manyModifInManyCampaigns)', (done) => {
      const catchGetModification = jest.fn();
      const thenGetModification = jest.fn();
      const responseObj = {
        data: { ...demoData.decisionApi.normalResponse.manyModifInManyCampaigns },
        status: 200,
        statusText: 'OK',
      };

      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);

      const spyGetModifs = jest.spyOn(visitorInstance, 'getModifications');
      const spyModifsDetails = jest.spyOn(visitorInstance, 'extractDesiredModifications');
      const spyTriggerActivateIfNeeded = jest.spyOn(visitorInstance, 'triggerActivateIfNeeded');

      visitorInstance.getModifications(getModifsDefaultParam).then(
        (response) => {
          try {
            expect(response).toEqual({ algorithmVersion: 'new', psp: 'dalenys', pspezrze: 'YOLOOOO' });
            expect(spyGetModifs).toHaveBeenCalled();
            expect(spyTriggerActivateIfNeeded).toHaveBeenCalledTimes(1);
            expect(spyModifsDetails).toHaveReturnedWith(
              expect.objectContaining({ detailsModifications: demoData.flagshipVisitor.getModifications.detailsModifications.manyModifInManyCampaigns }),
            );
          } catch (error) {
            done.fail(error);
          }
          done();
        },
      ).catch(catchGetModification);
      expect(mockAxios.post).toHaveBeenCalledWith(`https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] });
      mockAxios.mockResponse(responseObj);

      expect(catchGetModification).not.toHaveBeenCalled();
    });
  });

  describe('TriggerActivateIfNeeded function', () => {
    it('should not trigger twice activate for a modification which is in more than one campaign (1st use case)', () => {
      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      visitorInstance.triggerActivateIfNeeded(demoData.flagshipVisitor.getModifications.detailsModifications.oneModifInMoreThanOneCampaign);
      expect(mockAxios.post).toHaveBeenCalledTimes(2);

      expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
        caid: 'blntcamqmdvg04g371hg',
        cid: demoData.envId[0],
        vaid: 'blntcamqmdvg04g371h0',
        vid: demoData.visitor.id[0],
      });
      expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
        caid: 'bmjdprsjan0g01uq2ctg',
        cid: demoData.envId[0],
        vaid: 'bmjdprsjan0g01uq2csg',
        vid: demoData.visitor.id[0],
      });
    });

    it('should not trigger twice activate for a modification which is in more than one campaign (2nd use case)', () => {
      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      visitorInstance.triggerActivateIfNeeded(demoData.flagshipVisitor.getModifications.detailsModifications.manyModifInManyCampaigns);
      expect(mockAxios.post).toHaveBeenCalledTimes(1);

      expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
        caid: 'blntcamqmdvg04g371hg',
        cid: demoData.envId[0],
        vaid: 'blntcamqmdvg04g371h0',
        vid: demoData.visitor.id[0],
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
        statusText: 'OK',
      };
      const spyFetchAll = jest.spyOn(visitorInstance, 'fetchAllModifications');
      const campaignId = 'blntcamqmdvg04g371f0';
      visitorInstance.getModificationsForCampaign(campaignId)
        .then((response) => {
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
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] });
    });
    it('should return empty array if no match', (done) => {
      const responseObj = {
        data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
        status: 200,
        statusText: 'OK',
      };
      const spyFetchAll = jest.spyOn(visitorInstance, 'fetchAllModifications');
      const campaignId = '123456';
      visitorInstance.getModificationsForCampaign(campaignId)
        .then((response) => {
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
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] });
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
        statusText: 'OK',
      };
      const spyFetchAll = jest.spyOn(visitorInstance, 'fetchAllModifications');
      visitorInstance.getAllModifications()
        .then((response) => {
          try {
            expect(response).toMatchObject(responseObj);
            expect(spyFetchAll).toHaveBeenCalled();
          } catch (error) {
            done.fail(error);
          }
          done();
        });
      mockAxios.mockResponse(responseObj);
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] });
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
        statusText: 'OK',
      };
    });
    it('should send hit of type "transaction" + "item" + "event" + "page" + "screen" if there are in the array argument', (done) => {
      visitorInstance.sendHits(
        [
          demoData.hit.event,
          demoData.hit.item,
          demoData.hit.screen,
          demoData.hit.transaction,
        ],
      ).then((response) => {
        try {
          expect(response).not.toBeDefined();
        } catch (error) {
          done.fail(error);
        }
        done();
      });
      mockAxios.mockResponse(responseObject);
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://ariane.abtasty.com',
        {
          cid: 'bn1ab7m56qolupi5sa0g',
          vid: 'test-perf',
          ds: 'APP',
          ea: 'signOff',
          dl: 'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
          ec: 'User Engagement',
          el: 'yolo label ;)',
          ev: 123,
          pt: 'YoloTitle',
          t: 'EVENT',
        });
      expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://ariane.abtasty.com',
        {
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
          vid: 'test-perf',
        });
      expect(mockAxios.post).toHaveBeenNthCalledWith(3, 'https://ariane.abtasty.com',
        {
          cid: 'bn1ab7m56qolupi5sa0g',
          dl: 'http%3A%2F%2Fabtastylab.com%2F60511af14f5e48764b83d36ddb8ece5a%2F',
          ds: 'APP',
          t: 'SCREENVIEW',
          vid: 'test-perf',
          pt: 'YoloScreen',
        });
      expect(mockAxios.post).toHaveBeenNthCalledWith(4, 'https://ariane.abtasty.com',
        {
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
          tt: 1234444,
        });
      expect(mockAxios.post).toHaveBeenCalledTimes(4);
      expect(spyInfoLogs).toBeCalledWith('sendHits: success');
      expect(spyWarnLogs).toBeCalledTimes(0);
      expect(spyErrorLogs).toBeCalledTimes(0);
      expect(spyFatalLogs).toBeCalledTimes(0);
    });
    it('should logs error when hit "event" not set correctly', (done) => {
      const brokenEvent1 = { ...demoData.hit.event, data: { ...demoData.hit.event.data, action: null } };
      const brokenEvent2 = { ...demoData.hit.event, data: { ...demoData.hit.event.data, category: null } };
      visitorInstance.sendHits(
        [
          brokenEvent1,
          brokenEvent2,
        ],
      ).then((response) => {
        try {
          expect(response).not.toBeDefined();
        } catch (error) {
          done.fail(error);
        }
        done();
      });
      expect(mockAxios.post).toBeCalledTimes(0);
      expect(spyInfoLogs).toBeCalledWith('sendHits: success');
      expect(spyWarnLogs).toBeCalledTimes(0);
      expect(spyErrorLogs).toHaveBeenNthCalledWith(2, 'sendHits(Event): failed because attribute "category" is missing...');
      expect(spyErrorLogs).toHaveBeenNthCalledWith(1, 'sendHits(Event): failed because attribute "action" is missing...');
      expect(spyErrorLogs).toBeCalledTimes(2);
      expect(spyFatalLogs).toBeCalledTimes(0);
    });
    it('should logs error when hit "screen" not set correctly', (done) => {
      const brokenHit1 = { ...demoData.hit.screen, data: { ...demoData.hit.screen.data, pageTitle: null } };
      const brokenHit2 = { ...demoData.hit.screen, data: { ...demoData.hit.screen.data, documentLocation: null } };
      visitorInstance.sendHits(
        [
          brokenHit1,
          brokenHit2,
        ],
      ).then((response) => {
        try {
          expect(response).not.toBeDefined();
        } catch (error) {
          done.fail(error);
        }
        done();
      });
      expect(mockAxios.post).toBeCalledTimes(0);
      expect(spyInfoLogs).toBeCalledWith('sendHits: success');
      expect(spyWarnLogs).toBeCalledTimes(0);
      expect(spyErrorLogs).toHaveBeenNthCalledWith(1, 'sendHits(Screen): failed because attribute "pageTitle" is missing...');
      expect(spyErrorLogs).toHaveBeenNthCalledWith(2, 'sendHits(Screen): failed because attribute "documentLocation" is missing...');
      expect(spyErrorLogs).toBeCalledTimes(2);
      expect(spyFatalLogs).toBeCalledTimes(0);
    });
    it('should logs error when hit "item" not set correctly', (done) => {
      visitorInstance.sendHits(
        [
          { ...demoData.hit.item, data: { ...demoData.hit.item.data, transactionId: null } },
          { ...demoData.hit.item, data: { ...demoData.hit.item.data, name: null } },
        ],
      ).then((response) => {
        try {
          expect(response).not.toBeDefined();
        } catch (error) {
          done.fail(error);
        }
        done();
      });
      expect(mockAxios.post).toBeCalledTimes(0);
      expect(spyInfoLogs).toBeCalledWith('sendHits: success');
      expect(spyWarnLogs).toBeCalledTimes(0);
      expect(spyErrorLogs).toHaveBeenNthCalledWith(1, 'sendHits(Item): failed because attribute "transactionId" is missing...');
      expect(spyErrorLogs).toHaveBeenNthCalledWith(2, 'sendHits(Item): failed because attribute "name" is missing...');
      expect(spyErrorLogs).toBeCalledTimes(2);
      expect(spyFatalLogs).toBeCalledTimes(0);
    });
    it('should logs error when hit "transaction" not set correctly', (done) => {
      visitorInstance.sendHits(
        [
          { ...demoData.hit.transaction, data: { ...demoData.hit.transaction.data, transactionId: null } },
          { ...demoData.hit.transaction, data: { ...demoData.hit.transaction.data, affiliation: null } },
        ],
      ).then((response) => {
        try {
          expect(response).not.toBeDefined();
        } catch (error) {
          done.fail(error);
        }
        done();
      });
      expect(mockAxios.post).toBeCalledTimes(0);
      expect(spyInfoLogs).toBeCalledWith('sendHits: success');
      expect(spyWarnLogs).toBeCalledTimes(0);
      expect(spyErrorLogs).toHaveBeenNthCalledWith(1, 'sendHits(Transaction): failed because attribute "transactionId" is missing...');
      expect(spyErrorLogs).toHaveBeenNthCalledWith(2, 'sendHits(Transaction): failed because attribute "affiliation" is missing...');
      expect(spyErrorLogs).toBeCalledTimes(2);
      expect(spyFatalLogs).toBeCalledTimes(0);
    });
  });

  // let spyFetchModifs;
  // describe('GetModificationsCache function', () => {
  //   beforeEach(() => {
  //     visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
  //     spyGenerateCustomTypeParamsOf = jest.spyOn(visitorInstance, 'generateCustomTypeParamsOf');
  //     spyWarnLogs = jest.spyOn(visitorInstance.log, 'warn');
  //     spyErrorLogs = jest.spyOn(visitorInstance.log, 'error');
  //     spyFatalLogs = jest.spyOn(visitorInstance.log, 'fatal');
  //     spyInfoLogs = jest.spyOn(visitorInstance.log, 'info');
  //     spyFetchModifs = jest.spyOn(visitorInstance, 'fetchAllModifications');
  //     responseObject = {
  //       data: null,
  //       status: 200,
  //       statusText: 'OK',
  //     };
  //   });
  //   it('should not use promise when fetching modifications', (done) => {
  //     responseObject = {
  //       ...responseObject,
  //       data: { ...demoData.decisionApi.normalResponse.manyModifInManyCampaigns },
  //     };
  //     visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
  //     visitorInstance.fetchedModifications = { ...responseObject }; // Mock a previous fetch
  //     const cacheResponse = visitorInstance.getModificationsCache();
  //     try {
  //       expect(spyFetchModifs).toHaveBeenCalledWith([{ tt: 34 }, 2]);
  //       expect(visitorInstance.fetchedModifications).toMatchObject(responseObject.data);
  //       expect(cacheResponse.status).toBe(responseObject.status);
  //       done();
  //     } catch (error) {
  //       done.fail(error);
  //     }
  //   });
  //   // TODO:
  //   it('should return null if nothing in cache', (done) => { expect(1).toBe(1); });
  // });

  describe('CheckContext function', () => {
    it('should not send warn logs if visitor context is clean', (done) => {
      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      spyWarnLogs = jest.spyOn(visitorInstance.log, 'warn');
      visitorInstance.on('ready', () => {
        try {
          expect(spyWarnLogs).toBeCalledTimes(0);
          visitorInstance.checkContext(demoData.visitor.cleanContext);
          expect(spyWarnLogs).toBeCalledTimes(0);
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });
    it('should not send warn logs if visitor context has array<string | bool | number> attribute', (done) => {
      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.contextWithGoodArrayAttributes);
      spyWarnLogs = jest.spyOn(visitorInstance.log, 'warn');
      visitorInstance.on('ready', () => {
        try {
          expect(spyWarnLogs).toBeCalledTimes(0);
          visitorInstance.checkContext(demoData.visitor.contextWithGoodArrayAttributes);
          expect(spyWarnLogs).toBeCalledTimes(0);
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
          visitorInstance.checkContext(demoData.visitor.contextWithObjectAttributes);
          expect(spyWarnLogs).toBeCalledTimes(1);
          expect(spyWarnLogs).toHaveBeenCalledWith('Context key "badAttribute" is type of "object" which is not supported. This key will be ignored...');
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
          visitorInstance.checkContext(demoData.visitor.contextWithBadArrayAttributes);
          expect(spyWarnLogs).toBeCalledTimes(1);
          expect(spyWarnLogs).toHaveBeenCalledWith('Context key "badAttribute" is type of "Array<object>" which is not supported. This key will be ignored...');
          done();
        } catch (error) {
          done.fail(error);
        }
      });
    });
  });
});
