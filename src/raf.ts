import { Fn } from './types';
import factory from './factory';


export default () => factory(
    globalThis?.requestAnimationFrame.bind(globalThis) || ((fn: Fn) => setTimeout(fn, (1000 / 60)))
);
