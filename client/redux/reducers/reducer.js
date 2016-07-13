import { combineReducers } from 'redux';
import { messages } from './messages';
import { hamsters } from './hamsters';
import { questions } from './questions';

const reducer = combineReducers({
  messages,
  hamsters,
  questions
});

export default reducer;