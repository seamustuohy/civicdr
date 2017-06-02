'use strict';
import React from 'react';

var GroupingCard = React.createClass({
  displayName: 'GroupingCard',

  propTypes: {
    grouping: React.PropTypes.object
  },

  render: function () {
    return (
      <article className='card group'>
        <a className='card__content' href={'/#/groupings/' + this.props.grouping.id}>
          <header className='card__header'>
            <h2> {this.props.grouping.title}</h2>
          </header>
          <div className='card__body'>
            <p className='card__description'>{this.props.grouping.description}</p>
            <p className='card__stats'>{this.props.grouping.ticket_count} related tickets</p>
          </div>
        </a>
      </article>
    );
  }
});

module.exports = GroupingCard;
