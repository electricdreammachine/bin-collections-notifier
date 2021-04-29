import { injectable, inject } from "inversify";
import dependencies from '../dependencies';
import { IScheduleService } from '../interfaces';
import { EnvironmentConfig } from '../types';
import { BinCollectionsNotifier } from "./main";

@injectable()
export class Orchestrator {
    private config: EnvironmentConfig;
    private _scheduleService: IScheduleService;
    private _binCollectionsNotifier: BinCollectionsNotifier;

    constructor(
        @inject(dependencies.binCollectionsNotifier) binCollectionsNotifier: BinCollectionsNotifier,
        @inject(dependencies.scheduleService) scheduleService: IScheduleService,
        @inject(dependencies.configuration) config: EnvironmentConfig,
    ) {
        this.config = config;
        this._scheduleService = scheduleService;
        this._binCollectionsNotifier = binCollectionsNotifier;
    }

    start() {
        this.scheduleCheckForMatchingSubscriptions();
    }

    scheduleCheckForMatchingSubscriptions() {
        return this._scheduleService.schedule(
            this.config.SUBSCRIPTIONS_POLL_CRON,
            this._binCollectionsNotifier.notifySubscribersForUpcomingHour
        )
    }
}