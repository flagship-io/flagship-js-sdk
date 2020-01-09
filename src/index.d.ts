/* eslint-disable @typescript-eslint/interface-name-prefix */
import { EventEmitter } from 'events';
import {
  FlagshipVisitorContext, FsModifsRequestedList, DecisionApiResponse, DecisionApiSimpleResponse, HitShape, GetModificationsOutput,
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
  fetchedModifications: DecisionApiResponse | null;
  getModifications(modificationsRequested: FsModifsRequestedList, activateAllModifications?: boolean | null): Promise<GetModificationsOutput>;
  setContext(context: FlagshipVisitorContext): void;
  synchronizeModifications(activate?: boolean): Promise<number>;
  getModificationsForCampaign(campaignId: string, activate?: boolean, fetchMode?: 'simple' | 'normal'): Promise<DecisionApiResponse | DecisionApiSimpleResponse>;
  getAllModifications(activate?: boolean, fetchMode?: 'simple' | 'normal'): Promise<DecisionApiResponse | DecisionApiSimpleResponse>;
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
