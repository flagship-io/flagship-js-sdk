import PanicMode from './panicMode';
import testConfig from '../../config/test';
import { IFsPanicMode } from '../../types';

let panicModeInstance: IFsPanicMode = null;

let spyWarnLogs;
let spyErrorLogs;
let spyFatalLogs;
let spyInfoLogs;
let spyDebugLogs;

type initSpyLogsOutput = {
    spyWarnLogs: jest.SpyInstance<any, unknown[]>;
    spyErrorLogs: jest.SpyInstance<any, unknown[]>;
    spyFatalLogs: jest.SpyInstance<any, unknown[]>;
    spyInfoLogs: jest.SpyInstance<any, unknown[]>;
    spyDebugLogs: jest.SpyInstance<any, unknown[]>;
};

const initSpyLogs = (vInstance): initSpyLogsOutput => {
    spyFatalLogs = jest.spyOn(vInstance.log, 'fatal');
    spyWarnLogs = jest.spyOn(vInstance.log, 'warn');
    spyInfoLogs = jest.spyOn(vInstance.log, 'info');
    spyDebugLogs = jest.spyOn(vInstance.log, 'debug');
    spyErrorLogs = jest.spyOn(vInstance.log, 'error');

    return {
        spyWarnLogs,
        spyErrorLogs,
        spyFatalLogs,
        spyInfoLogs,
        spyDebugLogs
    };
};

const testConfigWithoutFetchNow = { ...testConfig, fetchNow: false };

describe('PanicMode', () => {
    beforeAll(() => {
        // nothing
    });
    afterEach(() => {
        panicModeInstance = null;
    });
    it('should warn a debug log if setting panic mode twice in a row', () => {
        panicModeInstance = new PanicMode(testConfigWithoutFetchNow);
        initSpyLogs(panicModeInstance);

        panicModeInstance.setPanicModeTo(true);

        expect(spyDebugLogs).toHaveBeenCalledTimes(0);
        expect(spyInfoLogs).toHaveBeenCalledTimes(1);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        expect(spyInfoLogs).toHaveBeenNthCalledWith(1, 'panic mode is ENABLED. SDK will turn into safe mode.');

        panicModeInstance.setPanicModeTo(true);

        expect(spyDebugLogs).toHaveBeenCalledTimes(1);
        expect(spyInfoLogs).toHaveBeenCalledTimes(1);
        expect(spyErrorLogs).toHaveBeenCalledTimes(0);
        expect(spyFatalLogs).toHaveBeenCalledTimes(0);
        expect(spyWarnLogs).toHaveBeenCalledTimes(0);

        const strDate: string = new Date().toDateString();
        expect(spyDebugLogs).toHaveBeenNthCalledWith(1, `panic mode already ENABLED since ${strDate}`);
    });
});
