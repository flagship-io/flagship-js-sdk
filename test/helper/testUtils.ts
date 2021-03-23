import { HttpResponse } from 'jest-mock-axios/dist/lib/mock-axios-types';
import mockAxios from 'jest-mock-axios';
import demoData from '../mock/demoData';
import { internalConfig } from '../../src/config/default';
import { demoPollingInterval } from '../../src/config/test_constants';

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

export const mockPollingRequestV2 = (index = 0, loopScheduler: (HttpResponse | string)[], options = {}): void => {
    const defaultOptions = {
        envId: demoData.envId[0],
        onFail: (error) => {
            throw new Error(`mock ${error}`);
        }
    };
    const computedOptions = { ...defaultOptions, ...options };
    const { envId, onFail } = computedOptions;
    let loopIndex = index;
    try {
        if (loopScheduler.length < loopIndex) {
            return;
        }

        // getting the extended info about the most recent request
        const lastReqInfo = mockAxios.lastReqGet();
        if (lastReqInfo && lastReqInfo.url.includes('bucketing.json')) {
            if (typeof loopScheduler[loopIndex] === 'string') {
                mockAxios.mockError(loopScheduler[loopIndex], lastReqInfo);
            } else {
                mockAxios.mockResponseFor(
                    internalConfig.bucketingEndpoint.replace('@ENV_ID@', envId),
                    loopScheduler[loopIndex] as HttpResponse
                );
            }
            // if here, means no crash
            loopIndex += 1;
        }

        if (loopIndex < loopScheduler.length) {
            setTimeout(() => {
                mockPollingRequestV2(loopIndex, loopScheduler, computedOptions);
            }, demoPollingInterval * 1000 - 25);
        }
    } catch (error) {
        if (error.message === 'No request to respond to!') {
            setTimeout(() => {
                mockPollingRequestV2(loopIndex, loopScheduler, computedOptions);
            }, demoPollingInterval * 1000 - 25);
        } else {
            const newError = error;
            newError.message = `mockPollingRequestV2 function - ${error.message}`;
            onFail(newError);
        }
    }
};
