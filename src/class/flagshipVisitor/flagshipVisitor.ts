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
  HitShape,
  GetModificationsOutput,
  TransactionHit,
  ItemHit,
  EventHit,
  checkCampaignsActivatedMultipleTimesOutput,
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

  fetchedModifications: DecisionApiResponseData | null;

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
    return axios.post(`${this.config.flagshipApi}activate`, {
      vid: this.id,
      cid: this.envId,
      caid: variationId,
      vaid: variationGroupId,
    })
      .then((response: DecisionApiResponse) => {
        let successLog = `VariationId "${variationId}" successfully activate with status code:${response.status}`;
        if (customLogs && customLogs.success) {
          successLog = `${customLogs.success}\nStatus code:${response.status}`;
        }
        this.log.debug(successLog);
      })
      .catch((error: Error) => {
        let failLog = `Trigger activate of variationId "${variationId}" failed with error:\n${error}`;
        if (customLogs && customLogs.fail) {
          failLog = `${customLogs.fail}\nFailed with error:\n${error}`;
        }
        this.log.fatal(failLog);
      });
  }

  // TODO: consider args "variationId" & "variationGroupId" and unit test them
  public activateModifications(modifications: Array<{ key: string; variationId?: string; variationGroupId?: string }>): void {
    const modificationsRequested: FsModifsRequestedList = modifications.reduce(
      (output, { key }) => [...output, { key, defaultValue: '', activate: true }], [] as FsModifsRequestedList,
    );

    if (this.fetchedModifications) {
      const { detailsModifications } = this.extractDesiredModifications(this.fetchedModifications, modificationsRequested);
      this.triggerActivateIfNeeded(detailsModifications as DecisionApiResponseDataFullComputed);
    }
  }

  private triggerActivateIfNeeded(detailsModifications: DecisionApiResponseDataFullComputed): void {
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

    // Logs unexpected behavior:
    const { activateKey, activateCampaign }: checkCampaignsActivatedMultipleTimesOutput = this.checkCampaignsActivatedMultipleTimes(detailsModifications as DecisionApiResponseDataFullComputed);
    Object.entries(activateKey).forEach(([key, count]) => {
      if (count > 1) {
        this.log.warn(`Key "${key}" has been activated ${count} times because it was in conflict in further campaigns (debug logs for more details)`);
        this.log.debug(`Here the details:${Object.entries(activateCampaign).map(
          ([campaignId, { directActivate, indirectActivate }]) => {
            if (indirectActivate.includes(key)) {
              return `\n- because key "${key}" is also include inside campaign id="${campaignId}" where key(s) "${directActivate.map((item) => `${item} `)}" is/are also requested.`;
            }
            return null;
          },
        )}`);
      } else if (count !== 1) {
        this.log.warn(`Key "${key}" has unexpectedly been activated ${count} times`);
      } else {
        // everything good;
      }
    });
    // END of logs
  }

  private checkCampaignsActivatedMultipleTimes(detailsModifications: DecisionApiResponseDataFullComputed): checkCampaignsActivatedMultipleTimesOutput {
    const output: checkCampaignsActivatedMultipleTimesOutput = { activateCampaign: {}, activateKey: {} };
    const requestedActivateKeys = Object.entries(detailsModifications).filter(([, keyInfo]) => keyInfo.isActivateNeeded === true);
    const extractModificationIndirectKeysFromCampaign = (campaignId: string, directKey: string): Array<string> => {
      if (this.fetchedModifications) {
        const campaignDataArray: Array<DecisionApiCampaign> = this.fetchedModifications.campaigns.filter((campaign) => campaign.id === campaignId);
        if (campaignDataArray.length === 1) {
          return Object.keys(campaignDataArray[0].variation.modifications.value).filter((key) => key !== directKey);
        }
        this.log.debug('extractModificationIndirectKeysFromCampaign: Error campaignDataArray.length has unexpectedly length bigger than 1');
        return [];
      }
      this.log.debug('extractModificationIndirectKeysFromCampaign: Error this.fetchedModifications is empty');
      return [];
    };

    if (this.fetchedModifications) {
      requestedActivateKeys.forEach(([key, keyInfos]) => {
        if (output.activateCampaign[keyInfos.campaignId[0]]) {
          output.activateCampaign[keyInfos.campaignId[0]].directActivate.push(key);
        } else {
          output.activateCampaign[keyInfos.campaignId[0]] = {
            directActivate: [key],
            indirectActivate: extractModificationIndirectKeysFromCampaign(keyInfos.campaignId[0], key),
          };
        }
      });

      // then, clean indirect key which are also in direct
      Object.keys(output.activateCampaign).forEach((campaignId) => {
        Object.values(output.activateCampaign[campaignId].directActivate).forEach((directKey) => {
          if (output.activateCampaign[campaignId].indirectActivate.includes(directKey)) {
            output.activateCampaign[campaignId].indirectActivate.splice(output.activateCampaign[campaignId].indirectActivate.indexOf(directKey), 1);
          }
        });
      });

      // then, fill "keyActivate"
      const extractNbTimesActivateCallForKey = (key: string): number => Object.values(output.activateCampaign).reduce(
        (count, { directActivate, indirectActivate }) => count + indirectActivate.filter((item) => item === key).length + directActivate.filter((item) => item === key).length, 0,
      );
      requestedActivateKeys.forEach(([key]) => {
        output.activateKey[key] = extractNbTimesActivateCallForKey(key);
      });

      // done
      return output;
    }
    this.log.debug('checkCampaignsActivatedMultipleTimes: Error this.fetchedModifications is empty');
    return output;
  }

  private analyseModifications({ campaigns }: DecisionApiResponseData, activate = false, modificationsRequested?: FsModifsRequestedList): { detailsModifications: DecisionApiResponseDataFullComputed; mergedModifications: DecisionApiResponseDataSimpleComputed} {
    const detailsModifications: DecisionApiResponseDataFullComputed = {};
    const mergedModifications: DecisionApiResponseDataSimpleComputed = {};
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
              isActivateNeeded: !!activate,
            };
            if (modificationsRequested) {
              modificationsRequested.some((item) => {
                if (item.key === key) {
                  detailsModifications[key].isRequested = true;
                  if (!activate && !!item.activate) {
                    detailsModifications[key].isActivateNeeded = item.activate;
                  }
                }
              });
            }
          }
        },
      );
      return null;
    });
    this.log.debug(`detailsModifications:\n${JSON.stringify(detailsModifications)}`);
    return { detailsModifications, mergedModifications };
  }

  private extractDesiredModifications(response: DecisionApiResponseData, modificationsRequested: FsModifsRequestedList, activateAllModifications: boolean | null = null): { desiredModifications: GetModificationsOutput; detailsModifications: object } {
    const desiredModifications: DecisionApiResponseDataSimpleComputed = {};
    // Extract all modifications from "normal" answer and put them in "mergedModifications" as "simple" mode would do but with additional info.
    const { detailsModifications, mergedModifications } = this.analyseModifications(response, !!activateAllModifications, modificationsRequested);
    // Notify modifications which have campaign conflict
    Object.entries(detailsModifications).forEach(
      ([key]) => {
        // log only if it's a requested keyw
        if (detailsModifications[key].value.length > 1 && detailsModifications.isRequested) {
          this.log.warn(`Modification "${key}" has further values because the modification is involved in campgains with:\nid="${detailsModifications[key].campaignId.toString()}"\nModification value kept:\n${key}="${detailsModifications[key].value[0]}"`);
        }
      },
    );

    // Check modifications requested (=modificationsRequested) match modifications fetched (=mergedModifications)
    modificationsRequested.forEach((modifRequested) => {
      if (typeof mergedModifications[modifRequested.key] !== 'undefined'
          && mergedModifications[modifRequested.key] !== null) {
        desiredModifications[modifRequested.key] = mergedModifications[modifRequested.key];
      } else {
        const { defaultValue } = modifRequested;
        desiredModifications[modifRequested.key] = defaultValue;
        this.log.debug(`No value found for modification "${modifRequested.key}".\nSetting default value "${defaultValue}"`);
        if (modifRequested.activate) {
          this.log.warn(`Unable to activate modification "${modifRequested.key}" because it does not exist on any existing campaign...`);
        }
      }
    });
    return { desiredModifications, detailsModifications };
  }

  private getModificationsPostProcess(response: DecisionApiResponseData | DecisionApiResponse, modificationsRequested: FsModifsRequestedList, activateAllModifications: boolean|null = null): GetModificationsOutput {
    const completeResponse = response as DecisionApiResponse;
    const responseData = completeResponse && completeResponse.data ? completeResponse.data : response as DecisionApiResponseData;
    if (modificationsRequested && responseData && typeof responseData === 'object' && !Array.isArray(response)) {
      const { desiredModifications, detailsModifications } = this.extractDesiredModifications(responseData, modificationsRequested, activateAllModifications);
      this.triggerActivateIfNeeded(detailsModifications as DecisionApiResponseDataFullComputed);
      return (desiredModifications);
    }

    if (!modificationsRequested) {
      const errorMsg = 'No modificationsRequested specified...';
      this.log.error(errorMsg);
      return {};
    }

    this.log.warn('getModifications: no campaigns found...');
    return {};
  }

  public getModifications(modificationsRequested: FsModifsRequestedList, activateAllModifications: boolean|null = null): GetModificationsOutput {
    return this.getModificationsCache(modificationsRequested, activateAllModifications);
  }

  // deprecated
  public getModificationsCache(
    modificationsRequested: FsModifsRequestedList,
    activateAllModifications: boolean | null = null,
  ): GetModificationsOutput {
    if (!modificationsRequested) {
      this.log.error('getModificationsCache: No requested modifications defined...');
      return {};
    }
    if (!this.fetchedModifications) {
      this.log.warn('No modifications found in cache...');
      const { desiredModifications } = this.extractDesiredModifications({ visitorId: this.id, campaigns: [] }, modificationsRequested, activateAllModifications);
      return desiredModifications;
    }
    const response = this.fetchAllModifications({ activate: !!activateAllModifications, loadFromCache: true }) as DecisionApiResponseData;
    return this.getModificationsPostProcess(response, modificationsRequested, activateAllModifications);
  }

  // deprecated
  public setContext(context: FlagshipVisitorContext): void {
    this.context = context;
  }

  public updateContext(context: FlagshipVisitorContext): void {
    this.setContext(context);
  }

  public synchronizeModifications(activate = false): Promise<number> {
    return new Promise(
      (resolve, reject) => {
        const fetchedModif = this.fetchAllModifications({ activate, force: true }) as Promise<DecisionApiResponse >;
        fetchedModif.then(
          (response: DecisionApiResponse) => {
            const castResponse = response as DecisionApiResponse;
            this.fetchedModifications = flagshipSdkHelper.checkDecisionApiResponseFormat(castResponse, this.log);
            resolve(castResponse.status);
          },
        )
          .catch((error: Error) => {
            this.fetchedModifications = null;
            reject(error);
          });
      },
    );
  }

  public getModificationsForCampaign(campaignId: string, activate = false): Promise<DecisionApiResponse > {
    return this.fetchAllModifications({ activate, campaignCustomID: campaignId }) as Promise<DecisionApiResponse >;
  }

  public getAllModifications(activate = false): Promise<DecisionApiResponse> {
    return this.fetchAllModifications({ activate }) as Promise<DecisionApiResponse >;
  }

  private fetchAllModificationsPostProcess(
    response: DecisionApiResponseData | DecisionApiResponse,
    {
      activate,
      campaignCustomID,
    }: {
      activate: boolean;
      campaignCustomID: string | null;
    },
  ): { data: DecisionApiResponseData } {
    const completeResponse = response as DecisionApiResponse;
    const reshapeResponse = completeResponse.data ? completeResponse : { data: response };
    const responseData = completeResponse.data ? completeResponse.data : response as DecisionApiResponseData;
    let output = { data: {} } as { data: DecisionApiResponseData };
    let analysedModifications = {};
    let filteredCampaigns: Array<DecisionApiCampaign> = [];

    // PART 1: Compute the data (if needed)
    if (responseData && responseData.campaigns) {
      if (campaignCustomID) {
        filteredCampaigns = responseData.campaigns.filter((item) => item.id === campaignCustomID);
        output = {
          ...reshapeResponse,
          data: {
            visitorId: this.id,
            campaigns: filteredCampaigns,
          },
        };
      } else { // default behavior
        const { detailsModifications /* , mergedModifications */ } = this.analyseModifications(responseData, !!activate);
        analysedModifications = detailsModifications;
        output = { ...reshapeResponse } as DecisionApiResponse;
      }
    } else {
      let warningMsg = 'No modification(s) found';
      if (campaignCustomID) {
        warningMsg += ` for campaignId="${campaignCustomID}"`;
        output = { ...reshapeResponse, data: { campaigns: [], visitorId: this.id } };
      } else {
        output = { ...reshapeResponse } as DecisionApiResponse;
      }
      this.log.warn(warningMsg);
    }

    // PART 2: Handle activate (if needed)
    if (activate) {
      if (filteredCampaigns.length > 0) {
        this.activateCampaign(
          filteredCampaigns[0].variation.id,
          filteredCampaigns[0].variationGroupId,
        );
      } else {
        this.triggerActivateIfNeeded(analysedModifications);
      }
    }

    // PART 3: Return the data
    return output;
  }

  private saveModificationsInCache(data: DecisionApiResponseData | null): void {
    let haveBeenCalled = false;
    const callback = (arg = data): void => {
      haveBeenCalled = true;
      this.fetchedModifications = arg;
    };
    this.emit('saveCache', {
      saveInCacheModifications: callback,
      modifications: {
        before: this.fetchedModifications,
        after: data,
      },
    });

    // if callback not used, do default behavior
    if (!haveBeenCalled) {
      this.fetchedModifications = data;
    }
    this.log.debug(`Saving in cache those modifications:\n${data ? JSON.stringify(data) : 'null'}`);
  }

  private fetchAllModifications(
    args: {
      activate?: boolean;
      campaignCustomID?: string | null;
      force?: boolean;
      loadFromCache?: boolean;
    },
  ): Promise<DecisionApiResponse> | DecisionApiResponseData {
    const defaultArgs = {
      activate: false,
      campaignCustomID: null,
      force: false,
      loadFromCache: false,
    };
    const {
      activate, force, loadFromCache, /* , campaignCustomID, */
    } = { ...defaultArgs, ...args };
    const url = `${this.config.flagshipApi}${this.envId}/campaigns?mode=normal`;

    // check if need to return without promise
    if (loadFromCache) {
      if (this.fetchedModifications && !force) {
        this.log.info('fetchAllModifications: loadFromCache enabled');
        return this.fetchAllModificationsPostProcess(this.fetchedModifications, { ...defaultArgs, ...args }).data;
      }
      this.log.fatal('fetchAllModifications: loadFromCache enabled but no data in cache. Make sure you fetched at least once before.');
      return this.fetchedModifications as DecisionApiResponseData;
    }

    // default: return a promise
    return new Promise((resolve, reject) => {
      if (this.fetchedModifications && !force) {
        this.log.info('fetchAllModifications: no calls to the Decision API because it has already been fetched before');
        resolve(
          this.fetchAllModificationsPostProcess(this.fetchedModifications, { ...defaultArgs, ...args }) as DecisionApiResponse,
        );
      } else {
        axios.post(url, {
          visitor_id: this.id,
          trigger_hit: activate, // TODO: to unit test
          context: this.context,
        })
          .then((response: DecisionApiResponse) => {
            this.saveModificationsInCache(response.data);
            resolve(
              this.fetchAllModificationsPostProcess(response, { ...defaultArgs, ...args }) as DecisionApiResponse,
            );
          })
          .catch((response: Error) => {
            this.saveModificationsInCache(null);
            this.log.fatal('fetchAllModifications: an error occurred while fetching...');
            if (activate) {
              this.log.fatal('fetchAllModifications: activate canceled due to errors...');
            }
            reject(response);
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

  public sendHit(hitData: HitShape): Promise<void> {
    return this.sendHits([hitData]);
  }

  public sendHits(hitsArray: Array<HitShape>): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const promises = Promise.all(
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

        promises.then(
          () => {
            this.log.info('sendHits: success');
            resolve();
          },
        ).catch((error) => {
          this.log.fatal('sendHits: fail');
          reject(error);
        });
      } catch (error) {
        this.log.fatal('sendHits: fail');
        reject(error);
      }
    });
  }
}

export default FlagshipVisitor;
