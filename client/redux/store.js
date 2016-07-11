import { applyMiddleware, createStore, compose } from 'redux';
import reducer from './reducers/reducer';
import createLogger from 'redux-logger';

export default function(initialState) {
  const logger = createLogger();
  const createFinalStore = compose(
    //don't apply middleware when not in the browser
    typeof window != 'undefined' ? applyMiddleware(logger) : f => f
  )(createStore);
  const store = createFinalStore(reducer, initialState);
  return store;
}