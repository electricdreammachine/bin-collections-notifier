import { Collection } from "collection";

export interface IQueueService {
    queueName: string;
    init(): Promise<any>;
    enqueueAll(queueItems: any[]): Promise<boolean>;
    enqueueWithDelay(queueItem: any, delay: Date): Promise<boolean>;
    processQueue(itemHandler: (queueItem: any) => Promise<any>): void;
}