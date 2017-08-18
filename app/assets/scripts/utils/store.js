import { createStore, applyMiddleware } from 'redux';
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

const store = createStore(reducer, initialState, applyMiddleware(thunkMiddleware, logger));

module.exports = store;
