import { injectable, inject } from 'inversify'
import { INotificationsService } from '../../interfaces'
import { EnvironmentConfig, Subscription } from '../../types'
import dependencies from '../../dependencies'
import twilioClient, { Twilio } from 'twilio'

@injectable()
export class TwilioSMSNotifier implements INotificationsService {
    private _config: EnvironmentConfig;
    private _client: Twilio;

    constructor(
        @inject(dependencies.configuration) config: EnvironmentConfig,
    ) {
        this._config = config;

        this._client = twilioClient(
            this._config.TWILIO_SID,
            this._config.TWILIO_AUTH_TOKEN,
            {
                edge: 'dublin',
            }
        )
    }

    async sendNotification(notificationBody: string, subscription: Subscription) {
        if (!notificationBody?.length) return null

        try {
            const message = await this._client.messages.create({
                from: this._config.TWILIO_FROM_NUMBER,
                to: subscription.phoneNumber,
                body: notificationBody,

            })

            return message.errorCode === null
        } catch (e) {
            console.log(e)
        }
    }
}