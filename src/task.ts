import factory from './factory';


export default () => factory( typeof queueMicrotask !== 'undefined' ? queueMicrotask : Promise.resolve().then );
