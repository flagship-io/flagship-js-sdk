import defaultConfig, { internalConfig } from '../config/default';
import { FlagshipSdkConfig } from '../types';
import flagshipSdkHelper from './flagshipSdkHelper';

describe('Flagship helpers', () => {
    let fakeSdkConfig: FlagshipSdkConfig;
    beforeEach(() => {
        fakeSdkConfig = defaultConfig;
    });
    afterEach(() => {
        // NOHTING
    });
    describe('flagshipSdkHelper', () => {
        it('isUsingFlagshipApi works good', () => {
            expect(flagshipSdkHelper.isUsingFlagshipApi('v1', fakeSdkConfig)).toEqual(true);
            expect(flagshipSdkHelper.isUsingFlagshipApi('v2', fakeSdkConfig)).toEqual(false);
            expect(flagshipSdkHelper.isUsingFlagshipApi('v1010', fakeSdkConfig)).toEqual(false);

            fakeSdkConfig = { ...fakeSdkConfig, flagshipApi: internalConfig.apiV2 };
            expect(flagshipSdkHelper.isUsingFlagshipApi('v1', fakeSdkConfig)).toEqual(false);
            expect(flagshipSdkHelper.isUsingFlagshipApi('v2', fakeSdkConfig)).toEqual(true);
            expect(flagshipSdkHelper.isUsingFlagshipApi('v1010', fakeSdkConfig)).toEqual(false);
        });
    });
});
