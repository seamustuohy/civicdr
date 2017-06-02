'use strict';

import clonedeep from 'lodash.clonedeep';
import { del } from 'object-path';
import {
  GET_TICKET_SINGLE,
  UPDATE_TICKET_SP,
  REMOVE_TICKET_SP,
  REMOVE_TICKET_GROUPING
} from '../actions';

export const initialState = {
  ticket: {}
};

export default (state = initialState, action) => {
  const newState = clonedeep(state);
  switch (action.type) {
    case GET_TICKET_SINGLE:
      newState.ticket = Object.assign(newState.ticket, action.data);
      break;
    case UPDATE_TICKET_SP:
      newState.ticket.sp_assigned_id = action.data.serviceProviderID;
      break;
    case REMOVE_TICKET_SP:
      del(newState, ['ticket', 'sp_assigned_id']);
      break;
    case REMOVE_TICKET_GROUPING:
      newState.ticket.groupings = newState.ticket.groupings
        .filter(g => g.grouping_id !== action.data.groupingID);
      break;
  }
  return newState;
};
