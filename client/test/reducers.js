//test reducers here
import test from 'tape';
import { hamsters } from '../redux/reducers/hamsters';

test('hamster reducer', (t) => {
  t.deepEqual(hamsters(undefined, {"type":"@@INIT"}).all, {}, 'initial state has "all" object');
  t.end();
});