import { FlagshipSdkConfig } from '../index.d';
import { FsLogger } from './index.d';

/* eslint-disable no-console */

/*
Available logs:
    - debug()
    - info()
    - warn()
    - error()
    - fatal()
*/

const loggerHelper = {
  getLogger: (config: FlagshipSdkConfig, name = 'Flagship SDK'): FsLogger => {
    const { enableConsoleLogs } = config;
    const timestamp = `[${new Date().toISOString().slice(11, -5)}] - `;
    return {
      warn: (str: string): void| null => (enableConsoleLogs ? console.warn(`${timestamp}${name} - ${str}`) : null),
      error: (str: string): void| null => (enableConsoleLogs ? console.error(`${timestamp}${name} - ${str}`) : null),
      info: (str: string): void| null => (enableConsoleLogs ? console.log(`${timestamp}${name} - ${str}`) : null),
      fatal: (str: string): void| null => (enableConsoleLogs ? console.error(`${timestamp}${name} - Fatal: ${str}`) : null),
      debug: (str: string): void | null => (config.nodeEnv === 'development' && enableConsoleLogs ? console.log(`${timestamp}${name} - Debug: ${str}`) : null),
    };
  },
};

export default loggerHelper;
