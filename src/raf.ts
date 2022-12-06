import { Fn } from './types';
import factory from './factory';


export default () => factory(
    window.requestAnimationFrame || function (fn: Fn) {
        return window.setTimeout(fn, (1000 / 60));
    }
);
