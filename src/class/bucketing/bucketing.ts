import { EventEmitter } from 'events';
import { FsLogger } from '@flagship.io/js-sdk-logs';
import Axios, { AxiosResponse } from 'axios';
import { DecisionApiResponseData, FlagshipVisitorContext } from '../flagshipVisitor/flagshipVisitor.d';

import { BucketingApiResponse } from './bucketing.d';
import { IFlagshipBucketing, FlagshipSdkConfig } from '../../index.d';
import loggerHelper from '../../lib/loggerHelper';
import { internalConfig } from '../../config/default';

class Bucketing extends EventEmitter implements IFlagshipBucketing {
    data: BucketingApiResponse | null;

    computedData: DecisionApiResponseData| null;

    visitorId: string;

    log: FsLogger;

    envId: string;

    visitorContext: FlagshipVisitorContext;

    config: FlagshipSdkConfig;

    constructor(envId: string, config: FlagshipSdkConfig, visitorId: string, visitorContext: FlagshipVisitorContext = {}) {
      super();
      this.config = config;
      this.visitorId = visitorId;
      this.log = loggerHelper.getLogger(this.config, `visitorId:${this.visitorId}`);
      this.envId = envId;
      this.visitorContext = visitorContext;
      this.data = null;
      this.computedData = null;
    }

    public launch(): void {
      Axios.get(internalConfig.bucketingEndpoint.replace('@ENV_ID@', this.envId)).then(
        ({ data: bucketingData }: AxiosResponse<BucketingApiResponse>) => {
          const transformResponse = { data: null };
          this.emit('launched');
        },
      ).catch((response: Error) => {
        this.log.fatal('An error occurred while fetching using bucketing...');
        this.emit('error', response);
      });
    }
}

export default Bucketing;
