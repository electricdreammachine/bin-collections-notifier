type loggerOptions = {
    logDirectory: string,
    fileNamePattern: string,
    dateFormat: string,
}

interface Logger {
    warn(message: string): void;
    info(message: string): void;
    error(message: string): void;
    debug(message: string): void;
}

declare module 'simple-node-logger' {
    export function createSimpleLogger(opts: loggerOptions): Logger;
}