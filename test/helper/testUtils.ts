import { HttpResponse } from 'jest-mock-axios/dist/lib/mock-axios-types';
import mockAxios from 'jest-mock-axios';
import demoData from '../mock/demoData';
import { internalConfig } from '../../src/config/default';
import { demoPollingInterval } from '../../src/config/test';

export const mockPollingRequest = (
    done,
    getPollingLoop: () => number,
    loopScheduler: (HttpResponse | string)[],
    envId = demoData.envId[0]
): void => {
    try {
        if (loopScheduler.length < getPollingLoop()) {
            return;
        }

        if (typeof loopScheduler[getPollingLoop()] === 'string') {
            mockAxios.mockError(loopScheduler[getPollingLoop()]);
        } else {
            mockAxios.mockResponseFor(
                internalConfig.bucketingEndpoint.replace('@ENV_ID@', envId),
                loopScheduler[getPollingLoop()] as HttpResponse
            );
        }

        if (getPollingLoop() < loopScheduler.length) {
            mockPollingRequest(done, getPollingLoop, loopScheduler);
        }
    } catch (error) {
        if (error.message === 'No request to respond to!') {
            setTimeout(() => {
                mockPollingRequest(done, getPollingLoop, loopScheduler);
            }, demoPollingInterval - 50);
        } else {
            done.fail(`mock ${error}`);
        }
    }
};
