'use strict';
import { set } from 'object-path';
import {
  GET_TICKETS,
  UPDATE_TICKET_FILTERS,
  REMOVE_TICKETS,
  UPDATE_TICKET_STATUSES
} from '../actions';

export const initialState = {
  tickets: [],
  filters: {
    status: [],
    incident_type: [],
    grouping: []
  }
};

export default (state = initialState, action) => {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case GET_TICKETS:
      set(newState, 'tickets', action.data);
      break;
    case UPDATE_TICKET_FILTERS:
      const newFilters = Object.assign({}, newState.filters);
      set(newFilters, action.data.filterKey, action.data.filterList);
      newState.filters = newFilters;
      break;
    case REMOVE_TICKETS:
      set(newState, 'tickets', newState.tickets.filter(t => !action.ticketIDs.includes(t.id)));
      break;
    case UPDATE_TICKET_STATUSES:
      set(newState, 'tickets', newState.tickets.map(t => {
        if (action.ticketIDs.includes(t.id)) {
          return Object.assign({}, t, { status: action.status });
        } else {
          return t;
        }
      }));
  }
  return newState;
};
