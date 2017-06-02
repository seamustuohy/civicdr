'use strict';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import tickets from './tickets';
import grouping from './grouping';
import groupings from './groupings';
import serviceProviders from './service-providers';
import auth from './auth';
import ticketSingle from './ticket-single';
import implementingPartners from './implementing-partners';
import threads from './threads';

export const reducers = {
  tickets,
  grouping,
  groupings,
  serviceProviders,
  ticketSingle,
  implementingPartners,
  threads,
  auth
};

export default combineReducers(Object.assign({}, reducers, {
  routing: routerReducer
}));
