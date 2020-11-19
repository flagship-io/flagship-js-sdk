import { IFsCacheManager } from '../../types';

const CLIENT_CACHE_KEY = 'FS_CLIENT_VISITOR';

const clientCacheManager: IFsCacheManager = {
    saveVisitorProfile: (visitorId, visitorProfile) => {
        localStorage.setItem(CLIENT_CACHE_KEY, JSON.stringify(visitorProfile));
    },
    loadVisitorProfile: (visitorId) => {
        const data = localStorage.getItem(CLIENT_CACHE_KEY);
        return data ? JSON.parse(data) : null;
    }
};

export default clientCacheManager;
