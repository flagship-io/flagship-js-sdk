import Flagship from './class/flagship/flagship';
import { FlagshipNodeSdk } from './index.d';

export const flagship: FlagshipNodeSdk = {
  initSdk: (envId, config) => new Flagship(envId, config), // deprecated
  start: (envId, config) => new Flagship(envId, config),
};

export default flagship as FlagshipNodeSdk;
