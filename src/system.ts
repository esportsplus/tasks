import { Fn } from './types';


class System {
    running: boolean = false;
    scheduled: boolean = false;
    schedulers = new Set<{ add: (fn: Fn) => void }>;
    tasks = new Set<Fn>;


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
            throw new Error('A minimum of 1 scheduler is required to run system workers');
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


export default () => new System();
export { System };