import { EventEmitter } from 'events';
import { FsLogger } from '@flagship.io/js-sdk-logs';
import Axios, { AxiosResponse } from 'axios';
import { DecisionApiCampaign, DecisionApiResponseData, FlagshipVisitorContext } from '../flagshipVisitor/flagshipVisitor.d';


import {
  BucketingApiResponse, BucketingOperator, BucketingTargetings, BucketingTypes,
} from './bucketing.d';
import { IFlagshipBucketing, FlagshipSdkConfig } from '../../index.d';
import loggerHelper from '../../lib/loggerHelper';
import { internalConfig } from '../../config/default';

class Bucketing extends EventEmitter implements IFlagshipBucketing {
    data: BucketingApiResponse | null;

    computedData: DecisionApiResponseData| null;

    visitorId: string;

    log: FsLogger;

    envId: string;

    visitorContext: FlagshipVisitorContext;

    config: FlagshipSdkConfig;

    constructor(envId: string, config: FlagshipSdkConfig, visitorId: string, visitorContext: FlagshipVisitorContext = {}) {
      super();
      this.config = config;
      this.visitorId = visitorId;
      this.log = loggerHelper.getLogger(this.config, `visitorId:${this.visitorId}`);
      this.envId = envId;
      this.visitorContext = visitorContext;
      this.data = null;
      this.computedData = null;
    }

    private getEligibleCampaigns(bucketingData: BucketingApiResponse): DecisionApiCampaign[] {
      let result = [];
      const checkAssertion = <T>(vcValue: T, apiValueArray: T[], assertionCallback: (a: T, b: T) => boolean): boolean => apiValueArray.map((apiValue) => assertionCallback(vcValue, apiValue)).filter((answer) => answer === true).length > 0;
      const computeAssertion = ({ operator, key, value }: BucketingTargetings): boolean => {
        const checkTypeMatch = (vcValue: string|number|boolean, apiValue: BucketingTypes, vcKey: string): boolean => {
          if (typeof apiValue !== 'object' && (typeof vcValue !== typeof apiValue)) {
            this.log.error('');
            return false;
          }
          if (typeof apiValue === 'object' && !Array.isArray(apiValue)) {
            this.log.error('Bucketing:getEligibleCampaigns - The bucketing API returned a json object which is not supported by the SDK.');
            return false;
          }
          if (Array.isArray(apiValue)) {
            if ((apiValue as []).filter((v) => typeof v !== typeof vcValue).length > 0) {
              this.log.error(`Bucketing:getEligibleCampaigns - The bucketing API returned an array where some elements do not have same type ("${typeof vcValue}") as the visitor context key="${vcKey}"`);
              return false;
            }
          }
          return true;
        };
        switch (operator) {
          case 'EQUALS':
            return this.visitorContext[key] === value;
          case 'NOT_EQUALS':
            return this.visitorContext[key] !== value;
          case 'LOWER_THAN':
            if (checkTypeMatch(this.visitorContext[key], value, key)) {
              switch (typeof this.visitorContext[key]) {
                case 'string':
                  if (Array.isArray(value)) {
                    return checkAssertion<string>(this.visitorContext[key] as string, value as string[], (a, b) => a.toLowerCase() < b.toLowerCase());
                  }
                  return (this.visitorContext[key] as string).toLowerCase() < (value as string).toLowerCase();
                case 'number':
                case 'boolean':
                  if (Array.isArray(value)) {
                    return checkAssertion<boolean | number>(this.visitorContext[key] as boolean | number, value as (boolean | number)[], (a, b) => a < b);
                  }
                  return this.visitorContext[key] < value;
                default:
                  this.log.fatal(`Bucketing:getEligibleCampaigns unexpected visitor context key type ("${typeof this.visitorContext[key]}"). This type is not supported. Assertion aborted.`);
                  return false;
              }
            } else {
              return false; // error message send with "checkTypeMatch" function
            }
          default:
            this.log.error(`Bucketing:getEligibleCampaigns unknown operator ${operator} found in bucketing api answer. Assertion aborted.`);
            return false;
        }
      };
      result = bucketingData.campaigns.filter(
        (campaign) => {
          const shouldConsider = false;
          let matchingVgId: string | null = null;

          // take the FIRST variation group which match the visitor context
          campaign.variationGroups.forEach(
            (vg) => {
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
                        // TODO:
                        break;
                      default:
                        // TODO:
                        operatorAndBox.push(computeAssertion(targeting));
                        break;
                    }
                  });
                  operatorOrBox.push(operatorAndBox.filter((answer) => answer !== true).length === 0);
                });
                matchingVgId = operatorOrBox.filter((answer) => answer === true).length > 0 ? vg.id : null;
              }
            },
          );
          if (shouldConsider) {
            result.push(campaign); // TODO: improve
          }
        },
      );
      return result;
    }

    public launch(): void {
      Axios.get(internalConfig.bucketingEndpoint.replace('@ENV_ID@', this.envId)).then(
        ({ data: bucketingData }: AxiosResponse<BucketingApiResponse>) => {
          if (bucketingData.panic) {
            this.log.warn('Panic mode detected, running SDK in safe mode...');
          } else {
            const computedCampaigns: DecisionApiCampaign[] = this.getEligibleCampaigns(bucketingData);
            this.data = { ...bucketingData };
            this.computedData = { visitorId: this.visitorId, campaigns: [...computedCampaigns] };
          }
          this.emit('launched');
        },
      ).catch((response: Error) => {
        this.log.fatal('An error occurred while fetching using bucketing...');
        this.emit('error', response);
      });
    }
}

export default Bucketing;
