/*
 * 404 page
 */

'use strict';
import React, {PropTypes as T} from 'react';
import {Link} from 'react-router';

// View for 404 errors
var UhOh = React.createClass({
  displayName: 'UhOh',

  propTypes: {
    route: T.object
  },

  render: function () {
    console.log(this.props.route);
    let status_message;
    if (this.props.route.status === 401) {
      status_message = "You can't go there!"
    } else if (this.props.route.status === 440) {
      status_message = "Your session has expired."
    } else {
      status_message = "Looks like you're lost."
    }
    return (
      <section className="section section--404">
        <div className="inner">
          <header className="section__header">
            <h1 className="section__title">{this.props.route.status}</h1>
          </header>
          <div className="section__body">
            <p>
              {status_message}
            </p>
            <Link to="/">
              <button className="button button--base button--large">
                Go Back Home
              </button>
            </Link>
          </div>
        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

export default UhOh;
