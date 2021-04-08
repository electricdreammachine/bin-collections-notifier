export type EnvironmentConfig = {
    [key: string]: string;
    API_URL?: string;
    MONGO_USER?: string;
    MONGO_PASS?: string;
    SUBSCRIPTIONS_POLL_CRON?: string;
}