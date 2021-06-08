import { injectable, inject } from 'inversify';
import { MongoClient } from 'mongodb';
import { LogLevels } from '../../constants';
import dependencies from '../../dependencies';
import { IDatabaseClient, ILoggerService } from '../../interfaces';
import { EnvironmentConfig } from '../../types';

@injectable()
export class MongoDatabaseClient implements IDatabaseClient {
    private _client: MongoClient;
    private _connection: Promise<any>;
    private _logger;

    private environmentConfig: EnvironmentConfig;

    constructor(
        @inject(dependencies.configuration) config: EnvironmentConfig,
        @inject(dependencies.logger) logger: ILoggerService,
    ) {
        this.environmentConfig = config;
        this._connection = this.connect();
        this._logger = logger;
    }

    public isConnected(): boolean {
        return this._client.isConnected();
    }

    public async connect(): Promise<boolean> {
        const uri = `mongodb://${this.environmentConfig.MONGO_USER}:${encodeURIComponent(this.environmentConfig.MONGO_PASS)}@mongo:27017/bin-collections?poolSize=20&writeConcern=majority&authSource=test`;

        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        try {
            await client.connect();
            await client.db("admin").command({ ping: 1 });

            this._client = client

            this._logger.log(LogLevels.info, 'Succesfully established database connection');

            return true
        }
        catch (e) {
            this._logger.log(LogLevels.error, 'Error establishing database connection');

            return false
        }
    }

    public async findBySingleMatchingValue(collectionName: string, key: string, value: string): Promise<object[]> {
        await this._connection;

        try {
            const collection = this._client.db(this.environmentConfig.dbName).collection(collectionName);

            return await collection.find({
                [key]: value,
            }).toArray();
        }
        catch (e) {
            this._logger.log(LogLevels.error, `Error querying database: ${e.message}`);
            throw new Error(e);
        }
    }
}