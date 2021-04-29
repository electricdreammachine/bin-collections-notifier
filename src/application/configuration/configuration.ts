import { injectable } from 'inversify';

@injectable()
export class Configuration {
    constructor() {
        Object.assign(this, process.env)
    }
}