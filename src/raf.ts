import { Fn } from './types';
import factory from './factory';


let queue: any = (fn: Fn) => setTimeout(fn, (1000 / 60));

if (self && self?.requestAnimationFrame) {
    queue = self.requestAnimationFrame.bind(self);
}


export default () => factory(queue as Parameters<typeof factory>[0]);
