import factory from './factory';


let global = globalThis;


const immediate = () => {
    let { port1, port2 } = new MessageChannel(),
        registered = false;

    return factory((task) => {
        if (!registered) {
            port1.onmessage = task;
            registered = true;
        }

        port2.postMessage(null);
    });
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
