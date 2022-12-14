import factory from './factory';


export default () => factory( self.queueMicrotask.bind(self) || Promise.resolve().then );
