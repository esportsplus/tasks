
import { Scheduler } from './factory';


class Worker {
    running = false;
    scheduled = false;
    schedulers = new Set<{ add: Scheduler['add'] }>;
    tasks = new Set< Scheduler['stack'][0] >;


    async run() {
        this.running = true;

        for (let task of this.tasks) {
            await task();
        }

        this.running = false;
    }


    schedule() {
        if (this.scheduled) {
            return;
        }

        if (!this.schedulers.size) {
            throw new Error('A minimum of 1 scheduler is required to run a worker');
        }

        this.scheduled = true;

        for (let scheduler of this.schedulers) {
            scheduler.add(async () => {
                if (this.running) {
                    return;
                }

                await this.run();

                this.scheduled = false;
            });
        }
    }
}


export default () => new Worker();
export { Worker };