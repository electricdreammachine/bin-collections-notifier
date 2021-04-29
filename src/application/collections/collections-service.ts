import { injectable, inject } from 'inversify';
import fetch from 'node-fetch';
import dependencies from '../../dependencies';
import { ICollectionsService } from '../../interfaces';
import { EnvironmentConfig, Collection } from '../../types';

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

            return collectionsResponse.json();
        }
        catch {
            throw new Error();
        }
    }
}