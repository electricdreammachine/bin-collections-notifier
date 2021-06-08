import { injectable, inject } from "inversify";
import dependencies from '../dependencies';
import { IScheduleService, ILoggerService } from '../interfaces';
import { EnvironmentConfig } from '../types';
import { LogLevels } from '../constants';
import { BinCollectionsNotifier } from "./main";

@injectable()
export class Orchestrator {
    private config;
    private _scheduleService;
    private _binCollectionsNotifier;
    private _logger;

    constructor(
        @inject(dependencies.binCollectionsNotifier) binCollectionsNotifier: BinCollectionsNotifier,
        @inject(dependencies.scheduleService) scheduleService: IScheduleService,
        @inject(dependencies.configuration) config: EnvironmentConfig,
        @inject(dependencies.messageFormatter) logger: ILoggerService,
    ) {
        this.config = config;
        this._scheduleService = scheduleService;
        this._binCollectionsNotifier = binCollectionsNotifier;
        this._logger = logger;
    }

    start() {
        this._logger.log(LogLevels.info, `Service started`)

        this.scheduleCheckForMatchingSubscriptions();
    }

    scheduleCheckForMatchingSubscriptions() {
        this._logger.log(LogLevels.info, `Registering scheduled job`)

        return this._scheduleService.schedule(
            this.config.SUBSCRIPTIONS_POLL_CRON,
            this._binCollectionsNotifier.notifySubscribersForUpcomingHour
        )
    }
}