import { injectable, inject } from 'inversify';
import fetch from 'node-fetch';
import dependencies from '../../dependencies';
import { ICollectionsService } from '../../interfaces';
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
    @inject(dependencies.configuration)
    private config: EnvironmentConfig;

    async getCollectionsForAddressID(addressID: string): Promise<Collection[]> {
        try {
            const collectionsResponse = await fetch(`${this.config.API_URL}/collections`, {
                method: 'post',
                body: JSON.stringify({ addressId: addressID }),
            });

            const responseJson: CollectionsResponse = await collectionsResponse.json();

            return responseJson.dates.map(date => ({
                ...date,
                // @ts-ignore typescript doesn't seem to be aware of this method
                // TODO: add a declaration
                type: new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(
                    date.type.map(t => responseJson.types[t])
                ),
            }));
        }
        catch {
            throw new Error();
        }
    }
}