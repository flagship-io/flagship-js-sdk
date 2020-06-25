import { FsLogger } from '@flagship.io/js-sdk-logs';
import { validate } from 'validate.js';
import {
    FlagshipVisitorContext,
    DecisionApiResponseData,
    DecisionApiResponse,
    DecisionApiCampaign
} from '../class/flagshipVisitor/flagshipVisitor.d';
import { FlagshipSdkConfig } from '../index.d';

import defaultConfig from '../config/default';
import otherSdkConfig from '../config/otherSdk';

const flagshipSdkHelper = {
    checkVisitorContext: (unknownContext: object, fsLogger: FsLogger): FlagshipVisitorContext => {
        const validContext: FlagshipVisitorContext = {};
        Object.entries(unknownContext).forEach(([key, value]) => {
            if (typeof value === 'object' && !Array.isArray(value)) {
                // means value is a json
                fsLogger.warn(`Context key "${key}" is an object (json) which is not supported. This key will be ignored...`);
            } else if (Array.isArray(value)) {
                // means value is an array
                fsLogger.warn(`Context key "${key}" is an array which is not supported. This key will be ignored...`);
            } else if (typeof value === 'undefined' || value === null) {
                // means value is not an array
                fsLogger.warn(`Context key "${key}" is null or undefined which is not supported. This key will be ignored...`);
            } else {
                validContext[key] = value;
            }
        });
        return validContext;
    },
    logIgnoredAttributesFromObject: (obj: object, log: FsLogger, objectName = ''): void => {
        let hasDirtyValues = false;
        Object.entries(obj).forEach(([key, value]) => {
            hasDirtyValues = true;
            log.warn(`Unknown key "${key}" detected (with value="${value}"). This key has been ignored... - ${objectName}`);
        });
        if (!hasDirtyValues) {
            log.debug(`No unknown key detected :) - ${objectName}`);
        }
    },
    checkConfig: (unknownConfig: { [key: string]: any }): { cleanConfig: object; ignoredConfig: object } => {
        const cleanObject: { [key: string]: string | boolean | null } = {};
        const dirtyObject: { [key: string]: string | boolean | null } = {};
        const validAttributesList: Array<string> = [];
        Object.entries(defaultConfig).forEach(([key]) => validAttributesList.push(key));
        const whiteListedAttributesList: Array<string> = Object.keys(otherSdkConfig); // specific config coming from other SDK.
        Object.keys(unknownConfig).forEach((key) => {
            const value = unknownConfig[key];
            if (validAttributesList.includes(key)) {
                if (typeof value === 'undefined' || value === null) {
                    cleanObject[key] = defaultConfig[key as keyof FlagshipSdkConfig] as string | boolean | null;
                } else {
                    cleanObject[key] = value;
                }
            } else if (whiteListedAttributesList.includes(key)) {
                // do nothing
            } else {
                dirtyObject[key] = value;
            }
        });
        return { cleanConfig: { ...cleanObject }, ignoredConfig: { ...dirtyObject } };
    },
    checkDecisionApiResponseFormat: (response: DecisionApiResponse, log: FsLogger): DecisionApiResponseData | null => {
        if (!response.data || !response.data.campaigns) {
            log.warn('Unknow Decision Api response received or error happened'); // TODO: can be improved according status value
            return null;
        }
        return response.data;
    },
    validateDecisionApiData: (data: DecisionApiCampaign[], log: FsLogger): null | DecisionApiCampaign[] => {
        const constraints = {
            id: {
                presence: { message: 'is missing' },
                type: { type: 'string', message: 'is not a string' }
            },
            variationGroupId: {
                presence: { message: 'is missing' },
                type: { type: 'string', message: 'is not a string' }
            },
            'variation.id': {
                presence: { message: 'is missing' },
                type: { type: 'string', message: 'is not a string' }
            },
            'variation.modifications.type': {
                presence: { message: 'is missing' },
                type: { type: 'string', message: 'is not a string' }
            },
            'variation.modifications.value': {
                presence: { message: 'is missing' }
            }
        };
        const result: { [key: string]: any } = {};
        let errorMsg = 'Decision Api data does not have correct format:\n';
        data.forEach((potentialCampaign, i) => {
            const output = validate(potentialCampaign, constraints);
            if (output) {
                result[i] = output;
                errorMsg += `Element at index=${i}:\n`;
                Object.keys(output).forEach((key) => {
                    errorMsg += `- "${key}" ${output[key].map((err: string, j: number) =>
                        j === output[key].length - 1 ? `${err}` : `${err} and `
                    )}.\n`;
                });
                errorMsg += '\n';
            }
        });
        if (Object.keys(result).length === 0) {
            return data;
        }
        log.error(errorMsg);
        return null;
    }
};

export default flagshipSdkHelper;
