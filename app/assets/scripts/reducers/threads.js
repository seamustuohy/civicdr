'use strict';

import _ from 'lodash';
import { GET_THREADS, GET_THREAD, REMOVE_MESSAGE } from '../actions';

export const initialState = {
  // This state will only contain one ticket or grouping's threads at a time
  threads: []
};

export default (state = initialState, action) => {
  const newState = _.cloneDeep(state);
  switch (action.type) {
    case GET_THREADS:
      newState.threads = action.data;
      break;
    case GET_THREAD:
      if (newState.threads.map(t => t.id).includes(action.data.id)) {
        newState.threads = newState.threads.map(t => {
          if (t.id === action.data.id) {
            return action.data;
          } else {
            return t;
          }
        });
      } else {
        newState.threads = newState.threads.concat(action.data);
      }
      break;
    case REMOVE_MESSAGE:
      newState.threads = newState.threads.map(t => {
        t.messages = t.messages.filter(m => m.id !== action.messageID);
        return t;
      });
      break;
  }
  return newState;
};
