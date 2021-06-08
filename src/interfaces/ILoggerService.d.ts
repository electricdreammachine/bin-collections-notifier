import { LogLevels } from '../constants'

export interface ILoggerService {
    log(level: LogLevels, message: string): void,
}