import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers/reducer';
import createLogger from 'redux-logger';

export default function(initialState) {
  const logger = createLogger();
  const createFinalStore = compose(
    // redux dev tools
    applyMiddleware(thunk),
    (typeof window != 'undefined' && window.devToolsExtension) ?
    window.devToolsExtension() :
    f => f
  )(createStore);
  const store = createFinalStore(reducer, initialState);
  return store;
}