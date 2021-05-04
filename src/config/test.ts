import defaultConfig from './default';
import { FlagshipSdkConfig } from '../types';
import demoData from '../../test/mock/demoData';

const testConfig: FlagshipSdkConfig = {
    ...defaultConfig,
    nodeEnv: 'development'
};

export const bucketingMinimumConfig: FlagshipSdkConfig = {
    ...testConfig,
    fetchNow: true,
    decisionMode: 'Bucketing'
};

export const bucketingApiMockOtherResponse200: { status: number; headers: { 'last-modified': string } } = {
    status: 200,
    headers: { 'last-modified': demoData.bucketing.headers.lastModified[0] }
};

export const bucketingApiMockOtherResponse304: { status: number; headers: {} } = {
    status: 304,
    headers: {} // NOTE: 'last-modified' does not exist on 304
};

export default testConfig;
