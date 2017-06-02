/*
 * View for all groupings
 */
'use strict';
import React from 'react';
import { connect } from 'react-redux';

import GroupingsList from '../components/groupings-list';
import CreateEditGrouping from '../components/create-edit-grouping';

import { createGrouping, fetchGroupings, toggleGroupingsModal } from '../actions';

// View with a table of all groupings
var Groupings = React.createClass({
  displayName: 'Groupings',

  propTypes: {
    groupings: React.PropTypes.array,
    dispatch: React.PropTypes.func,
    isModalVisible: React.PropTypes.bool,
    router: React.PropTypes.object
  },

  componentWillMount: function () {
    this.props.dispatch(fetchGroupings());
  },

  render: function () {
    return (
      <section className='section section--groupings'>
        <GroupingsList
          groupings={this.props.groupings}
          onCreateGrouping={() => { this.props.dispatch(toggleGroupingsModal()); }}
        />
        <div style={{display: this.props.isModalVisible ? 'block' : 'none'}}>
          <CreateEditGrouping
            onClose={() => { this.props.dispatch(toggleGroupingsModal()); }}
            onSubmit={(title, description) => {
              createGrouping(title, description, this.props.router.push);
              this.props.dispatch(toggleGroupingsModal());
            }}
          />
        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const mapStateToProps = state => {
  const { groupings } = state;
  return groupings;
};

export default connect(mapStateToProps)(Groupings);
