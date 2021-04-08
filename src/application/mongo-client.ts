import { injectable, inject } from 'inversify';
import { MongoClient } from 'mongodb';
import dependencies from '../dependencies';
import { IDatabaseClient } from '../interfaces';
import { EnvironmentConfig } from '../types';

@injectable()
export class MongoDatabaseClient implements IDatabaseClient {
    private _client: MongoClient;

    private environmentConfig: EnvironmentConfig;

    constructor(
        @inject(dependencies.configuration) config: EnvironmentConfig,
    ) {
        this.environmentConfig = config;
    }

    public isConnected(): boolean {
        return this._client.isConnected();
    }

    public async connect(): Promise<boolean> {
        const uri = `mongodb+srv://${this.environmentConfig.MONGO_USER}:${this.environmentConfig.MONGO_PASS}@mongo:27017/?poolSize=20&writeConcern=majority`;

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
        catch {
            return false
        }
    }

    public async findBySingleMatchingValue(collectionName: string, key: string, value: string): Promise<object[]> {
        try {
            const collection = this._client.db(this.environmentConfig.dbName).collection(collectionName)

            return await collection.find({
                [key]: value,
            }).toArray();
        }
        catch (e) {
            throw new Error(e);
        }
    }
}