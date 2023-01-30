import { Fn } from './types';
import factory from './factory';


export default () => factory(
    window?.requestAnimationFrame.bind(window) || ((fn: Fn) => setTimeout(fn, (1000 / 60)))
);
