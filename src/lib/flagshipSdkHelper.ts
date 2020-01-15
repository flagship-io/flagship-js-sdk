import { DecisionApiResponse } from '../class/flagshipVisitor/flagshipVisitor.d';
import defaultConfig from '../config/default';
import { FsLogger } from './index.d';

const flagshipSdkHelper = {
  logIgnoredAttributesFromObject: (obj: object, log: FsLogger, objectName = ''): void => {
    let hasDirtyValues = false;
    Object.entries(obj).forEach(
      ([key, value]) => {
        hasDirtyValues = true;
        log.warn(`Unknown key "${key}" detected (with value="${value}"). This key has been ignored... - ${objectName}`);
      },
    );
    if (!hasDirtyValues) {
      log.debug(`No unknown key detected :) - ${objectName}`);
    }
  },
  checkConfig: (unknownConfig: object): {cleanConfig: object; ignoredConfig: object} => {
    const cleanObject: {[key: string]: string} = {};
    const dirtyObject: {[key: string]: string} = {};
    const validAttributesList: Array<string> = [];
    Object.entries(defaultConfig).forEach(
      ([key]) => validAttributesList.push(key),
    );
    Object.entries(unknownConfig).forEach(
      ([key, value]) => {
        if (validAttributesList.includes(key)) {
          cleanObject[key] = value;
        } else {
          dirtyObject[key] = value;
        }
      },
    );
    return { cleanConfig: { ...cleanObject }, ignoredConfig: { ...dirtyObject } };
  },
  checkDecisionApiResponseFormat: (response: DecisionApiResponse, log: FsLogger): DecisionApiResponse | null => {
    if (!response.status || !response.data || !response.data.campaigns) {
      log.warn('Unknow Decision Api response received or error happened'); // TODO: can be improved according status value
      return null;
    }
    return response;
  },
};

export default flagshipSdkHelper;
