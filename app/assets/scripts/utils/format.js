'use strict';
import moment from 'moment';

export const formatDate = (datetime) => moment(datetime).format('YYYY-MM-DD');
export const formatTime = (datetime) => moment(datetime).format('h:mm a');

// Extract a ticket "title" from the first segment of the ticket's UUID
export function formatTicketTitle (uuid) {
  let parts = uuid.split('-');
  if (parts.length > 0) {
    return parts[0];
  } else {
    throw new Error('Malformed ticket title');
  }
}
