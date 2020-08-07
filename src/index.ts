import Flagship from './class/flagship/flagship';
import { FlagshipNodeSdk, FlagshipSdkConfig, IFlagship } from './types';

function startLegacy(envId: string, config?: FlagshipSdkConfig): IFlagship {
    return new Flagship(envId, undefined, config);
}

// NOTE: apiKeyOrSettings (any) will become apiKey (string) in next major release
function start(envId: string, apiKeyOrSettings?: any, config?: FlagshipSdkConfig): IFlagship {
    if (typeof apiKeyOrSettings === 'object' && !Array.isArray(apiKeyOrSettings)) {
        return startLegacy(envId, apiKeyOrSettings as FlagshipSdkConfig);
    }
    return new Flagship(envId, apiKeyOrSettings as string, config);
}

export const flagship: FlagshipNodeSdk = {
    start
};

export default flagship as FlagshipNodeSdk;
