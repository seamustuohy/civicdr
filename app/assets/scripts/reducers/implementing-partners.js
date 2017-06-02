'use strict';

import { set } from 'object-path';

import {
  GET_IMPLEMENTING_PARTNER,
  GET_IMPLEMENTING_PARTNERS,
  UPDATE_IMPLEMENTING_PARTNERS_FILTERS,
  REMOVE_IMPLEMENTING_PARTNERS
} from '../actions';

export const initialState = {
  list: [],
  filters: {}
};

export default (state = initialState, action) => {
  const newState = Object.assign({}, state);
  let index, newList;

  switch (action.type) {
    // Upsert a single IP into the list
    case GET_IMPLEMENTING_PARTNER:
      newList = newState.list.slice(0);
      index = newList.findIndex(ip => ip.id === action.data.id);
      if (index > -1) {
        newList.splice(index, 1, action.data);
      } else {
        newList.push(action.data);
      }
      newState.list = newList;
      break;
    case GET_IMPLEMENTING_PARTNERS:
      newState.list = action.data;
      break;
    case UPDATE_IMPLEMENTING_PARTNERS_FILTERS:
      const newFilters = Object.assign({}, newState.filters);
      set(newFilters, action.data.filterKey, action.data.filterList);
      newState.filters = newFilters;
      break;
    case REMOVE_IMPLEMENTING_PARTNERS:
      newList = newState.list.slice(0);
      newState.list = newList.filter(ip => !action.data.includes(ip.id));
  }
  return newState;
};
