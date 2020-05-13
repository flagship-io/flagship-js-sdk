import { EventEmitter } from 'events';
/* eslint-disable @typescript-eslint/interface-name-prefix */
import {
  FlagshipVisitorContext, FsModifsRequestedList, DecisionApiResponse, DecisionApiResponseData, HitShape, GetModificationsOutput, DecisionApiCampaign,
} from './class/flagshipVisitor/flagshipVisitor.d';

export type FlagshipSdkConfig = {
  fetchNow?: boolean;
  activateNow?: boolean;
  enableConsoleLogs?: boolean;
  nodeEnv?: string;
  flagshipApi?: string;
  apiKey?: string | null;
  initialModifications?: DecisionApiCampaign[] | null;
};

export type SaveCacheArgs = {
  modifications: {
    before: DecisionApiCampaign[] | null;
    after: DecisionApiCampaign[] | null;
  };
  saveInCacheModifications(modificationsToSaveInCache: DecisionApiCampaign[] | null): void;
}

export interface IFlagshipVisitor extends EventEmitter {
  config: FlagshipSdkConfig;
  id: string;
  log: any;
  envId: string;
  context: FlagshipVisitorContext;
  isAllModificationsFetched: boolean;
  fetchedModifications: DecisionApiCampaign[] | null;
  activateModifications(modifications: Array<{ key: string; variationId?: string; variationGroupId?: string }>): void;
  getModifications(modificationsRequested: FsModifsRequestedList, activateAllModifications: boolean | null,): GetModificationsOutput;
  getModificationsCache(modificationsRequested: FsModifsRequestedList, activateAllModifications: boolean | null,): GetModificationsOutput;
  setContext(context: FlagshipVisitorContext): void;
  updateContext(context: FlagshipVisitorContext): void;
  synchronizeModifications(activate?: boolean): Promise<number>;
  getModificationsForCampaign(campaignId: string, activate?: boolean): Promise<DecisionApiResponse>;
  getAllModifications(activate?: boolean, options?: {force?: boolean}): Promise<DecisionApiResponse>;
  sendHit(hitData: HitShape): Promise<void>;
  sendHits(hitsArray: Array<HitShape>): Promise<void>;
  on(event: 'ready', listener: () => void): this;
  on(event: 'saveCache', listener: (args: SaveCacheArgs) => void): this;
}
export interface IFlagship {
  config: FlagshipSdkConfig;
    log: any;
    envId: string;
    newVisitor(id: string, context: FlagshipVisitorContext): IFlagshipVisitor; // deprecated
    createVisitor(id: string, context: FlagshipVisitorContext): IFlagshipVisitor;
}

export interface FlagshipNodeSdk {
  initSdk(
    envId: string,
    config?: FlagshipSdkConfig
  ): IFlagship;
  start(
    envId: string,
    config?: FlagshipSdkConfig
  ): IFlagship;
}
