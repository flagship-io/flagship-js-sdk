import { FsLogger } from '@flagship.io/js-sdk-logs';
import { MurmurHashV3 } from 'react-native-murmurhash';
import { FlagshipSdkConfig, IFlagshipBucketingVisitor, IFlagshipBucketing, IFsCacheManager, IFsPanicMode } from '../../types';
import { FlagshipVisitorContext, DecisionApiCampaign, DecisionApiResponseData } from '../flagshipVisitor/types';
import {
    BucketingVariation,
    BucketingApiResponse,
    BucketingOperator,
    BucketingTargetings,
    BucketingTypes,
    BucketingCampaign
} from '../bucketing/types';

import loggerHelper from '../../lib/loggerHelper';
import flagshipSdkHelper from '../../lib/flagshipSdkHelper';

class BucketingVisitor implements IFlagshipBucketingVisitor {
    data: BucketingApiResponse | null;

    computedData: DecisionApiResponseData | null;

    log: FsLogger;

    cacheManager: IFsCacheManager;

    envId: string;

    config: FlagshipSdkConfig;

    visitorId: string;

    visitorContext: FlagshipVisitorContext;

    global: IFlagshipBucketing;

    panic: IFsPanicMode;

    constructor(
        envId: string,
        visitorId: string,
        visitorContext: FlagshipVisitorContext,
        config: FlagshipSdkConfig,
        globalBucket: IFlagshipBucketing,
        optional?: {
            cacheManager?: IFsCacheManager | null;
            panic?: IFsPanicMode | null; // NOTE: actually not used but must be never null if it's not the case anymore
        }
    ) {
        // const defaultOptionalValue = {
        //     cacheManager: null,
        //     panic: null
        // };
        // const { cacheManager, panic } = { ...defaultOptionalValue, ...optional };
        const bucketingData = globalBucket.data;
        this.config = config;
        this.visitorId = visitorId;
        this.visitorContext = visitorContext;
        this.global = globalBucket;
        this.log = loggerHelper.getLogger(this.config, `Flagship SDK - Bucketing (visitorId=${this.visitorId})`);
        this.envId = envId;
        this.data = bucketingData || null;
        this.computedData = bucketingData ? { visitorId: this.visitorId, campaigns: this.getEligibleCampaigns() } : null;
    }

    static transformIntoDecisionApiPayload(
        variation: BucketingVariation,
        campaign: BucketingCampaign,
        variationGroupId: string
    ): DecisionApiCampaign {
        return {
            id: campaign.id,
            variationGroupId,
            variation: {
                id: variation.id,
                // reference: variation.reference,
                modifications: {
                    ...variation.modifications
                }
            }
        };
    }

    public updateCache(): boolean {
        if (this.data !== this.global.data) {
            this.log.debug('Updating cache.');
            this.data = this.global.data;
            this.computedData = { visitorId: this.visitorId, campaigns: this.getEligibleCampaigns() };

            return true; // an update has been done
        }
        return true; // no updates needed
    }

    public updateVisitorContext(newContext: FlagshipVisitorContext): void {
        this.log.debug(`Updating bucketing visitor context from ${JSON.stringify(this.visitorContext)} to ${JSON.stringify(newContext)}`);
        this.visitorContext = flagshipSdkHelper.checkVisitorContext(newContext, this.log);
    }

    private computeMurmurAlgorithm(variations: BucketingVariation[], variationGroupId: string): BucketingVariation | null {
        let assignedVariation: BucketingVariation | null = null;
        // generates a v3 hash
        const murmurAllocation = MurmurHashV3(variationGroupId + this.visitorId, undefined) % 100; // 2nd argument is set to 0 by default
        this.log.debug(`computeMurmurAlgorithm - murmur returned value="${murmurAllocation}"`);

        const variationTrafficCheck = variations.reduce((sum, v) => {
            const variationAllocation = v.allocation || 0;
            const nextSum = variationAllocation + sum;
            if (assignedVariation === null && murmurAllocation < nextSum) {
                assignedVariation = v;
            }
            return nextSum;
        }, 0);

        if (variationTrafficCheck < 100) {
            this.log.debug(`computeMurmurAlgorithm - the total variation traffic allocation is equal to "${variationTrafficCheck}"`);
            if (assignedVariation === null) {
                this.log.info(
                    `computeMurmurAlgorithm - current visitor will be untracked as it is outside the total variation traffic allocation`
                );
            }
        }
        if (variationTrafficCheck > 100) {
            this.log.fatal(
                `computeMurmurAlgorithm - the total variation traffic allocation is equal to "${variationTrafficCheck}" instead of being equal to "100"`
            );
            return null;
        }

        return assignedVariation;
    }

    public getEligibleCampaigns(): DecisionApiCampaign[] {
        const result: DecisionApiCampaign[] = [];
        const { visitorId, visitorContext, log, data: bucketingData } = this;
        const reportIssueBetweenValueTypeAndOperator = (type: string, operator: BucketingOperator): void => {
            log.warn(`getEligibleCampaigns - operator "${operator}" is not supported for type "${type}". Assertion aborted.`);
        };
        const checkAssertion = <T>(vcValue: T, apiValueArray: T[], assertionCallback: (a: T, b: T) => boolean): boolean =>
            apiValueArray.map((apiValue) => assertionCallback(vcValue, apiValue)).filter((answer) => answer === true).length > 0;
        const computeAssertion = ({ operator, key, value }: BucketingTargetings, compareWithVisitorId: boolean): boolean => {
            const vtc = compareWithVisitorId ? visitorId : visitorContext[key]; // vtc = 'value to compare'
            if (typeof vtc === 'undefined' || vtc === null) {
                log.debug(`getEligibleCampaigns - Assertion aborted because visitor context key (="${key}") does not exist`);
                return false;
            }
            const checkTypeMatch = (vcValue: string | number | boolean, apiValue: BucketingTypes, vcKey: string): boolean => {
                if (typeof apiValue !== 'object' && typeof vcValue !== typeof apiValue) {
                    log.error(
                        `getEligibleCampaigns - The bucketing API returned a value which have not the same type ("${typeof vcValue}") as the visitor context key="${vcKey}"`
                    );
                    return false;
                }
                if (typeof apiValue === 'object' && !Array.isArray(apiValue)) {
                    log.error('getEligibleCampaigns - The bucketing API returned a json object which is not supported by the SDK.');
                    return false;
                }
                if (Array.isArray(apiValue)) {
                    if ((apiValue as []).filter((v) => typeof v !== typeof vcValue).length > 0) {
                        log.error(
                            `getEligibleCampaigns - The bucketing API returned an array where some elements do not have same type ("${typeof vcValue}") as the visitor context key="${vcKey}"`
                        );
                        return false;
                    }
                }
                return true;
            };
            switch (operator) {
                case 'EQUALS':
                    if (Array.isArray(value)) {
                        return checkAssertion<string | boolean | number>(vtc, value, (a, b) => a === b);
                    }
                    return vtc === value;
                case 'NOT_EQUALS':
                    if (Array.isArray(value)) {
                        return checkAssertion<string | boolean | number>(vtc, value, (a, b) => a !== b);
                    }
                    return vtc !== value;
                case 'LOWER_THAN':
                    if (checkTypeMatch(vtc, value, key)) {
                        switch (typeof vtc) {
                            case 'string':
                                if (Array.isArray(value)) {
                                    return checkAssertion<string>(
                                        vtc as string,
                                        value as string[],
                                        (a, b) => a.toLowerCase() < b.toLowerCase()
                                    );
                                }
                                return (vtc as string).toLowerCase() < (value as string).toLowerCase();
                            case 'number':
                                if (Array.isArray(value)) {
                                    return checkAssertion<boolean | number>(
                                        vtc as boolean | number,
                                        value as (boolean | number)[],
                                        (a, b) => a < b
                                    );
                                }
                                return vtc < value;
                            case 'boolean':
                            default:
                                reportIssueBetweenValueTypeAndOperator('boolean', 'LOWER_THAN');
                                return false;
                        }
                    } else {
                        return false; // error message send with "checkTypeMatch" function
                    }
                case 'LOWER_THAN_OR_EQUALS':
                    if (checkTypeMatch(vtc, value, key)) {
                        switch (typeof vtc) {
                            case 'string':
                                if (Array.isArray(value)) {
                                    return checkAssertion<string>(
                                        vtc as string,
                                        value as string[],
                                        (a, b) => a.toLowerCase() <= b.toLowerCase()
                                    );
                                }
                                return (vtc as string).toLowerCase() <= (value as string).toLowerCase();
                            case 'number':
                                if (Array.isArray(value)) {
                                    return checkAssertion<boolean | number>(
                                        vtc as boolean | number,
                                        value as (boolean | number)[],
                                        (a, b) => a <= b
                                    );
                                }
                                return vtc <= value;
                            case 'boolean':
                            default:
                                reportIssueBetweenValueTypeAndOperator('boolean', 'LOWER_THAN_OR_EQUALS');
                                return false;
                        }
                    } else {
                        return false; // error message send with "checkTypeMatch" function
                    }
                case 'GREATER_THAN':
                    if (checkTypeMatch(vtc, value, key)) {
                        switch (typeof vtc) {
                            case 'string':
                                if (Array.isArray(value)) {
                                    return checkAssertion<string>(
                                        vtc as string,
                                        value as string[],
                                        (a, b) => a.toLowerCase() > b.toLowerCase()
                                    );
                                }
                                return (vtc as string).toLowerCase() > (value as string).toLowerCase();
                            case 'number':
                                if (Array.isArray(value)) {
                                    return checkAssertion<boolean | number>(
                                        vtc as boolean | number,
                                        value as (boolean | number)[],
                                        (a, b) => a > b
                                    );
                                }
                                return vtc > value;
                            case 'boolean':
                            default:
                                reportIssueBetweenValueTypeAndOperator('boolean', 'GREATER_THAN');
                                return false;
                        }
                    } else {
                        return false; // error message send with "checkTypeMatch" function
                    }
                case 'GREATER_THAN_OR_EQUALS':
                    if (checkTypeMatch(vtc, value, key)) {
                        switch (typeof vtc) {
                            case 'string':
                                if (Array.isArray(value)) {
                                    return checkAssertion<string>(
                                        vtc as string,
                                        value as string[],
                                        (a, b) => a.toLowerCase() >= b.toLowerCase()
                                    );
                                }
                                return (vtc as string).toLowerCase() >= (value as string).toLowerCase();
                            case 'number':
                                if (Array.isArray(value)) {
                                    return checkAssertion<boolean | number>(
                                        vtc as boolean | number,
                                        value as (boolean | number)[],
                                        (a, b) => a >= b
                                    );
                                }
                                return vtc >= value;
                            case 'boolean':
                            default:
                                reportIssueBetweenValueTypeAndOperator('boolean', 'GREATER_THAN_OR_EQUALS');
                                return false;
                        }
                    } else {
                        return false; // error message send with "checkTypeMatch" function
                    }

                case 'STARTS_WITH':
                    if (checkTypeMatch(vtc, value, key)) {
                        switch (typeof vtc) {
                            case 'string':
                                if (Array.isArray(value)) {
                                    return checkAssertion<string>(vtc as string, value as string[], (a, b) =>
                                        (a as string).toLowerCase().startsWith((b as string).toLowerCase())
                                    );
                                }
                                return (vtc as string).toLowerCase().startsWith((value as string).toLowerCase());
                            case 'number':
                                reportIssueBetweenValueTypeAndOperator('number', 'STARTS_WITH');
                                return false;
                            case 'boolean':
                            default:
                                reportIssueBetweenValueTypeAndOperator('boolean', 'STARTS_WITH');
                                return false;
                        }
                    } else {
                        return false; // error message send with "checkTypeMatch" function
                    }
                case 'ENDS_WITH':
                    if (checkTypeMatch(vtc, value, key)) {
                        switch (typeof vtc) {
                            case 'string':
                                if (Array.isArray(value)) {
                                    return checkAssertion<string>(vtc as string, value as string[], (a, b) =>
                                        (a as string).toLowerCase().endsWith((b as string).toLowerCase())
                                    );
                                }
                                return (vtc as string).toLowerCase().endsWith((value as string).toLowerCase());
                            case 'number':
                                reportIssueBetweenValueTypeAndOperator('number', 'ENDS_WITH');
                                return false;
                            case 'boolean':
                            default:
                                reportIssueBetweenValueTypeAndOperator('boolean', 'ENDS_WITH');
                                return false;
                        }
                    } else {
                        return false; // error message send with "checkTypeMatch" function
                    }
                case 'CONTAINS':
                    if (checkTypeMatch(vtc, value, key)) {
                        switch (typeof vtc) {
                            case 'string':
                                if (Array.isArray(value)) {
                                    return checkAssertion<string>(vtc as string, value as string[], (a, b) =>
                                        (a as string).toLowerCase().includes((b as string).toLowerCase())
                                    );
                                }
                                return (vtc as string).toLowerCase().includes((value as string).toLowerCase());
                            case 'number':
                                reportIssueBetweenValueTypeAndOperator('number', 'CONTAINS');
                                return false;
                            case 'boolean':
                            default:
                                reportIssueBetweenValueTypeAndOperator('boolean', 'CONTAINS');
                                return false;
                        }
                    } else {
                        return false; // error message send with "checkTypeMatch" function
                    }
                case 'NOT_CONTAINS':
                    if (checkTypeMatch(vtc, value, key)) {
                        switch (typeof vtc) {
                            case 'string':
                                if (Array.isArray(value)) {
                                    return checkAssertion<string>(
                                        vtc as string,
                                        value as string[],
                                        (a, b) => !(a as string).toLowerCase().includes((b as string).toLowerCase())
                                    );
                                }
                                return !(vtc as string).toLowerCase().includes((value as string).toLowerCase());
                            case 'number':
                                reportIssueBetweenValueTypeAndOperator('number', 'NOT_CONTAINS');
                                return false;
                            case 'boolean':
                            default:
                                reportIssueBetweenValueTypeAndOperator('boolean', 'NOT_CONTAINS');
                                return false;
                        }
                    } else {
                        return false; // error message send with "checkTypeMatch" function
                    }
                default:
                    log.error(`getEligibleCampaigns - unknown operator "${operator}" found in bucketing api answer. Assertion aborted.`);
                    return false;
            }
        };
        if (!bucketingData || !bucketingData.campaigns) {
            log.warn('getEligibleCampaigns - no bucketing data found');
            return result;
        }
        bucketingData.campaigns.forEach((campaign) => {
            let matchingVgId: string | null = null;

            // take the FIRST variation group which match the visitor context
            campaign.variationGroups.forEach((vg) => {
                if (matchingVgId === null) {
                    const operatorOrBox: boolean[] = [];
                    // each variation group is a 'OR' condition
                    vg.targeting.targetingGroups.forEach((tg) => {
                        const operatorAndBox: boolean[] = [];
                        // each variation group is a 'OR' condition
                        tg.targetings.forEach((targeting) => {
                            switch (targeting.key) {
                                case 'fs_all_users':
                                    operatorAndBox.push(true);
                                    break;
                                case 'fs_users':
                                    operatorAndBox.push(computeAssertion(targeting, true));
                                    break;
                                default:
                                    operatorAndBox.push(computeAssertion(targeting, false));
                                    break;
                            }
                        });
                        operatorOrBox.push(operatorAndBox.filter((answer) => answer !== true).length === 0);
                    });
                    matchingVgId = operatorOrBox.filter((answer) => answer === true).length > 0 ? vg.id : null;
                }
            });
            if (matchingVgId !== null) {
                log.debug(`Bucketing - campaign (id="${campaign.id}") is matching visitor context`);
                const cleanCampaign = {
                    ...campaign,
                    variationGroups: campaign.variationGroups.filter((varGroup) => varGroup.id === matchingVgId)
                }; // = campaign with only the desired variation group
                const variationToAffectToVisitor = this.computeMurmurAlgorithm(cleanCampaign.variationGroups[0].variations, matchingVgId);
                if (variationToAffectToVisitor !== null) {
                    result.push(BucketingVisitor.transformIntoDecisionApiPayload(variationToAffectToVisitor, campaign, matchingVgId));
                } else {
                    log.debug(
                        `computeMurmurAlgorithm - Unable to find the corresponding variation (campaignId="${campaign.id}") using murmur for visitor (id="${visitorId}"). This visitor will be untracked.`
                    );
                }
            } else {
                log.debug(`Bucketing - campaign (id="${campaign.id}") NOT MATCHING visitor`);
            }
        });
        return result;
    }
}

export default BucketingVisitor;
