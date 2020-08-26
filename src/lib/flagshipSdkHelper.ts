import { FsLogger } from '@flagship.io/js-sdk-logs';
import { validate } from 'validate.js';
import axios from 'axios';
import { demoPollingInterval } from '../config/test';
import { BucketingApiResponse } from '../class/bucketing/types';
import { FlagshipSdkConfig, IFsPanicMode } from '../types';

import defaultConfig, { internalConfig } from '../config/default';
import { FlagshipVisitorContext, DecisionApiResponseData, DecisionApiResponse, DecisionApiCampaign } from '../class/flagshipVisitor/types';

import otherSdkConfig from '../config/otherSdk';

const checkRequiredSettingsForApiV2 = (config: FlagshipSdkConfig, log: FsLogger): void => {
    if (config.flagshipApi && config.flagshipApi.includes('/v2/') && !config.apiKey) {
        log.fatal('initialization - flagshipApi v2 detected but required setting "apiKey" is missing !');
    }
};

const flagshipSdkHelper = {
    postFlagshipApi: (
        panic: IFsPanicMode,
        config: FlagshipSdkConfig,
        log: FsLogger,
        endpoint: string,
        params: { [key: string]: any },
        queryParams: any = { headers: {} }
    ): Promise<any> => {
        const additionalParams: { [key: string]: string } = {};
        const additionalHeaderParams: { [key: string]: string } = {};

        checkRequiredSettingsForApiV2(config, log);
        const isNotApiV1 = !config.flagshipApi.includes('/v1/');
        if (config.apiKey && isNotApiV1) {
            additionalHeaderParams['x-api-key'] = config.apiKey;
        }
        const url = endpoint.includes(config.flagshipApi) ? endpoint : config.flagshipApi + endpoint;
        return axios
            .post(
                url,
                { ...params, ...additionalParams },
                {
                    ...queryParams,
                    headers: {
                        ...queryParams.headers,
                        ...additionalHeaderParams
                    }
                }
            )
            .then((response: DecisionApiResponse) => {
                panic.checkPanicMode(response.data);
                return response;
            });
    },
    checkPollingIntervalValue: (pollingIntervalValue: any): 'ok' | 'underLimit' | 'notSupported' => {
        const valueType = typeof pollingIntervalValue;
        switch (valueType) {
            case 'number':
                if (process && process.env && process.env.NODE_ENV === 'test' && pollingIntervalValue === demoPollingInterval) {
                    // for unit test
                    return 'ok';
                }
                return pollingIntervalValue >= internalConfig.pollingIntervalMinValue ? 'ok' : 'underLimit';
            case 'object':
                return pollingIntervalValue === null ? 'notSupported' : 'notSupported';
            case 'undefined':
            default:
                return 'notSupported';
        }
    },
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
    checkTimeout: (value: number): number => {
        return typeof value === 'number' && value > 0 ? value : defaultConfig.timeout;
    },
    checkConfig: (unknownConfig: { [key: string]: any }, apiKey?: string): { cleanConfig: object; ignoredConfig: object } => {
        const cleanObject: { [key: string]: string | boolean | number | null } = {};
        const dirtyObject: { [key: string]: string | boolean | null } = {};
        const validAttributesList: Array<string> = [];
        Object.entries(defaultConfig).forEach(([key]) => validAttributesList.push(key));
        const whiteListedAttributesList: Array<string> = Object.keys(otherSdkConfig); // specific config coming from other SDK.
        Object.keys(unknownConfig).forEach((foreignKey) => {
            const value = unknownConfig[foreignKey];
            if (validAttributesList.includes(foreignKey)) {
                if (typeof value === 'undefined' || value === null) {
                    cleanObject[foreignKey] = defaultConfig[foreignKey as keyof FlagshipSdkConfig] as string | boolean | null;
                } else {
                    switch (foreignKey) {
                        case 'timeout':
                            cleanObject[foreignKey] = flagshipSdkHelper.checkTimeout(value);
                            break;

                        default:
                            cleanObject[foreignKey] = value;
                            break;
                    }
                }
            } else if (whiteListedAttributesList.includes(foreignKey)) {
                // do nothing
            } else {
                dirtyObject[foreignKey] = value;
            }
        });

        // TODO: remove in next major release
        if (apiKey) {
            cleanObject.apiKey = apiKey;
        }

        return { cleanConfig: { ...cleanObject }, ignoredConfig: { ...dirtyObject } };
    },
    checkDecisionApiResponseFormat: (response: DecisionApiResponse, log: FsLogger): DecisionApiResponseData | null => {
        if (!response.data || !response.data.campaigns) {
            log.warn('Unknow Decision Api response received or error happened'); // TODO: can be improved according status value
            return null;
        }
        return response.data;
    },
    checkBucketingApiResponse: (response: any, log: FsLogger): BucketingApiResponse | null => {
        const constraints = {
            campaigns: {
                presence: { message: 'is missing' },
                type: { type: 'array', message: 'is not a array' }
            },
            lastModifiedDate: {
                presence: { message: 'is missing' },
                type: { type: 'string', message: 'is not a string' }
            }
        };

        const constraintsBucketingCampaigns = {
            id: {
                presence: { message: 'is missing' },
                type: { type: 'string', message: 'is not a string' }
            },
            type: {
                presence: { message: 'is missing' },
                type: { type: 'string', message: 'is not a string' }
            },
            variationGroups: {
                presence: { message: 'is missing' },
                type: { type: 'array', message: 'is not a array' }
            }
        };

        let result = true;
        let errorLog = '';
        const firstCheck = validate(response, constraints);

        if (!firstCheck) {
            response.campaigns.forEach((element, index) => {
                const secondCheck = validate(element, constraintsBucketingCampaigns);
                if (secondCheck) {
                    result = false;
                    errorLog += flagshipSdkHelper.generateValidateError(secondCheck, index);
                }
            });
        } else {
            result = false;
            errorLog += flagshipSdkHelper.generateValidateError(firstCheck);
        }

        if (result) {
            return response as BucketingApiResponse;
        }

        log.error(errorLog);
        return null;
    },
    generateValidateError: (validateOutput: any, index?: number): string => {
        let errorMsg = '';
        if (typeof index === 'number') {
            errorMsg += `Element at index=${index}:\n`;
        } else {
            errorMsg += `Element:\n`;
        }
        Object.keys(validateOutput).forEach((key) => {
            errorMsg += `- "${key}" ${validateOutput[key].map((err: string, j: number) =>
                j === validateOutput[key].length - 1 ? `${err}` : `${err} and `
            )}.\n`;
        });
        errorMsg += '\n';

        return errorMsg;
    },
    validateDecisionApiData: (data: DecisionApiCampaign[] | null, log: FsLogger): null | DecisionApiCampaign[] => {
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

        if (!data || !Array.isArray(data)) {
            if (!Array.isArray(data) && data !== null) {
                log.error(`validateDecisionApiData - received unexpected decision api data of type "${typeof data}"`);
            }
            return null;
        }

        data.forEach((potentialCampaign, i) => {
            const output = validate(potentialCampaign, constraints);
            if (output) {
                result[i] = output;
                errorMsg += flagshipSdkHelper.generateValidateError(output, i);
            }
        });
        if (Object.keys(result).length === 0) {
            return data;
        }
        log.error(errorMsg);
        return null;
    },
    isUsingFlagshipApi: (version: 'v1' | 'v2', config: FlagshipSdkConfig): boolean => {
        switch (version) {
            case 'v1':
                return config.flagshipApi.includes(internalConfig.apiV1);

            case 'v2':
                return config.flagshipApi.includes(internalConfig.apiV2);

            default:
                return false;
        }
    },
    generatePanicDecisionApiResponse: (visitorId: string): DecisionApiResponseData => {
        return {
            visitorId,
            campaigns: [],
            panic: true
        };
    }
};

export default flagshipSdkHelper;
