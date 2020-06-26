import mockAxios from 'jest-mock-axios';
import { BucketingApiResponse } from '../bucketing/bucketing.d';
import { IFlagship, IFlagshipVisitor, IFlagshipBucketing, FlagshipSdkConfig } from '../../index.d';
import testConfig from '../../config/test';

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
});
