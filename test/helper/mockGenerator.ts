import PanicMode from '../../src/class/panicMode/panicMode';
import { FlagshipSdkConfig, IFsPanicMode } from '../../src/types';

type MockGenerator = {
    createPanicModeMock: (config: FlagshipSdkConfig, isPanic?: boolean, callback?: (PM: IFsPanicMode) => IFsPanicMode) => IFsPanicMode;
};

const mockGenerator: MockGenerator = {
    createPanicModeMock: (config, isPanic = false, callback = (PM): IFsPanicMode => PM): IFsPanicMode => {
        const output = new PanicMode(config);

        // if (isPanic) {
        //     output.setPanicModeTo(true, { sendLogs: false });
        // }

        return callback(output);
    }
};

export default mockGenerator;
