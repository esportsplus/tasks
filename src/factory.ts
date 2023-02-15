class Scheduler {
    private last = 0;
    private queue: (task: Scheduler['stack'][0]) => Promise<unknown> | unknown;
    private scheduled = false;
    private stack: VoidFunction[] = [];
    private throttled: {
        interval: number;
        limit: number;
    } | undefined;


    constructor(queue: Scheduler['queue']) {
        this.queue = queue;
    }


    add<T>(task: () => Promise<T> | T) {
        return new Promise< Awaited< ReturnType<typeof task> > >((resolve, reject) => {
            this.stack.push(async () => {
                try {
                    resolve( await task() );
                }
                catch (e) {
                    reject(e);
                }
            });
            this.schedule();
        });
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

    throttle(limit: number, ms: number) {
        this.throttled = {
            interval: ms / limit,
            limit: 1
        };

        return this;
    }
}


export default (queue: Scheduler['queue']) => new Scheduler(queue);
export { Scheduler };
