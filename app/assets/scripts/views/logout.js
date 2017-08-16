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
    router: T.object,
    secret: T.string
  },

  componentWillMount: function () {
    let {secret} = this.props;
    if (this.props.route.auth.checkSecret(secret)) {
      this.props.route.auth.logout();
      this.props.router.push('/');
    } else {
      this.props.router.push('/unauthorized');
    }
  },

  render: function () {
    return <div></div>;
  }
});

function selector (state) {
  return {
    secret: state.auth.secret
  };
}
module.exports = connect(selector)(Logout);
