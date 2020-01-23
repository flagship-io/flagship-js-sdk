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

export interface IFlagshipVisitor extends EventEmitter {
  config: FlagshipSdkConfig;
  id: string;
  log: any;
  envId: string;
  context: FlagshipVisitorContext;
  isAllModificationsFetched: boolean;
  fetchedModifications: DecisionApiResponseData | null;
  getModifications(modificationsRequested: FsModifsRequestedList, activateAllModifications?: boolean | null): Promise<GetModificationsOutput>;
  setContext(context: FlagshipVisitorContext): void;
  synchronizeModifications(activate?: boolean): Promise<number>;
  getModificationsForCampaign(campaignId: string, activate?: boolean): Promise<DecisionApiResponse>;
  getAllModifications(activate?: boolean): Promise<DecisionApiResponse>;
  sendHits(hitsArray: Array<HitShape>): Promise<void>;
}
export interface IFlagship {
  config: FlagshipSdkConfig;
    log: any;
    envId: string;
    newVisitor(id: string, context: FlagshipVisitorContext): IFlagshipVisitor;
}

export interface FlagshipNodeSdk {
  initSdk(
    envId: string,
    config?: FlagshipSdkConfig
  ): IFlagship;
}
