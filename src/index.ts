import Flagship from './class/flagship/flagship';
import { FlagshipNodeSdk } from './types';

export const flagship: FlagshipNodeSdk = {
    start: (envId, config) => new Flagship(envId, config)
};

export default flagship as FlagshipNodeSdk;
