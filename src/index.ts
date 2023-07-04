import factory from './factory';
import worker from './worker';


let { queueMicrotask, requestAnimationFrame } = globalThis;


const raf = () => factory(
    requestAnimationFrame
        ? (fn) => requestAnimationFrame.call(global, fn)
        : (fn) => setTimeout(fn, (1000 / 60))
);

const task = () => factory(
    queueMicrotask
        ? (fn) => queueMicrotask.call(global, fn)
        : Promise.resolve().then
);


export { raf, task, worker };
