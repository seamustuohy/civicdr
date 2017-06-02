'use strict';

import {UPDATE_TOKEN, LOGOUT_SUCCESS, UPDATE_PROFILE} from '../actions';
import {getRolesFromToken} from '../utils/auth-service';

export const initialState = {
  id_token: null,
  roles: [],
  profile: {},
  askedForProfile: false
};

export default (state = initialState, action) => {
  let newState = Object.assign({}, state);
  switch (action.type) {
    case UPDATE_TOKEN:
      if (action.err) {
        // Do something with the error
        break;
      }
      newState.roles = getRolesFromToken(action.data);
      newState.id_token = action.data;
      break;
    case UPDATE_PROFILE:
      if (action.err) {
        // Do something with the error
        break;
      }
      newState.profile = action.data;
      newState.askedForProfile = action.askedForProfile;
      break;

    case LOGOUT_SUCCESS:
      newState = Object.assign({}, initialState);
      break;
  }
  return newState;
};
