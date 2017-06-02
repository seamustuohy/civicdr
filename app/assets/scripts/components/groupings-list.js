'use strict';
import React from 'react';

import GroupingCard from '../components/grouping-card';

var GroupingsList = React.createClass({
  displayName: 'GroupingsList',

  propTypes: {
    groupings: React.PropTypes.array,
    onCreateGrouping: React.PropTypes.func
  },

  render: function () {
    return (
    <div className='groupings'>
      <header className='inpage__header'>
        <div className='inner'>
          <div className='inpage__headline'>
            <h1 className=''>Groupings</h1>
          </div>
          <div className='header__actions'>
            <button className='button button--secondary-bounded' onClick={this.props.onCreateGrouping}>Create Grouping</button>
          </div>
        </div>
      </header>
      <section className='inpage__body'>
        <div className='inner'>
          <div className='inpage__content'>
            <div className='content__actions'>
              <div className='actions__display'>
              <h2 className='heading--xsmall'>{this.props.groupings.length} Groupings Available</h2>
              </div>
            </div>
              <div className='content__results'>
                {this.props.groupings.map(grouping => (
                  <GroupingCard grouping={grouping} key={grouping.id} />
                ))}
              </div>
          </div>
        </div>
      </section>
    </div>
    );
  }
});

module.exports = GroupingsList;
