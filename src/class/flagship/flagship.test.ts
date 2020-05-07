import mockAxios from 'jest-mock-axios';
import demoData from '../../../test/mock/demoData';
import testConfig from '../../config/test';
import Flagship from './flagship';
import flagshipSdk from '../../index';

let sdk: Flagship;
let visitorInstance;

describe('FlagshipVisitor', () => {
  let responseObj = {
    data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
    status: 200,
    statusText: 'OK',
  };
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
    mockAxios.reset();
  });
  describe('createVisitor function', () => {
    it('should have .once("ready") triggered also when fetchNow=false', (done) => {
      const mockFn = jest.fn();
      sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, fetchNow: false });
      visitorInstance = sdk.createVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
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
      visitorInstance = sdk.createVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
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

    it('should have ability to return custom modifications with "saveCache" event', (done) => {
      const mockFn = jest.fn();
      const modificationsWhichWillBeSavedInCache = demoData.flagshipVisitor.getModifications.detailsModifications.oneModifInMoreThanOneCampaign;
      sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, fetchNow: true });
      visitorInstance = sdk.createVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
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
      visitorInstance = sdk.createVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
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
        statusText: 'OK',
      };
      sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, fetchNow: true });
      visitorInstance = sdk.createVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      expect(visitorInstance.config).toMatchObject({ ...testConfig, fetchNow: true });
      visitorInstance.once('ready', () => {
        done();
      });
      mockAxios.mockResponse(responseObj);
      expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data);
    });
    it('should create a Visitor with modifications already loaded and activated if config "activateNow=true"', (done) => {
      sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, activateNow: true });
      visitorInstance = sdk.createVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      expect(visitorInstance.config).toMatchObject({ ...testConfig, activateNow: true });
      visitorInstance.once('ready', () => {
        try {
          expect(visitorInstance.fetchedModifications).not.toBe(null);
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
        } catch (error) {
          done.fail(error);
        }
      });
      mockAxios.mockResponse(responseObj);
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: true, visitor_id: demoData.visitor.id[0] });
      expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data);
    });
    it('should use correct endpoint when "flagshipApi" is set in config', (done) => {
      const mockEndpoint = 'https://decision-api.flagship.io/v999/';
      sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, activateNow: true, flagshipApi: mockEndpoint });
      visitorInstance = sdk.createVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      expect(visitorInstance.config).toMatchObject({ ...testConfig, activateNow: true, flagshipApi: mockEndpoint });
      visitorInstance.once('ready', () => {
        try {
          expect(visitorInstance.fetchedModifications).not.toBe(null);
          expect(mockAxios.post).toHaveBeenNthCalledWith(2, `${mockEndpoint}activate`, {
            caid: 'blntcamqmdvg04g371hg', cid: 'bn1ab7m56qolupi5sa0g', vaid: 'blntcamqmdvg04g371h0', vid: 'test-perf',
          });
          expect(mockAxios.post).toHaveBeenNthCalledWith(3, `${mockEndpoint}activate`, {
            caid: 'bmjdprsjan0g01uq2ctg', cid: 'bn1ab7m56qolupi5sa0g', vaid: 'bmjdprsjan0g01uq2csg', vid: 'test-perf',
          });
          expect(mockAxios.post).toHaveBeenNthCalledWith(4, `${mockEndpoint}activate`, {
            caid: 'bmjdprsjan0g01uq1ctg', cid: 'bn1ab7m56qolupi5sa0g', vaid: 'bmjdprsjan0g01uq2ceg', vid: 'test-perf',
          });
          done();
        } catch (error) {
          done.fail(error);
        }
      });
      mockAxios.mockResponse(responseObj);
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, `${mockEndpoint}${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: true, visitor_id: demoData.visitor.id[0] });
      expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data);
    });
    it('should add "x-api-key" in modifications queries when "apiKey" is set in config', (done) => {
      const mockApiKey = 'toto';
      const endPoint = 'https://decision-api.flagship.io/v1/';
      sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, activateNow: true, apiKey: mockApiKey });
      visitorInstance = sdk.createVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      expect(visitorInstance.config).toMatchObject({ ...testConfig, activateNow: true, apiKey: mockApiKey });
      visitorInstance.once('ready', () => {
        try {
          expect(visitorInstance.fetchedModifications).not.toBe(null);
          expect(mockAxios.post).toHaveBeenNthCalledWith(2, `${endPoint}activate`, {
            caid: 'blntcamqmdvg04g371hg', cid: 'bn1ab7m56qolupi5sa0g', vaid: 'blntcamqmdvg04g371h0', vid: 'test-perf',
          });
          expect(mockAxios.post).toHaveBeenNthCalledWith(3, `${endPoint}activate`, {
            caid: 'bmjdprsjan0g01uq2ctg', cid: 'bn1ab7m56qolupi5sa0g', vaid: 'bmjdprsjan0g01uq2csg', vid: 'test-perf',
          });
          expect(mockAxios.post).toHaveBeenNthCalledWith(4, `${endPoint}activate`, {
            caid: 'bmjdprsjan0g01uq1ctg', cid: 'bn1ab7m56qolupi5sa0g', vaid: 'bmjdprsjan0g01uq2ceg', vid: 'test-perf',
          });
          done();
        } catch (error) {
          done.fail(error);
        }
      });
      mockAxios.mockResponse(responseObj);
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, `${endPoint}${demoData.envId[0]}/campaigns?mode=normal`, {
        context: demoData.visitor.cleanContext, trigger_hit: true, visitor_id: demoData.visitor.id[0], 'x-api-key': 'toto',
      });
      expect(visitorInstance.fetchedModifications).toMatchObject(responseObj.data);
    });
  });
  it('should have setting "initialModifications" working correctly', (done) => {
    const defaultCacheData = demoData.decisionApi.normalResponse.manyModifInManyCampaigns.campaigns;
    sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, fetchNow: false, initialModifications: defaultCacheData });
    visitorInstance = sdk.createVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
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
    const defaultCacheData = [{
      toto: 123,
    },
    {
      id: 'blntcamqmdvg04g371f0',
      variation: {
        id: 'blntcamqmdvg04g371hg',
        modifications: {
          type: 'FLAG',
          value: {
            psp: 'dalenys',
            algorithmVersion: 'new',
          },
        },
      },
    },
    ];
    sdk = flagshipSdk.initSdk(demoData.envId[0], {
      ...testConfig, enableConsoleLogs: true, fetchNow: false, initialModifications: defaultCacheData,
    });
    visitorInstance = sdk.createVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);

    visitorInstance.on('ready', () => {
      try {
        expect(mockAxios.post).toHaveBeenCalledTimes(0);
        expect(visitorInstance.fetchedModifications).toEqual(null);
        expect(spyErrorLogs).toHaveBeenCalledTimes(1);

        const spyResult = spyErrorLogs.mock.calls[0][0];
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
    visitorInstance = sdk.createVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
    visitorInstance.on('ready', () => {
      try {
        expect(mockAxios.post).toHaveBeenCalledTimes(1);
        expect(visitorInstance.fetchedModifications).toEqual(demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign);
        done();
      } catch (error) {
        done.fail(error);
      }
    });

    mockAxios.mockResponse(responseObj);
  });
});
