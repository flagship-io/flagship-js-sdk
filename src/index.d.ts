import { EventEmitter } from 'events';
import { FsLogger } from '@flagship.io/js-sdk-logs';
/* eslint-disable @typescript-eslint/interface-name-prefix */
import {
    FlagshipVisitorContext,
    FsModifsRequestedList,
    DecisionApiResponse,
    HitShape,
    GetModificationsOutput,
    DecisionApiCampaign,
    GetModificationInfoOutput,
    DecisionApiResponseData
} from './class/flagshipVisitor/flagshipVisitor.d';
import { BucketingApiResponse } from './class/bucketing/bucketing.d';

export type FlagshipSdkConfig = {
    fetchNow?: boolean;
    pollingInterval?: number;
    activateNow?: boolean;
    enableConsoleLogs?: boolean;
    decisionMode: 'API' | 'Bucketing';
    nodeEnv?: string;
    flagshipApi?: string;
    apiKey?: string | null;
    initialModifications?: DecisionApiCampaign[] | null;
};

export type FlagshipSdkInternalConfig = {
    bucketingEndpoint: string;
};

export type SaveCacheArgs = {
    modifications: {
        before: DecisionApiCampaign[] | null;
        after: DecisionApiCampaign[] | null;
    };
    saveInCacheModifications(modificationsToSaveInCache: DecisionApiCampaign[] | null): void;
};

export interface IFlagshipBucketing extends EventEmitter {
    data: BucketingApiResponse | null;
    log: FsLogger;
    envId: string;
    config: FlagshipSdkConfig;
    getEligibleCampaigns(
        bucketingData: BucketingApiResponse,
        visitor: { id: string; context: FlagshipVisitorContext }
    ): DecisionApiCampaign[];
    launch(): Promise<BucketingApiResponse | void>;
    on(event: 'launched', listener: () => void): this;
    on(event: 'error', listener: (args: Error) => void): this;
}

export interface IFlagshipVisitor extends EventEmitter {
    config: FlagshipSdkConfig;
    id: string;
    bucket: IFlagshipBucketing | null;
    log: FsLogger;
    envId: string;
    context: FlagshipVisitorContext;
    isAllModificationsFetched: boolean;
    fetchedModifications: DecisionApiCampaign[] | null;
    activateModifications(
        modifications: Array<{
            key: string;
            variationId?: string;
            variationGroupId?: string;
        }>
    ): void;
    getModifications(modificationsRequested: FsModifsRequestedList, activateAllModifications?: boolean): GetModificationsOutput;
    getModificationsCache(modificationsRequested: FsModifsRequestedList, activateAllModifications?: boolean): GetModificationsOutput;
    getModificationInfo(key: string): Promise<null | GetModificationInfoOutput>;
    setContext(context: FlagshipVisitorContext): void;
    updateContext(context: FlagshipVisitorContext): void;
    synchronizeModifications(activate?: boolean): Promise<number>;
    getModificationsForCampaign(campaignId: string, activate?: boolean): Promise<DecisionApiResponse>;
    getAllModifications(activate?: boolean, options?: { force?: boolean }): Promise<DecisionApiResponse>;
    sendHit(hitData: HitShape): Promise<void>;
    sendHits(hitsArray: Array<HitShape>): Promise<void>;
    on(event: 'ready', listener: () => void): this;
    on(event: 'saveCache', listener: (args: SaveCacheArgs) => void): this;
}
export interface IFlagship {
    config: FlagshipSdkConfig;
    log: FsLogger;
    envId: string;
    newVisitor(id: string, context: FlagshipVisitorContext): IFlagshipVisitor;
}

export interface FlagshipNodeSdk {
    initSdk(envId: string, config?: FlagshipSdkConfig): IFlagship;
    start(envId: string, config?: FlagshipSdkConfig): IFlagship;
}
