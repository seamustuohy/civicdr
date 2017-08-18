/*
 * App wraps header body and footer
 */

'use strict';

import React, {PropTypes as T} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import c from 'classnames';

import PageHeader from '../components/page-header';
import PageFooter from '../components/page-footer';
import { fetchProfile, removeErrors } from '../actions';
import ErrorModal from '../components/error-modal';

// Top-level application component
// Just contains header, footer, and container for actual views
var App = React.createClass({
  displayName: 'App',

  propTypes: {
    routes: T.array,
    children: T.object,
    dispatch: T.func,
    profile: T.object,
    route: T.object,
    roles: T.array,
    secret: T.string,
    router: T.object,
    error: T.object
  },

  componentDidMount: function () {
    if (
      this.props.roles &&
      (this.props.roles.includes('IP') || this.props.roles.includes('SP'))
    ) { this.props.dispatch(fetchProfile()); }
  },

  render: function () {
    const pageClass = _.get(_.last(this.props.routes), 'pageClass', '');
    const hidden = !this.props.route.auth.loggedIn();
    return (
      <div className={c('page', pageClass)}>
        <PageHeader
          className={c({hidden})}
          roles={this.props.roles}
          profile={this.props.profile}
        />
        <main className="page__body" role="main">
        <div style={{display: this.props.error.isErrorModalVisible ? 'block' : 'none'}}>
          <ErrorModal
            onLogout={() => {
              this.props.dispatch(removeErrors());
              this.props.router.push('/logout');
            }}
            onClose={() => {
              this.props.dispatch(removeErrors());
            }}
            error={this.props.error.errorMsg}
        />
        </div>
          {this.props.children}
        </main>
        <PageFooter className={c({hidden})} />
      </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const mapStateToProps = state => {
  return {
    dispatch: state.dispatch,
    roles: state.auth.roles,
    profile: state.auth.profile,
    secret: state.auth.secret,
    error: state.errors
  };
};

module.exports = connect(mapStateToProps)(App);
