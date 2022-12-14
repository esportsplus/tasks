import { Fn, Queue, Throttled } from './types';


class Scheduler {
    private last = 0;
    private queue: Queue;
    private scheduled: boolean = false;
    private stack: Fn[] = [];
    private throttled: Throttled;


    constructor(queue: Scheduler['queue']) {
        this.queue = queue;
    }


    add(fn: Fn) {
        this.stack.push(fn);
        this.schedule();

        return this;
    }

    private async run() {
        let n = this?.throttled?.limit || this.stack.length,
            now = Date.now();

        if (!this.throttled || (now - this.last) > this.throttled.interval) {
            this.last = now;

            for (let i = 0; i < n; i++) {
                await this.stack[i]();
            }

            this.stack.splice(0, n);
        }

        this.scheduled = false;
        this.schedule();
    }

    schedule() {
        if (this.scheduled || !this.stack.length) {
            return;
        }

        this.queue(async () => await this.run());
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
}


export default (queue: Scheduler['queue']) => new Scheduler(queue);
export { Scheduler };
