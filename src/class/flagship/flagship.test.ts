import mockAxios from 'jest-mock-axios';
import demoData from '../../../test/mock/demoData';
import testConfig from '../../config/test';
import Flagship from './flagship';
import flagshipSdk from '../../index';

let sdk: Flagship;
let visitorInstance;

describe('FlagshipVisitor', () => {
  afterEach(() => {
    mockAxios.reset();
  });
  describe('NewVisitor function', () => {
    it('should have .once("ready") triggered also when fetchNow=false', (done) => {
      const mockFn = jest.fn();
      sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, fetchNow: false });
      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      visitorInstance.on('ready', () => {
        try {
          mockFn();
        } catch (error) {
          done.fail(error);
        }
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
      done();
    });
    it('should create a Visitor with modifications already loaded if config "fetchNow=true"', (done) => {
      const responseObj = {
        data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
        status: 200,
        statusText: 'OK',
      };
      sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, fetchNow: true });
      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      expect(visitorInstance.config).toMatchObject({ ...testConfig, fetchNow: true });
      visitorInstance.once('ready', () => {
        done();
      });
      mockAxios.mockResponse(responseObj);
      expect(visitorInstance.fetchedModifications).toMatchObject(responseObj);
    });
    it('should create a Visitor with modifications already loaded and activated if config "activateNow=true"', (done) => {
      const responseObj = {
        data: { ...demoData.decisionApi.normalResponse.oneModifInMoreThanOneCampaign },
        status: 200,
        statusText: 'OK',
      };
      sdk = flagshipSdk.initSdk(demoData.envId[0], { ...testConfig, activateNow: true });
      visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
      expect(visitorInstance.config).toMatchObject({ ...testConfig, activateNow: true });
      visitorInstance.once('ready', () => {
        try {
          expect(visitorInstance.fetchedModifications).not.toBe(null);
        } catch (error) {
          done.fail(error);
        }
        done();
      });
      mockAxios.mockResponse(responseObj);
      expect(mockAxios.post).toHaveBeenNthCalledWith(1, `https://decision-api.flagship.io/v1/${demoData.envId[0]}/campaigns?mode=normal`, { context: demoData.visitor.cleanContext, trigger_hit: true, visitor_id: demoData.visitor.id[0] });
      expect(visitorInstance.fetchedModifications).toMatchObject(responseObj);
    });
  });
});
