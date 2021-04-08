import { injectable } from 'inversify';
import { scheduleJob } from 'node-schedule';
import { IScheduleService } from '../interfaces';

@injectable()
export class NodeScheduler implements IScheduleService {
    schedule(cronTime: string, callback: () => void) {
        return scheduleJob(cronTime, callback);
    }
}