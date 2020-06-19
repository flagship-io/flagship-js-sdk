import { EventEmitter } from 'events';
import { FsLogger } from '@flagship.io/js-sdk-logs';
import Axios, { AxiosResponse } from 'axios';
import * as murmurhash from 'murmurhash';
import { DecisionApiCampaign, DecisionApiResponseData, FlagshipVisitorContext } from '../flagshipVisitor/flagshipVisitor.d';

import {
    BucketingApiResponse,
    BucketingOperator,
    BucketingTargetings,
    BucketingTypes,
    BucketingVariation,
    BucketingCampaign
} from './bucketing.d';
import { IFlagshipBucketing, FlagshipSdkConfig } from '../../index.d';
import loggerHelper from '../../lib/loggerHelper';
import { internalConfig } from '../../config/default';

class Bucketing extends EventEmitter implements IFlagshipBucketing {
    data: BucketingApiResponse | null;

    computedData: DecisionApiResponseData | null;

    visitorId: string;

    log: FsLogger;

    envId: string;

    visitorContext: FlagshipVisitorContext;

    config: FlagshipSdkConfig;

    constructor(envId: string, config: FlagshipSdkConfig, visitorId: string, visitorContext: FlagshipVisitorContext = {}) {
        super();
        this.config = config;
        this.visitorId = visitorId;
        this.log = loggerHelper.getLogger(this.config, `Flagship SDK - Bucketing (vId=${this.visitorId})`);
        this.envId = envId;
        this.visitorContext = visitorContext;
        this.data = null;
        this.computedData = null;
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

    private computeMurmurAlgorithm(variations: BucketingVariation[]): BucketingVariation | null {
        let assignedVariation: BucketingVariation | null = null;
        // generates a v3 hash
        const murmurAllocation = murmurhash.v3(this.visitorId) % 100; // 2nd argument is set to 0 by default
        this.log.debug(`computeMurmurAlgorithm - murmur returned value="${murmurAllocation}"`);

        const variationTrafficCheck = variations.reduce((sum, v) => {
            const nextSum = v.allocation + sum;
            if (murmurAllocation < nextSum) {
                assignedVariation = v;
            }
            return nextSum;
        }, 0);

        if (variationTrafficCheck !== 100) {
            this.log.fatal(
                `computeMurmurAlgorithm - the variation traffic is equal to "${variationTrafficCheck}" instead of being equal to "100"`
            );
            return null;
        }

        return assignedVariation;
    }

    private getEligibleCampaigns(bucketingData: BucketingApiResponse): DecisionApiCampaign[] {
        const result: DecisionApiCampaign[] = [];
        const reportIssueBetweenValueTypeAndOperator = (type: string, operator: BucketingOperator): void => {
            this.log.warn(`getEligibleCampaigns - operator "${operator}" is not supported for type "${type}". Assertion aborted.`);
        };
        const reportUnexpectedVisitorContextKeyType = (str: string): void => {
            this.log.fatal(
                `getEligibleCampaigns - unexpected visitor context key type ("${str}"). This type is not supported. Assertion aborted.`
            );
        };
        const checkAssertion = <T>(vcValue: T, apiValueArray: T[], assertionCallback: (a: T, b: T) => boolean): boolean =>
            apiValueArray.map((apiValue) => assertionCallback(vcValue, apiValue)).filter((answer) => answer === true).length > 0;
        const computeAssertion = ({ operator, key, value }: BucketingTargetings, compareWithVisitorId: boolean): boolean => {
            const vtc = compareWithVisitorId ? this.visitorId : this.visitorContext[key]; // vtc = 'value to compare'
            if (typeof vtc === 'undefined' || vtc === null) {
                this.log.debug(`getEligibleCampaigns - Assertion aborted because visitor context key (="${key}") does not exist`);
                return false;
            }
            const checkTypeMatch = (vcValue: string | number | boolean, apiValue: BucketingTypes, vcKey: string): boolean => {
                if (typeof apiValue !== 'object' && typeof vcValue !== typeof apiValue) {
                    this.log.error(
                        `getEligibleCampaigns - The bucketing API returned a value which have not the same type ("${typeof vcValue}") as the visitor context key="${vcKey}"`
                    );
                    return false;
                }
                if (typeof apiValue === 'object' && !Array.isArray(apiValue)) {
                    this.log.error('getEligibleCampaigns - The bucketing API returned a json object which is not supported by the SDK.');
                    return false;
                }
                if (Array.isArray(apiValue)) {
                    if ((apiValue as []).filter((v) => typeof v !== typeof vcValue).length > 0) {
                        this.log.error(
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
                                reportIssueBetweenValueTypeAndOperator('boolean', 'LOWER_THAN');
                                return false;
                            default:
                                reportUnexpectedVisitorContextKeyType(typeof vtc);
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
                                reportIssueBetweenValueTypeAndOperator('boolean', 'LOWER_THAN_OR_EQUALS');
                                return false;
                            default:
                                reportUnexpectedVisitorContextKeyType(typeof vtc);
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
                                reportIssueBetweenValueTypeAndOperator('boolean', 'GREATER_THAN');
                                return false;
                            default:
                                reportUnexpectedVisitorContextKeyType(typeof vtc);
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
                                reportIssueBetweenValueTypeAndOperator('boolean', 'GREATER_THAN_OR_EQUALS');
                                return false;
                            default:
                                reportUnexpectedVisitorContextKeyType(typeof vtc);
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
                                reportIssueBetweenValueTypeAndOperator('boolean', 'STARTS_WITH');
                                return false;
                            default:
                                reportUnexpectedVisitorContextKeyType(typeof vtc);
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
                                reportIssueBetweenValueTypeAndOperator('boolean', 'ENDS_WITH');
                                return false;
                            default:
                                reportUnexpectedVisitorContextKeyType(typeof vtc);
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
                                reportIssueBetweenValueTypeAndOperator('boolean', 'CONTAINS');
                                return false;
                            default:
                                reportUnexpectedVisitorContextKeyType(typeof vtc);
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
                                reportIssueBetweenValueTypeAndOperator('boolean', 'NOT_CONTAINS');
                                return false;
                            default:
                                reportUnexpectedVisitorContextKeyType(typeof vtc);
                                return false;
                        }
                    } else {
                        return false; // error message send with "checkTypeMatch" function
                    }
                default:
                    this.log.error(
                        `getEligibleCampaigns - unknown operator "${operator}" found in bucketing api answer. Assertion aborted.`
                    );
                    return false;
            }
        };
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
                this.log.debug(`Bucketing - campaign (id="${campaign.id}") is matching visitor context`);
                const cleanCampaign = {
                    ...campaign,
                    variationGroups: campaign.variationGroups.filter((varGroup) => varGroup.id === matchingVgId)
                }; // = campaign with only the desired variation group
                const variationToAffectToVisitor = this.computeMurmurAlgorithm(cleanCampaign.variationGroups[0].variations);
                if (variationToAffectToVisitor !== null) {
                    result.push(Bucketing.transformIntoDecisionApiPayload(variationToAffectToVisitor, campaign, matchingVgId));
                } else {
                    this.log.fatal(
                        `computeMurmurAlgorithm - Unable to find the corresponding variation (campaignId="${campaign.id}") using murmur for visitor (id="${this.visitorId}")`
                    );
                }
            } else {
                this.log.debug(`Bucketing - campaign (id="${campaign.id}") NOT MATCHING visitor`);
            }
        });
        return result;
    }

    public launch(): Promise<BucketingApiResponse | void> {
        return Axios.get(internalConfig.bucketingEndpoint.replace('@ENV_ID@', this.envId))
            .then(({ data: bucketingData }: AxiosResponse<BucketingApiResponse>) => {
                if (bucketingData.panic) {
                    this.log.warn('Panic mode detected, running SDK in safe mode...');
                } else {
                    const computedCampaigns: DecisionApiCampaign[] = this.getEligibleCampaigns(bucketingData);
                    this.data = { ...bucketingData };
                    this.computedData = { visitorId: this.visitorId, campaigns: [...computedCampaigns] };
                    this.log.info(`launch - ${this.computedData.campaigns.length} campaign(s) found matching current visitor`);
                }
                this.emit('launched');
                return bucketingData;
            })
            .catch((response: Error) => {
                this.log.fatal('An error occurred while fetching using bucketing...');
                this.emit('error', response);
            });
    }
}

export default Bucketing;
