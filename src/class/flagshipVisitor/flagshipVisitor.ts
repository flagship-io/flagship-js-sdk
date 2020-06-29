import { FsLogger } from '@flagship.io/js-sdk-logs';
import axios from 'axios';
import { EventEmitter } from 'events';
import { IFlagshipBucketing, FlagshipSdkConfig, IFlagshipBucketingVisitor, IFlagshipVisitor } from '../../index.d';

import flagshipSdkHelper from '../../lib/flagshipSdkHelper';
import loggerHelper from '../../lib/loggerHelper';
import { BucketingApiResponse } from '../bucketing/bucketing.d';
import BucketingVisitor from '../bucketingVisitor/bucketingVisitor';
import {
    checkCampaignsActivatedMultipleTimesOutput,
    DecisionApiCampaign,
    DecisionApiResponse,
    DecisionApiResponseData,
    DecisionApiResponseDataFullComputed,
    DecisionApiResponseDataSimpleComputed,
    EventHit,
    FlagshipVisitorContext,
    FsModifsRequestedList,
    GetModificationInfoOutput,
    GetModificationsOutput,
    HitShape,
    ItemHit,
    TransactionHit
} from './flagshipVisitor.d';

class FlagshipVisitor extends EventEmitter implements IFlagshipVisitor {
    config: FlagshipSdkConfig;

    id: string;

    log: FsLogger;

    envId: string;

    context: FlagshipVisitorContext;

    isAllModificationsFetched: boolean;

    bucket: IFlagshipBucketingVisitor | null;

    fetchedModifications: DecisionApiCampaign[] | null;

    sdkListener: EventEmitter;

    constructor(
        envId: string,
        config: FlagshipSdkConfig,
        sdkListener: EventEmitter,
        bucket: IFlagshipBucketing | null,
        id: string,
        context: FlagshipVisitorContext = {}
    ) {
        super();
        this.config = config;
        this.id = id;
        this.log = loggerHelper.getLogger(this.config, `Flagship SDK - visitorId:${this.id}`);
        this.envId = envId;
        this.context = flagshipSdkHelper.checkVisitorContext(context, this.log);
        this.isAllModificationsFetched = false;
        this.bucket = null;
        this.sdkListener = sdkListener;
        this.fetchedModifications = config.initialModifications
            ? flagshipSdkHelper.validateDecisionApiData(config.initialModifications, this.log)
            : null;

        if (this.config.decisionMode === 'Bucketing') {
            this.bucket = new BucketingVisitor(this.envId, this.id, this.context, this.config, bucket && bucket.data);
            sdkListener.on('bucketPollingSuccess', (data: BucketingApiResponse) => {
                this.log.debug('bucketing polling detected.');
                (this.bucket as IFlagshipBucketingVisitor).updateCache(data);
            });
        }
    }

    private activateCampaign(
        variationId: string,
        variationGroupId: string,
        customLogs?: { success: string; fail: string }
    ): Promise<{ status: number } | Error> {
        return new Promise<{ status: number } | Error>((resolve) => {
            axios
                .post(`${this.config.flagshipApi}activate`, {
                    vid: this.id,
                    cid: this.envId,
                    caid: variationGroupId,
                    vaid: variationId
                })
                .then((response: DecisionApiResponse) => {
                    let successLog = `VariationId "${variationId}" successfully activate with status code:${response.status}`;
                    if (customLogs && customLogs.success) {
                        successLog = `${customLogs.success} with status code "${response.status}"`;
                    }
                    this.log.debug(successLog);
                    resolve({ status: 200 });
                })
                .catch((error: Error) => {
                    let failLog = `Trigger activate of variationId "${variationId}" failed with error "${error}"`;
                    if (customLogs && customLogs.fail) {
                        failLog = `${customLogs.fail} failed with error "${error}"`;
                    }
                    this.log.fatal(failLog);
                    resolve(error);
                });
        });
    }

    // TODO: consider args "variationId" & "variationGroupId" and unit test them
    public activateModifications(modifications: Array<{ key: string; variationId?: string; variationGroupId?: string }>): void {
        const modificationsRequested: FsModifsRequestedList = modifications.reduce(
            (output, { key }) => [...output, { key, defaultValue: '', activate: true }],
            [] as FsModifsRequestedList
        );

        if (this.fetchedModifications) {
            const { detailsModifications } = this.extractDesiredModifications(this.fetchedModifications, modificationsRequested);
            this.triggerActivateIfNeeded(detailsModifications as DecisionApiResponseDataFullComputed);
        }
    }

    private triggerActivateIfNeeded(detailsModifications: DecisionApiResponseDataFullComputed): void {
        const campaignsActivated: Array<string> = [];
        Object.entries(detailsModifications).forEach(([key, value]) => {
            if (value.isActivateNeeded) {
                if (campaignsActivated.includes(value.campaignId[0])) {
                    this.log.debug(
                        `Skip trigger activate of "${key}" because the corresponding campaign already been triggered with another modification`
                    );
                } else {
                    campaignsActivated.push(value.campaignId[0]);
                    this.activateCampaign(value.variationId[0], value.variationGroupId[0], {
                        success: `Modification key "${key}" successfully activate.`,
                        fail: `Trigger activate of modification key "${key}" failed.`
                    });
                }
            }
        });

        // Logs unexpected behavior:
        const { activateKey, activateCampaign }: checkCampaignsActivatedMultipleTimesOutput = this.checkCampaignsActivatedMultipleTimes(
            detailsModifications as DecisionApiResponseDataFullComputed
        );
        Object.entries(activateKey).forEach(([key, count]) => {
            if (count > 1) {
                this.log.warn(
                    `Key "${key}" has been activated ${count} times because it was in conflict in further campaigns (debug logs for more details)`
                );
                this.log.debug(
                    `Here the details:${Object.entries(activateCampaign).map(([campaignId, { directActivate, indirectActivate }]) => {
                        if (indirectActivate.includes(key)) {
                            return `\n- because key "${key}" is also include inside campaign id="${campaignId}" where key(s) "${directActivate.map(
                                (item) => `${item} `
                            )}" is/are also requested.`;
                        }
                        return null;
                    })}`
                );
            } else {
                // everything good;
            }
        });
        // END of logs
    }

    private checkCampaignsActivatedMultipleTimes(
        detailsModifications: DecisionApiResponseDataFullComputed
    ): checkCampaignsActivatedMultipleTimesOutput {
        const output: checkCampaignsActivatedMultipleTimesOutput = { activateCampaign: {}, activateKey: {} };
        const requestedActivateKeys = Object.entries(detailsModifications).filter(([, keyInfo]) => keyInfo.isActivateNeeded === true);
        const extractModificationIndirectKeysFromCampaign = (campaignId: string, directKey: string): Array<string> => {
            if (this.fetchedModifications) {
                const campaignDataArray: Array<DecisionApiCampaign> = this.fetchedModifications.filter(
                    (campaign) => campaign.id === campaignId
                );
                if (campaignDataArray.length === 1) {
                    return Object.keys(campaignDataArray[0].variation.modifications.value).filter((key) => key !== directKey);
                }
                this.log.debug(
                    `extractModificationIndirectKeysFromCampaign - detected more than one campaign with same id "${campaignDataArray[0].id}"`
                );
            }
            return [];
        };

        if (this.fetchedModifications) {
            requestedActivateKeys.forEach(([key, keyInfos]) => {
                if (output.activateCampaign[keyInfos.campaignId[0]]) {
                    output.activateCampaign[keyInfos.campaignId[0]].directActivate.push(key);
                } else {
                    output.activateCampaign[keyInfos.campaignId[0]] = {
                        directActivate: [key],
                        indirectActivate: extractModificationIndirectKeysFromCampaign(keyInfos.campaignId[0], key)
                    };
                }
            });

            // then, clean indirect key which are also in direct
            Object.keys(output.activateCampaign).forEach((campaignId) => {
                Object.values(output.activateCampaign[campaignId].directActivate).forEach((directKey) => {
                    if (output.activateCampaign[campaignId].indirectActivate.includes(directKey)) {
                        output.activateCampaign[campaignId].indirectActivate.splice(
                            output.activateCampaign[campaignId].indirectActivate.indexOf(directKey),
                            1
                        );
                    }
                });
            });

            // then, fill "keyActivate"
            const extractNbTimesActivateCallForKey = (key: string): number =>
                Object.values(output.activateCampaign).reduce(
                    (count, { directActivate, indirectActivate }) =>
                        count +
                        indirectActivate.filter((item) => item === key).length +
                        directActivate.filter((item) => item === key).length,
                    0
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

    private analyseModifications(
        campaigns: DecisionApiCampaign[] = [],
        activate = false,
        modificationsRequested?: FsModifsRequestedList
    ): { detailsModifications: DecisionApiResponseDataFullComputed; mergedModifications: DecisionApiResponseDataSimpleComputed } {
        const detailsModifications: DecisionApiResponseDataFullComputed = {};
        const mergedModifications: DecisionApiResponseDataSimpleComputed = {};
        campaigns.forEach((campaign) => {
            Object.entries(campaign.variation.modifications.value).forEach(([key, value]) => {
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
                        isActivateNeeded: !!activate
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
            });
            return null;
        });
        this.log.debug(`detailsModifications:\n${JSON.stringify(detailsModifications)}`);
        return { detailsModifications, mergedModifications };
    }

    private extractDesiredModifications(
        response: DecisionApiCampaign[],
        modificationsRequested: FsModifsRequestedList,
        activateAllModifications: boolean | null = null
    ): { desiredModifications: GetModificationsOutput; detailsModifications: object } {
        const desiredModifications: DecisionApiResponseDataSimpleComputed = {};
        // Extract all modifications from "normal" answer and put them in "mergedModifications" as "simple" mode would do but with additional info.
        const { detailsModifications, mergedModifications } = this.analyseModifications(
            response,
            !!activateAllModifications,
            modificationsRequested
        );
        // Notify modifications which have campaign conflict
        Object.entries(detailsModifications).forEach(([key]) => {
            // log only if it's a requested key
            if (detailsModifications[key].value.length > 1 && detailsModifications[key].isRequested) {
                this.log.warn(
                    `Modification "${key}" has further values because the modification is involved in campaigns with (id="${detailsModifications[
                        key
                    ].campaignId.toString()}"). Modification value kept is ${key}="${detailsModifications[key].value[0]}"`
                );
            }
        });

        // Check modifications requested (=modificationsRequested) match modifications fetched (=mergedModifications)
        (modificationsRequested || []).forEach((modifRequested) => {
            if (typeof mergedModifications[modifRequested.key] !== 'undefined' && mergedModifications[modifRequested.key] !== null) {
                desiredModifications[modifRequested.key] = mergedModifications[modifRequested.key];
            } else {
                const { defaultValue } = modifRequested;
                desiredModifications[modifRequested.key] = defaultValue;
                this.log.debug(`No value found for modification "${modifRequested.key}".\nSetting default value "${defaultValue}"`);
                if (modifRequested.activate) {
                    this.log.warn(
                        `Unable to activate modification "${modifRequested.key}" because it does not exist on any existing campaign...`
                    );
                }
            }
        });
        return { desiredModifications, detailsModifications };
    }

    private getModificationsPostProcess(
        response: DecisionApiResponseData | DecisionApiResponse,
        modificationsRequested: FsModifsRequestedList,
        activateAllModifications: boolean | null = null
    ): GetModificationsOutput {
        const completeResponse = response as DecisionApiResponse;
        const responseData = completeResponse && completeResponse.data ? completeResponse.data : (response as DecisionApiResponseData);
        if (modificationsRequested && responseData && typeof responseData === 'object' && !Array.isArray(response)) {
            const { desiredModifications, detailsModifications } = this.extractDesiredModifications(
                responseData.campaigns,
                modificationsRequested,
                activateAllModifications
            );
            this.triggerActivateIfNeeded(detailsModifications as DecisionApiResponseDataFullComputed);
            return desiredModifications;
        }

        if (!modificationsRequested) {
            this.log.error(
                `Requesting some specific modifications but the "modificationsRequested" argument is "${typeof modificationsRequested}"...`
            );
        }

        return {};
    }

    public getModifications(
        modificationsRequested: FsModifsRequestedList,
        activateAllModifications: boolean | null = null
    ): GetModificationsOutput {
        return this.getModificationsCache(modificationsRequested, activateAllModifications);
    }

    public getModificationInfo(key: string): Promise<null | GetModificationInfoOutput> {
        const polishOutput = (data: DecisionApiCampaign): GetModificationInfoOutput => ({
            campaignId: data.id,
            variationId: data.variation.id,
            variationGroupId: data.variationGroupId
        });
        return new Promise((resolve, reject) => {
            const fetchedModif = this.fetchAllModifications({ activate: false, force: true }) as Promise<DecisionApiResponse>;
            fetchedModif
                .then((response: DecisionApiResponse) => {
                    const castResponse = response as DecisionApiResponse;
                    flagshipSdkHelper.checkDecisionApiResponseFormat(castResponse, this.log);
                    const campaigns = castResponse.data.campaigns as DecisionApiCampaign[];
                    const { detailsModifications } = this.extractDesiredModifications(
                        campaigns,
                        [{ key, defaultValue: '', activate: false }],
                        false
                    ) as { detailsModifications: { [key: string]: any } };
                    if (!detailsModifications[key]) {
                        resolve(null);
                    } else if (detailsModifications[key].campaignId.length > 1) {
                        const consideredCampaignId = detailsModifications[key].campaignId[0];
                        this.log.warn(
                            `Modification "${key}" is involved in further campgains with:\nid="${detailsModifications[
                                key
                            ].campaignId.toString()}"\nKeeping data from:\ncampaignId="${consideredCampaignId}"`
                        );
                        resolve(polishOutput(campaigns.filter((cpgn) => cpgn.id === consideredCampaignId)[0]));
                    }
                    resolve(polishOutput(campaigns.filter((cpgn) => cpgn.id === detailsModifications[key].campaignId[0])[0]));
                })
                .catch((error: Error) => {
                    this.fetchedModifications = null;
                    reject(error);
                });
        });
    }

    // deprecated
    public getModificationsCache(
        modificationsRequested: FsModifsRequestedList,
        activateAllModifications: boolean | null = null
    ): GetModificationsOutput {
        if (!this.fetchedModifications) {
            this.log.warn('No modifications found in cache...');
            const { desiredModifications } = this.extractDesiredModifications([], modificationsRequested, activateAllModifications);
            return desiredModifications;
        }
        const response = this.fetchAllModifications({
            activate: !!activateAllModifications,
            loadFromCache: true
        }) as DecisionApiResponseData;
        return this.getModificationsPostProcess(response, modificationsRequested, activateAllModifications);
    }

    // deprecated
    public setContext(context: FlagshipVisitorContext): void {
        this.context = context;
    }

    public updateContext(context: FlagshipVisitorContext): void {
        this.setContext(flagshipSdkHelper.checkVisitorContext(context, this.log));
    }

    public synchronizeModifications(activate = false): Promise<number> {
        if (this.config.decisionMode === 'Bucketing' && this.bucket !== null) {
            this.bucket.updateVisitorContext(this.context);
        }
        return new Promise((resolve, reject) => {
            const fetchedModifPromise = this.fetchAllModifications({ activate, force: true }) as Promise<DecisionApiResponse>;
            fetchedModifPromise
                .then((response: DecisionApiResponse) => {
                    const castResponse = response as DecisionApiResponse;
                    const output = flagshipSdkHelper.checkDecisionApiResponseFormat(castResponse, this.log);
                    this.fetchedModifications = (output && output.campaigns) || null;
                    resolve(castResponse.status || 200);
                })
                .catch((error: Error) => {
                    this.fetchedModifications = null;
                    reject(error);
                });
        });
    }

    public getModificationsForCampaign(campaignId: string, activate = false): Promise<DecisionApiResponse> {
        return this.fetchAllModifications({ activate, campaignCustomID: campaignId }) as Promise<DecisionApiResponse>;
    }

    public getAllModifications(activate = false, options = { force: false }): Promise<DecisionApiResponse> {
        return this.fetchAllModifications({ activate, force: options.force }) as Promise<DecisionApiResponse>;
    }

    private fetchAllModificationsPostProcess(
        response: DecisionApiResponseData | DecisionApiResponse,
        {
            activate,
            campaignCustomID
        }: {
            activate: boolean;
            campaignCustomID: string | null;
        }
    ): { data: DecisionApiResponseData } {
        const completeResponse = response as DecisionApiResponse;
        const reshapeResponse = completeResponse.data ? completeResponse : { data: response };
        const responseData = completeResponse.data ? completeResponse.data : (response as DecisionApiResponseData);
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
                        campaigns: filteredCampaigns
                    }
                };
            } else {
                // default behavior
                const { detailsModifications /* , mergedModifications */ } = this.analyseModifications(responseData.campaigns, !!activate);
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
                this.activateCampaign(filteredCampaigns[0].variation.id, filteredCampaigns[0].variationGroupId);
            } else {
                this.triggerActivateIfNeeded(analysedModifications);
            }
        }

        // PART 3: Return the data
        return output;
    }

    private saveModificationsInCache(data: DecisionApiCampaign[] | null): void {
        let haveBeenCalled = false;
        const previousFetchedModifications = this.fetchedModifications;

        const callback = (campaigns: DecisionApiCampaign[] | null = data): void => {
            haveBeenCalled = true;
            this.log.debug(
                `saveModificationsInCache - saving in cache modifications returned by the callback: ${
                    Array.isArray(campaigns) ? JSON.stringify(campaigns) : campaigns
                }`
            );
            this.fetchedModifications = campaigns || null;
        };

        this.emit('saveCache', {
            saveInCacheModifications: callback,
            modifications: {
                before: this.fetchedModifications,
                after: data || null
            }
        });

        // if callback not used, do default behavior
        if (!haveBeenCalled) {
            if (data === null && previousFetchedModifications && this.config.decisionMode === 'Bucketing') {
                this.log.info('saveModificationsInCache - keeping previous cache since bucketing did not return data');
            } else {
                this.fetchedModifications = data || null; // default behavior
                this.log.debug(
                    `saveModificationsInCache - saving in cache those modifications: "${
                        this.fetchedModifications ? JSON.stringify(this.fetchedModifications) : 'null'
                    }"`
                );
            }
        }
    }

    private fetchAllModifications(args: {
        activate?: boolean;
        campaignCustomID?: string | null;
        force?: boolean;
        loadFromCache?: boolean;
    }): Promise<DecisionApiResponse> | DecisionApiResponseData {
        const defaultArgs = {
            activate: false,
            campaignCustomID: null,
            force: false,
            loadFromCache: false
        };
        const { activate, force, loadFromCache /* , campaignCustomID, */ } = { ...defaultArgs, ...args };
        const url = `${this.config.flagshipApi}${this.envId}/campaigns?mode=normal`;

        // check if need to return without promise
        if (loadFromCache) {
            if (this.fetchedModifications && !force) {
                this.log.debug('fetchAllModifications - loadFromCache enabled');
                return this.fetchAllModificationsPostProcess(
                    { visitorId: this.id, campaigns: this.fetchedModifications as DecisionApiCampaign[] },
                    { ...defaultArgs, ...args }
                ).data;
            }
            this.log.fatal(
                'fetchAllModifications - loadFromCache enabled but no data in cache. Make sure you fetched at least once before.'
            );
            return { visitorId: this.id, campaigns: this.fetchedModifications as DecisionApiCampaign[] };
        }

        // default: return a promise
        return new Promise((resolve, reject) => {
            if (this.fetchedModifications && !force) {
                this.log.info('fetchAllModifications - no calls to the Decision API because it has already been fetched before');
                resolve(
                    this.fetchAllModificationsPostProcess(
                        { visitorId: this.id, campaigns: this.fetchedModifications as DecisionApiCampaign[] },
                        { ...defaultArgs, ...args }
                    ) as DecisionApiResponse
                );
            } else if (this.config.decisionMode === 'Bucketing') {
                let transformedBucketingData: DecisionApiResponseData = { visitorId: this.id, campaigns: [] };
                if (this.bucket && this.bucket.computedData) {
                    transformedBucketingData = { ...transformedBucketingData, campaigns: this.bucket.computedData.campaigns };
                    this.saveModificationsInCache(transformedBucketingData.campaigns);
                    resolve(
                        this.fetchAllModificationsPostProcess(transformedBucketingData, {
                            ...defaultArgs,
                            ...args
                        }) as DecisionApiResponse
                    );
                } else {
                    this.log.info('fetchAllModifications - no data in current bucket, waiting for bucket to start...');
                    this.sdkListener.once('bucketPollingSuccess', (data) => {
                        (this.bucket as IFlagshipBucketingVisitor).updateCache(data);
                        transformedBucketingData = {
                            ...transformedBucketingData,
                            campaigns: ((this.bucket as IFlagshipBucketingVisitor).computedData as DecisionApiResponseData).campaigns
                        };
                        this.saveModificationsInCache(transformedBucketingData.campaigns);
                        this.log.debug('fetchAllModifications - bucket start detected');
                        if (activate) {
                            const { detailsModifications } = this.analyseModifications(transformedBucketingData.campaigns, true);
                            this.log.debug(
                                `fetchAllModifications - activateNow enabled with bucketing mode. ${detailsModifications.length} campaign(s) will be activated.`
                            );
                            this.triggerActivateIfNeeded(detailsModifications);
                        }
                        resolve(
                            this.fetchAllModificationsPostProcess(transformedBucketingData, {
                                ...defaultArgs,
                                ...args
                            }) as DecisionApiResponse
                        );
                    });
                    this.sdkListener.once('bucketPollingFailed', (error) => {
                        this.log.fatal(`fetchAllModifications - bucketing failed with error "${error}"`);
                        this.saveModificationsInCache(null);
                        reject(error);
                    });
                }
            } else {
                const additionalParam: { [key: string]: string } = {};
                if (this.config.apiKey) {
                    additionalParam['x-api-key'] = this.config.apiKey;
                }
                axios
                    .post(url, {
                        visitor_id: this.id,
                        trigger_hit: activate, // TODO: to unit test
                        context: this.context,
                        ...additionalParam
                    })
                    .then((response: DecisionApiResponse) => {
                        this.saveModificationsInCache(response.data.campaigns);
                        resolve(this.fetchAllModificationsPostProcess(response, { ...defaultArgs, ...args }) as DecisionApiResponse);
                    })
                    .catch((response: Error) => {
                        this.saveModificationsInCache(null);
                        this.log.fatal('fetchAllModifications - an error occurred while fetching...');
                        if (activate) {
                            this.log.fatal('fetchAllModifications - activate canceled due to errors...');
                        }
                        reject(response);
                    });
            }
        });
    }

    private generateCustomTypeParamsOf(hitData: HitShape): object | null {
        const optionalAttributes: { [key: string]: string | number | boolean } = {};
        // TODO: move common optional attributes before switch statement (ie: "pageTitle", "documentLocation",...)
        switch (hitData.type.toUpperCase()) {
            case 'SCREEN':
            case 'SCREENVIEW': {
                const { documentLocation, pageTitle } = hitData.data;
                if (!documentLocation || !pageTitle) {
                    if (!documentLocation)
                        this.log.error(
                            'sendHits(ScreenView) - failed because following required attribute "documentLocation" is missing...'
                        );
                    if (!pageTitle)
                        this.log.error('sendHits(ScreenView) - failed because following required attribute "pageTitle" is missing...');
                    return null;
                }
                return {
                    t: 'SCREENVIEW',
                    dl: documentLocation,
                    pt: pageTitle
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
                    itemCount
                } = hitData.data as TransactionHit;

                if (totalRevenue) {
                    optionalAttributes.tr = totalRevenue; // number, max length = NONE
                }
                if (shippingCost) {
                    optionalAttributes.ts = shippingCost; // number, max length = NONE
                }
                if (taxes) {
                    optionalAttributes.tt = taxes; // number, max length = NONE
                }
                if (currency) {
                    optionalAttributes.tc = currency; // string, max length = 10 BYTES
                }
                if (couponCode) {
                    optionalAttributes.tcc = couponCode; // string, max length = 10 BYTES
                }
                if (paymentMethod) {
                    optionalAttributes.pm = paymentMethod; // string, max length = 10 BYTES
                }
                if (shippingMethod) {
                    optionalAttributes.sm = shippingMethod; // string, max length = 10 BYTES
                }
                if (itemCount) {
                    optionalAttributes.icn = itemCount; // number, max length = NONE
                }
                if (documentLocation) {
                    optionalAttributes.dl = documentLocation; // string, max length = 2048 BYTES
                }
                if (pageTitle) {
                    optionalAttributes.pt = pageTitle; // string, max length = 1500 BYTES
                }
                if (!transactionId || !affiliation) {
                    if (!transactionId)
                        this.log.error('sendHits(Transaction) - failed because following required attribute "transactionId" is missing...');
                    if (!affiliation)
                        this.log.error('sendHits(Transaction) - failed because following required attribute "affiliation" is missing...');
                    return null;
                }

                return {
                    t: 'TRANSACTION',
                    tid: transactionId, // string, max length = 500 BYTES
                    ta: affiliation, // string, max length = 500 BYTES
                    ...optionalAttributes
                };
            }
            case 'ITEM': {
                const { transactionId, name, documentLocation, pageTitle, price, code, category, quantity } = hitData.data as ItemHit;

                if (price) {
                    optionalAttributes.ip = price; // number, max length = NONE
                }
                if (quantity) {
                    optionalAttributes.iq = quantity; // number, max length = NONE
                }
                if (category) {
                    optionalAttributes.iv = category; // string, max length = 500 BYTES
                }
                if (documentLocation) {
                    optionalAttributes.dl = documentLocation; // string, max length = 2048 BYTES
                }
                if (pageTitle) {
                    optionalAttributes.pt = pageTitle; // string, max length = 1500 BYTES
                }
                if (!transactionId || !name || !code) {
                    if (!transactionId)
                        this.log.error('sendHits(Item) - failed because following required attribute "transactionId" is missing...');
                    if (!name) this.log.error('sendHits(Item) - failed because following required attribute "name" is missing...');
                    if (!code) this.log.error('sendHits(Item) - failed because following required attribute "code" is missing...');
                    return null;
                }

                return {
                    t: 'ITEM',
                    tid: transactionId, // string, max length = 500 BYTES
                    in: name, // string, max length = 500 BYTES
                    ic: code, // string, max length = 500 BYTES
                    ...optionalAttributes
                };
            }
            case 'EVENT': {
                const { label, value, documentLocation, category, pageTitle, action } = hitData.data as EventHit;

                if (label) {
                    optionalAttributes.el = label; // string, max length = 500 BYTES
                }
                if (value) {
                    optionalAttributes.ev = value; // string, max length = 500 BYTES
                }
                if (documentLocation) {
                    optionalAttributes.dl = documentLocation; // string, max length = 2048 BYTES
                }
                if (pageTitle) {
                    optionalAttributes.pt = pageTitle; // string, max length = 1500 BYTES
                }
                if (!category || !action) {
                    this.log.debug(`sendHits(Event) - this hits is missing attributes:\n${JSON.stringify(hitData)}`);
                    if (!category) this.log.error('sendHits(Event) - failed because following required attribute "category" is missing...');
                    if (!action) this.log.error('sendHits(Event) - failed because following required attribute "action" is missing...');
                    return null;
                }

                return {
                    t: 'EVENT',
                    ea: action, // string, max length = 500 BYTES
                    ec: category, // string, max length = 150 BYTES
                    ...optionalAttributes
                };
            }
            default:
                this.log.error(`sendHits - no type found for hit: "${JSON.stringify(hitData)}"`);
                return null;
        }
    }

    public sendHits(hitsArray: Array<HitShape>): Promise<void> {
        const payloads: any[] = [];
        const url = 'https://ariane.abtasty.com';
        const handleHitsError = (error: Error): void => {
            this.log.fatal(`sendHits - fail with error: "${error}"`);
        };
        return new Promise((resolve, reject) => {
            const promises = Promise.all(
                hitsArray.map(async (hit) => {
                    const customParams = this.generateCustomTypeParamsOf(hit);
                    if (customParams) {
                        const payload = {
                            vid: this.id, // string, max length = NONE
                            cid: this.envId, // string, max length = NONE
                            ds: 'APP', // string, max length = NONE
                            ...customParams
                        };
                        payloads.push(payload);
                        return axios.post(url, payload).then(() => ({ skipped: false, ...payload }));
                    }
                    this.log.debug(`sendHits - skip request to "${url}" because current hit not set correctly`);
                    return new Promise((resolveAuto) => resolveAuto({ skipped: true })); // do nothing
                })
            ) as Promise<{ [key: string]: any; skipped: boolean }[]>;

            promises
                .then((data) => {
                    data.forEach((d) => {
                        if (d && !d.skipped) {
                            this.log.info(`sendHits - hit (type"${d.t}") send successfully`);
                            this.log.debug(`sendHits - with url ${url}`);
                            this.log.debug(`sendHits - with payload:\n${payloads.map((p) => `${JSON.stringify(p)}\n`)}`);
                        }
                    });
                    resolve();
                })
                .catch((error) => {
                    handleHitsError(error);
                    reject(error);
                });
        });
    }

    public sendHit(hitData: HitShape): Promise<void> {
        return this.sendHits([hitData]);
    }
}

export default FlagshipVisitor;
