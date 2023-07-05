import { READY, RUNNING, SCHEDULED } from './symbols';


class Scheduler {
    private lastRunAt = 0;
    private queue: ((task: Scheduler['task']) => Promise<unknown> | unknown);
    private stack: (() => Promise<unknown> | unknown)[] = [];
    private state = READY;
    private task: () => Promise<void>;
    private throttled: {
        interval: number;
        limit: number;
    } | null = null;


    constructor(queue: Scheduler['queue']) {
        this.queue = queue;
        this.task = () => this.run();
    }


    private async run() {
        if (this.state === RUNNING) {
            return;
        }

        this.state = RUNNING;

        if ((this.throttled?.interval || 0) <= (Date.now() - this.lastRunAt)) {
            let n = this.throttled?.limit || this.stack.length;

            for (let i = 0; i < n; i++) {
                try {
                    // @ts-ignore
                    this.stack[i] = this.stack[i]();
                }
                catch {}
            }

            if (this.stack.length === n) {
                await Promise.allSettled( this.stack );
                this.stack.length = 0;
            }
            else {
                await Promise.allSettled( this.stack.splice(0, n) );
            }

            this.lastRunAt = Date.now();
        }

        this.state = READY;
        this.schedule();
    }


    add<T>(task: () => Promise<T> | T) {
        this.stack.push(task);
        this.schedule();

        return this;
    }

    schedule() {
        if (this.state !== READY || !this.stack.length) {
            return this;
        }

        this.state = SCHEDULED;
        this.queue(this.task);

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
