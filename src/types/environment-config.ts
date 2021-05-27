export type EnvironmentConfig = {
    [key: string]: string;
    API_URL?: string;
    MONGO_USER?: string;
    MONGO_PASS?: string;
    SUBSCRIPTIONS_POLL_CRON?: string;
    TWILIO_SID?: string;
    TWILIO_AUTH_TOKEN?: string;
}