import factory from './factory';


export default () => factory(
    (window || self || global).queueMicrotask.bind(window || self || global) || Promise.resolve().then
);
