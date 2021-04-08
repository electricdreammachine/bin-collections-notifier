import { EnvironmentConfig } from '../types'

export interface IDatabaseClient {
    connect(config: EnvironmentConfig): Promise<any>;
    isConnected(): boolean;
    findBySingleMatchingValue(targetDatabaseEntry: string, key: string, value: string): Promise<object[]>;
}