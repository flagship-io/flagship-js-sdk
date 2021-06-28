import { IFsCacheManager } from '../../types';

export const CLIENT_CACHE_KEY = 'FS_CLIENT_VISITOR';

const clientCacheManager: IFsCacheManager = {
    saveVisitorProfile: (visitorId, visitorProfile) => {
        try {
            localStorage.setItem(CLIENT_CACHE_KEY, JSON.stringify(visitorProfile));
        } catch {}
    },
    loadVisitorProfile: (visitorId) => {
        let data;
        try {
            data = localStorage.getItem(CLIENT_CACHE_KEY);
        } catch {
            data = null;
        }
        return data ? JSON.parse(data) : null;
    }
};

export default clientCacheManager;
