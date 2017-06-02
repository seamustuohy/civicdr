'use strict';

import clonedeep from 'lodash.clonedeep';

import {
  GET_GROUPING,
  UPDATE_GROUPING,
  TOGGLE_GROUPING_DELETE_MODAL,
  TOGGLE_GROUPING_EDIT_MODAL,
  UPDATE_GROUPING_TICKET_CHECK,
  UPDATE_ALL_TICKET_CHECKS,
  REMOVE_TICKETS_FROM_GROUPING_LIST,
  UPDATE_TICKET_STATUSES_FOR_GROUPING
} from '../actions';

export const initialState = {
  grouping: {
    tickets: [{
      ticket_id: '',
      title: '',
      date_of_incident: '',
      description: '',
      checked: false
    }]
  },
  // Some UI information for the single-grouping view is stored here
  allTicketCheckboxIsChecked: false,
  isDeleteModalVisible: false,
  isEditModalVisible: false
};

export default (state = initialState, action) => {
  const newState = clonedeep(state);

  switch (action.type) {
    case GET_GROUPING:
      newState.grouping = action.data;
      break;
    case UPDATE_GROUPING:
      newState.grouping.title = action.title;
      newState.grouping.description = action.description;
      newState.isEditModalVisible = false;
      break;

    case TOGGLE_GROUPING_DELETE_MODAL:
      newState.isDeleteModalVisible = !state.isDeleteModalVisible;
      break;
    case TOGGLE_GROUPING_EDIT_MODAL:
      newState.isEditModalVisible = !state.isEditModalVisible;
      break;

    case UPDATE_GROUPING_TICKET_CHECK:
      // First, update the individual checkbox
      newState.grouping.tickets
        .find(t => t.ticket_id === action.ticketID)
        .checked = action.checked;

      // Then, update the list-header's checkbox
      if (action.checked === false) {
        newState.allTicketCheckboxIsChecked = false;
      } else if (
        action.checked === true &&
        newState.allTicketCheckboxIsChecked === false &&
        newState.grouping.tickets.filter(t => (t.checked !== true)).length === 0
      ) {
        newState.allTicketCheckboxIsChecked = true;
      }
      break;
    // Apply the list-header's checkbox value to all groupings'
    case UPDATE_ALL_TICKET_CHECKS:
      newState.allTicketCheckboxIsChecked = action.checked;
      newState.grouping.tickets
        .forEach(t => { t.checked = action.checked; });
      break;

    case REMOVE_TICKETS_FROM_GROUPING_LIST:
      newState.grouping.tickets = newState.grouping.tickets
        .filter(t => !(action.ticketIDs.includes(t.ticket_id)));
      newState.allTicketCheckboxIsChecked = false;
      break;
    case UPDATE_TICKET_STATUSES_FOR_GROUPING:
      newState.grouping.tickets
        .filter(t => action.ticketIDs.includes(t.ticket_id))
        .forEach(t => { t.status = action.status; });
      break;
  }
  return newState;
};
