import { injectable, inject } from "inversify";
import { endOfHour, add } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz'
import dependencies from '../dependencies';
import { ICollectionsService, ISubscriptionRepository, IScheduleService } from '../interfaces';
import { EnvironmentConfig } from '../types';

@injectable()
export class BinCollectionsNotifier {
    private _collectionsService: ICollectionsService;
    private _scheduleService: IScheduleService;
    private _subscriptionRepository: ISubscriptionRepository;
    private config: EnvironmentConfig;

    constructor(
        @inject(dependencies.collectionsService) collectionsService: ICollectionsService,
        @inject(dependencies.scheduleService) scheduleService: IScheduleService,
        @inject(dependencies.subscriptionRepository) subscriptionRepository: ISubscriptionRepository,
        @inject(dependencies.configuration) config: EnvironmentConfig,
    ) {
        this._collectionsService = collectionsService;
        this._scheduleService = scheduleService;
        this._subscriptionRepository = subscriptionRepository;
        this.config = config;
    }

    private getUpcomingHour() {
        const nextHourDateTimeUTC = add(endOfHour(Date.now()), { seconds: 1 })
        // happy hard-coding this to uk timezone since it's a location bound app
        const zonedNextHourDateTime = utcToZonedTime(nextHourDateTimeUTC, 'Europe/London')

        return zonedNextHourDateTime.getHours();
    }

    async getSubscribersForUpcomingHour() {
        const upcomingHourCronString = `* ${this.getUpcomingHour()} * * *`

        return this._subscriptionRepository.getSubscriptionsByTime(upcomingHourCronString)
    }

    scheduleCheckForMatchingSubscriptions() {
        return this._scheduleService.schedule(this.config.SUBSCRIPTIONS_POLL_CRON, this.notifySubscribersForUpcomingHour)
    }
}