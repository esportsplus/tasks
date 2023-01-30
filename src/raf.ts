import { Fn } from './types';
import factory from './factory';
import global from './global';


export default () => factory(
    global?.requestAnimationFrame.bind(global) || ((fn: Fn) => setTimeout(fn, (1000 / 60)))
);
