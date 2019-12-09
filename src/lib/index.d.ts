export type FsLogger = {
    warn(str: string): void| null;
    error(str: string): void| null;
    info(str: string): void| null;
    fatal(str: string): void| null;
    debug(str: string): void| null;
}
