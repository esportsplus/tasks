import factory from './factory';
import worker from './worker';


let global = globalThis;


const raf = () => factory(
    global?.requestAnimationFrame.bind(global) || ((fn) => setTimeout(fn, (1000 / 60)))
);

const task = () => factory(
    global?.queueMicrotask.bind(global) || Promise.resolve().then
);;


export default { raf, task, worker };
export { raf, task, worker };
