/*
 * Auth callback
 * 1. Determine if the user has a profile
 * 2a If the user has a profile or is an admin redirect to dashboard
 * 2b If the user does not have a profile redirect to the correct
 * form creation route for that user role (IP or SP)
 */

'use strict';
import React, {PropTypes as T} from 'react';
import {connect} from 'react-redux';
import {fetchProfile} from '../actions';
import _ from 'lodash';

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

    if (idToken && !askedForProfile) {
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
