import { injectable } from 'inversify'
import { IQueueService } from '../../interfaces'
import BeeQueue from 'bee-queue'

@injectable()
export class QueueService implements IQueueService {
    private _queue: BeeQueue;
    private _queueName: string;

    init() {
        this._queue = new BeeQueue(this.queueName, {
            redis: {
                host: 'redis',
                port: 6379,
            },
            activateDelayedJobs: true,
        })

        return this._queue.ready()
    }

    async enqueueAll(queueItems: any[]) {
        // @ts-ignore bee-queue currently does not include a type definition for this method,
        // though it is added in https://github.com/viniciuspsw/bee-queue/commit/b015236ae3dcee30f4dc5eb29cff634ffd42f678
        // just waiting for a release
        const errors = await this._queue.saveAll(queueItems.map(item => this._queue.createJob(item)))

        return errors.size === 0
    }

    async enqueueWithDelay(queueItem: any, delay: Date) {
        const job = await this._queue.createJob(queueItem).delayUntil(delay).save();

        return job.progress;
    }

    get queueName() {
        return this._queueName;
    }

    set queueName(name: string) {
        this._queueName = name;
        this.init();
    }

    processQueue(itemHandler: (item: any) => Promise<any>) {
        this._queue.process(job => itemHandler(job.data))
    }
}