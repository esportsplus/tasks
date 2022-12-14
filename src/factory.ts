import { Fn, Queue, Throttled } from './types';


class Scheduler {
    private queue: VoidFunction;
    private lastRun = 0;
    private scheduled: boolean = false;
    private stack: Fn[] = [];
    private throttled: Throttled;
    private workers = new Set<Fn>;


    // Microtask throws error when queue is set as scheduler property
    constructor(queue: Queue) {
        this.queue = () => queue(this.run);
    }


    add(fn: Fn) {
        this.stack.push(fn);
        this.schedule();

        return this;
    }

    async run() {
        let n = this?.throttled?.limit || this.stack.length,
            now = Date.now();

        if (!this.throttled || (now - this.lastRun) > this.throttled.interval) {
            this.lastRun = now;

            for (let i = 0; i < n; i++) {
                await this.stack[i]();
            }

            this.stack.splice(0, n);

            for (let worker of this.workers) {
                await worker();
            }
        }

        this.scheduled = false;
        this.schedule();
    }

    schedule() {
        if (this.scheduled || !this.stack.length) {
            return;
        }

        this.queue();
        this.scheduled = true;

        return this;
    }

    throttle(limit: number, interval: number, evenly: boolean = false) {
        if (evenly) {
            interval = interval / limit;
            limit = 1;
        }

        this.throttled = { interval, limit };

        return this;
    }

    worker(fn: Fn) {
        this.workers.add(fn);

        return () => this.workers.delete(fn);
    }
}


export default (queue: Queue) => new Scheduler(queue);
export { Scheduler };
