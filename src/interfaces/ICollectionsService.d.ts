import { Collection } from '../types';

export interface ICollectionsService {
    getCollectionsForAddressID(addressID: string): Promise<Collection[]>;
}