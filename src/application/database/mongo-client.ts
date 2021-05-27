import { injectable, inject } from 'inversify';
import { MongoClient } from 'mongodb';
import urlencode from 'urlencode';
import dependencies from '../../dependencies';
import { IDatabaseClient } from '../../interfaces';
import { EnvironmentConfig } from '../../types';

@injectable()
export class MongoDatabaseClient implements IDatabaseClient {
    private _client: MongoClient;
    private _connection: Promise<any>;

    private environmentConfig: EnvironmentConfig;

    constructor(
        @inject(dependencies.configuration) config: EnvironmentConfig,
    ) {
        this.environmentConfig = config;
        this._connection = this.connect();
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
            return true
        }
        catch (e) {
            console.error(e)
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
            throw new Error(e);
        }
    }
}