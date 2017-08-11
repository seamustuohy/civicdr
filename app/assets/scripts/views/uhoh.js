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
    let statusMessage;
    if (this.props.route.status === 401) {
      statusMessage = 'You can\'t go there!';
    } else if (this.props.route.status === 440) {
      statusMessage = 'Your session has expired.';
    } else {
      statusMessage = 'Looks like you\'re lost.';
    }
    return (
      <section className="section section--404">
        <div className="inner">
          <header className="section__header">
            <h1 className="section__title">{this.props.route.status}</h1>
          </header>
          <div className="section__body">
            <p>
              {statusMessage}
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
