import request from '../utils/request.js';
import axios from 'axios';

// Export the action string constants

export const UPDATE_TOKEN = 'UPDATE_TOKEN';
export const DELETE_TOKEN = 'DELETE_TOKEN';
export const UPDATE_SECRET = 'UPDATE_SECRET';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const GET_TICKETS = 'GET_TICKETS';
export const GET_TICKET_SINGLE = 'GET_TICKET_SINGLE';
export const REMOVE_TICKETS = 'REMOVE_TICKETS';
export const UPDATE_TICKET_SP = 'UPDATE_TICKET_SP';
export const REMOVE_TICKET_SP = 'REMOVE_TICKET_SP';
export const REMOVE_TICKET_GROUPING = 'REMOVE_TICKET_GROUPING';
export const UPDATE_TICKET_STATUSES = 'UPDATE_TICKET_STATUSES';
export const UPDATE_TICKET_FILTERS = 'UPDATE_TICKET_FILTERS';
export const DUPLICATE_TICKET = 'DUPLICATE_TICKET';

export const GET_GROUPING = 'GET_GROUPING';
export const UPDATE_GROUPING = 'UPDATE_GROUPING';
export const TOGGLE_GROUPING_DELETE_MODAL = 'TOGGLE_GROUPING_DELETE_MODAL';
export const TOGGLE_GROUPING_EDIT_MODAL = 'TOGGLE_GROUPING_EDIT_MODAL';
export const UPDATE_GROUPING_TICKET_CHECK = 'UPDATE_GROUPING_TICKET_CHECK';
export const UPDATE_ALL_TICKET_CHECKS = 'UPDATE_ALL_TICKET_CHECKS';
export const REMOVE_TICKETS_FROM_GROUPING_LIST = 'REMOVE_TICKETS_FROM_GROUPING_LIST';
export const UPDATE_TICKET_STATUSES_FOR_GROUPING = 'UPDATE_TICKET_STATUSES_FOR_GROUPING';
export const GET_GROUPINGS = 'GET_GROUPINGS';
export const TOGGLE_GROUPINGS_MODAL = 'TOGGLE_GROUPINGS_MODAL';

export const GET_SERVICE_PROVIDER = 'GET_SERVICE_PROVIDER';
export const GET_SERVICE_PROVIDERS = 'GET_SERVICE_PROVIDERS';
export const UPDATE_SERVICE_PROVIDER_FILTERS = 'UPDATE_SERVICE_PROVIDER_FILTERS';
export const REMOVE_SERVICE_PROVIDERS = 'REMOVE_SERVICE_PROVIDERS';
export const PUT_SP_PROFILE = 'PUT_SP_PROFILE';
export const POST_SP_PROFILE = 'POST_SP_PROFILE';

export const GET_IMPLEMENTING_PARTNERS = 'GET_IMPLEMENTING_PARTNERS';
export const UPDATE_IMPLEMENTING_PARTNERS_FILTERS = 'UPDATE_IMPLEMENTING_PARTNERS_FILTERS';
export const GET_IMPLEMENTING_PARTNER = 'GET_IMPLEMENTING_PARTNER';
export const REMOVE_IMPLEMENTING_PARTNERS = 'REMOVE_IMPLEMENTING_PARTNERS';
export const PUT_IP_PROFILE = 'PUT_IP_PROFILE';
export const POST_IP_PROFILE = 'POST_IP_PROFILE';

export const GET_THREAD = 'GET_THREAD';
export const GET_THREADS = 'GET_THREADS';
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE';
export const ADD_ERROR = 'ADD_ERROR';
export const REMOVE_ERROR = 'REMOVE_ERROR';

// Generic error checker

export const checkErrors = (err) => {
  // If the error is a 401 redirect the user to the unauthorized page.
  if (err.response.status === 401) {
    return {type: ADD_ERROR, error: 'unauthorized', msg: 'You are not authorized to conduct that action. If you continue to get errors try logging out and back in.'};
  } else {
    return {type: ADD_ERROR, error: 'unknown'};
  }
};

export const removeErrors = () => {
  return {type: REMOVE_ERROR};
};

// Create the action-generators themselves

// Login actions

export const updateTokenStatus = (err, token) => {
  return {type: UPDATE_TOKEN, data: token, err};
};

export const deleteTokenStatus = () => {
  return {type: DELETE_TOKEN};
};

export const updateSecretStatus = (err, secret) => {
  return {type: UPDATE_SECRET, data: secret, err};
};

export const updateProfileStatus = (err, askedForProfile, profile) => {
  return {type: UPDATE_PROFILE, askedForProfile, data: profile, err};
};

// Reset the `auth` state to defaults
export const logoutSuccess = () => {
  return {type: LOGOUT_SUCCESS};
};

export const fetchProfile = () => {
  return dispatch => {
    request('/profile', 'get')
      .then(res => {
        // Note a successful receipt of data, and store it
        dispatch(updateProfileStatus(null, true, res.data));
      })
      .catch(err => {
        if (err.response) {
          if (err.response.status === 404) {
            // Record that an attempt was made, but access denied
            dispatch(updateProfileStatus(null, true, null));
          } else {
            dispatch(updateProfileStatus(err.response.data));
          }
        } else {
          dispatch(updateProfileStatus(err.message));
        }
      });
  };
};

// An IP or SP's one-time action to create their profile from scratch
export const createProfile = data => {
  return dispatch => {
    request('/profile', 'post', {data})
      .then(res => {
        dispatch(updateProfileStatus(null, true, res.data));
      })
      .catch(err => {
        dispatch(updateProfileStatus(err.message));
      });
  };
};

// Tickets/dashboard and ticket actions

export const getTickets = tickets => {
  return {type: GET_TICKETS, data: tickets};
};

export const fetchTickets = () => {
  return dispatch => {
    request('/tickets', 'get').then(res => {
      dispatch(getTickets(res.data));
    })
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const getTicketSingle = ticket => {
  return {type: GET_TICKET_SINGLE, data: ticket};
};

export const fetchTicketSingle = ticketID => {
  return dispatch => {
    request(`/tickets/${ticketID}`, 'get').then(res => {
      dispatch(getTicketSingle(res.data));
    })
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const removeTickets = ticketIDs => {
  return { type: REMOVE_TICKETS, ticketIDs };
};

export const deleteTickets = (ids, redirect) => {
  return dispatch => {
    axios
      // Wait until all of the requests have completed before continuing
      .all(ids.map(id => request(`/tickets/${id}`, 'delete')))
      .then(() => {
        dispatch(removeTickets(ids));
        if (redirect) redirect();
      })
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const updateTicketStatuses = (status, ticketIDs) => {
  return {type: UPDATE_TICKET_STATUSES, status, ticketIDs};
};

export const assignStatusToTickets = (status, ticketIDs) => {
  return dispatch => {
    axios
      .all(ticketIDs.map(ticketID => request(`/tickets/${ticketID}`, 'put', {data: {status}})))
      .then(() => dispatch(updateTicketStatuses(status, ticketIDs)))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const addGroupingToTicket = (ticketID, groupingID) => {
  return dispatch => {
    request(`/tickets/${ticketID}/groupings/${groupingID}`, 'post')
      // Refresh the ticket in the store
      .then(() => request(`/tickets/${ticketID}`, 'get'))
      .then(res => dispatch(getTicketSingle(res.data)))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const createGroupingAndAddToTicket = (title, description, ticketID) => {
  return dispatch => {
    request('/groupings', 'post', {data: {title, description}})
      .then(res => request(`/tickets/${ticketID}/groupings/${res.data[0]}`, 'post'))
      // Refresh the ticket in the store
      .then(() => request(`/tickets/${ticketID}`, 'get'))
      .then(res => dispatch(getTicketSingle(res.data)))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const removeTicketGrouping = (groupingID) => {
  return {type: REMOVE_TICKET_GROUPING, data: { groupingID }};
};

export const removeGroupingFromTicket = (ticketID, groupingID) => {
  return dispatch => {
    request(`/tickets/${ticketID}/groupings/${groupingID}`, 'delete')
      .then(() => dispatch(removeTicketGrouping(groupingID)))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const updateTicketSP = (serviceProviderID) => {
  return {type: UPDATE_TICKET_SP, data: { serviceProviderID }};
};

export const assignSPToTicket = (ticketID, serviceProviderID) => {
  return dispatch => {
    // Get currently-assigned SP ID, if there is one
    request(`/tickets/${ticketID}`, 'get')
      .then(res => {
        const existingSPID = res.data.sp_assigned_id;
        return existingSPID
          ? request(`/tickets/${ticketID}/sp_profiles/${existingSPID}`, 'delete')
          : Promise.resolve(null);
      })
      .then(() => request(`/tickets/${ticketID}/sp_profiles/${serviceProviderID}`, 'post'))
      // Update the store
      .then(() => {
        dispatch(updateTicketSP(serviceProviderID));
        dispatch(fetchTicketThreads(ticketID));
      })
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

// `PUT`ting a ticket's data results in those fields being updated
// in the database, for that given ticket ID
export const putTicket = (ticketID, updatedTicket) => {
  return dispatch => {
    request(`/tickets/${ticketID}`, 'put', { data: updatedTicket })
      .then(() => dispatch(getTicketSingle(updatedTicket)))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const removeTicketSP = () => {
  return {type: REMOVE_TICKET_SP};
};

export const removeSPFromTicket = (ticketID, serviceProviderID) => {
  return dispatch => {
    request(`/tickets/${ticketID}/sp_profiles/${serviceProviderID}`, 'delete')
      // Update the store
      .then(() => {
        dispatch(removeTicketSP());
        dispatch(fetchTicketThreads(ticketID));
      })
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

// Duplicate a ticket to another (or the same) IP
// This will copy almost all of the fields, except for ones like
// assigned SP and status
export const duplicateTicket = (ticketID, implementingPartnerID, redirectCallback) => {
  return dispatch => {
    request(`/tickets/${ticketID}/duplicate/${implementingPartnerID}`, 'post')
      .then(res => {
        redirectCallback(`/tickets/${res.data[0]}`);
        dispatch(fetchTicketSingle(res.data[0]));
        dispatch(fetchTicketThreads(res.data[0]));
      })
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const createTicket = ticket => {
  return request('/tickets', 'post', {data: ticket});
};

export const updateTicketFilters = (filterKey, filterList) => {
  return {type: UPDATE_TICKET_FILTERS, data: {filterKey, filterList}};
};

// Groupings actions
// The groupings and single-grouping views use Redux to store UI state
// more than other main views on the site; for example with the
// hide/show options for single-grouping-view modals

export const createGrouping = (title, description, redirectCallback) => {
  request('/groupings', 'post', {data: {title, description}})
    .then(res => redirectCallback(`/groupings/${res.data[0]}`))
  .catch(function (err) { redirectCallback(checkErrors(err)); });
};

export const getGroupings = groupings => {
  return {type: GET_GROUPINGS, data: groupings};
};

export const fetchGroupings = () => {
  return dispatch => {
    request('/groupings', 'get').then(res => {
      dispatch(getGroupings(res.data));
    })
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const toggleGroupingsModal = () => {
  return {type: TOGGLE_GROUPINGS_MODAL};
};

export const getGrouping = grouping => {
  return {type: GET_GROUPING, data: grouping};
};

export const fetchGrouping = groupingID => {
  return dispatch => {
    request(`/groupings/${groupingID}`, 'get').then(res => {
      dispatch(getGrouping(res.data));
    })
      .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const updateGrouping = (title, description) => {
  return {type: UPDATE_GROUPING, title, description};
};

export const putGrouping = (groupingID, title, description) => {
  return dispatch => {
    request(`/groupings/${groupingID}`, 'put', {
      data: {title, description}
    }).then(() => dispatch(updateGrouping(title, description)))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const toggleGroupingDeleteModal = () => {
  return {type: TOGGLE_GROUPING_DELETE_MODAL};
};
export const toggleGroupingEditModal = () => {
  return {type: TOGGLE_GROUPING_EDIT_MODAL};
};

export const updateGroupingTicketCheck = (ticketID, checked) => {
  return {type: UPDATE_GROUPING_TICKET_CHECK, ticketID, checked};
};

export const updateAllTicketChecks = checked => {
  return {type: UPDATE_ALL_TICKET_CHECKS, checked};
};

export const removeTicketsFromGroupingList = ticketIDs => {
  return {type: REMOVE_TICKETS_FROM_GROUPING_LIST, ticketIDs};
};

export const deleteTicketsFromGrouping = ticketIDs => {
  return dispatch => {
    axios
      .all(ticketIDs.map(id => request(`/tickets/${id}`, 'delete')))
      .then(() => dispatch(removeTicketsFromGroupingList(ticketIDs)))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const deleteTicketsAndGrouping = (ticketIDs, groupingID, redirectCallback) => {
  return dispatch => {
    axios
      .all(ticketIDs.map(id => request(`/tickets/${id}`, 'delete')))
      .then(request(`/groupings/${groupingID}`, 'delete'))
      .then(() => redirectCallback(`/groupings`))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const untagTicketsAndDeleteGrouping = (ticketIDs, groupingID, redirectCallback) => {
  return dispatch => {
    axios
      .all(ticketIDs.map(id => request(`/tickets/${id}/groupings/${groupingID}`, 'delete')))
      .then(request(`/groupings/${groupingID}`, 'delete'))
      .then(() => redirectCallback(`/groupings`))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const updateTicketStatusesForGrouping = (status, ticketIDs) => {
  return {type: UPDATE_TICKET_STATUSES_FOR_GROUPING, status, ticketIDs};
};

export const assignStatusToGroupingTickets = (status, tickets) => {
  return dispatch => {
    axios
      .all(tickets.map(ticket => request(`/tickets/${ticket.ticket_id}`, 'put', {data: {status}})))
      .then(() => dispatch(updateTicketStatusesForGrouping(status, tickets.map(t => t.ticket_id))))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

// Service provider actions

export const getServiceProviders = serviceProviders => {
  return {type: GET_SERVICE_PROVIDERS, data: serviceProviders};
};

export const getServiceProvider = serviceProvider => {
  return {type: GET_SERVICE_PROVIDER, data: serviceProvider};
};

export const fetchServiceProviders = () => {
  return dispatch => {
    request('/sp_profiles', 'get').then(res => {
      dispatch(getServiceProviders(res.data));
    })
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const fetchServiceProvider = id => {
  return dispatch => {
    request(`/sp_profiles/${id}`, 'get').then(res => {
      dispatch(getServiceProvider(res.data));
    })
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const updateServiceProviderFilters = (filterKey, filterList) => {
  return {type: UPDATE_SERVICE_PROVIDER_FILTERS, data: {filterKey, filterList}};
};

export const deleteServiceProviders = (ids, redirect) => {
  return dispatch => {
    axios
      .all(ids.map(id => request(`/sp_profiles/${id}`, 'delete')))
      .then(() => {
        dispatch(removeServiceProviders(ids));
        if (redirect) redirect();
      })
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const removeServiceProviders = ids => {
  return {type: REMOVE_SERVICE_PROVIDERS, data: ids};
};

export const putServiceProvider = (SPID, updatedServiceProvider) => {
  return dispatch => {
    request(`/sp_profiles/${SPID}`, 'put', { data: updatedServiceProvider })
      // The data that was PUT may be incomplete,
      // so dispatch a new fetch to get the complete, updated SP
      .then(() => dispatch(fetchServiceProvider(SPID)))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const deleteServiceProviderTickets = (newSP, ticketIDs) => {
  return dispatch => {
    axios
      .all(ticketIDs.map(ticketID => request(`/tickets/${ticketID}`, 'delete')))
      .then(() => dispatch(getServiceProvider(newSP)))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const assignStatusToSPTickets = (status, ticketIDs, sp) => {
  return dispatch => {
    axios
      .all(ticketIDs.map(ticketID => request(`/tickets/${ticketID}`, 'put', {data: {status}})))
      .then(() => {
        const updatedTickets = sp.tickets.map(t => ticketIDs.includes(t.id) ? Object.assign({}, t, { status: status }) : t);
        dispatch(getServiceProvider(Object.assign({}, sp, { tickets: updatedTickets })));
      })
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const createSpProfile = (data, isAdmin) => {
  const route = isAdmin ? '/sp_profiles' : '/profile';
  const onComplete = isAdmin ? () => true : updateProfileStatus(null, true, data);
  return dispatch => {
    return request(route, 'post', {data})
      .then(() => dispatch(onComplete))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

// Implementing partners actions
// Very similar to the SP actions

export const updateImplementingPartnerFilters = (filterKey, filterList) => {
  return {type: UPDATE_IMPLEMENTING_PARTNERS_FILTERS, data: {filterKey, filterList}};
};

export const deleteImplementingPartners = (ids, redirect) => {
  return dispatch => {
    axios
      .all(ids.map(id => request(`/ip_profiles/${id}`, 'delete')))
      .then(() => {
        dispatch(removeImplementingPartners(ids));
        if (redirect) redirect();
      })
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const removeImplementingPartners = ids => {
  return {type: REMOVE_IMPLEMENTING_PARTNERS, data: ids};
};

export const getImplementingPartners = implementingPartners => {
  return {type: GET_IMPLEMENTING_PARTNERS, data: implementingPartners};
};

export const fetchImplementingPartners = () => {
  return dispatch => {
    request('/ip_profiles', 'get').then(res => {
      dispatch(getImplementingPartners(res.data));
    })
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const deleteImplementingPartnerTickets = (newIP, ticketIDs) => {
  return dispatch => {
    axios
      .all(ticketIDs.map(ticketID => request(`/tickets/${ticketID}`, 'delete')))
      .then(() => dispatch(getImplementingPartner(newIP)))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const assignStatusToIPTickets = (status, ticketIDs, ip) => {
  return dispatch => {
    axios
      .all(ticketIDs.map(ticketID => request(`/tickets/${ticketID}`, 'put', {data: {status}})))
      .then(() => {
        const updatedTickets = ip.tickets.map(t => ticketIDs.includes(t.id) ? Object.assign({}, t, { status: status }) : t);
        dispatch(getImplementingPartner(Object.assign({}, ip, { tickets: updatedTickets })));
      })
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const createIpProfile = (data, isAdmin) => {
  const route = isAdmin ? '/ip_profiles' : '/profile';
  const onComplete = isAdmin ? () => true : updateProfileStatus(null, true, data);
  return dispatch => {
    return request(route, 'post', {data})
      .then(() => dispatch(onComplete))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const putIpProfile = (partnerID, data) => {
  return dispatch => {
    return request(`/ip_profiles/${partnerID}`, 'put', {data: data})
      .then(() => dispatch(fetchImplementingPartner(partnerID)))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const getImplementingPartner = partner => {
  return {type: GET_IMPLEMENTING_PARTNER, data: partner};
};

export const fetchImplementingPartner = id => {
  return dispatch => {
    request(`/ip_profiles/${id}`, 'get').then(res => {
      dispatch(getImplementingPartner(res.data))
      .catch(function (err) { dispatch(checkErrors(err)); });
    });
  };
};

// Threads and messages actions

export const getThread = thread => {
  return { type: GET_THREAD, data: thread };
};

export const fetchThread = threadID => {
  return dispatch => {
    request(`/threads/${threadID}`, 'get')
      .then(res => dispatch(getThread(res.data)))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const getThreads = threads => {
  return { type: GET_THREADS, data: threads };
};

export const fetchTicketThreads = ticketID => {
  return dispatch => {
    request(`/tickets/${ticketID}/threads`, 'get')
      .then(res => dispatch(getThreads(res.data)))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const fetchGroupingThreads = groupingID => {
  return dispatch => {
    request(`/groupings/${groupingID}/threads`, 'get')
      .then(res => dispatch(getThreads(res.data)))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const removeMessage = messageID => {
  return { type: REMOVE_MESSAGE, messageID };
};

export const deleteMessage = messageID => {
  return dispatch => {
    request(`/messages/${messageID}`, 'delete')
      .then(() => dispatch(removeMessage(messageID)))
    .catch(function (err) { dispatch(checkErrors(err)); });
  };
};

export const createMessage = (threadID, content) => {
  return dispatch => {
    request(`/threads/${threadID}/messages`, 'post', {data: {content}})
      // Currently, there's no response data, so we can't simply
      // add this message into the Redux store;
      // we need to re-fetch the data for that thread
      .then(() => dispatch(fetchThread(threadID)))
      .catch(function (err) { dispatch(checkErrors(err)); });
  };
};
