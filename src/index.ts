import factory, { Scheduler } from './factory';


let global = globalThis;


const immediate = () => {
    let { port1, port2 } = new MessageChannel();

    port1.onmessage = async ({ data: task }: { data: Scheduler['task'] }) => {
        await task();
    };

    return factory( (fn) => port2.postMessage(fn) );
};

const micro = () => factory(
    global?.queueMicrotask
        ? (fn) => global?.queueMicrotask.call(global, fn)
        : Promise.resolve().then
);

const raf = () => factory(
    global?.requestAnimationFrame
        ? (fn) => global?.requestAnimationFrame.call(global, fn)
        : (fn) => setTimeout(fn, (1000 / 60))
);


export default { immediate, micro, raf };
