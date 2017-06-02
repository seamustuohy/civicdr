'use strict';

import { set } from 'object-path';

import {
  GET_SERVICE_PROVIDERS,
  GET_SERVICE_PROVIDER,
  UPDATE_SERVICE_PROVIDER_FILTERS,
  REMOVE_SERVICE_PROVIDERS
} from '../actions';

export const initialState = {
  list: [],
  filters: {}
};

export default (state = initialState, action) => {
  const newState = Object.assign({}, state);
  let index, newList;

  switch (action.type) {
    case GET_SERVICE_PROVIDER:
      newList = newState.list.slice(0);
      index = newList.findIndex(sp => sp.id === action.data.id);
      if (index > -1) {
        newList.splice(index, 1, action.data);
      } else {
        newList.push(action.data);
      }
      newState.list = newList;
      break;
    case GET_SERVICE_PROVIDERS:
      newState.list = action.data;
      break;
    case UPDATE_SERVICE_PROVIDER_FILTERS:
      const newFilters = Object.assign({}, newState.filters);
      set(newFilters, action.data.filterKey, action.data.filterList);
      newState.filters = newFilters;
      break;
    case REMOVE_SERVICE_PROVIDERS:
      newList = newState.list.slice(0);
      newState.list = newList.filter(sp => !action.data.includes(sp.id));
  }
  return newState;
};
