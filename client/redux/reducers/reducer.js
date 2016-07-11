import { combineReducers } from 'redux';
import { messages } from './messages';
import { hamsters } from './hamsters';

const reducer = combineReducers({
  messages,
  hamsters
});

export default reducer;