export type EnvironmentConfig = {
    [key: string]: string;
    API_URL?: string;
    MONGO_URI?: string;
    SUBSCRIPTIONS_POLL_CRON?: string;
    TWILIO_SID?: string;
    TWILIO_AUTH_TOKEN?: string;
}