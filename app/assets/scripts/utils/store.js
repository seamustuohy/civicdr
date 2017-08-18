import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import config from '../config';
import reducer from '../reducers';

// Configuration for Redux.js,
// to initialize its store and incorporate middleware

const initialState = {
};

const logger = createLogger({
  level: 'info',
  collapsed: true,
  predicate: (getState, action) => {
    return (config.environment !== 'production');
  }
});

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer,
                          initialState,
                          composeEnhancers(applyMiddleware(thunkMiddleware, logger)));
/* eslint-enable */

module.exports = store;
