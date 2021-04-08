import { Subscription } from '../types';

export interface ISubscriptionRepository {
    getSubscriptionsByTime(time: string): Promise<Subscription[]>;
}