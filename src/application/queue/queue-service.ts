import { injectable, inject } from 'inversify'
import { IQueueService, ILoggerService } from '../../interfaces'
import BeeQueue from 'bee-queue'
import dependencies from '../../dependencies';
import { LogLevels } from '../../constants';

@injectable()
export class QueueService implements IQueueService {
    private _queue: BeeQueue;
    private _queueName: string;
    private _logger;

    constructor(
        @inject(dependencies.logger) logger: ILoggerService,
    ) {
        this._logger = logger;
    }

    init() {
        try {
            this._queue = new BeeQueue(this.queueName, {
                redis: {
                    host: 'redis',
                    port: 6379,
                },
                activateDelayedJobs: true,
            })

            this._logger.log(LogLevels.info, `Creating queue ${this.queueName}`)

            return this._queue.ready()
        } catch (e) {
            this._logger.log(LogLevels.error, `Error creating queue ${this.queueName}: ${e.message}`)
        }
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