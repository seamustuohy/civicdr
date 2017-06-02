/*
 * Logout component calls the AuthService
 * logout method and routes to the root
 */

'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';

// Stub view for handling logouts
// Immediately redirects to the homepage, which'll redirect to login
var Logout = React.createClass({
  propTypes: {
    route: T.object,
    router: T.object
  },

  componentWillMount: function () {
    this.props.route.auth.logout();
    this.props.router.push('/');
  },

  render: function () {
    return <div></div>;
  }
});

module.exports = connect()(Logout);
