import { applyMiddleware, createStore, compose } from 'redux';
import reducer from './reducers/reducer';
import createLogger from 'redux-logger';

export default function(initialState) {
  const logger = createLogger();
  const createFinalStore = compose(
    applyMiddleware(logger)
  )(createStore);
  const store = createFinalStore(reducer, initialState);
  return store;
}