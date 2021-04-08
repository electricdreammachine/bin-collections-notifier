import { inject, injectable } from 'inversify';
import dependencies from '../dependencies';
import { ISubscriptionRepository, IDatabaseClient } from '../interfaces';
import { Subscription } from '../types';

@injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
    private _dbClient: IDatabaseClient;

    constructor(
        @inject(dependencies.databaseClient) dbClient: IDatabaseClient,
    ) {
        this._dbClient = dbClient;
    }

    async getSubscriptionsByTime(time: string): Promise<Subscription[]> {
        return await this._dbClient.findBySingleMatchingValue('subscriptions', 'time', time) as Subscription[]
    }
}