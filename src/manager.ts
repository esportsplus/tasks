import { Scheduler } from './factory';
import { Fn } from './types';


let queue: Fn[] = [],
    running: boolean = false,
    scheduled: boolean = false;


async function tick() {
    if (running) {
        return;
    }

    running = true;

    for (let i = 0, n = queue.length; i < n; i++) {
        await queue[i]();
    }

    queue.length = 0;
    running = false;
    scheduled = false;
};


const add = (fn: Fn) => {
    queue.push(fn);

    if (!scheduled) {
        if (!schedulers.size) {
            throw new Error('Task manager requires a minimum of 1 scheduler');
        }

        scheduled = true;

        for (let scheduler of schedulers) {
            scheduler.add(tick);
        }
    }
};

const schedulers = new Set<Scheduler>;


export default { add, schedulers };
export { add, schedulers };