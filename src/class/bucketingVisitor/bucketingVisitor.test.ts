import mockAxios from 'jest-mock-axios';
import { HttpResponse } from 'jest-mock-axios/dist/lib/mock-axios-types';

import demoData from '../../../test/mock/demoData';
import testConfig from '../../config/test';
import { FlagshipSdkConfig, IFlagship, IFlagshipBucketingVisitor, IFlagshipVisitor } from '../../types';
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
let bucketingEventMockResponse: HttpResponse;

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

const expectedRequestHeaderFirstCall = { headers: { 'If-Modified-Since': '' } };
const expectedRequestHeaderNotFirstCall = { headers: { 'If-Modified-Since': 'Wed, 18 Mar 2020 23:29:16 GMT' } };

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

describe('BucketingVisitor - callEventEndpoint', () => {
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

    it('should notify when fail with api v2 and apiKey is missing', (done) => {
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], demoData.visitor.cleanContext, {
            ...bucketingConfig,
            flagshipApi: 'https://decision.flagship.io/v2/'
        });
        initSpyLogs(bucketInstance);
        bucketInstance
            .callEventEndpoint()
            .then(() => {
                done.fail('callEventEndpoint not supposed to be here');
            })
            .catch((e) => {
                expect(e).toEqual('server crashed');
                expect(spyFatalLogs).toHaveBeenCalledTimes(1);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyErrorLogs).toHaveBeenCalledTimes(1);
                expect(spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyErrorLogs).toHaveBeenNthCalledWith(1, 'callEventEndpoint - failed with error="server crashed"');

                done();
            });

        mockAxios.mockError('server crashed');
    });

    it('should notify when fail with api v2', (done) => {
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], demoData.visitor.cleanContext, {
            ...bucketingConfig,
            flagshipApi: 'https://decision.flagship.io/v2/',
            apiKey: 'toto'
        });
        initSpyLogs(bucketInstance);
        bucketInstance
            .callEventEndpoint()
            .then(() => {
                done.fail('callEventEndpoint not supposed to be here');
            })
            .catch((e) => {
                expect(e).toEqual('server crashed');
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyErrorLogs).toHaveBeenCalledTimes(1);
                expect(spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyErrorLogs).toHaveBeenNthCalledWith(1, 'callEventEndpoint - failed with error="server crashed"');

                done();
            });

        mockAxios.mockError('server crashed');
    });

    it('should notify when fail with api v1', (done) => {
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], demoData.visitor.cleanContext, {
            ...bucketingConfig
        });
        initSpyLogs(bucketInstance);
        bucketInstance
            .callEventEndpoint()
            .then(() => {
                done.fail('callEventEndpoint not supposed to be here');
            })
            .catch((e) => {
                expect(e).toEqual('server crashed');
                expect(spyFatalLogs).toHaveBeenCalledTimes(0);
                expect(spyInfoLogs).toHaveBeenCalledTimes(0);
                expect(spyErrorLogs).toHaveBeenCalledTimes(1);
                expect(spyDebugLogs).toHaveBeenCalledTimes(0);
                expect(spyWarnLogs).toHaveBeenCalledTimes(0);

                expect(spyErrorLogs).toHaveBeenNthCalledWith(1, 'callEventEndpoint - failed with error="server crashed"');

                done();
            });

        mockAxios.mockError('server crashed');
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
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], demoData.visitor.cleanContext, bucketingConfig);
        initSpyLogs(bucketInstance);
        expect(bucketInstance.visitorContext).toEqual(demoData.visitor.cleanContext);
        bucketInstance.updateVisitorContext({ isVip: false });
        expect(bucketInstance.visitorContext).toEqual({ isVip: false });
        done();
    });

    it('should filter bad values', (done) => {
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], demoData.visitor.cleanContext, bucketingConfig);
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
            bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], bucketingContext, bucketingConfig);
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
        bucketingEventMockResponse = { status: 204, data: {} };
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], demoData.visitor.cleanContext, bucketingConfig);
        bucketInstance.data = bucketingApiMockResponse;
        initSpyLogs(bucketInstance);
        const result = bucketInstance.getEligibleCampaigns();

        mockAxios.mockResponse(bucketingEventMockResponse);

        expect(mockAxios.post).toHaveBeenNthCalledWith(1, `${bucketInstance.config.flagshipApi}${bucketInstance.envId}/events`, {
            data: { ...bucketInstance.visitorContext },
            type: 'CONTEXT',
            visitor_id: bucketInstance.visitorId
        });

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

        expect(spyDebugLogs).toHaveBeenCalledTimes(5);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        expect(spyDebugLogs).toHaveBeenNthCalledWith(5, 'callEventEndpoint - returns status=204');

        done();
    });

    it('should expect correct behavior when bucket api return no data', (done) => {
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], demoData.visitor.cleanContext, bucketingConfig);
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
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], { foo1: 'yes1' }, bucketingConfig);
        bucketInstance.data = bucketingApiMockResponse;
        const bucketInstance2 = new BucketingVisitor(
            demoData.envId[0],
            demoData.visitor.id[0],
            { foo1: 'NOPE', foo2: 'yes2' },
            bucketingConfig
        );
        bucketInstance2.data = bucketingApiMockResponse;
        const bucketInstance3 = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], { foo3: 'yes3' }, bucketingConfig);
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
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], { foo1: 'yes1' }, bucketingConfig);
        bucketInstance.data = bucketingApiMockResponse;
        const bucketInstance2 = new BucketingVisitor(
            demoData.envId[0],
            demoData.visitor.id[0],
            { foo1: 'yes1', isVip: true },
            bucketingConfig
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
            demoData.visitor.id[0],
            {
                lowerThanBadType: 123,
                lowerThanBadTypeArray: 0,
                lowerThanBadTypeJson: 2
            },
            bucketingConfig
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
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], {}, bucketingConfig);
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
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], {}, bucketingConfig);
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

    it('should expect correct behavior for "bad murmur allocation" data received', (done) => {
        bucketingApiMockResponse = demoData.bucketing.oneCampaignWithBadTraffic as BucketingApiResponse;
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], {}, bucketingConfig);
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
        expect(spyDebugLogs).toHaveBeenNthCalledWith(2, 'computeMurmurAlgorithm - murmur returned value="79"');
        expect(spyDebugLogs).toHaveBeenNthCalledWith(
            3,
            'computeMurmurAlgorithm - Unable to find the corresponding variation (campaignId="bptggipaqi903f3haq0g") using murmur for visitor (id="test-perf"). This visitor will be untracked.'
        );
        expect(spyFatalLogs).toHaveBeenNthCalledWith(
            1,
            'computeMurmurAlgorithm - the total variation traffic allocation is equal to "110" instead of being equal to "100"'
        );

        done();
    });

    it('should expect correct behavior for "unknown operator" data received', (done) => {
        bucketingApiMockResponse = demoData.bucketing.badOperator as BucketingApiResponse;
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], { isVip: false }, bucketingConfig);
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
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], demoData.visitor.cleanContext, bucketingConfig);

        expect(bucketInstance.data).toEqual(null);
        expect(bucketInstance.computedData).toEqual(null);

        initSpyLogs(bucketInstance);
        bucketSpy = jest.spyOn(bucketInstance, 'computeMurmurAlgorithm');
        const result = bucketInstance.computeMurmurAlgorithm(demoData.bucketing.functions.murmur.defaultArgs); // private function

        expect(result).toEqual({
            allocation: 50,
            id: 'bptggipaqi903f3haq2g',
            modifications: { type: 'JSON', value: { testCache: 'value' } }
        });

        expect(spyDebugLogs).toHaveBeenCalledTimes(1);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'computeMurmurAlgorithm - murmur returned value="79"');

        done();
    });

    it('should works with a campaign containing a 100% allocation variation', (done) => {
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], demoData.visitor.cleanContext, bucketingConfig);

        expect(bucketInstance.data).toEqual(null);
        expect(bucketInstance.computedData).toEqual(null);

        initSpyLogs(bucketInstance);
        bucketSpy = jest.spyOn(bucketInstance, 'computeMurmurAlgorithm');
        const result = bucketInstance.computeMurmurAlgorithm(
            demoData.bucketing.oneCampaignWith100PercentAllocation.campaigns[0].variationGroups[0].variations
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
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], demoData.visitor.cleanContext, bucketingConfig);
        initSpyLogs(bucketInstance);
        bucketSpy = jest.spyOn(bucketInstance, 'computeMurmurAlgorithm');
        const result = bucketInstance.computeMurmurAlgorithm(demoData.bucketing.functions.murmur.defaultArgs); // private function

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
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], demoData.visitor.cleanContext, bucketingConfig);
        initSpyLogs(bucketInstance);
        bucketSpy = jest.spyOn(bucketInstance, 'computeMurmurAlgorithm');
        const result = bucketInstance.computeMurmurAlgorithm(demoData.bucketing.functions.murmur.lowTraffic); // private function

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
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], demoData.visitor.cleanContext, bucketingConfig);
        initSpyLogs(bucketInstance);
        bucketSpy = jest.spyOn(bucketInstance, 'computeMurmurAlgorithm');
        const result = bucketInstance.computeMurmurAlgorithm(demoData.bucketing.functions.murmur.extremLowTraffic); // private function

        expect(result).toEqual(null);

        expect(spyDebugLogs).toHaveBeenCalledTimes(2);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(1);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'computeMurmurAlgorithm - murmur returned value="79"');
        expect(spyDebugLogs).toHaveBeenNthCalledWith(2, 'computeMurmurAlgorithm - the total variation traffic allocation is equal to "14"');
        expect(spyInfoLogs).toHaveBeenNthCalledWith(
            1,
            'computeMurmurAlgorithm - current visitor will be untracked as it is outside the total variation traffic allocation'
        );

        done();
    });

    it('should return null and print an error log if traffic allocation is greater than 100', (done) => {
        bucketInstance = new BucketingVisitor(demoData.envId[0], demoData.visitor.id[0], demoData.visitor.cleanContext, bucketingConfig);
        initSpyLogs(bucketInstance);
        bucketSpy = jest.spyOn(bucketInstance, 'computeMurmurAlgorithm');
        const result = bucketInstance.computeMurmurAlgorithm(demoData.bucketing.functions.murmur.badTraffic); // private function

        expect(result).toEqual(null);

        expect(spyDebugLogs).toHaveBeenCalledTimes(1);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(1);
        expect(spyInfoLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        expect(spyDebugLogs).toHaveBeenNthCalledWith(1, 'computeMurmurAlgorithm - murmur returned value="79"');
        expect(spyFatalLogs).toHaveBeenNthCalledWith(
            1,
            'computeMurmurAlgorithm - the total variation traffic allocation is equal to "105" instead of being equal to "100"'
        );

        done();
    });
});
