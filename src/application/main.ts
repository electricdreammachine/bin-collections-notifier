import { injectable, inject } from "inversify";
import { endOfHour, add, isSameDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz'
import dependencies from '../dependencies';
import { ICollectionsService, ISubscriptionRepository, IQueueService, INotificationsService, IMessageFormatter, ILoggerService } from '../interfaces';
import { Subscription } from '../types';
import { LogLevels, Messages } from '../constants';

@injectable()
export class BinCollectionsNotifier {
    private _collectionsService;
    private _subscriptionRepository;
    private _notificationsQueue;
    private _collectionsQueue;
    private _notificationsService;
    private _messageFormatter;
    private _logger;

    constructor(
        @inject(dependencies.collectionsService) collectionsService: ICollectionsService,
        @inject(dependencies.subscriptionRepository) subscriptionRepository: ISubscriptionRepository,
        @inject(dependencies.queueServiceFactory) queueFactory: (name: string) => IQueueService,
        @inject(dependencies.notificationService) notificationsService: INotificationsService,
        @inject(dependencies.messageFormatter) messageFormatter: IMessageFormatter,
        @inject(dependencies.logger) logger: ILoggerService,
    ) {
        this._collectionsService = collectionsService;
        this._subscriptionRepository = subscriptionRepository;
        this._notificationsQueue = queueFactory("NotificationQueue")
        this._collectionsQueue = queueFactory("CollectionsQueue")
        this._notificationsService = notificationsService;
        this._messageFormatter = messageFormatter;
        this._logger = logger;

        this._collectionsQueue.processQueue(async (subscription: Subscription) => {
            this._logger.log(LogLevels.debug, `Retrieving collections: Subscription ${subscription._id}`)

            const collections = await this._collectionsService.getCollectionsForAddressID(subscription.addressId)

            this._logger.log(LogLevels.debug, `Retrieved collections: Subscription ${collections[0].date}`)

            if (isSameDay(new Date(collections[0].date), add(new Date(), { days: 1 }))) {
                return this._notificationsQueue.enqueueWithDelay({ collection: collections[0], subscription }, this.getUpcomingHour())
            }

            return Promise.resolve();
        })

        this._notificationsQueue.processQueue(async ({ subscription, collection }) => {
            this._logger.log(LogLevels.debug, `Creating notification: Subscription ${subscription._id}`)

            return this._notificationsService.sendNotification(
                this._messageFormatter.createMessageFromCollection(
                    collection,
                    Messages.UPCOMING_COLLECTION,
                ),
                subscription
            )
        })
    }

    private getUpcomingHour() {
        return add(endOfHour(Date.now()), { seconds: 1 })
    }

    private getZonedUpcomingHour = () => {
        // happy hard-coding this to uk timezone since it's a location bound app by nature
        const zonedNextHourDateTime = utcToZonedTime(this.getUpcomingHour(), 'Europe/London')

        return zonedNextHourDateTime;
    }

    private getSubscribersForUpcomingHour = () => {
        const upcomingHourCronString = `0 ${this.getZonedUpcomingHour().getHours()} * * *`

        this._logger.log(LogLevels.info, `Getting subscribers for ${upcomingHourCronString}`)

        return this._subscriptionRepository.getSubscriptionsByTime(upcomingHourCronString)
    }

    public notifySubscribersForUpcomingHour = async () => {
        this._logger.log(LogLevels.info, `Checking for subscribers...`)

        const subscribers = await this.getSubscribersForUpcomingHour();

        this._logger.log(LogLevels.debug, `Found ${subscribers.length} subscribers`)

        await this._collectionsQueue.enqueueAll(subscribers);
    }
}