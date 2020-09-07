import mockAxios from 'jest-mock-axios';
import { HttpResponse } from 'jest-mock-axios/dist/lib/mock-axios-types';

import demoData from '../../../test/mock/demoData';
import testConfig from '../../config/test';
import { FlagshipSdkConfig, IFlagship, IFlagshipBucketingVisitor, IFlagshipVisitor, IFlagshipBucketing } from '../../types';
import { BucketingApiResponse } from '../bucketing/types';
import BucketingVisitor from './bucketingVisitor';

let sdk: IFlagship;
let visitorInstance: IFlagshipVisitor;
let bucketInstance: IFlagshipBucketingVisitor;
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

    return {
        spyWarnLogs,
        spyErrorLogs,
        spyFatalLogs,
        spyInfoLogs,
        spyDebugLogs
    };
};

const generateUuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r && 0x3) || 0x8;
        return v.toString(16);
    });
};

const murmurAllocationCheck = (variations, acceptedRange, nbVisitor) => {
    const randomVariationGroupId = `kjfiezjfez${Math.floor(Math.random() * 100)}`;
    const nbAllocation = variations.length;
    const variationAllocationResult = new Array(nbAllocation).fill(0);
    for (let i = 0; i < nbVisitor; i += 1) {
        bucketInstance = new BucketingVisitor(
            demoData.envId[0],
            generateUuid(),
            demoData.visitor.cleanContext,
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        const { id } = bucketInstance.computeMurmurAlgorithm(variations, randomVariationGroupId);
        const vIndex = variations.findIndex((el) => el.id === id);
        variationAllocationResult[vIndex] += 1;
    }

    const calculateDiffPercentage = (currentAllocation) => {
        return Number((((nbVisitor / nbAllocation - currentAllocation) / nbVisitor) * 100).toFixed(2));
    };
    const variationRangeResult = variationAllocationResult.map((allocation) => calculateDiffPercentage(allocation));
    const checkCondition = (v) => (v < 0 ? -1 * v < acceptedRange : v < acceptedRange);
    return {
        isTestOk: variationRangeResult.filter((v) => checkCondition(v)).length > 0,
        debug: `
        variationAllocationResult:
        ${variationAllocationResult.map((v, index) => `v${index}=${v}`).join(' ')}
        variationRangeResult:
        ${variationRangeResult.map((v, index) => `v${index}=${v}`).join(' ')}
        result:
        ${variationRangeResult.map((v, index) => `v${index}=${checkCondition(v)}`).join(' ')}
        max range accepted: ${acceptedRange}
        range detected in this test: ${variationRangeResult.map((v, index) => `v${index}=${v}`)}
        `
    };
};

const expectedRequestHeaderFirstCall = { headers: { 'If-Modified-Since': '' } };
const expectedRequestHeaderNotFirstCall = { headers: { 'If-Modified-Since': 'Wed, 18 Mar 2020 23:29:16 GMT' } };

const temporaryGlobalBucketMock = {
    data: null
};

describe('BucketingVisitor used from visitor instance', () => {
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

describe('BucketingVisitor - updateVisitorContext', () => {
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

    it('should works', (done) => {
        bucketInstance = new BucketingVisitor(
            demoData.envId[0],
            demoData.visitor.id[3],
            demoData.visitor.cleanContext,
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        initSpyLogs(bucketInstance);
        expect(bucketInstance.visitorContext).toEqual(demoData.visitor.cleanContext);
        bucketInstance.updateVisitorContext({ isVip: false });
        expect(bucketInstance.visitorContext).toEqual({ isVip: false });
        done();
    });

    it('should filter bad values', (done) => {
        bucketInstance = new BucketingVisitor(
            demoData.envId[0],
            demoData.visitor.id[3],
            demoData.visitor.cleanContext,
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        initSpyLogs(bucketInstance);
        expect(bucketInstance.visitorContext).toEqual(demoData.visitor.cleanContext);
        bucketInstance.updateVisitorContext({ isVip: [false, true, false], ok: 'ok' });
        expect(bucketInstance.visitorContext).toEqual({ ok: 'ok' });

        expect(spyDebugLogs).toHaveBeenCalledTimes(1);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(1);

        expect(spyDebugLogs).toHaveBeenNthCalledWith(
            1,
            'Updating bucketing visitor context from {"pos":"es"} to {"isVip":[false,true,false],"ok":"ok"}'
        );
        done();
    });
});

describe('BucketingVisitor - getEligibleCampaigns', () => {
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
    const assertOperatorBehavior = (operator: string, type: string, shouldReportIssueBetweenValueTypeAndOperator: boolean): void => {
        const mapping = {
            equals: 'EQUALS',
            notEquals: 'NOT_EQUALS',
            lowerThan: 'LOWER_THAN',
            lowerThanOrEquals: 'LOWER_THAN_OR_EQUALS',
            greaterThan: 'GREATER_THAN',
            greaterThanOrEquals: 'GREATER_THAN_OR_EQUALS',
            startsWith: 'STARTS_WITH',
            endsWith: 'ENDS_WITH',
            contains: 'CONTAINS',
            notContains: 'NOT_CONTAINS'
        };
        it(`should compute correctly operator "${operator}" and type "${type}"`, (done) => {
            const bucketingContext = getCorrespondingOperatorBucketingContext(
                operator,
                type,
                demoData.visitor.contextBucketingOperatorTestSuccess
            );
            bucketingApiMockResponse = getCorrespondingOperatorApiMockResponse(operator, type);
            bucketInstance = new BucketingVisitor(
                demoData.envId[0],
                demoData.visitor.id[3],
                bucketingContext,
                bucketingConfig,
                temporaryGlobalBucketMock as IFlagshipBucketing
            );
            bucketInstance.data = bucketingApiMockResponse;
            initSpyLogs(bucketInstance);
            const result = bucketInstance.getEligibleCampaigns();

            if (shouldReportIssueBetweenValueTypeAndOperator) {
                expect(result).toEqual([]);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyDebugLogs).toHaveBeenCalledTimes(1);
                expect(spyWarnLogs).toHaveBeenCalledTimes(2);

                expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'Bucketing - campaign (id="bptggipaqi903f3haq0g") NOT MATCHING visitor');
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    1,
                    `getEligibleCampaigns - operator "${mapping[operator]}" is not supported for type "${(type === 'Bool'
                        ? 'boolean'
                        : type
                    ).toLowerCase()}". Assertion aborted.`
                );
                expect(spyWarnLogs).toHaveBeenNthCalledWith(
                    2,
                    `getEligibleCampaigns - operator "${mapping[operator]}" is not supported for type "${(type === 'Bool'
                        ? 'boolean'
                        : type
                    ).toLowerCase()}". Assertion aborted.`
                );
            } else {
                expect(Array.isArray(result) && result.length === 1).toEqual(true);
                expect(result[0].id === bucketingApiMockResponse.campaigns[0].id).toEqual(true);

                expect(spyDebugLogs).toHaveBeenCalledTimes(2);
                expect(spyErrorLogs).toHaveBeenCalledTimes(0);
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);
            }

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

    [...getBundleOfType('Bool'), ...getBundleOfType('String'), ...getBundleOfType('Number')].forEach((bt) => {
        switch (bt.operator) {
            case 'lowerThan': // ONLY BOOL
            case 'lowerThanOrEquals':
            case 'greaterThan':
            case 'greaterThanOrEquals':
                assertOperatorBehavior(bt.operator, bt.type, bt.type === 'Bool');
                break;

            case 'startsWith': // BOTH BOOL AND STRING
            case 'endsWith':
            case 'contains':
            case 'notContains':
                assertOperatorBehavior(bt.operator, bt.type, bt.type === 'Bool' || bt.type === 'Number');
                break;

            default:
                assertOperatorBehavior(bt.operator, bt.type, false);
        }
    });

    it('should expect correct behavior for "classic" data received', (done) => {
        bucketingApiMockResponse = demoData.bucketing.classical as BucketingApiResponse;
        const allocation = 68;
        bucketInstance = new BucketingVisitor(
            demoData.envId[0],
            demoData.bucketing.functions.murmur.allocation[allocation].visitorId,
            demoData.visitor.cleanContext,
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        bucketInstance.data = bucketingApiMockResponse;
        initSpyLogs(bucketInstance);
        const result = bucketInstance.getEligibleCampaigns();

        expect(result).toEqual([
            {
                id: 'bptggipaqi903f3haq0g',
                variationGroupId: demoData.bucketing.functions.murmur.allocation[allocation].variationGroup,
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
                variationGroupId: demoData.bucketing.functions.murmur.allocation[17].variationGroup,
                variation: {
                    id: 'bq4sf09oet0006cfiheg',
                    modifications: {
                        type: 'JSON',
                        value: {
                            'btn-color': 'red',
                            'btn-text': 'Buy now !',
                            'txt-color': '#fff'
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

    it('should expect correct behavior when bucket api return no data', (done) => {
        bucketInstance = new BucketingVisitor(
            demoData.envId[0],
            demoData.visitor.id[3],
            demoData.visitor.cleanContext,
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        bucketInstance.data = {};
        initSpyLogs(bucketInstance);
        const result = bucketInstance.getEligibleCampaigns();

        expect(result).toEqual([]);

        expect(spyDebugLogs).toHaveBeenCalledTimes(0);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(1);

        expect(spyWarnLogs).toHaveBeenNthCalledWith(1, 'getEligibleCampaigns - no bucketing data found');

        done();
    });

    it('should expect correct behavior for "multiple variation groups" data received', (done) => {
        bucketingApiMockResponse = demoData.bucketing.oneCampaignOneVgMultipleTgg as BucketingApiResponse;
        bucketInstance = new BucketingVisitor(
            demoData.envId[0],
            demoData.visitor.id[3],
            { foo1: 'yes1' },
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        bucketInstance.data = bucketingApiMockResponse;
        const bucketInstance2 = new BucketingVisitor(
            demoData.envId[0],
            demoData.visitor.id[3],
            { foo1: 'NOPE', foo2: 'yes2' },
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        bucketInstance2.data = bucketingApiMockResponse;
        const bucketInstance3 = new BucketingVisitor(
            demoData.envId[0],
            demoData.visitor.id[3],
            { foo3: 'yes3' },
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        bucketInstance3.data = bucketingApiMockResponse;
        initSpyLogs(bucketInstance);
        let result = bucketInstance.getEligibleCampaigns();
        expect(Array.isArray(result) && result.length === 1).toEqual(true);
        result = bucketInstance2.getEligibleCampaigns();
        expect(Array.isArray(result) && result.length === 1).toEqual(true);
        result = bucketInstance3.getEligibleCampaigns();
        expect(Array.isArray(result) && result.length === 1).toEqual(true);

        expect(spyDebugLogs).toHaveBeenCalledTimes(4);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        done();
    });

    it('should expect correct behavior for "multiple campaigns" data received', (done) => {
        bucketingApiMockResponse = demoData.bucketing.multipleCampaigns as BucketingApiResponse;
        bucketInstance = new BucketingVisitor(
            demoData.envId[0],
            demoData.visitor.id[3],
            { foo1: 'yes1' },
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        bucketInstance.data = bucketingApiMockResponse;
        const bucketInstance2 = new BucketingVisitor(
            demoData.envId[0],
            demoData.visitor.id[3],
            { foo1: 'yes1', isVip: true },
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        bucketInstance2.data = bucketingApiMockResponse;
        initSpyLogs(bucketInstance);
        let result = bucketInstance.getEligibleCampaigns();
        expect(Array.isArray(result) && result.length === 1).toEqual(true);
        result = bucketInstance2.getEligibleCampaigns();
        expect(Array.isArray(result) && result.length === 2).toEqual(true);

        expect(spyDebugLogs).toHaveBeenCalledTimes(6);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        done();
    });

    it('should expect correct behavior for "bad type between visitor context and" data received', (done) => {
        bucketingApiMockResponse = demoData.bucketing.badTypeBetweenTargetingAndVisitorContextKey as BucketingApiResponse;
        bucketInstance = new BucketingVisitor(
            demoData.envId[0],
            demoData.visitor.id[3],
            {
                lowerThanBadType: 123,
                lowerThanBadTypeArray: 0,
                lowerThanBadTypeJson: 2
            },
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        bucketInstance.data = bucketingApiMockResponse;
        initSpyLogs(bucketInstance);
        const result = bucketInstance.getEligibleCampaigns();
        expect(result).toEqual([]);

        expect(mockAxios.post).toHaveBeenCalledTimes(0);

        expect(spyDebugLogs).toHaveBeenCalledTimes(1);
        expect(spyErrorLogs).toHaveBeenCalledTimes(10);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'Bucketing - campaign (id="bptggipaqi903f3haq0g") NOT MATCHING visitor');
        expect(spyErrorLogs).toHaveBeenNthCalledWith(
            1,
            'getEligibleCampaigns - The bucketing API returned a value which have not the same type ("number") as the visitor context key="lowerThanBadType"'
        );
        expect(spyErrorLogs).toHaveBeenNthCalledWith(
            2,
            'getEligibleCampaigns - The bucketing API returned a json object which is not supported by the SDK.'
        );

        expect(spyErrorLogs).toHaveBeenNthCalledWith(
            3,
            'getEligibleCampaigns - The bucketing API returned an array where some elements do not have same type ("number") as the visitor context key="lowerThanBadTypeArray"'
        );

        done();
    });
    it('should expect correct behavior for "fs_all_users" data received', (done) => {
        bucketingApiMockResponse = demoData.bucketing.fs_all_users as BucketingApiResponse;
        bucketInstance = new BucketingVisitor(
            demoData.envId[0],
            demoData.visitor.id[3],
            {},
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        bucketInstance.data = bucketingApiMockResponse;
        initSpyLogs(bucketInstance);
        const result = bucketInstance.getEligibleCampaigns();
        expect(Array.isArray(result) && result.length === 1).toEqual(true);

        expect(spyDebugLogs).toHaveBeenCalledTimes(2);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        done();
    });

    it('should expect correct behavior for "fs_users" data received', (done) => {
        bucketingApiMockResponse = demoData.bucketing.fs_users as BucketingApiResponse;
        bucketInstance = new BucketingVisitor(
            demoData.envId[0],
            demoData.visitor.id[0],
            {},
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        bucketInstance.data = bucketingApiMockResponse;
        initSpyLogs(bucketInstance);
        const result = bucketInstance.getEligibleCampaigns();
        expect(Array.isArray(result) && result.length).toEqual(1);

        expect(spyDebugLogs).toHaveBeenCalledTimes(2);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        done();
    });

    it('should expect correct behavior for "bad murmur allocation" data received', (done) => {
        bucketingApiMockResponse = demoData.bucketing.oneCampaignWithBadTraffic as BucketingApiResponse;
        const allocation = 99;
        bucketInstance = new BucketingVisitor(
            demoData.envId[0],
            demoData.bucketing.functions.murmur.allocation[allocation].visitorId,
            {},
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        bucketInstance.data = bucketingApiMockResponse;
        initSpyLogs(bucketInstance);
        const result = bucketInstance.getEligibleCampaigns();
        expect(result).toEqual([]);
        expect(spyDebugLogs).toHaveBeenCalledTimes(3);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(1);

        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'Bucketing - campaign (id="bptggipaqi903f3haq0g") is matching visitor context');
        expect(spyDebugLogs).toHaveBeenNthCalledWith(2, `computeMurmurAlgorithm - murmur returned value="${allocation}"`);
        expect(spyDebugLogs).toHaveBeenNthCalledWith(
            3,
            `computeMurmurAlgorithm - Unable to find the corresponding variation (campaignId="bptggipaqi903f3haq0g") using murmur for visitor (id="${demoData.bucketing.functions.murmur.allocation[allocation].visitorId}"). This visitor will be untracked.`
        );
        expect(spyFatalLogs).toHaveBeenNthCalledWith(
            1,
            'computeMurmurAlgorithm - the total variation traffic allocation is equal to "110" instead of being equal to "100"'
        );

        done();
    });

    it('should expect correct behavior for "unknown operator" data received', (done) => {
        bucketingApiMockResponse = demoData.bucketing.badOperator as BucketingApiResponse;
        bucketInstance = new BucketingVisitor(
            demoData.envId[0],
            demoData.visitor.id[3],
            { isVip: false },
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        bucketInstance.data = bucketingApiMockResponse;
        initSpyLogs(bucketInstance);
        const result = bucketInstance.getEligibleCampaigns();
        expect(result).toEqual([]);

        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);
        expect(spyDebugLogs).toHaveBeenCalledTimes(1);
        expect(spyErrorLogs).toHaveBeenCalledTimes(1);

        expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'Bucketing - campaign (id="bptggipaqi903f3haq0g") NOT MATCHING visitor');
        expect(spyErrorLogs).toHaveBeenNthCalledWith(
            1,
            'getEligibleCampaigns - unknown operator "I_DONT_EXIST" found in bucketing api answer. Assertion aborted.'
        );

        done();
    });
});

describe('BucketingVisitor - murmur algorithm', () => {
    const expectedIsoAssertions = [
        { '202072017183814142': { bs8r119sbs4016meiiii: 1, bs8qvmo4nlr01fl9bbbb: 4 } },
        { '202072017183860649': { bs8r119sbs4016meiiii: 1, bs8qvmo4nlr01fl9bbbb: 1 } },
        { '202072017183828850': { bs8r119sbs4016meiiii: 1, bs8qvmo4nlr01fl9bbbb: 2 } },
        { '202072017183818733': { bs8r119sbs4016meiiii: 1, bs8qvmo4nlr01fl9bbbb: 4 } },
        { '202072017183823773': { bs8r119sbs4016meiiii: 2, bs8qvmo4nlr01fl9bbbb: 2 } },
        { '202072017183894922': { bs8r119sbs4016meiiii: 1, bs8qvmo4nlr01fl9bbbb: 4 } },
        { '202072017183829817': { bs8r119sbs4016meiiii: 1, bs8qvmo4nlr01fl9bbbb: 1 } },
        { '202072017183842202': { bs8r119sbs4016meiiii: 1, bs8qvmo4nlr01fl9bbbb: 3 } },
        { '202072017233645009': { bs8r119sbs4016meiiii: 2, bs8qvmo4nlr01fl9bbbb: 2 } },
        { '202072017233690230': { bs8r119sbs4016meiiii: 2, bs8qvmo4nlr01fl9bbbb: 1 } },
        { '202072017183886606': { bs8r119sbs4016meiiii: 1, bs8qvmo4nlr01fl9bbbb: 4 } },
        { '202072017183877657': { bs8r119sbs4016meiiii: 1, bs8qvmo4nlr01fl9bbbb: 4 } },
        { '202072017183860380': { bs8r119sbs4016meiiii: 1, bs8qvmo4nlr01fl9bbbb: 1 } },
        { '202072017183972690': { bs8r119sbs4016meiiii: 2, bs8qvmo4nlr01fl9bbbb: 1 } },
        { '202072017183912618': { bs8r119sbs4016meiiii: 1, bs8qvmo4nlr01fl9bbbb: 2 } },
        { '202072017183951364': { bs8r119sbs4016meiiii: 1, bs8qvmo4nlr01fl9bbbb: 3 } },
        { '202072017183920657': { bs8r119sbs4016meiiii: 2, bs8qvmo4nlr01fl9bbbb: 4 } },
        { '202072017183922748': { bs8r119sbs4016meiiii: 2, bs8qvmo4nlr01fl9bbbb: 1 } },
        { '202072017183943575': { bs8r119sbs4016meiiii: 1, bs8qvmo4nlr01fl9bbbb: 3 } },
        { '202072017183987677': { bs8r119sbs4016meiiii: 1, bs8qvmo4nlr01fl9bbbb: 4 } }
    ];
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

    it('should return about 50/50 scenario with 10 000 visitors', (done) => {
        const nbVisitor = 10000;
        const acceptedRange = 1.62; // percent (should fail 1/100)
        const output = murmurAllocationCheck(demoData.bucketing.functions.murmur.defaultArgs, acceptedRange, nbVisitor);
        if (!output.isTestOk) {
            done.fail(output.debug);
        }
        done();
    });

    it('should return about 33/33/34 scenario with 10 000 visitors', (done) => {
        const nbVisitor = 10000;
        const acceptedRange = 0.8; // percent
        const output = murmurAllocationCheck(demoData.bucketing.functions.murmur.threeVariations, acceptedRange, nbVisitor);
        if (!output.isTestOk) {
            done.fail(output.debug);
        }
        done();
    });

    it('should return about 25/25/25/25 scenario with 10 000 visitors', (done) => {
        const nbVisitor = 10000;
        const acceptedRange = 0.8; // percent
        const output = murmurAllocationCheck(demoData.bucketing.functions.murmur.fourVariations, acceptedRange, nbVisitor);
        if (!output.isTestOk) {
            done.fail(output.debug);
        }
        done();
    });

    it('should works with "classical" scenario', (done) => {
        bucketInstance = new BucketingVisitor(
            demoData.envId[0],
            demoData.bucketing.functions.murmur.allocation[24].visitorId,
            demoData.visitor.cleanContext,
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );

        expect(bucketInstance.data).toEqual(null);
        expect(bucketInstance.computedData).toEqual(null);

        initSpyLogs(bucketInstance);
        bucketSpy = jest.spyOn(bucketInstance, 'computeMurmurAlgorithm');
        const result = bucketInstance.computeMurmurAlgorithm(
            demoData.bucketing.functions.murmur.defaultArgs,
            demoData.bucketing.functions.murmur.allocation[24].variationGroup
        ); // private function

        expect(result).toEqual({
            allocation: 50,
            reference: true,
            id: 'bptggipaqi903f3haq20',
            modifications: { type: 'JSON', value: { testCache: null } }
        });

        expect(spyDebugLogs).toHaveBeenCalledTimes(1);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'computeMurmurAlgorithm - murmur returned value="24"');

        done();
    });

    it('should be ISO with other SDK (campaign 50/50)', (done) => {
        try {
            const vgIdToCheck = 'bs8r119sbs4016meiiii';
            expectedIsoAssertions.forEach((assertion) => {
                const assertion_vId = Object.keys(assertion)[0];
                bucketInstance = new BucketingVisitor(
                    demoData.envId[0],
                    assertion_vId,
                    demoData.visitor.cleanContext,
                    bucketingConfig,
                    temporaryGlobalBucketMock as IFlagshipBucketing
                );
                bucketInstance.data = demoData.bucketing.isoSdk_50_50;
                initSpyLogs(bucketInstance);
                const result = bucketInstance.getEligibleCampaigns();
                expect(result.length).toEqual(1);
                expect(result[0].variation.modifications.value.variation50).toEqual(assertion[assertion_vId][vgIdToCheck]);
            });
            done();
        } catch (error) {
            done.fail(error);
        }
    });

    it('should be ISO with other SDK (campaign 25/25/25/25)', (done) => {
        try {
            const vgIdToCheck = 'bs8qvmo4nlr01fl9bbbb';
            expectedIsoAssertions.forEach((assertion) => {
                const assertion_vId = Object.keys(assertion)[0];
                bucketInstance = new BucketingVisitor(
                    demoData.envId[0],
                    assertion_vId,
                    demoData.visitor.cleanContext,
                    bucketingConfig,
                    temporaryGlobalBucketMock as IFlagshipBucketing
                );
                bucketInstance.data = demoData.bucketing.isoSdk_25_25_25_25;
                initSpyLogs(bucketInstance);
                const result = bucketInstance.getEligibleCampaigns();
                expect(result.length).toEqual(1);
                expect(result[0].variation.modifications.value.variation).toEqual(assertion[assertion_vId][vgIdToCheck]);
            });
            done();
        } catch (error) {
            done.fail(error);
        }
    });

    it('should works with a campaign containing a 100% allocation variation', (done) => {
        bucketInstance = new BucketingVisitor(
            demoData.envId[0],
            demoData.bucketing.functions.murmur.allocation[79].visitorId,
            demoData.visitor.cleanContext,
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );

        expect(bucketInstance.data).toEqual(null);
        expect(bucketInstance.computedData).toEqual(null);

        initSpyLogs(bucketInstance);
        bucketSpy = jest.spyOn(bucketInstance, 'computeMurmurAlgorithm');
        const result = bucketInstance.computeMurmurAlgorithm(
            demoData.bucketing.oneCampaignWith100PercentAllocation.campaigns[0].variationGroups[0].variations,
            demoData.bucketing.functions.murmur.allocation[79].variationGroup
        ); // private function

        expect(result).toEqual({
            allocation: 100,
            id: 'bqtvkps9h7j02m34fj4g',
            modifications: { type: 'JSON', value: { Buttoncolor: 'Blue' } }
        });

        expect(spyDebugLogs).toHaveBeenCalledTimes(1);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'computeMurmurAlgorithm - murmur returned value="79"');

        done();
    });

    it('should be SDK ISO (visitorId="toto")', (done) => {
        bucketInstance = new BucketingVisitor(
            demoData.envId[0],
            demoData.bucketing.functions.murmur.allocation[79].visitorId,
            demoData.visitor.cleanContext,
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        initSpyLogs(bucketInstance);
        bucketSpy = jest.spyOn(bucketInstance, 'computeMurmurAlgorithm');
        const result = bucketInstance.computeMurmurAlgorithm(
            demoData.bucketing.functions.murmur.defaultArgs,
            demoData.bucketing.functions.murmur.allocation[79].variationGroup
        ); // private function

        expect(result).toEqual({
            allocation: 50,
            id: 'bptggipaqi903f3haq2g',
            modifications: { type: 'JSON', value: { testCache: 'value' } }
        });

        expect(spyDebugLogs).toHaveBeenCalledTimes(1);
        expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'computeMurmurAlgorithm - murmur returned value="79"');

        done();
    });

    it('should return a variation if visitor is in the traffic allocation according murmur hash and traffic allocation below 100', (done) => {
        bucketInstance = new BucketingVisitor(
            demoData.envId[0],
            demoData.bucketing.functions.murmur.allocation[79].visitorId,
            demoData.visitor.cleanContext,
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        initSpyLogs(bucketInstance);
        bucketSpy = jest.spyOn(bucketInstance, 'computeMurmurAlgorithm');
        const result = bucketInstance.computeMurmurAlgorithm(
            demoData.bucketing.functions.murmur.lowTraffic,
            demoData.bucketing.functions.murmur.allocation[79].variationGroup
        ); // private function

        expect(result).toEqual({
            allocation: 30,
            id: 'bptggipaqi903f3haq2g',
            modifications: { type: 'JSON', value: { testCache: 'value' } }
        });

        expect(spyDebugLogs).toHaveBeenCalledTimes(2);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'computeMurmurAlgorithm - murmur returned value="79"');
        expect(spyDebugLogs).toHaveBeenNthCalledWith(2, 'computeMurmurAlgorithm - the total variation traffic allocation is equal to "80"');

        done();
    });

    it('should return null and print a log if visitor is NOT in the traffic allocation according murmur hash and traffic allocation below 100', (done) => {
        bucketInstance = new BucketingVisitor(
            demoData.envId[0],
            demoData.bucketing.functions.murmur.allocation[99].visitorId,
            demoData.visitor.cleanContext,
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        initSpyLogs(bucketInstance);
        bucketSpy = jest.spyOn(bucketInstance, 'computeMurmurAlgorithm');
        const result = bucketInstance.computeMurmurAlgorithm(
            demoData.bucketing.functions.murmur.extremLowTraffic,
            demoData.bucketing.functions.murmur.allocation[99].variationGroup
        ); // private function

        expect(result).toEqual(null);

        expect(spyDebugLogs).toHaveBeenCalledTimes(2);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(1);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'computeMurmurAlgorithm - murmur returned value="99"');
        expect(spyDebugLogs).toHaveBeenNthCalledWith(2, 'computeMurmurAlgorithm - the total variation traffic allocation is equal to "14"');
        expect(spyInfoLogs).toHaveBeenNthCalledWith(
            1,
            'computeMurmurAlgorithm - current visitor will be untracked as it is outside the total variation traffic allocation'
        );

        done();
    });

    it('should return null and print an error log if traffic allocation is greater than 100', (done) => {
        bucketInstance = new BucketingVisitor(
            demoData.envId[0],
            demoData.bucketing.functions.murmur.allocation[31].visitorId,
            demoData.visitor.cleanContext,
            bucketingConfig,
            temporaryGlobalBucketMock as IFlagshipBucketing
        );
        initSpyLogs(bucketInstance);
        bucketSpy = jest.spyOn(bucketInstance, 'computeMurmurAlgorithm');
        const result = bucketInstance.computeMurmurAlgorithm(
            demoData.bucketing.functions.murmur.badTraffic,
            demoData.bucketing.functions.murmur.allocation[31].variationGroup
        ); // private function

        expect(result).toEqual(null);

        expect(spyDebugLogs).toHaveBeenCalledTimes(1);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(1);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'computeMurmurAlgorithm - murmur returned value="31"');
        expect(spyFatalLogs).toHaveBeenNthCalledWith(
            1,
            'computeMurmurAlgorithm - the total variation traffic allocation is equal to "105" instead of being equal to "100"'
        );

        done();
    });
});
