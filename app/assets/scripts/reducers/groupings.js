'use strict';

import {
  GET_GROUPINGS,
  TOGGLE_GROUPINGS_MODAL
} from '../actions';

export const initialState = {
  groupings: [],
  isModalVisible: false
};

export default (state = initialState, action) => {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case GET_GROUPINGS:
      newState.groupings = action.data;
      break;
    case TOGGLE_GROUPINGS_MODAL:
      newState.isModalVisible = !state.isModalVisible;
      break;
  }
  return newState;
};
