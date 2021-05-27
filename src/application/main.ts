import { injectable, inject } from "inversify";
import { endOfHour, add, isSameDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz'
import dependencies from '../dependencies';
import { ICollectionsService, ISubscriptionRepository, IQueueService, INotificationsService, IMessageFormatter } from '../interfaces';
import { Messages, Subscription } from '../types';

@injectable()
export class BinCollectionsNotifier {
    private _collectionsService;
    private _subscriptionRepository;
    private _notificationsQueue;
    private _collectionsQueue;
    private _notificationsService;
    private _messageFormatter;

    constructor(
        @inject(dependencies.collectionsService) collectionsService: ICollectionsService,
        @inject(dependencies.subscriptionRepository) subscriptionRepository: ISubscriptionRepository,
        @inject(dependencies.queueServiceFactory) queueFactory: (name: string) => IQueueService,
        @inject(dependencies.notificationService) notificationsService: INotificationsService,
        @inject(dependencies.messageFormatter) messageFormatter: IMessageFormatter,
    ) {
        this._collectionsService = collectionsService;
        this._subscriptionRepository = subscriptionRepository;
        this._notificationsQueue = queueFactory("NotificationQueue")
        this._collectionsQueue = queueFactory("CollectionsQueue")
        this._notificationsService = notificationsService;
        this._messageFormatter = messageFormatter;

        this._collectionsQueue.processQueue(async (subscription: Subscription) => {
            const collections = await this._collectionsService.getCollectionsForAddressID(subscription.addressId)

            if (isSameDay(new Date(collections[0].date), add(new Date(), { days: 1 }))) {
                this._notificationsQueue.enqueueWithDelay({ collection: collections[0], subscription }, this.getUpcomingHour())
            }
        })

        this._notificationsQueue.processQueue(async ({ subscription, collection }) => {
            this._notificationsService.sendNotification(
                this._messageFormatter.createMessageFromCollection(
                    collection,
                    Messages.UPCOMING_COLLECTION,
                ),
                subscription
            )
        })
    }

    private getUpcomingHour() {
        const nextHourDateTimeUTC = add(endOfHour(Date.now()), { seconds: 1 })
        // happy hard-coding this to uk timezone since it's a location bound app by nature
        const zonedNextHourDateTime = utcToZonedTime(nextHourDateTimeUTC, 'Europe/London')

        return zonedNextHourDateTime;
    }

    async getSubscribersForUpcomingHour() {
        const upcomingHourCronString = `0 ${this.getUpcomingHour().getHours()} * * *`

        return this._subscriptionRepository.getSubscriptionsByTime(upcomingHourCronString)
    }

    async notifySubscribersForUpcomingHour() {
        const subscribers = await this.getSubscribersForUpcomingHour();

        await this._collectionsQueue.enqueueAll(subscribers);
    }
}