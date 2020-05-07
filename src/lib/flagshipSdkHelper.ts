import { FsLogger } from '@flagship.io/js-sdk-logs';
import { validate } from 'validate.js';
import { DecisionApiResponseData, DecisionApiResponse } from '../class/flagshipVisitor/flagshipVisitor.d';

import defaultConfig from '../config/default';

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
  checkDecisionApiResponseFormat: (response: DecisionApiResponse, log: FsLogger): DecisionApiResponseData | null => {
    if (!response.status || !response.data || !response.data.campaigns) {
      log.warn('Unknow Decision Api response received or error happened'); // TODO: can be improved according status value
      return null;
    }
    return response.data;
  },
  validateDecisionApiData: (data: DecisionApiResponseData, log: FsLogger): null | DecisionApiResponseData => {
    const constraints = {
      visitorId: {
        presence: { message: 'is missing' },
        type: { type: 'string', message: 'is not a string' },
      },
      campaigns: {
        presence: { message: 'is missing' },
        type: { type: 'array', message: 'is not an array' },
      },
    };
    const output = validate(data, constraints);
    if (!output) {
      return data;
    }
    let errorMsg = 'Decision Api data does not have correct format:\n';
    Object.keys(output).forEach((key) => {
      errorMsg += `- "${key}" ${output[key].map((err: string, i: number) => (i === output[key].length - 1 ? `${err}` : `${err} and `))}.\n`;
    });
    log.error(errorMsg);
    return null;
  },
};

export default flagshipSdkHelper;
