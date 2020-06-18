import mockAxios from 'jest-mock-axios';
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
    it('should trigger bucketing behavior when creating new visitor with config having "bucketing" in decision mode', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        sdk = flagshipSdk.initSdk(demoData.envId[0], bucketingConfig);
        visitorInstance = sdk.newVisitor(demoData.visitor.id[0], demoData.visitor.cleanContext);
        expect(visitorInstance.bucket instanceof Bucketing).toEqual(true);
        mockAxios.mockResponse({ data: bucketingApiMockResponse });
        expect(mockAxios.get).toHaveBeenNthCalledWith(1, internalConfig.bucketingEndpoint.replace('@ENV_ID@', visitorInstance.envId));
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
});

describe('Bucketing - murmur algorithm', () => {
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
    it('should works with "classical" scenario', (done) => {
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig, demoData.visitor.id[0], demoData.visitor.cleanContext);
        initSpyLogs(bucketInstance);
        bucketSpy = jest.spyOn(bucketInstance, 'computeMurmurAlgorithm');
        const result = bucketInstance.computeMurmurAlgorithm(demoData.bucketing.functions.murmur.defaultArgs); // private function

        expect(result).toEqual({
            allocation: 50,
            id: 'bptggipaqi903f3haq2g',
            modifications: { type: 'JSON', value: { testCache: 'value' } }
        });
        expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'computeMurmurAlgorithm - murmur returned value="79"');
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);
        done();
    });
    it('should be SDK ISO (visitorId="toto")', (done) => {
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig, demoData.visitor.id[1], demoData.visitor.cleanContext);
        initSpyLogs(bucketInstance);
        bucketSpy = jest.spyOn(bucketInstance, 'computeMurmurAlgorithm');
        const result = bucketInstance.computeMurmurAlgorithm(demoData.bucketing.functions.murmur.defaultArgs); // private function

        expect(result).toEqual({
            allocation: 50,
            id: 'bptggipaqi903f3haq2g',
            modifications: { type: 'JSON', value: { testCache: 'value' } }
        });
        expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'computeMurmurAlgorithm - murmur returned value="21"');
        done();
    });
    it('should return an error if variation traffic not correct', (done) => {
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig, demoData.visitor.id[1], demoData.visitor.cleanContext);
        initSpyLogs(bucketInstance);
        bucketSpy = jest.spyOn(bucketInstance, 'computeMurmurAlgorithm');
        const result = bucketInstance.computeMurmurAlgorithm(demoData.bucketing.functions.murmur.badTraffic); // private function

        expect(result).toEqual(null);
        expect(spyFatalLogs).toHaveBeenNthCalledWith(
            1,
            'computeMurmurAlgorithm - the variation traffic is equal to "80" instead of being equal to "100"'
        );
        done();
    });
});
describe('Bucketing - launch', () => {
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
    it('should works with "classical" bucket api response', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig, demoData.visitor.id[0], demoData.visitor.cleanContext);
        initSpyLogs(bucketInstance);
        bucketInstance.launch().then(spyThen).catch(spyCatch);
        mockAxios.mockResponse({ data: bucketingApiMockResponse });
        expect(mockAxios.get).toHaveBeenNthCalledWith(1, internalConfig.bucketingEndpoint.replace('@ENV_ID@', bucketInstance.envId));
        expect(spyThen).toHaveBeenCalledWith(bucketingApiMockResponse);
        expect(spyCatch).not.toHaveBeenCalled();

        expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'Bucketing - campaign (id="bptggipaqi903f3haq0g") is matching visitor context');
        expect(spyDebugLogs).toHaveBeenNthCalledWith(3, 'Bucketing - campaign (id="bq4sf09oet0006cfihd0") is matching visitor context');
        expect(spyDebugLogs).toHaveBeenNthCalledWith(2, 'computeMurmurAlgorithm - murmur returned value="79"');
        expect(spyDebugLogs).toHaveBeenNthCalledWith(4, 'computeMurmurAlgorithm - murmur returned value="79"');
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenNthCalledWith(1, 'launch - 2 campaign(s) found matching current visitor');
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);
        done();
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
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig, demoData.visitor.id[0], demoData.visitor.cleanContext);
        expect(bucketInstance instanceof Bucketing).toEqual(true);

        expect(bucketInstance.envId).toEqual(demoData.envId[0]);
        expect(bucketInstance.data).toEqual(null);
        expect(bucketInstance.computedData).toEqual(null);
        expect(bucketInstance.log).toBeDefined();
        expect(bucketInstance.visitorId).toEqual(demoData.visitor.id[0]);
        expect(bucketInstance.visitorContext).toEqual(demoData.visitor.cleanContext);
        expect(bucketInstance.config).toEqual(bucketingConfig);
        done();
    });
});
