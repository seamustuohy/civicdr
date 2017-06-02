/*
 * Login view handles showing the auth0 modal
 *
 * When a user logs in, the lock redirects to another
 * route and loads Auth0Callback
 *
 * The AuthService component handles communication with
 * auth0 and requests an access token and an id token that
 * can sign requests to the API
 *
 * reference: https://auth0.com/docs/api-auth/grant/implicit
 */

'use strict';
import React, {PropTypes as T} from 'react';
import {connect} from 'react-redux';
import {fetchProfile} from '../actions';
import _ from 'lodash';

// This view itself will prodominently use Auth-0's login modal
var Login = React.createClass({
  propTypes: {
    router: T.object,
    route: T.object,
    idToken: T.string,
    hasProfile: T.bool,
    roles: T.array,
    dispatch: T.func,
    askedForProfile: T.bool,
    profile: T.object
  },

  componentWillMount () {
    let {idToken, askedForProfile} = this.props;
    if (!idToken && !askedForProfile) {
      this.props.route.auth.showLock();
    }

    if (idToken && !askedForProfile) {
      // Now fetch the profile
      this.props.dispatch(fetchProfile());
    }
  },

  componentWillReceiveProps (nextProps) {
    let {idToken, askedForProfile, profile, roles} = nextProps;

    if (idToken) {
      if (askedForProfile) {
        let isAdmin = _.includes(roles, 'admin');
        let isIP = _.includes(roles, 'IP');
        let hasProfile = profile !== null;
        if (isAdmin || hasProfile) {
          return this.props.router.push('/');
        }
        if (!hasProfile) {
          let prefix = isIP ? '/partners' : '/service-providers';
          return this.props.router.push(`${prefix}/new`);
        }
      } else {
        this.props.dispatch(fetchProfile());
      }
    }
  },

  render: function () {
    return (
      <div></div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
    askedForProfile: state.auth.askedForProfile,
    idToken: state.auth.id_token,
    roles: state.auth.roles,
    profile: state.auth.profile
  };
}

module.exports = connect(selector)(Login);
