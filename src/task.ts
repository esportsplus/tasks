import factory from './factory';


let queue: any = Promise.resolve().then;

if (self && self?.queueMicrotask) {
    queue = self.queueMicrotask.bind(self);
}


export default () => factory(queue as Parameters<typeof factory>[0]);
