/*
 * Main entrypoint
 * Middleware and Routing
 */

// Imports
'use strict';
import React from 'react';
import _ from 'lodash';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {
  Router,
  Route,
  IndexRoute,
  hashHistory,
  applyRouterMiddleware
} from 'react-router';
import {useScroll} from 'react-router-scroll';
import {syncHistoryWithStore} from 'react-router-redux';

import store from './utils/store';

// Views
import App from './views/app';
import UhOh from './views/uhoh';
import Tickets from './views/tickets';
import Login from './views/login';
import Logout from './views/logout';
import TicketSingle from './views/tickets-single';
import TicketsForm from './views/tickets-form';
import Groupings from './views/groupings';
import GroupingSingle from './views/groupings-single';
import ServiceProviders from './views/service-providers';
import ServiceProviderSingle from './views/service-providers-single';
import ProviderForm from './views/provider-form';
import PartnerForm from './views/partner-form';
import Partners from './views/partners';
import PartnerSingle from './views/partner-single';
import AuthCallback from './views/auth-callback';

// Utilities
import AuthService from './utils/auth-service';
import config from './config';
import {updateTokenStatus} from './actions';
const auth = new AuthService(config.clientId, config.domain, store);

const history = syncHistoryWithStore(hashHistory, store);

const scrollerMiddleware = useScroll((prevRouterProps, currRouterProps) => {
  return prevRouterProps &&
    decodeURIComponent(currRouterProps.location.pathname) !==
      decodeURIComponent(prevRouterProps.location.pathname);
});

if (auth.loggedIn()) {
  store.dispatch(updateTokenStatus(null, auth.getToken()));
}

const parseAuthHash = (nextState, replace) => {
  auth.parseHash(nextState.location.pathname.slice(1));
};

/*
 * Middleware function to check authorization against
 * user roles
 * Block the user from accessing a view if they aren't qualified
 * Relies on the `roles` array of the user, found in the Redux store
 */

function checkAuth (route) {
  var permissions = {
    'read:tickets': {needsProfile: true},
    'read:groupings': {roles: ['admin']},
    'read:partners': {roles: ['admin']},
    'read:sps': {roles: ['admin']},
    'create:sp': {roles: ['admin', 'SP']},
    'read:sp': {
      needsProfile: true,
      roles: ['admin', 'SP']
    },
    'edit:sp': {
      needsProfile: true,
      roles: ['admin', 'SP']
    },
    'create:ip': {roles: ['admin', 'IP']},
    'read:ip': {needsProfile: true, roles: ['admin', 'IP']},
    'edit:ip': {needsProfile: true, roles: ['admin', 'IP']},
    'read:grouping': {roles: ['admin']},
    'create:ticket': {needsProfile: true, roles: ['admin', 'IP']},
    'read:ticket': {needsProfile: true, roles: ['admin', 'IP', 'SP']},
    'edit:ticket': {needsProfile: true, roles: ['admin', 'IP']}
  };

  return function (nextState, replace) {
    const opts = permissions[route];
    let roles = opts.roles || [];
    let needsProfile = opts.needsProfile;

    let {roles: userRoles, profile} = store.getState().auth;
    let isAdmin = _.includes(userRoles, 'admin');

    let loggedOut = !auth.loggedIn();
    let noProfile = !isAdmin && profile === null;

    if (loggedOut || (needsProfile && noProfile)) {
      replace({pathname: '/login'});
    }

    if (roles.length > 0) {
      let canAccess = false;
      roles.forEach(role => {
        canAccess = _.includes(userRoles, role) || canAccess;
      });

      if (!canAccess) {
        replace({pathname: '/unauthorized'});
      }
    }
  };
}

// Read the URL component after the `#`, and render a view based on that string
// For example, running locally,
// `http://localhost:3000/#/service-providers` will access `/service-providers`
render(
  <Provider store={store}>
    <Router
      history={history}
      render={applyRouterMiddleware(scrollerMiddleware)}
    >
      <Route path="/" component={App} auth={auth}>
        <IndexRoute component={Tickets} onEnter={checkAuth('read:tickets')} />
        <Route
          path="/groupings"
          component={Groupings}
          onEnter={checkAuth('read:groupings')}
        />
        <Route
          path="/service-providers"
          component={ServiceProviders}
          onEnter={checkAuth('read:sps')}
        />
        <Route
          path="/service-providers/new"
          component={ProviderForm}
          onEnter={checkAuth('create:sp')}
          actionType={'create'}
        />
        <Route
          path="/service-providers/:providerID"
          component={ServiceProviderSingle}
          onEnter={checkAuth('read:sp')}
        />
        <Route
          path="/service-providers/:providerID/edit"
          component={ProviderForm}
          onEnter={checkAuth('edit:sp')}
          actionType={'edit'}
        />
        <Route
          path="/partners"
          component={Partners}
          onEnter={checkAuth('read:partners')}
        />
        <Route
          path="/partners/new"
          component={PartnerForm}
          onEnter={checkAuth('create:ip')}
          actionType={'create'}
        />
        <Route
          path="/partners/:partnerID"
          component={PartnerSingle}
          onEnter={checkAuth('read:ip')}
        />
        <Route
          path="/partners/:partnerID/edit"
          component={PartnerForm}
          onEnter={checkAuth('edit:ip')}
          actionType={'edit'}
        />
        <Route
          path="/groupings/:groupingID"
          component={GroupingSingle}
          onEnter={checkAuth('read:grouping')}
        />
        <Route
          path="/tickets/new"
          component={TicketsForm}
          onEnter={checkAuth('create:ticket')}
        />
        <Route
          path="/tickets/:ticketId"
          component={TicketSingle}
          onEnter={checkAuth('read:ticket')}
        />
        <Route
          path="/tickets/:ticketId/edit"
          component={TicketsForm}
          onEnter={checkAuth('edit:ticket')}
        />
        <Route
          path="/access_token=:access_token"
          component={AuthCallback}
          pageClass="page--homepage"
          onEnter={parseAuthHash}
          auth={auth}
        />
        <Route
          path="/login"
          component={Login}
          pageClass="page--homepage"
          auth={auth}
        />
        <Route
          path="/logout"
          component={Logout}
          pageClass="page--homepage"
          auth={auth}
        />
        <Route path="/unauthorized" component={UhOh} status={401} />
        <Route path="*" component={UhOh} status={404} />
      </Route>
    </Router>
  </Provider>,
  document.querySelector('#app-container')
);
