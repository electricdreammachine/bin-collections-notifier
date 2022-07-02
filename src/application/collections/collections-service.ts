import { injectable, inject } from 'inversify';
import fetch from 'node-fetch';
import { LogLevels } from '../../constants';
import dependencies from '../../dependencies';
import { ICollectionsService, ILoggerService } from '../../interfaces';
import { EnvironmentConfig, Collection } from '../../types';

interface CollectionsResponse {
    dates: {
        date: string,
        type: string[],
    }[],
    types: {
        [key: string]: string,
    }
}

@injectable()
export class CollectionsService implements ICollectionsService {
    private _config;
    private _logger;

    constructor(
        @inject(dependencies.configuration) config: EnvironmentConfig,
        @inject(dependencies.logger) logger: ILoggerService,
    ) {
        this._config = config;
        this._logger = logger;
    }

    async getCollectionsForAddressID(addressID: string): Promise<Collection[]> {
        try {
            const collectionsResponse = await fetch(`${this._config.API_URL}/collections`, {
                method: 'post',
                body: JSON.stringify({ addressId: addressID }),
            });

            const responseJson: CollectionsResponse = await collectionsResponse.json();

            this._logger.log(LogLevels.info, 'Collections request succeeded')

            return responseJson.dates.map(date => ({
                ...date,
                // @ts-ignore typescript doesn't seem to be aware of this method
                // TODO: add a declaration
                type: new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(
                    date.type.map(t => responseJson.types[t])
                ),
            }));
        } catch (e) {
            this._logger.log(LogLevels.error, `An error occured retrieving collections: ${e.message}`)

            throw new Error(e);
        }
    }
}