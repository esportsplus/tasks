import { Fn } from './types';
import factory from './factory';


export default () => factory( self.requestAnimationFrame.bind(self) || ((fn: Fn) => self.setTimeout(fn, (1000 / 60))) );
