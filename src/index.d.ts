/* eslint-disable @typescript-eslint/interface-name-prefix */
import { EventEmitter } from 'events';
import {
  FlagshipVisitorContext, FsModifsRequestedList, DecisionApiResponse, DecisionApiResponseData, HitShape, GetModificationsOutput,
} from './class/flagshipVisitor/flagshipVisitor.d';

export type FlagshipSdkConfig = {
  fetchNow?: boolean;
  activateNow?: boolean;
  logPathName?: string;
  enableConsoleLogs?: boolean;
  nodeEnv?: string;
  flagshipApi?: string;
};

export type SaveCacheArgs = {
  modifications: {
    before: DecisionApiResponseData | null;
    after: DecisionApiResponseData | null;
  };
  saveInCacheModifications(modificationsToSaveInCache: DecisionApiResponseData | null): void;
}

export interface IFlagshipVisitor extends EventEmitter {
  config: FlagshipSdkConfig;
  id: string;
  log: any;
  envId: string;
  context: FlagshipVisitorContext;
  isAllModificationsFetched: boolean;
  fetchedModifications: DecisionApiResponseData | null;
  activateModifications(modifications: Array<{ key: string; variationId?: string; variationGroupId?: string }>): void;
  getModifications(modificationsRequested: FsModifsRequestedList, activateAllModifications?: boolean | null): Promise<GetModificationsOutput>;
  getModificationsCache(modificationsRequested: FsModifsRequestedList, activateAllModifications: boolean | null,): GetModificationsOutput;
  setContext(context: FlagshipVisitorContext): void;
  updateContext(context: FlagshipVisitorContext): void;
  synchronizeModifications(activate?: boolean): Promise<number>;
  getModificationsForCampaign(campaignId: string, activate?: boolean): Promise<DecisionApiResponse>;
  getAllModifications(activate?: boolean): Promise<DecisionApiResponse>;
  sendHits(hitsArray: Array<HitShape>): Promise<void>;
  on(event: 'ready', listener: (name: string) => void): this;
  on(event: 'saveCache', listener: (name: string, args: SaveCacheArgs) => void): this;
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
