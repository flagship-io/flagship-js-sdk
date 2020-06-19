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

describe('Bucketing - getEligibleCampaigns', () => {
    const getCorrespondingOperatorBucketingContext = (
        operator: string,
        type: string,
        bucketingContext: FlagshipVisitorContext
    ): FlagshipVisitorContext => ({
        ...Object.keys(bucketingContext).reduce(
            (reducer, key) => (key.includes(operator) && key.includes(type) ? { ...reducer, [key]: bucketingContext[key] } : reducer),
            {}
        )
    });
    const getCorrespondingOperatorApiMockResponse = (operator: string, type: string): BucketingApiResponse => {
        const campaign = (demoData.bucketing[`${operator}Operator`] as BucketingApiResponse).campaigns[0];
        const cloneCampaign = JSON.parse(JSON.stringify(campaign));
        cloneCampaign.variationGroups[0].targeting.targetingGroups[0].targetings = campaign.variationGroups[0].targeting.targetingGroups[0].targetings.filter(
            (t) => {
                //
                return t.key.includes(type);
            }
        );
        return {
            ...(demoData.bucketing[`${operator}Operator`] as BucketingApiResponse),
            campaigns: [cloneCampaign]
        };
    };
    const assertOperatorBehavior = (operator: string, type: string): void => {
        it(`should compute correctly operator "${operator}" and type "${type}"`, (done) => {
            const bucketingContext = getCorrespondingOperatorBucketingContext(
                operator,
                type,
                demoData.visitor.contextBucketingOperatorTestSuccess
            );
            bucketingApiMockResponse = getCorrespondingOperatorApiMockResponse(operator, type);
            bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig, demoData.visitor.id[0], bucketingContext);
            initSpyLogs(bucketInstance);
            const result = bucketInstance.getEligibleCampaigns(bucketingApiMockResponse);

            expect(Array.isArray(result) && result.length === 1).toEqual(true);
            expect(result[0].id === bucketingApiMockResponse.campaigns[0].id).toEqual(true);

            expect(spyDebugLogs).toHaveBeenCalledTimes(2);
            expect(spyErrorLogs).toHaveBeenCalledTimes(0);
            expect(spyFatalLogs).toHaveBeenCalledTimes(0);
            expect(spyInfoLogs).toHaveBeenCalledTimes(0);
            expect(spyWarnLogs).toHaveBeenCalledTimes(0);

            done();
        });
    };
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
    it('should expect correct behavior for "classic" data received', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig, demoData.visitor.id[0], demoData.visitor.cleanContext);
        initSpyLogs(bucketInstance);
        const result = bucketInstance.getEligibleCampaigns(bucketingApiMockResponse);

        expect(result).toEqual([
            {
                id: 'bptggipaqi903f3haq0g',
                variationGroupId: 'bptggipaqi903f3haq1g',
                variation: {
                    id: 'bptggipaqi903f3haq2g',
                    modifications: {
                        type: 'JSON',
                        value: {
                            testCache: 'value'
                        }
                    }
                }
            },
            {
                id: 'bq4sf09oet0006cfihd0',
                variationGroupId: 'bq4sf09oet0006cfihe0',
                variation: {
                    id: 'bq4sf09oet0006cfihf0',
                    modifications: {
                        type: 'JSON',
                        value: {
                            'btn-color': 'green',
                            'btn-text': 'Buy now with discount !',
                            'txt-color': '#A3A3A3'
                        }
                    }
                }
            }
        ]);

        expect(spyDebugLogs).toHaveBeenCalledTimes(4);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        done();
    });

    const getBundleOfType = (t): { type: string; operator: string }[] =>
        [
            'equals',
            'notEquals',
            'lowerThan',
            'lowerThanOrEquals',
            'greaterThan',
            'greaterThanOrEquals',
            'startsWith',
            'endsWith',
            'contains',
            'notContains'
        ].map((o) => ({
            type: t,
            operator: o
        }));

    [...getBundleOfType('Bool'), ...getBundleOfType('String'), ...getBundleOfType('Number')].forEach((bt) =>
        assertOperatorBehavior(bt.operator, bt.type)
    );
    it('should compute correctly operator "contains" and type "string"', (done) => {
        const operator = 'contains';
        const type = 'String';
        const bucketingContext = getCorrespondingOperatorBucketingContext(
            operator,
            type,
            demoData.visitor.contextBucketingOperatorTestSuccess
        );
        bucketingApiMockResponse = getCorrespondingOperatorApiMockResponse(operator, type);
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig, demoData.visitor.id[0], bucketingContext);
        initSpyLogs(bucketInstance);
        const result = bucketInstance.getEligibleCampaigns(bucketingApiMockResponse);

        expect(Array.isArray(result) && result.length === 1).toEqual(true);
        expect(result[0].id === bucketingApiMockResponse.campaigns[0].id).toEqual(true);

        expect(spyDebugLogs).toHaveBeenCalledTimes(2);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        done();
    });
    // it('should compute correctly operator "contains" and type "bool"', (done) => {
    //     const operator = 'contains';
    //     const type = 'Bool';
    //     const bucketingContext = getCorrespondingOperatorBucketingContext(
    //         operator,
    //         type,
    //         demoData.visitor.contextBucketingOperatorTestSuccess
    //     );
    //     bucketingApiMockResponse = getCorrespondingOperatorApiMockResponse(
    //         operator,
    //         type,
    //         demoData.bucketing[`${operator}Operator`] as BucketingApiResponse
    //     );
    //     bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig, demoData.visitor.id[0], bucketingContext);
    //     initSpyLogs(bucketInstance);
    //     const result = bucketInstance.getEligibleCampaigns(bucketingApiMockResponse);

    //     expect(Array.isArray(result) && result.length === 1).toEqual(true);
    //     expect(result[0].id === bucketingApiMockResponse.campaigns[0].id).toEqual(true);

    //     expect(spyDebugLogs).toHaveBeenCalledTimes(2);
    //     expect(spyErrorLogs).toHaveBeenCalledTimes(0);
    //     expect(spyFatalLogs).toHaveBeenCalledTimes(0);
    //     expect(spyInfoLogs).toHaveBeenCalledTimes(0);
    //     expect(spyWarnLogs).toHaveBeenCalledTimes(0);

    //     done();
    // });

    it('should compute correctly operator "contains" and type "number"', (done) => {
        const operator = 'contains';
        const type = 'Bool';
        const bucketingContext = getCorrespondingOperatorBucketingContext(
            operator,
            type,
            demoData.visitor.contextBucketingOperatorTestSuccess
        );
        bucketingApiMockResponse = getCorrespondingOperatorApiMockResponse(operator, type);
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig, demoData.visitor.id[0], bucketingContext);
        initSpyLogs(bucketInstance);
        const result = bucketInstance.getEligibleCampaigns(bucketingApiMockResponse);

        expect(Array.isArray(result) && result.length === 1).toEqual(true);
        expect(result[0].id === bucketingApiMockResponse.campaigns[0].id).toEqual(true);

        expect(spyDebugLogs).toHaveBeenCalledTimes(2);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

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
    it('should detect when bucket api response return panic mode', (done) => {
        bucketingApiMockResponse = demoData.bucketing.panic as BucketingApiResponse;
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig, demoData.visitor.id[0], demoData.visitor.cleanContext);
        initSpyLogs(bucketInstance);
        bucketInstance.launch().then(spyThen).catch(spyCatch);
        mockAxios.mockResponse({ data: bucketingApiMockResponse });
        expect(mockAxios.get).toHaveBeenNthCalledWith(1, internalConfig.bucketingEndpoint.replace('@ENV_ID@', bucketInstance.envId));
        expect(spyThen).toHaveBeenCalledWith(bucketingApiMockResponse);
        expect(spyCatch).not.toHaveBeenCalled();

        expect(spyDebugLogs).toHaveBeenCalledTimes(0);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenNthCalledWith(1, 'Panic mode detected, running SDK in safe mode...');
        done();
    });
    it('should log an error when bucketing api fail', (done) => {
        bucketInstance = new Bucketing(demoData.envId[0], bucketingConfig, demoData.visitor.id[0], demoData.visitor.cleanContext);
        initSpyLogs(bucketInstance);
        bucketInstance.launch().then(spyThen).catch(spyCatch);
        mockAxios.mockError('server crashed');
        expect(mockAxios.get).toHaveBeenNthCalledWith(1, internalConfig.bucketingEndpoint.replace('@ENV_ID@', bucketInstance.envId));
        expect(spyCatch).toHaveBeenCalled();
        expect(spyThen).not.toHaveBeenCalled();

        expect(spyDebugLogs).toHaveBeenCalledTimes(0);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenNthCalledWith(1, 'An error occurred while fetching using bucketing...');
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
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
