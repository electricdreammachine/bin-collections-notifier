export default {
    collectionsService: Symbol.for("CollectionsService"),
    databaseClient: Symbol.for("DatabaseClient"),
    scheduleService: Symbol.for("ScheduleService"),
    subscriptionRepository: Symbol.for("SubscriptionRepository"),
    configuration: Symbol.for("Configuration"),
    binCollectionsNotifier: Symbol.for("BinCollectionsNotifier"),
    orchestrator: Symbol.for("Orchestrator"),
    queueService: Symbol.for("QueueService"),
    queueServiceFactory: Symbol.for("Factory<QueueService>"),
    messageFormatter: Symbol.for("MessageFormatter"),
    notificationService: Symbol.for("NotificationService"),
    logger: Symbol.for("Logger"),
}