import FlagshipLogger, { FsLogger } from '@flagship.io/js-sdk-logs';
import { IFsPanicMode, FlagshipSdkConfig } from '../../types';
import { DecisionApiResponseData } from '../flagshipVisitor/types';
import { BucketingApiResponse } from '../bucketing/types';
import { SetPanicModeToOptions } from './types';

class PanicMode implements IFsPanicMode {
    enabled: boolean;

    beginDate: Date | null;

    log: FsLogger;

    constructor(config: FlagshipSdkConfig) {
        this.enabled = false;
        this.beginDate = null;
        this.log = FlagshipLogger.getLogger(config, `Flagship SDK - panic mode`);
    }

    public setPanicModeTo(value: boolean, options: SetPanicModeToOptions = { sendLogs: true }): void {
        const { sendLogs } = options;
        if (value === this.enabled) {
            if (sendLogs) {
                this.log.debug(
                    value ? `panic mode already ENABLED since ${this.beginDate.toDateString()}` : 'panic mode already DISABLED.'
                );
            }
            return;
        }
        this.enabled = value;
        this.beginDate = value === false ? null : new Date();

        if (sendLogs) {
            this.log.info(
                value ? 'panic mode is ENABLED. SDK will turn into safe mode.' : 'panic mode is DISABLED. Everything is back to normal.'
            );
        }
    }

    public checkPanicMode(response: DecisionApiResponseData | BucketingApiResponse): void {
        const answer = !!response?.panic;
        this.setPanicModeTo(answer, { sendLogs: answer !== this.enabled });
    }

    public shouldRunSafeMode(functionName: string, options: { logType: 'debug' | 'error' } = { logType: 'error' }): boolean {
        const { logType } = options;
        if (this.enabled) {
            switch (logType) {
                case 'debug':
                    this.log.debug(`Can't execute '${functionName}' because the SDK is in panic mode !`);
                    break;

                default:
                    this.log.error(`Can't execute '${functionName}' because the SDK is in panic mode !`);
                    break;
            }
        }

        return this.enabled;
    }
}

export default PanicMode;
