import { Container, interfaces } from "inversify";
import "reflect-metadata";
import dependencies from './dependencies';
import * as application from './application';
import { ICollectionsService, IDatabaseClient, IScheduleService, ISubscriptionRepository, IQueueService, IMessageFormatter, INotificationsService } from './interfaces';
import { EnvironmentConfig } from './types';

const container = new Container();

container.bind<EnvironmentConfig>(dependencies.configuration).toConstantValue(new application.Configuration() as EnvironmentConfig)
container.bind<IDatabaseClient>(dependencies.databaseClient).to(application.MongoDatabaseClient)
container.bind<ISubscriptionRepository>(dependencies.subscriptionRepository).to(application.SubscriptionRepository)
container.bind<IScheduleService>(dependencies.scheduleService).to(application.NodeScheduler)
container.bind<ICollectionsService>(dependencies.collectionsService).to(application.CollectionsService)
container.bind<IQueueService>(dependencies.queueService).to(application.QueueService)
container.bind<IMessageFormatter>(dependencies.messageFormatter).to(application.MessageFormatter)
container.bind<INotificationsService>(dependencies.notificationService).to(application.TwilioSMSNotifier)
container.bind<interfaces.Factory<IQueueService>>(dependencies.queueServiceFactory).toFactory<IQueueService>(context =>
    (name): IQueueService => {
        const queueService: IQueueService = context.container.get(dependencies.queueService)
        queueService.queueName = name;
        return queueService;
    }
)
container.bind<application.BinCollectionsNotifier>(dependencies.binCollectionsNotifier).to(application.BinCollectionsNotifier)
container.bind<application.Orchestrator>(dependencies.orchestrator).to(application.Orchestrator)

export default container;