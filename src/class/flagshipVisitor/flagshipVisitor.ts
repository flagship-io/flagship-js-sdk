import axios from 'axios';
import { EventEmitter } from 'events';
import { FlagshipSdkConfig, IFlagshipVisitor } from '../../index.d';

import loggerHelper from '../../lib/loggerHelper';
import {
  DecisionApiResponse,
  DecisionApiResponseData,
  DecisionApiResponseDataFullComputed,
  DecisionApiResponseDataSimpleComputed,
  FlagshipVisitorContext,
  FsModifsRequestedList,
  DecisionApiCampaign,
  DecisionApiSimpleResponse,
  HitShape,
  GetModificationsOutput,
  TransactionHit,
  ItemHit,
  EventHit,
} from './flagshipVisitor.d';
import flagshipSdkHelper from '../../lib/flagshipSdkHelper';
import { FsLogger } from '../../lib/index.d';

class FlagshipVisitor extends EventEmitter implements IFlagshipVisitor {
  config: FlagshipSdkConfig;

  id: string;

  log: FsLogger;

  envId: string;

  context: FlagshipVisitorContext;

  isAllModificationsFetched: boolean;

  fetchedModifications: DecisionApiResponse | null;

  constructor(envId: string, config: FlagshipSdkConfig, id: string, context: FlagshipVisitorContext = {}) {
    super();
    this.config = config;
    this.id = id;
    this.log = loggerHelper.getLogger(this.config, `visitorId:${this.id}`);
    this.envId = envId;
    this.context = this.checkContext(context);
    this.isAllModificationsFetched = false;
    this.fetchedModifications = null;
  }

  private checkContext(unknownContext: object): FlagshipVisitorContext {
    const validContext: FlagshipVisitorContext = { };
    Object.entries(unknownContext).forEach(
      ([key, value]) => {
        if (typeof value === 'object' && !Array.isArray(value)) {
          this.log.warn(`Context key "${key}" is type of "${typeof value}" which is not supported. This key will be ignored...`);
        } else if (typeof value === 'object' && Array.isArray(value)) {
          let arrayLooksOkay = true;
          // check there is no object inside the array
          value.forEach((element) => {
            if (typeof element === 'object') {
              this.log.warn(`Context key "${key}" is type of "Array<${typeof element}>" which is not supported. This key will be ignored...`);
              arrayLooksOkay = false;
            }
          });
          if (arrayLooksOkay) {
            validContext[key] = value;
          }
        } else {
          validContext[key] = value;
        }
      },
    );
    return validContext;
  }

  private activateCampaign(variationId: string, variationGroupId: string, customLogs?: {success: string; fail: string}): Promise<void> {
    return axios.post('https://decision-api.flagship.io/v1/activate', {
      vid: this.id,
      cid: this.envId,
      caid: variationId,
      vaid: variationGroupId,
    })
      .then((response) => {
        let successLog = `VariationId "${variationId}" successfully activate with status code:${response.status}`;
        if (customLogs && customLogs.success) {
          successLog = `${customLogs.success}\nStatus code:${response.status}`;
        }
        this.log.debug(successLog);
      })
      .catch((error) => {
        let failLog = `Trigger activate of variationId "${variationId}" failed with error:\n${error}`;
        if (customLogs && customLogs.fail) {
          failLog = `${customLogs.fail}\nFailed with error:\n${error}`;
        }
        this.log.fatal(failLog);
      });
  }

  private triggerActivateIfNeeded(detailsModifications: object): void {
    const campaignsActivated: Array<string> = [];
    Object.entries(detailsModifications).forEach(
      ([key, value]) => {
        if (value.isActivateNeeded) {
          if (campaignsActivated.includes(value.campaignId[0])) {
            this.log.debug(`Skip trigger activate of "${key}" because the corresponding campaign already been triggered with another modification`);
          } else {
            campaignsActivated.push(value.campaignId[0]);
            this.activateCampaign(
              value.variationId[0],
              value.variationGroupId[0],
              {
                success: `Modification key "${key}" successfully activate.`,
                fail: `Trigger activate of modification key "${key}" failed.`,
              },
            );
          }
        }
      },
    );
  }

  private extractDesiredModifications({ campaigns }: DecisionApiResponseData, modificationsRequested: FsModifsRequestedList, activateAllModifications: boolean | null = null): { desiredModifications: GetModificationsOutput; detailsModifications: object } {
    const desiredModifications: DecisionApiResponseDataSimpleComputed = {};
    const mergedModifications: DecisionApiResponseDataSimpleComputed = {};
    const detailsModifications: DecisionApiResponseDataFullComputed = {};
    // Extract all modifications from "normal" answer and put them in "mergedModifications" as "simple" mode would do but with additional info.
    campaigns.forEach((campaign) => {
      Object.entries(campaign.variation.modifications.value).forEach(
        ([key, value]) => {
          if (mergedModifications[key]) {
            // This modif already exist on a previous campaign
            detailsModifications[key].value.push(value);
            detailsModifications[key].type.push(campaign.variation.modifications.type);
            detailsModifications[key].campaignId.push(campaign.id);
            detailsModifications[key].variationId.push(campaign.variation.id);
            detailsModifications[key].variationGroupId.push(campaign.variationGroupId);
          } else {
            // New modif
            mergedModifications[key] = value;
            detailsModifications[key] = {
              value: [value],
              type: [campaign.variation.modifications.type],
              campaignId: [campaign.id],
              variationId: [campaign.variation.id],
              variationGroupId: [campaign.variationGroupId],
              isRequested: false,
              isActivateNeeded: !!activateAllModifications,
            };
            modificationsRequested.some((item) => {
              if (item.key === key) {
                detailsModifications[key].isRequested = true;
                if (activateAllModifications === null && !!item.activate) {
                  detailsModifications[key].isActivateNeeded = item.activate;
                }
              }
            });
          }
        },
      );
      return null;
    });
    this.log.debug(`detailsModifications:\n${JSON.stringify(detailsModifications)}`);
    // Notify modifications which have campaign conflict
    Object.entries(detailsModifications).forEach(
      ([key]) => {
        // log only if it's a requested key
        if (detailsModifications[key].value.length > 1 && detailsModifications.isRequested) {
          this.log.warn(`Modification "${key}" has further values because the modification is involved in campgains with:\nid="${detailsModifications[key].campaignId.toString()}"\nModification value kept:\n${key}="${detailsModifications[key].value[0]}"`);
        }
      },
    );

    // Check modifications requested (=modificationsRequested) match modifications fetched (=mergedModifications)
    modificationsRequested.forEach((modifRequested) => {
      if (mergedModifications[modifRequested.key]) {
        desiredModifications[modifRequested.key] = mergedModifications[modifRequested.key];
      } else {
        const { defaultValue } = modifRequested;
        desiredModifications[modifRequested.key] = defaultValue;
        this.log.info(`No value found for modification "${modifRequested.key}".\nSetting default value "${defaultValue}"`);
        if (modifRequested.activate) {
          this.log.warn(`Unable to activate modification "${modifRequested.key}" because it does not exist on any existing campaign...`);
        }
      }
    });
    return { desiredModifications, detailsModifications };
  }

  public getModifications(modificationsRequested: FsModifsRequestedList, activateAllModifications: boolean|null = null): Promise<GetModificationsOutput> {
    return new Promise((resolve, reject) => {
      this.fetchAllModifications(!!activateAllModifications).then(
        (response: DecisionApiResponse | DecisionApiSimpleResponse) => {
          const castResponse = response as DecisionApiResponse;
          if (castResponse && typeof castResponse.data === 'object' && !Array.isArray(castResponse.data)) {
            this.log.info(`Get modifications succeed with status code:${castResponse.status}`);
            this.log.debug(`with json:\n${JSON.stringify(castResponse.data)}`);
            const { desiredModifications, detailsModifications } = this.extractDesiredModifications(castResponse.data, modificationsRequested, activateAllModifications);
            this.triggerActivateIfNeeded(detailsModifications);
            resolve(desiredModifications);
          } else {
            this.log.warn('Get modifications succeed but returned no values...');
            resolve({});
          }
        },
      ).catch((error) => {
        this.log.fatal(`Get modifications failed with error:\n${error.status || JSON.stringify(error)}`);
        reject(error);
      });
    });
  }

  public setContext(context: FlagshipVisitorContext): void {
    this.context = context;
  }

  public synchronizeModifications(activate = false): Promise<number> {
    return new Promise(
      (resolve, reject) => {
        this.fetchAllModifications(activate, null, 'normal', true).then(
          (response: DecisionApiResponse | DecisionApiSimpleResponse) => {
            const castResponse = response as DecisionApiResponse;
            this.fetchedModifications = flagshipSdkHelper.checkDecisionApiResponseFormat(castResponse, this.log);
            resolve(castResponse.status);
          },
        )
          .catch((error) => {
            this.fetchedModifications = null;
            reject(error);
          });
      },
    );
  }

  public getModificationsForCampaign(campaignId: string, activate = false, fetchMode: 'simple' | 'normal' = 'normal'): Promise<DecisionApiResponse | DecisionApiSimpleResponse> {
    return this.fetchAllModifications(activate, campaignId, fetchMode);
  }

  public getAllModifications(activate = false, fetchMode: 'simple' | 'normal' = 'normal'): Promise<DecisionApiResponse | DecisionApiSimpleResponse> {
    return this.fetchAllModifications(activate, null, fetchMode);
  }

  private fetchAllModifications(activate = false, campaignCustomID: string | null = null, fetchMode: 'simple' | 'normal' = 'normal', force = false): Promise<DecisionApiResponse | DecisionApiSimpleResponse> {
    const url = `https://decision-api.flagship.io/v1/${this.envId}/campaigns?mode=${fetchMode}`;
    const urlNormal = `https://decision-api.flagship.io/v1/${this.envId}/campaigns?mode=normal`;
    const postProcess = (response: DecisionApiResponse, resolve: Function): void => {
      if (fetchMode === 'simple') {
        const simpleResult: DecisionApiResponseDataSimpleComputed = {};
        if (response.data.campaigns) {
          const filteredArray: Array<DecisionApiCampaign> = response.data.campaigns.filter((item) => item.id === campaignCustomID);
          filteredArray.map((campaign) => {
            Object.entries(campaign.variation.modifications.value).forEach(
              ([key, value]) => {
                simpleResult[key] = value;
              },
            );
          });
          if (activate) {
            this.activateCampaign(filteredArray[0].variation.id, filteredArray[0].variationGroupId);
          }
        } else {
          this.log.warn(`No modification(s) found for campaignId="${campaignCustomID}"`);
        }
        resolve({
          ...response,
          data: {
            ...simpleResult,
          },
        });
      } else {
        // default behaviour: fetchMode==='normal
        if (response && response.data && response.data.campaigns) {
          const filteredArray: Array<DecisionApiCampaign> = response.data && response.data.campaigns.filter((item) => item.id === campaignCustomID);
          if (filteredArray && filteredArray.length > 0) {
            if (activate) {
              this.activateCampaign(filteredArray[0].variation.id, filteredArray[0].variationGroupId);
            }
            resolve({
              ...response,
              data: {
                visitorId: this.id,
                campaigns: filteredArray,
              },
            });
          }
        }

        this.log.warn(`No modification(s) found for campaignId="${campaignCustomID}"`);
        resolve({
          ...response,
          data: {
            visitorId: this.id,
            campaigns: [],
          },
        });
      }
    };
    if (!campaignCustomID) {
      this.log.debug('fetchAllModifications: fetching all campaigns of current visitor');
      return new Promise((resolve1, reject1) => {
        if (this.fetchedModifications && !activate && !force) {
          this.log.info('fetchAllModifications: no calls to the Decision API because it has already been fetched before');
          resolve1(this.fetchedModifications);
        } else {
          axios.post(url, {
            visitor_id: this.id,
            trigger_hit: !!activate,
            context: this.context,
          })
            .then((response: DecisionApiResponse) => {
              this.fetchedModifications = response;
              resolve1(response);
            })
            .catch((error) => {
              this.log.fatal('fetchAllModifications: an error occured while fetching...');
              reject1(error);
            });
        }
      });
    }

    return new Promise((resolve2) => {
      const httpBody = {
        visitor_id: this.id,
        trigger_hit: false,
        context: this.context,
      };

      if (this.fetchedModifications && !force) {
        this.log.info('fetchAllModifications: no calls to the Decision API because it has already been fetched before');
        postProcess(this.fetchedModifications, resolve2);
      } else {
        axios.post(urlNormal, httpBody)
          .then((response: DecisionApiResponse) => {
            this.fetchedModifications = response;
            postProcess(response, resolve2);
          });
      }
    });
  }

  private generateCustomTypeParamsOf(hitData: HitShape): object | null {
    const optionalAttributes: { [key: string]: string | number | boolean} = {};
    switch (hitData.type.toUpperCase()) {
      case 'SCREEN': {
        const { documentLocation, pageTitle } = hitData.data;
        if (!documentLocation || !pageTitle) {
          if (!documentLocation) this.log.error('sendHits(Screen): failed because attribute "documentLocation" is missing...');
          if (!pageTitle) this.log.error('sendHits(Screen): failed because attribute "pageTitle" is missing...');
          return null;
        }
        return {
          t: 'SCREENVIEW',
          dl: documentLocation,
          pt: pageTitle,
        };
      }
      case 'TRANSACTION': {
        const {
          documentLocation,
          pageTitle,
          transactionId,
          affiliation,
          totalRevenue,
          shippingCost,
          taxes,
          currency,
          couponCode,
          paymentMethod,
          shippingMethod,
          itemCount,
        } = hitData.data as TransactionHit;

        if (totalRevenue) {
          optionalAttributes.tr = totalRevenue;
        }
        if (shippingCost) {
          optionalAttributes.ts = shippingCost;
        }
        if (taxes) {
          optionalAttributes.tt = taxes;
        }
        if (currency) {
          optionalAttributes.tc = currency;
        }
        if (couponCode) {
          optionalAttributes.tcc = couponCode;
        }
        if (paymentMethod) {
          optionalAttributes.pm = paymentMethod;
        }
        if (shippingMethod) {
          optionalAttributes.sm = shippingMethod;
        }
        if (itemCount) {
          optionalAttributes.icn = itemCount;
        }


        if (documentLocation) {
          optionalAttributes.dl = documentLocation;
        }
        if (pageTitle) {
          optionalAttributes.pt = pageTitle;
        }
        if (!transactionId || !affiliation) {
          if (!transactionId) this.log.error('sendHits(Transaction): failed because attribute "transactionId" is missing...');
          if (!affiliation) this.log.error('sendHits(Transaction): failed because attribute "affiliation" is missing...');
          return null;
        }

        return {
          t: 'TRANSACTION',
          tid: transactionId,
          ta: affiliation,
          ...optionalAttributes,
        };
      }
      case 'ITEM': {
        const {
          transactionId, name, documentLocation, pageTitle, price, code, category, quantity,
        } = hitData.data as ItemHit;

        if (category) {
          optionalAttributes.iv = category;
        }
        if (code) {
          optionalAttributes.ic = code;
        }
        if (quantity) {
          optionalAttributes.iq = quantity;
        }
        if (price) {
          optionalAttributes.ip = price;
        }
        if (documentLocation) {
          optionalAttributes.dl = documentLocation;
        }
        if (pageTitle) {
          optionalAttributes.pt = pageTitle;
        }
        if (!transactionId || !name) {
          if (!transactionId) this.log.error('sendHits(Item): failed because attribute "transactionId" is missing...');
          if (!name) this.log.error('sendHits(Item): failed because attribute "name" is missing...');
          return null;
        }

        return {
          t: 'ITEM',
          tid: transactionId,
          in: name,
          ...optionalAttributes,
        };
      }
      case 'EVENT': {
        const {
          label, value, documentLocation, category, pageTitle, action,
        } = hitData.data as EventHit;

        if (label) {
          optionalAttributes.el = label;
        }
        if (value) {
          optionalAttributes.ev = value;
        }
        if (documentLocation) {
          optionalAttributes.dl = documentLocation;
        }
        if (pageTitle) {
          optionalAttributes.pt = pageTitle;
        }
        if (!category || !action) {
          this.log.debug(`sendHits(Event) this hits is missing attributes:\n${JSON.stringify(hitData)}`);
          if (!category) this.log.error('sendHits(Event): failed because attribute "category" is missing...');
          if (!action) this.log.error('sendHits(Event): failed because attribute "action" is missing...');
          return null;
        }

        return {
          t: 'EVENT',
          ea: action,
          ec: category,
          ...optionalAttributes,
        };
      }
      default:
        this.log.error(`sendHits: no type found for hit:\n${JSON.stringify(hitData)}`);
        return null;
    }
  }

  public sendHits(hitsArray: Array<HitShape>): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        Promise.all(
          hitsArray.map(async (hit) => {
            const customParams = this.generateCustomTypeParamsOf(hit);
            const url = 'https://ariane.abtasty.com';
            if (customParams) {
              return axios.post(url, {
                vid: this.id,
                cid: this.envId,
                ds: 'APP',
                ...customParams,
              });
            }
            this.log.debug(`sendHits: skip request to "${url}" because current hit not set correctly`);
            return new Promise((resolveAuto) => resolveAuto()); // do nothing
          }),
        );
        this.log.info('sendHits: success');
        resolve();
      } catch (error) {
        this.log.fatal('sendHits: fail');
        reject(error);
      }
    });
  }
}

export default FlagshipVisitor;
