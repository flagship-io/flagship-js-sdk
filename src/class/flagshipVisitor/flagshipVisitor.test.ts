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
let spyDebugLogs;

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
          expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data);
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
      visitorInstance.fetchedModifications = { ...demoData.decisionApi.normalResponse.manyModifInManyCampaigns }; // Mock a previous fetch
      visitorInstance.synchronizeModifications().then((response) => {
        try {
          expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data);
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
          expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data);
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
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: false, visitor_id: demoData.visitor.id[0] });
    });
  });

  describe('FetchAllModifications function', () => {
    beforeEach(() => {
      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      spyActivateCampaign = jest.spyOn(visitorInstance, 'activateCampaign');
      spyFatalLogs = jest.spyOn(visitorInstance.log, 'fatal');
      spyWarnLogs = jest.spyOn(visitorInstance.log, 'warn');
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
      visitorInstance.fetchedModifications = responseObj.data;
      spyInfoLogs = jest.spyOn(visitorInstance.log, 'info');
      const spyThen = jest.fn();
      visitorInstance.fetchAllModifications({
        activate: false,
        campaignCustomID: 'bmjdprsjan0g01uq2ceg',
        force: true,
      }).then(spyThen).catch((errorResponse) => {
        try {
          expect(errorResponse).toEqual(errorObj);
          expect(spyWarnLogs).toHaveBeenCalledTimes(0);
          expect(spyFatalLogs).toHaveBeenCalledTimes(1);
          expect(spyFatalLogs).toHaveBeenNthCalledWith(1, 'fetchAllModifications: an error occurred while fetching...');
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
          expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data);
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
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: true, visitor_id: demoData.visitor.id[0] });
    });
    it('should get all modifications and then activate individually each campaign if activate=true', (done) => {
      const responseObj = {
        data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
        status: 200,
        statusText: 'OK',
      };
      visitorInstance.fetchAllModifications({ activate: true }).then(({ data, status }) => {
        expect(status).toBe(200);
        expect(spyActivateCampaign).toHaveBeenCalledTimes(3);
        expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
          caid: 'blntcamqmdvg04g371hg', cid: 'bn1ab7m56qolupi5sa0g', vaid: 'blntcamqmdvg04g371h0', vid: 'test-perf',
        });
        expect(mockAxios.post).toHaveBeenNthCalledWith(3, 'https://decision-api.flagship.io/v1/activate', {
          caid: 'bmjdprsjan0g01uq2ctg', cid: 'bn1ab7m56qolupi5sa0g', vaid: 'bmjdprsjan0g01uq2csg', vid: 'test-perf',
        });
        expect(mockAxios.post).toHaveBeenNthCalledWith(4, 'https://decision-api.flagship.io/v1/activate', {
          caid: 'bmjdprsjan0g01uq1ctg', cid: 'bn1ab7m56qolupi5sa0g', vaid: 'bmjdprsjan0g01uq2ceg', vid: 'test-perf',
        });
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
      visitorInstance.fetchedModifications = responseObj.data; // Mock a already fetch
      visitorInstance.fetchAllModifications().then(({ data }) => {
        try {
          expect(data).toMatchObject(visitorInstance.fetchedModifications);
          expect(spyInfoLogs).toBeCalledWith('fetchAllModifications: no calls to the Decision API because it has already been fetched before');
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
        statusText: 'OK',
      };
      spyInfoLogs = jest.spyOn(visitorInstance.log, 'info');
      visitorInstance.fetchedModifications = responseObj.data; // Mock a already fetch
      visitorInstance.fetchAllModifications({ activate: true }).then(({ data }) => {
        try {
          expect(data).toMatchObject(visitorInstance.fetchedModifications);
          expect(spyInfoLogs).toHaveBeenCalledWith('fetchAllModifications: no calls to the Decision API because it has already been fetched before');
          expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
            caid: 'blntcamqmdvg04g371hg', cid: 'bn1ab7m56qolupi5sa0g', vaid: 'blntcamqmdvg04g371h0', vid: 'test-perf',
          });
          expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
            caid: 'bmjdprsjan0g01uq2ctg', cid: 'bn1ab7m56qolupi5sa0g', vaid: 'bmjdprsjan0g01uq2csg', vid: 'test-perf',
          });
          expect(mockAxios.post).toHaveBeenNthCalledWith(3, 'https://decision-api.flagship.io/v1/activate', {
            caid: 'bmjdprsjan0g01uq1ctg', cid: 'bn1ab7m56qolupi5sa0g', vaid: 'bmjdprsjan0g01uq2ceg', vid: 'test-perf',
          });
        } catch (error) {
          done.fail(error);
        }
        done();
      });
      mockAxios.mockResponse(responseObj);
      expect(mockAxios.post).not.toHaveBeenCalledWith(`https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`);
    });
  });

  describe('updateContext funcion', () => {
    it('should update current visitor context', () => {
      const newContext = {
        pos: 'fl',
        alt: 'nh',
        rot: 'deg',
      };

      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      expect(visitorInstance.context).toMatchObject(demoData.visitor.cleanContext);
      visitorInstance.updateContext(newContext);
      expect(visitorInstance.context).toMatchObject(newContext);
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
        statusText: 'OK',
      };
    });
    it('should warn if requested key does not match any campaign', (done) => {
      visitorInstance.fetchedModifications = responseObject.data; // Mock a previous fetch
      visitorInstance.activateModifications([...demoData.flagshipVisitor.activateModifications.args.basic, { key: 'xoxo' }]);
      try {
        expect(mockAxios.post).toHaveBeenCalledTimes(2);
        expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
          caid: '5e26ccd8445a622037b1bc3b', cid: 'bn1ab7m56qolupi5sa0g', vaid: '5e26ccd8cc00f72d5f3cb177', vid: 'test-perf',
        });
        expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
          caid: '5e26ccd828feadeb6d9b8414', cid: 'bn1ab7m56qolupi5sa0g', vaid: '5e26ccd8d4106bb1ae2b6455', vid: 'test-perf',
        });
        expect(spyExtractDesiredModifications).toHaveBeenCalledWith(responseObject.data, [
          { activate: true, defaultValue: '', key: 'toto' },
          { activate: true, defaultValue: '', key: 'tata' },
          { activate: true, defaultValue: '', key: 'xoxo' },
        ]);
        // expect(spyTriggerActivateIfNeeded).toHaveBeenCalledWith(""); // DEBUG ONLY
        expect(spyWarnLogs).toHaveBeenCalledTimes(1);
        expect(spyWarnLogs).toHaveBeenNthCalledWith(1, 'Unable to activate modification "xoxo" because it does not exist on any existing campaign...');
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
      visitorInstance.fetchedModifications = demoData.flagshipVisitor.activateModifications.fetchedModifications.oneKeyConflict; // Mock a previous fetch
      visitorInstance.activateModifications(demoData.flagshipVisitor.activateModifications.args.basic);
      try {
        expect(mockAxios.post).toHaveBeenCalledTimes(2);
        expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
          caid: '5e26ccd828feadeb6d9b8414', cid: 'bn1ab7m56qolupi5sa0g', vaid: '5e26ccd8d4106bb1ae2b6455', vid: 'test-perf',
        });
        expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
          caid: '5e26ccd89609296ae8430037', cid: 'bn1ab7m56qolupi5sa0g', vaid: '5e26ccd8fcde4be7ffe5476f', vid: 'test-perf',
        });
        expect(spyExtractDesiredModifications).toHaveBeenCalledWith(demoData.flagshipVisitor.activateModifications.fetchedModifications.oneKeyConflict, [
          { activate: true, defaultValue: '', key: 'toto' },
          { activate: true, defaultValue: '', key: 'tata' },
        ]);
        // expect(spyTriggerActivateIfNeeded).toHaveBeenCalledWith(""); // DEBUG ONLY
        expect(spyWarnLogs).toHaveBeenCalledTimes(1);
        expect(spyWarnLogs).toHaveBeenNthCalledWith(1, 'Key "toto" has been activated 2 times because it was in conflict in further campaigns (debug logs for more details)');
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyDebugLogs).toHaveBeenCalledTimes(2);
        expect(spyDebugLogs).toHaveBeenNthCalledWith(2, 'Here the details:,\n- because key "toto" is also include inside campaign id="5e26ccd803533a89c3acda5c" where key(s) "tata " is/are also requested.');
        done();
      } catch (error) {
        done.fail(error);
      }
    });
    it('should not activate all campaigns matching requesting key when there is a campaign conflict', (done) => {
      visitorInstance.fetchedModifications = demoData.flagshipVisitor.activateModifications.fetchedModifications.oneKeyConflict; // Mock a previous fetch
      visitorInstance.activateModifications([{ key: 'toto' }]);
      try {
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
          caid: '5e26ccd828feadeb6d9b8414', cid: 'bn1ab7m56qolupi5sa0g', vaid: '5e26ccd8d4106bb1ae2b6455', vid: 'test-perf',
        });
        expect(spyExtractDesiredModifications).toHaveBeenCalledWith(demoData.flagshipVisitor.activateModifications.fetchedModifications.oneKeyConflict, [
          { activate: true, defaultValue: '', key: 'toto' },
        ]);
        // expect(spyTriggerActivateIfNeeded).toHaveBeenCalledWith(""); // DEBUG ONLY
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);
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
      visitorInstance.fetchedModifications = demoData.flagshipVisitor.activateModifications.fetchedModifications.multipleKeyConflict; // Mock a previous fetch
      visitorInstance.activateModifications(demoData.flagshipVisitor.activateModifications.args.all);
      try {
        expect(mockAxios.post).toHaveBeenCalledTimes(3);
        expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
          caid: '5e26ccd8445a622037b1bc3b', cid: 'bn1ab7m56qolupi5sa0g', vaid: '5e26ccd8cc00f72d5f3cb177', vid: 'test-perf',
        });
        expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
          caid: '5e26ccd828feadeb6d9b8414', cid: 'bn1ab7m56qolupi5sa0g', vaid: '5e26ccd8d4106bb1ae2b6455', vid: 'test-perf',
        });
        expect(mockAxios.post).toHaveBeenNthCalledWith(3, 'https://decision-api.flagship.io/v1/activate', {
          caid: '5e26ccd89609296ae8430037', cid: 'bn1ab7m56qolupi5sa0g', vaid: '5e26ccd8fcde4be7ffe5476f', vid: 'test-perf',
        });
        expect(spyExtractDesiredModifications).toHaveBeenCalledWith(demoData.flagshipVisitor.activateModifications.fetchedModifications.multipleKeyConflict, [
          { activate: true, defaultValue: '', key: 'toto' },
          { activate: true, defaultValue: '', key: 'tata' },
          { activate: true, defaultValue: '', key: 'titi' },
        ]);
        // expect(spyTriggerActivateIfNeeded).toHaveBeenCalledWith(""); // DEBUG ONLY
        expect(spyWarnLogs).toHaveBeenCalledTimes(2);
        expect(spyWarnLogs).toHaveBeenNthCalledWith(1, 'Key "toto" has been activated 2 times because it was in conflict in further campaigns (debug logs for more details)');
        expect(spyWarnLogs).toHaveBeenNthCalledWith(2, 'Key "titi" has been activated 2 times because it was in conflict in further campaigns (debug logs for more details)');
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyDebugLogs).toHaveBeenCalledTimes(3);
        expect(spyDebugLogs).toHaveBeenNthCalledWith(2, 'Here the details:,,\n- because key "toto" is also include inside campaign id="5e26ccd803533a89c3acda5c" where key(s) "tata " is/are also requested.');
        expect(spyDebugLogs).toHaveBeenNthCalledWith(3, 'Here the details:,,\n- because key "titi" is also include inside campaign id="5e26ccd803533a89c3acda5c" where key(s) "tata " is/are also requested.');
        done();
      } catch (error) {
        done.fail(error);
      }
    });
    it('should correctly handle conflicts due to further other requested keys', () => {
      visitorInstance.fetchedModifications = demoData.flagshipVisitor.activateModifications.fetchedModifications.multipleKeyConflict; // Mock a previous fetch
      visitorInstance.activateModifications(demoData.flagshipVisitor.activateModifications.args.over9000);
      expect(mockAxios.post).toHaveBeenCalledTimes(4);
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
        caid: '5e26ccd8445a622037b1bc3b', cid: 'bn1ab7m56qolupi5sa0g', vaid: '5e26ccd8cc00f72d5f3cb177', vid: 'test-perf',
      });
      expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
        caid: '5e26ccd828feadeb6d9b8414', cid: 'bn1ab7m56qolupi5sa0g', vaid: '5e26ccd8d4106bb1ae2b6455', vid: 'test-perf',
      });
      expect(mockAxios.post).toHaveBeenNthCalledWith(3, 'https://decision-api.flagship.io/v1/activate', {
        caid: '5e26ccd89609296ae8430037', cid: 'bn1ab7m56qolupi5sa0g', vaid: '5e26ccd8fcde4be7ffe5476f', vid: 'test-perf',
      });
      expect(mockAxios.post).toHaveBeenNthCalledWith(4, 'https://decision-api.flagship.io/v1/activate', {
        caid: '5e26ccd89609296ae8430137', cid: 'bn1ab7m56qolupi5sa0g', vaid: '5e26ccd8fcde4be7ff55476f', vid: 'test-perf',
      });
      expect(spyExtractDesiredModifications).toHaveBeenCalledWith(demoData.flagshipVisitor.activateModifications.fetchedModifications.multipleKeyConflict, [
        { activate: true, defaultValue: '', key: 'toto' },
        { activate: true, defaultValue: '', key: 'tata' },
        { activate: true, defaultValue: '', key: 'titi' },
        { activate: true, defaultValue: '', key: 'tyty' },
      ]);
      // expect(spyTriggerActivateIfNeeded).toHaveBeenCalledWith(""); // DEBUG ONLY
      expect(spyWarnLogs).toHaveBeenCalledTimes(3);
      expect(spyWarnLogs).toHaveBeenNthCalledWith(1, 'Key "toto" has been activated 3 times because it was in conflict in further campaigns (debug logs for more details)');
      expect(spyWarnLogs).toHaveBeenNthCalledWith(2, 'Key "titi" has been activated 2 times because it was in conflict in further campaigns (debug logs for more details)');
      expect(spyWarnLogs).toHaveBeenNthCalledWith(3, 'Key "tata" has been activated 2 times because it was in conflict in further campaigns (debug logs for more details)');
      expect(spyErrorLogs).toHaveBeenCalledTimes(0);
      expect(spyFatalLogs).toHaveBeenCalledTimes(0);
      expect(spyInfoLogs).toHaveBeenCalledTimes(0);
      expect(spyDebugLogs).toHaveBeenCalledTimes(4);
      expect(spyDebugLogs).toHaveBeenNthCalledWith(2, expect.stringContaining('because key "toto" is also include inside campaign id="5e26ccd803533a89c3acda5c" where key(s) "tata " is/are also requested.'));
      expect(spyDebugLogs).toHaveBeenNthCalledWith(2, expect.stringContaining('because key "toto" is also include inside campaign id="5e26ccd803533a89c3acbbbb" where key(s) "tyty " is/are also requested'));
      expect(spyDebugLogs).toHaveBeenNthCalledWith(3, expect.stringContaining('because key "titi" is also include inside campaign id="5e26ccd803533a89c3acda5c" where key(s) "tata " is/are also requested'));
      expect(spyDebugLogs).toHaveBeenNthCalledWith(4, expect.stringContaining('because key "tata" is also include inside campaign id="5e26ccd803533a89c3acbbbb" where key(s) "tyty " is/are also requested'));
    });
    it('should not activate all campaigns matching requesting key when there is a campaign conflict + notify with logs (part 3)', (done) => {
      visitorInstance.fetchedModifications = demoData.flagshipVisitor.activateModifications.fetchedModifications.multipleKeyConflict; // Mock a previous fetch
      visitorInstance.activateModifications(demoData.flagshipVisitor.activateModifications.args.basic);
      try {
        expect(mockAxios.post).toHaveBeenCalledTimes(2);
        expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
          caid: '5e26ccd8445a622037b1bc3b', cid: 'bn1ab7m56qolupi5sa0g', vaid: '5e26ccd8cc00f72d5f3cb177', vid: 'test-perf',
        });
        expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
          caid: '5e26ccd89609296ae8430037', cid: 'bn1ab7m56qolupi5sa0g', vaid: '5e26ccd8fcde4be7ffe5476f', vid: 'test-perf',
        });
        expect(spyExtractDesiredModifications).toHaveBeenCalledWith(demoData.flagshipVisitor.activateModifications.fetchedModifications.multipleKeyConflict, [
          { activate: true, defaultValue: '', key: 'toto' },
          { activate: true, defaultValue: '', key: 'tata' },
        ]);
        // expect(spyTriggerActivateIfNeeded).toHaveBeenCalledWith(""); // DEBUG ONLY
        expect(spyWarnLogs).toHaveBeenCalledTimes(1);
        expect(spyWarnLogs).toHaveBeenNthCalledWith(1, 'Key "toto" has been activated 2 times because it was in conflict in further campaigns (debug logs for more details)');
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyDebugLogs).toHaveBeenCalledTimes(2);
        expect(spyDebugLogs).toHaveBeenNthCalledWith(2, 'Here the details:,\n- because key "toto" is also include inside campaign id="5e26ccd803533a89c3acda5c" where key(s) "tata " is/are also requested.');
        done();
      } catch (error) {
        done.fail(error);
      }
    });
    it('should not activate all campaigns matching requesting key when there is a campaign conflict (part 2)', (done) => {
      visitorInstance.fetchedModifications = demoData.flagshipVisitor.activateModifications.fetchedModifications.multipleKeyConflict; // Mock a previous fetch
      visitorInstance.activateModifications([{ key: 'toto' }]);
      try {
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
          caid: '5e26ccd8445a622037b1bc3b', cid: 'bn1ab7m56qolupi5sa0g', vaid: '5e26ccd8cc00f72d5f3cb177', vid: 'test-perf',
        });
        expect(spyExtractDesiredModifications).toHaveBeenCalledWith(demoData.flagshipVisitor.activateModifications.fetchedModifications.multipleKeyConflict, [
          { activate: true, defaultValue: '', key: 'toto' },
        ]);
        // expect(spyTriggerActivateIfNeeded).toHaveBeenCalledWith(""); // DEBUG ONLY
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);
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
      visitorInstance.fetchedModifications = responseObject.data; // Mock a previous fetch
      visitorInstance.activateModifications(demoData.flagshipVisitor.activateModifications.args.basic);
      try {
        expect(mockAxios.post).toHaveBeenCalledTimes(2);
        expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
          caid: '5e26ccd8445a622037b1bc3b', cid: 'bn1ab7m56qolupi5sa0g', vaid: '5e26ccd8cc00f72d5f3cb177', vid: 'test-perf',
        });
        expect(mockAxios.post).toHaveBeenNthCalledWith(2, 'https://decision-api.flagship.io/v1/activate', {
          caid: '5e26ccd828feadeb6d9b8414', cid: 'bn1ab7m56qolupi5sa0g', vaid: '5e26ccd8d4106bb1ae2b6455', vid: 'test-perf',
        });
        expect(spyExtractDesiredModifications).toHaveBeenCalledWith(responseObject.data, [
          { activate: true, defaultValue: '', key: 'toto' },
          { activate: true, defaultValue: '', key: 'tata' },
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
          expect(spyInfoLogs).toBeCalledWith('sendHits: success');
          expect(spyWarnLogs).toBeCalledTimes(0);
          expect(spyErrorLogs).toBeCalledTimes(0);
          expect(spyFatalLogs).toBeCalledTimes(0);
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
          expect(spyInfoLogs).toBeCalledWith('sendHits: success');
          expect(spyWarnLogs).toBeCalledTimes(0);
          expect(spyErrorLogs).toHaveBeenNthCalledWith(2, 'sendHits(Event): failed because attribute "category" is missing...');
          expect(spyErrorLogs).toHaveBeenNthCalledWith(1, 'sendHits(Event): failed because attribute "action" is missing...');
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
      visitorInstance.sendHits(
        [
          brokenHit1,
          brokenHit2,
        ],
      ).then((response) => {
        try {
          expect(response).not.toBeDefined();
          expect(spyInfoLogs).toBeCalledWith('sendHits: success');
          expect(spyWarnLogs).toBeCalledTimes(0);
          expect(spyErrorLogs).toHaveBeenNthCalledWith(1, 'sendHits(Screen): failed because attribute "pageTitle" is missing...');
          expect(spyErrorLogs).toHaveBeenNthCalledWith(2, 'sendHits(Screen): failed because attribute "documentLocation" is missing...');
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
      visitorInstance.sendHits(
        [
          { ...demoData.hit.item, data: { ...demoData.hit.item.data, transactionId: null } },
          { ...demoData.hit.item, data: { ...demoData.hit.item.data, name: null } },
        ],
      ).then((response) => {
        try {
          expect(response).not.toBeDefined();
          expect(spyInfoLogs).toBeCalledWith('sendHits: success');
          expect(spyWarnLogs).toBeCalledTimes(0);
          expect(spyErrorLogs).toHaveBeenNthCalledWith(1, 'sendHits(Item): failed because attribute "transactionId" is missing...');
          expect(spyErrorLogs).toHaveBeenNthCalledWith(2, 'sendHits(Item): failed because attribute "name" is missing...');
          expect(spyErrorLogs).toBeCalledTimes(2);
          expect(spyFatalLogs).toBeCalledTimes(0);
        } catch (error) {
          done.fail(error);
        }
        done();
      });
      expect(mockAxios.post).toBeCalledTimes(0);
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
          expect(spyInfoLogs).toBeCalledWith('sendHits: success');
          expect(spyWarnLogs).toBeCalledTimes(0);
          expect(spyErrorLogs).toHaveBeenNthCalledWith(1, 'sendHits(Transaction): failed because attribute "transactionId" is missing...');
          expect(spyErrorLogs).toHaveBeenNthCalledWith(2, 'sendHits(Transaction): failed because attribute "affiliation" is missing...');
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
      spyFetchModifs = jest.spyOn(visitorInstance, 'fetchAllModifications');
      responseObject = {
        data: null,
        status: 200,
        statusText: 'OK',
      };
    });
    it('should not activate an unexisting key + return default value', (done) => {
      responseObject.data = demoData.decisionApi.normalResponse.manyModifInManyCampaigns;
      visitorInstance.fetchedModifications = responseObject.data; // Mock a previous fetch
      const cacheResponse = visitorInstance.getModifications(demoData.flagshipVisitor.getModifications.args.requestOneUnexistingKeyWithActivate);
      try {
        expect(mockAxios.post).toHaveBeenCalledTimes(0);
        expect(spyFetchModifs).toHaveBeenCalledWith({ activate: false, loadFromCache: true });
        expect(spyFetchModifs).toHaveBeenCalledTimes(1);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(1);
        expect(spyWarnLogs).toHaveBeenNthCalledWith(1, 'Unable to activate modification "testUnexistingKey" because it does not exist on any existing campaign...');
        expect(spyInfoLogs).toHaveBeenCalledWith('fetchAllModifications: loadFromCache enabled');
        expect(visitorInstance.fetchedModifications).toMatchObject(responseObject.data);
        expect(cacheResponse).toMatchObject({ testUnexistingKey: 'NOOOOO' });
        done();
      } catch (error) {
        done.fail(error);
      }
    });
    it('should not use promise when fetching modifications', (done) => {
      responseObject.data = demoData.decisionApi.normalResponse.manyModifInManyCampaigns;
      visitorInstance.fetchedModifications = responseObject.data; // Mock a previous fetch
      const cacheResponse = visitorInstance.getModifications(demoData.flagshipVisitor.getModifications.args.noActivate);
      try {
        expect(mockAxios.post).toHaveBeenCalledTimes(0);
        expect(spyFetchModifs).toHaveBeenCalledWith({ activate: false, loadFromCache: true });
        expect(spyFetchModifs).toHaveBeenCalledTimes(1);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledWith('fetchAllModifications: loadFromCache enabled');
        expect(visitorInstance.fetchedModifications).toMatchObject(responseObject.data);
        expect(cacheResponse).toMatchObject({ algorithmVersion: 'new', psp: 'dalenys', testUnexistingKey: 'YOLOOOO' });
        done();
      } catch (error) {
        done.fail(error);
      }
    });
    it('should not activate two different campaign if two requested keys are in same campaign', (done) => {
      responseObject.data = demoData.decisionApi.normalResponse.manyModifInManyCampaigns;
      visitorInstance.fetchedModifications = responseObject.data; // Mock a previous fetch
      const cacheResponse = visitorInstance.getModifications(demoData.flagshipVisitor.getModifications.args.default);
      try {
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(mockAxios.post).toHaveBeenNthCalledWith(1, 'https://decision-api.flagship.io/v1/activate', {
          caid: 'blntcamqmdvg04g371hg', cid: 'bn1ab7m56qolupi5sa0g', vaid: 'blntcamqmdvg04g371h0', vid: 'test-perf',
        });
        expect(spyFetchModifs).toHaveBeenCalledWith({ activate: false, loadFromCache: true });
        expect(spyFetchModifs).toHaveBeenCalledTimes(1);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(1);
        expect(spyWarnLogs).toHaveBeenNthCalledWith(1, `Unable to activate modification "${demoData.flagshipVisitor.getModifications.args.default[2].key}" because it does not exist on any existing campaign...`);
        expect(spyInfoLogs).toHaveBeenCalledWith('fetchAllModifications: loadFromCache enabled');
        expect(visitorInstance.fetchedModifications).toMatchObject(responseObject.data);
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
        expect(spyWarnLogs).toHaveBeenNthCalledWith(2, 'Unable to activate modification "algorithmVersion" because it does not exist on any existing campaign...');
        expect(spyWarnLogs).toHaveBeenNthCalledWith(3, 'Unable to activate modification "psp" because it does not exist on any existing campaign...');
        expect(spyWarnLogs).toHaveBeenNthCalledWith(4, 'Unable to activate modification "testUnexistingKey" because it does not exist on any existing campaign...');
        expect(cacheResponse).toMatchObject({ algorithmVersion: 'NOOOOO', psp: 'YESESES', testUnexistingKey: 'YOLOOOO' });
        done();
      } catch (error) {
        done.fail(error);
      }
    });
    it('should return empty object if nothing in cache (+ full activate requested)', (done) => {
      const cacheResponse = visitorInstance.getModifications(undefined, true);
      try {
        expect(spyFetchModifs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);
        expect(spyErrorLogs).toHaveBeenCalledTimes(1);
        expect(cacheResponse).toMatchObject({});
        expect(mockAxios.post).toHaveBeenCalledTimes(0);
        done();
      } catch (error) {
        done.fail(error);
      }
    });
    it('should return empty object if no modificationsRequested specified', (done) => {
      visitorInstance.fetchedModifications = demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign;
      const cacheResponse = visitorInstance.getModifications();
      try {
        expect(spyFetchModifs).toHaveBeenCalledTimes(0);
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
