import container from './inversify.config';
import dependencies from './dependencies';
import { Orchestrator } from './application/orchestrator';

const orchestrator: Orchestrator = container.get(dependencies.orchestrator);

orchestrator.start();