import { injectable, inject } from 'inversify'
import { ILoggerService, INotificationsService } from '../../interfaces'
import { EnvironmentConfig, Subscription } from '../../types'
import dependencies from '../../dependencies'
import twilioClient, { Twilio } from 'twilio'
import { LogLevels } from '../../constants'

@injectable()
export class TwilioSMSNotifier implements INotificationsService {
    private _config: EnvironmentConfig;
    private _client: Twilio;
    private _logger;

    constructor(
        @inject(dependencies.configuration) config: EnvironmentConfig,
        @inject(dependencies.logger) logger: ILoggerService,
    ) {
        this._config = config;
        this._logger = logger;

        try {
            this._client = twilioClient(
                this._config.TWILIO_SID,
                this._config.TWILIO_AUTH_TOKEN,
                {
                    edge: 'dublin',
                }
            )
        } catch (e) {
            this._logger.log(LogLevels.error, `Error creating Twilio client: ${e.message}`)
        }
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
            this._logger.log(LogLevels.error, `Error sending Twilio message: ${e.message}`)

            throw new Error(e);
        }
    }
}