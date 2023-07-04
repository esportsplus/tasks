
import { Scheduler } from './factory';
import { READY, RUNNING, SCHEDULED } from './symbols';


class Worker {
    private state = READY;
    private task: () => Promise<void>;

    schedulers = new Set<{ add: Scheduler['add'] }>;
    tasks = new Set< Scheduler['stack'][0] >;


    constructor() {
        this.task = () => this.run();
    }


    private async run() {
        if (this.state === RUNNING) {
            return;
        }

        this.state = RUNNING;

        let stack: Promise<void>[] = [];

        for (let task of this.tasks) {
            stack.push( task() );
        }

        await Promise.allSettled(stack);

        this.state = READY;
    }

    schedule() {
        if (this.state !== READY || !this.tasks.size) {
            return this;
        }

        if (!this.schedulers.size) {
            throw new Error('A minimum of 1 scheduler is required to run a worker');
        }

        this.state = SCHEDULED;

        for (let scheduler of this.schedulers) {
            scheduler.add(this.task);
        }

        return this;
    }
}


export default () => new Worker();
export { Worker };