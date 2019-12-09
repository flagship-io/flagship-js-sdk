import Flagship from './class/flagship/flagship';
import { FlagshipNodeSdk } from './index.d';

const flagship: FlagshipNodeSdk = {
  initSdk: (envId, config) => new Flagship(envId, config),
};

export default flagship;
