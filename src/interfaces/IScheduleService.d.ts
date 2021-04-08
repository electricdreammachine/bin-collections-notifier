export interface IScheduleService {
    schedule(cronTime: string, callback: () => void): void;
}