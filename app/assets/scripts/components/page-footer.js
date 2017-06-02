'use strict';
import React, { PropTypes as T } from 'react';
import c from 'classnames';

var PageFooter = React.createClass({
  displayName: 'PageFooter',

  propTypes: {
    className: T.string
  },

  render: function () {
    return (
      <footer className={c('page__footer', this.props.className)} role='contentinfo'>
        <div className='inner'>
        </div>
      </footer>
    );
  }
});

module.exports = PageFooter;
