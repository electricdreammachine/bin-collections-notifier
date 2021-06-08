import { injectable } from 'inversify'
import { createSimpleLogger } from 'simple-node-logger';
import { ILoggerService } from '../../interfaces';
import { LogLevels } from '../../constants';

@injectable()
export class Logger implements ILoggerService {
    private _logger;

    constructor() {
        this._logger = createSimpleLogger({
            logDirectory: '/var/log/bin-collections-notifier',
            fileNamePattern: 'roll-<DATE>.log',
            dateFormat: 'YYYY-MM-DD'
        })
    }

    log(level: LogLevels, message: string) {
        return this._logger[level].call(message);
    }
}