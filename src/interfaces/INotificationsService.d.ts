import { Subscription } from "../types";

export interface INotificationsService {
    sendNotification: (notificationBody: string, subscription: Subscription) => Promise<boolean>
}