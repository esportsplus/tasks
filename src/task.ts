import factory from './factory';


export default () => factory(
    globalThis?.queueMicrotask.bind(globalThis) || Promise.resolve().then
);
