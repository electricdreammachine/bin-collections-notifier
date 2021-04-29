import { EnvironmentConfig } from '../types'

export interface IQueueService {
    init(config: EnvironmentConfig): Promise<any>;
    enqueueAll(queueItems: any[]): boolean;
    processQueue(): void;
}