import { injectable } from 'inversify'
import { createRollingFileLogger } from 'simple-node-logger';
import { ILoggerService } from '../../interfaces';
import { LogLevels } from '../../constants';

@injectable()
export class Logger implements ILoggerService {
    private _logger;

    constructor() {
        this._logger = createRollingFileLogger({
            logDirectory: '/var/log/bin-collections-notifier',
            fileNamePattern: 'roll-<DATE>.log',
            dateFormat: 'YYYY-MM-DD'
        })

        this._logger.setLevel('debug');
    }

    log(level: LogLevels, message: string) {
        return this._logger[level](message);
    }
}