import { Container } from "inversify";
import "reflect-metadata";
import dependencies from './dependencies';
import * as application from './application';
import { ICollectionsService, IDatabaseClient, IScheduleService, ISubscriptionRepository } from './interfaces';
import { EnvironmentConfig } from './types';

const container = new Container();

container.bind<EnvironmentConfig>(dependencies.configuration).toConstantValue(new application.Configuration() as EnvironmentConfig)
container.bind<IDatabaseClient>(dependencies.databaseClient).to(application.MongoDatabaseClient)
container.bind<ISubscriptionRepository>(dependencies.subscriptionRepository).to(application.SubscriptionRepository)
container.bind<IScheduleService>(dependencies.scheduleService).to(application.NodeScheduler)
container.bind<ICollectionsService>(dependencies.collectionsService).to(application.CollectionsService)
container.bind<application.BinCollectionsNotifier>(dependencies.main).to(application.BinCollectionsNotifier)

export default container;