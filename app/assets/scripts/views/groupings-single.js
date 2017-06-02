/*
 * View for single grouping
 */

'use strict';

import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import downloadObject from '../utils/download-object';

import Threads from '../components/threads';
import ListActions from '../components/list-actions';
import TicketList from '../components/ticket-list';
import DeleteGrouping from '../components/delete-grouping';
import CreateEditGrouping from '../components/create-edit-grouping';

import {
  fetchGrouping,
  putGrouping,
  deleteTicketsFromGrouping,
  updateGroupingTicketCheck,
  updateAllTicketChecks,
  toggleGroupingDeleteModal,
  toggleGroupingEditModal,
  deleteTicketsAndGrouping,
  untagTicketsAndDeleteGrouping,
  assignStatusToGroupingTickets,
  fetchGroupingThreads,
  deleteMessage,
  createMessage
} from '../actions';
import { formatDate } from '../utils/format';

// View for a single grouping
// Contains grouping's metadata, admin notes-to-self, and a list of associated tickets
// Compared to other views, this one stores more UI state inside Redux
var GroupingSingle = React.createClass({
  displayName: 'GroupingSingle',

  propTypes: {
    dispatch: React.PropTypes.func,
    routeParams: React.PropTypes.object,
    grouping: React.PropTypes.object,
    allTicketCheckboxIsChecked: React.PropTypes.bool,
    isDeleteModalVisible: React.PropTypes.bool,
    isEditModalVisible: React.PropTypes.bool,
    editModalTitle: React.PropTypes.string,
    editModalDescription: React.PropTypes.string,
    router: React.PropTypes.object,
    roles: React.PropTypes.array,
    threads: React.PropTypes.array
  },

  componentDidMount: function () {
    this.props.dispatch(fetchGrouping(this.props.routeParams.groupingID));
    this.props.dispatch(fetchGroupingThreads(this.props.routeParams.groupingID));
  },

  componentWillUnmount: function () {
    // Make sure to clear the `checked` property before closing out
    this.props.dispatch(updateAllTicketChecks(false));
  },

  render: function () {
    return (
      <section className='section grouping-single'>
        <div className='inner inner-shadow'>
          <header className='ticket__header'>
            <div className='grouping__header--content'>
             <div className='headline__group'>
                <h1 className='ticket__title'>{this.props.grouping.title}</h1>
                <p className='ticket__description'>created on {formatDate(this.props.grouping.created_at)}</p>
              </div>
              <div className='inpage__stats'>
                <ul className='inpage__stats-list'>
                  <li className='inpage__stats-item'>Related Tickets <small className='totals'>{this.props.grouping.tickets.length}</small></li>
                </ul>
              </div>
            </div>
            <ul className='ticket__header--actions'>
              <li className='ticket__actions-item'><button className='button button--primary' onClick={() => { this.props.dispatch(toggleGroupingDeleteModal()); }}>Delete</button></li>
              <li className='ticket__actions-item'><button className='button button--base' onClick={() => { this.props.dispatch(toggleGroupingEditModal()); }}>Edit</button></li>
            </ul>
          </header>
          <section className='inpage__content'>
            <p className='ticket__description'>{this.props.grouping.description}</p>
            <Threads
              threads={this.props.threads}
              roles={this.props.roles}
              delete={messageID => this.props.dispatch(deleteMessage(messageID))}
              create={(threadID, content) => this.props.dispatch(createMessage(threadID, content))}
              />
          </section>
        </div>
        <section className='dashboard'>
          <div className='inpage__body'>
            <div className='inpage__content'>
              <div className='inner'>
                <ListActions
                  elements={this.props.grouping.tickets}
                  elementName='Tickets'
                  isChecked={this.props.allTicketCheckboxIsChecked}
                  onCheck={() => this.props.dispatch(updateAllTicketChecks(!this.props.allTicketCheckboxIsChecked))}
                  onMarkStatus={(status, tickets) => this.props.dispatch(assignStatusToGroupingTickets(status, tickets))}
                  onDownload={() => downloadObject(this.props.grouping.tickets.filter(t => t.checked).map(t => _.omit(t, 'checked')), `Tickets from Grouping ${this.props.grouping.title}`)}
                  onDelete={() => this.props.dispatch(deleteTicketsFromGrouping(this.props.grouping.tickets.filter(t => t.checked).map(t => t.id || t.ticket_id)))}
                  roles={this.props.roles}
                />
                <TicketList
                  tickets={this.props.grouping.tickets}
                  onCheck={(id, checked) => this.props.dispatch(updateGroupingTicketCheck(id, checked))}
                />
              </div>
            </div>
          </div>
        </section>
        <div style={{display: this.props.isDeleteModalVisible ? 'block' : 'none'}}>
          <DeleteGrouping
            onClose={() => { this.props.dispatch(toggleGroupingDeleteModal()); }}
            onDeleteTicketsAndGrouping={(ticketIDs, groupingID) => {
              this.props.dispatch(deleteTicketsAndGrouping(ticketIDs, groupingID, this.props.router.push));
              this.props.dispatch(toggleGroupingDeleteModal());
            }}
            onUntagTicketsAndDeleteGrouping={(ticketIDs, groupingID) => {
              this.props.dispatch(untagTicketsAndDeleteGrouping(ticketIDs, groupingID, this.props.router.push));
              this.props.dispatch(toggleGroupingDeleteModal());
            }}
            grouping={this.props.grouping}
          />
        </div>
        <div style={{display: this.props.isEditModalVisible ? 'block' : 'none'}}>
          <CreateEditGrouping
            onClose={() => { this.props.dispatch(toggleGroupingEditModal()); }}
            onSubmit={(title, description) => {
              this.props.dispatch(putGrouping(this.props.grouping.id, title, description));
              this.props.dispatch(toggleGroupingEditModal());
            }}
            existingGrouping={this.props.grouping}
          />
        </div>
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const mapStateToProps = state => {
  const { grouping, auth, threads } = state;
  return Object.assign(grouping, {roles: auth.roles, threads: threads.threads});
};

module.exports = connect(mapStateToProps)(GroupingSingle);
