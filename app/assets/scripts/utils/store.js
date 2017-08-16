import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {browserHistory} from 'react-router';
import {routerMiddleware} from 'react-router-redux';

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

const middleware = applyMiddleware(
  routerMiddleware(browserHistory),
  thunkMiddleware,
  logger
);

const store = createStore(
  reducer,
  initialState,
  middleware
);

module.exports = store;
