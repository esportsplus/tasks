import { READY, RUNNING, SCHEDULED } from './constants';
import queue from '@esportsplus/queue';


class Scheduler {
    private lastRunAt = 0;
    private queue = queue<VoidFunction>();
    private scheduler: ((task: Scheduler['task']) => Promise<unknown> | unknown);
    private state = READY;
    private task: () => Promise<void>;
    private throttled: {
        interval: number;
        limit: number;
    } | null = null;


    constructor(scheduler: Scheduler['scheduler']) {
        this.scheduler = scheduler;
        this.task = () => this.run();
    }


    private async run() {
        if (this.state === RUNNING) {
            return;
        }

        this.state = RUNNING;

        if ((this.throttled?.interval || 0) <= (Date.now() - this.lastRunAt)) {
            let n = this.throttled?.limit || this.queue.length;

            for (let i = 0; i < n; i++) {
                try {
                    this.queue.next()?.();
                }
                catch {}
            }

            this.lastRunAt = Date.now();
        }

        this.state = READY;
        this.schedule();
    }


    add(task: VoidFunction) {
        this.queue.add(task);
        this.schedule();

        return this;
    }

    schedule() {
        if (this.state !== READY || !this.queue.length) {
            return this;
        }

        this.state = SCHEDULED;
        this.scheduler(this.task);

        return this;
    }

    throttle(limit: number, ms: number) {
        this.throttled = {
            interval: ms / limit,
            limit: 1
        };

        return this;
    }
}


export default (...args: ConstructorParameters< typeof Scheduler >) => new Scheduler(...args);
export { Scheduler };
