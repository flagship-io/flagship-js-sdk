import { IFsLocalStorage } from '../../types';

const SDK_LOCAL_STORAGE_PREFIX = 'FS_';

// eslint-disable-next-line import/prefer-default-export
export const clientLocalStorage: IFsLocalStorage = {
    get: (key) => localStorage.getItem(SDK_LOCAL_STORAGE_PREFIX + key.toUpperCase()),
    set: (key, value) => localStorage.setItem(SDK_LOCAL_STORAGE_PREFIX + key.toUpperCase(), value),
    remove: (key) => localStorage.removeItem(SDK_LOCAL_STORAGE_PREFIX + key.toUpperCase()),
    clear: () => {
        Object.keys(localStorage)
            .filter((key) => key.startsWith(SDK_LOCAL_STORAGE_PREFIX))
            .forEach((key) => clientLocalStorage.remove(key));
    }
};
