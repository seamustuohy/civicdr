'use strict';

import {
  ADD_ERROR,
  REMOVE_ERROR
} from '../actions';

export const initialState = {
  errorMsg: null,
  isErrorModalVisible: false,
  offerLogout: false
};

export default (state = initialState, action) => {
  let newState = Object.assign({}, state);

  switch (action.type) {
    case ADD_ERROR:
      if (action.error === 'unauthorized') {
        newState.offerLogout = true;
      }
      if (action.msg) {
        newState.errorMsg = action.msg;
      }
      newState.isErrorModalVisible = true;
      break;
    case REMOVE_ERROR:
      newState = Object.assign({}, initialState);
      break;
  }
  return newState;
};
