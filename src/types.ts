import { EventEmitter } from 'events';
import { FsLogger } from '@flagship.io/js-sdk-logs';
import { CancelTokenSource } from 'axios';
import {
    FlagshipVisitorContext,
    FsModifsRequestedList,
    DecisionApiResponse,
    HitShape,
    GetModificationsOutput,
    DecisionApiCampaign,
    GetModificationInfoOutput,
    DecisionApiResponseData,
    DecisionApiSimpleResponse,
    ModificationsInternalStatus
} from './class/flagshipVisitor/types';
import { BucketingApiResponse } from './class/bucketing/types';
import { SetPanicModeToOptions } from './class/panicMode/types';

export type MurmurV3 = (value: string, seed?: number) => number;

export type PostFlagshipApiCallback = (
    axiosCallback: () => Promise<any>,
    cancelTokenSource: CancelTokenSource,
    config: FlagshipSdkConfig
) => Promise<any>;

export interface IFsVisitorProfile {
    id: string; // required
    anonymousId?: string | null;
    context?: FlagshipVisitorContext;
    campaigns?: DecisionApiCampaign[];
}

export interface IFsCacheManager {
    saveVisitorProfile: (visitorId: string, visitorProfile: IFsVisitorProfile) => void;
    loadVisitorProfile: (visitorId: string) => IFsVisitorProfile | null;
}

export type IFlagshipCore = {
    log: FsLogger;
    config: FlagshipSdkConfig;
    envId: string;
    cacheManager: IFsCacheManager | null; // only defined on client side for now...
    panic: IFsPanicMode;
};

export type FlagshipSdkConfig = {
    fetchNow?: boolean;
    pollingInterval?: number | null;
    activateNow?: boolean;
    enableConsoleLogs?: boolean;
    decisionMode?: 'API' | 'Bucketing';
    nodeEnv?: string;
    enableClientCache?: boolean;
    flagshipApi?: string;
    apiKey?: string | null;
    initialModifications?: DecisionApiCampaign[] | null;
    initialBucketing?: BucketingApiResponse | null;
    timeout?: number;
    internal?: {
        react?: {};
        reactNative?: {
            httpCallback?: PostFlagshipApiCallback;
        };
    };
};

export type FlagshipSdkInternalConfig = {
    campaignNormalEndpoint: string;
    bucketingEndpoint: string;
    apiV1: string;
    apiV2: string;
    pollingIntervalMinValue: number;
};

export type SaveCacheArgs = {
    modifications: {
        before: DecisionApiCampaign[] | null;
        after: DecisionApiCampaign[] | null;
    };
    saveInCacheModifications(modificationsToSaveInCache: DecisionApiCampaign[] | null): void;
};

export interface IFsPanicMode {
    enabled: boolean;
    beginDate: Date | null;
    log: FsLogger;
    setPanicModeTo(value: boolean, options?: SetPanicModeToOptions): void;
    checkPanicMode(response: DecisionApiResponseData | BucketingApiResponse): void;
    shouldRunSafeMode(functionName: string, options?: { logType: 'debug' | 'error' }): boolean;
}

export interface IFlagshipBucketingVisitor extends IFlagshipCore {
    data: BucketingApiResponse | null;
    computedData: DecisionApiResponseData | null;
    visitorId: string;
    visitorContext: FlagshipVisitorContext;
    global: IFlagshipBucketing;
    getEligibleCampaigns(): DecisionApiCampaign[];
    updateCache(): boolean;
    updateVisitorContext(newContext: FlagshipVisitorContext): void;
}

export interface IFlagshipBucketing extends EventEmitter, IFlagshipCore {
    data: BucketingApiResponse | null;
    isPollingRunning: boolean;
    lastModifiedDate: string | null;
    callApi(): Promise<BucketingApiResponse | void>;
    startPolling(): void;
    stopPolling(): void;
    on(event: 'launched', listener: ({ status: number }) => void): this;
    on(event: 'error', listener: (args: Error) => void): this;
}

export type ReadyListenerOutput = {
    withError: boolean;
    error: Error | null;
};

export interface IFlagshipVisitor extends EventEmitter, IFlagshipCore {
    id: string;
    anonymousId: string;
    context: FlagshipVisitorContext;
    isAllModificationsFetched: boolean;
    isAuthenticated: boolean;
    bucket: IFlagshipBucketingVisitor | null;
    fetchedModifications: DecisionApiCampaign[] | null;
    modificationsInternalStatus: ModificationsInternalStatus | null;
    // UPDATE VISITOR
    updateContext(context: FlagshipVisitorContext): void;
    authenticate(id: string): Promise<void>;
    unauthenticate(visitorId?: string): Promise<void>;
    // VISITOR MODIFICATIONS
    getModifications(modificationsRequested: FsModifsRequestedList, activateAllModifications?: boolean): GetModificationsOutput;
    getModificationInfo(key: string): Promise<null | GetModificationInfoOutput>;
    synchronizeModifications(activate?: boolean): Promise<number>;
    getModificationsForCampaign(campaignId: string, activate?: boolean): Promise<DecisionApiResponse>;
    getAllModifications(
        activate?: boolean,
        options?: { force?: boolean; simpleMode?: boolean }
    ): Promise<DecisionApiResponse | DecisionApiSimpleResponse>;
    activateModifications(
        modifications: Array<{
            key: string;
            variationId?: string;
            variationGroupId?: string;
        }>
    ): void;
    // VISITOR HITS
    sendHit(hitData: HitShape): Promise<void>;
    sendHits(hitsArray: Array<HitShape>): Promise<void>;
    // VISITOR LISTENER
    on(event: 'ready', listener: (args: ReadyListenerOutput) => void): this;
    on(event: 'saveCache', listener: (args: SaveCacheArgs) => void): this;
}

export interface IFlagship extends IFlagshipCore {
    eventEmitter: EventEmitter;
    bucket: IFlagshipBucketing | null;
    newVisitor(id: string, context: FlagshipVisitorContext, options?: { isAuthenticated?: boolean }): IFlagshipVisitor;
    startBucketingPolling(): { success: boolean; reason?: string };
    stopBucketingPolling(): { success: boolean; reason?: string };
}

export interface FlagshipNodeSdk {
    start(envId: string, apiKeyOrSettings?: any, config?: FlagshipSdkConfig): IFlagship;
}

export type NewVisitorOptions = {
    isAuthenticated?: boolean;
};
