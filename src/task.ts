import factory from './factory';
import global from './global';


export default () => factory(
    global?.queueMicrotask.bind(global) || Promise.resolve().then
);
