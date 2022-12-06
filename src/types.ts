import { Scheduler as scheduler } from "./factory";


type Fn = () => Promise<unknown> | unknown;

type Queue = (fn: VoidFunction) => Promise<unknown> | unknown;

type Scheduler = typeof scheduler;

type Throttled = {
    interval: number;
    limit: number;
} | undefined;


export { Fn, Queue, Scheduler, Throttled };