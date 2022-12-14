import { Scheduler } from "./factory";
import { System } from './system';


type Fn = () => Promise<unknown> | unknown;

type Queue = (fn: VoidFunction) => Promise<unknown> | unknown;

type Throttled = {
    interval: number;
    limit: number;
} | undefined;


export { Fn, Queue, Scheduler, System, Throttled };