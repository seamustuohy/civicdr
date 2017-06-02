'use strict';
import React from 'react';

var DeleteGrouping = React.createClass({
  displayName: 'DeleteGrouping',

  propTypes: {
    grouping: React.PropTypes.object,
    onClose: React.PropTypes.func,
    onDeleteTicketsAndGrouping: React.PropTypes.func,
    onUntagTicketsAndDeleteGrouping: React.PropTypes.func
  },

  handleDeleteTicketsAndGrouping (e) {
    e.preventDefault();
    const ticketIDs = this.props.grouping.tickets.map(t => t.ticket_id);
    const groupingID = this.props.grouping.id;
    this.props.onDeleteTicketsAndGrouping(ticketIDs, groupingID);
  },

  handleUntagTicketsAndDeleteGrouping (e) {
    e.preventDefault();
    const ticketIDs = this.props.grouping.tickets.map(t => t.ticket_id);
    const groupingID = this.props.grouping.id;
    this.props.onUntagTicketsAndDeleteGrouping(ticketIDs, groupingID);
  },

  render: function () {
    const { grouping } = this.props;
    return (
        <section className='modal modal--large delete-modal'>
          <div className='modal__inner'>
            <div className='warning__group'>
              <h2 className='inpage__title heading--small'>Delete {grouping.title} and all associated tickets?</h2>
              <button className='button button--large button--base' onClick={this.handleDeleteTicketsAndGrouping}>Delete grouping and tickets</button>
            </div>
            <div className='warning__group'>
              <h2 className='inpage__title heading--small'>Delete {grouping.title} and keep tickets? </h2>
              <p className='inpage__description'>The associated tickets will be untagged but not deleted.</p>
              <button className='button button--large button--base' onClick={this.handleUntagTicketsAndDeleteGrouping}>Delete Grouping</button>
            </div>
            <button className='modal__button-dismiss' title='close' onClick={this.props.onClose}></button>
          </div>
        </section>
    );
  }
});

module.exports = DeleteGrouping;
