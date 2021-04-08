import { BinCollectionsNotifier } from './application';
import container from './inversify.config';
import dependencies from './dependencies';

const notifier: BinCollectionsNotifier = container.get(dependencies.main);

notifier.start();