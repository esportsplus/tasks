import factory from './factory';


let global = globalThis;


const immediate = () => {
    let { port1, port2 } = new MessageChannel();

    return factory(
        () => port2.postMessage(null),
        (task) => port1.onmessage = task
    );
};

const micro = () => factory(
    global?.queueMicrotask
        ? (task) => global?.queueMicrotask.call(global, task)
        : Promise.resolve().then
);

const raf = () => factory(
    global?.requestAnimationFrame
        ? (task) => global?.requestAnimationFrame.call(global, task)
        : (task) => setTimeout(task, (1000 / 60))
);


export default { immediate, micro, raf };
