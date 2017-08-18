'use strict';
import {
  ADD_ERROR,
  REMOVE_ERROR
} from '../actions';

export const initialState = {
  error: null,
  isErrorModalVisible: false,
  offerLogout: false
}

function errors(state = initialState, action) {
  const newState = Object.assign({}, state);

  switch (action.type) {
    case ADD_ERROR:
      if (action.error === "unauthorized") {
        newState.offerLogout = true;
      }
      if (action.msg) {
        newState.error = action.msg;
      }
      newState.isErrorModalVisible = true;
      break;
    case REMOVE_ERROR:
      newState = Object.assign({}, initialState);
      break;
  }
  return newState;
};
