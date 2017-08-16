/*
 * View to render a single ticket
 */

'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import c from 'classnames';
import { Link } from 'react-router';
import _ from 'lodash';

import Threads from '../components/threads';

import {
  fetchTicketSingle,
  fetchGroupings,
  addGroupingToTicket,
  createGroupingAndAddToTicket,
  assignSPToTicket,
  fetchImplementingPartners,
  putTicket,
  removeGroupingFromTicket,
  removeSPFromTicket,
  fetchTicketThreads,
  deleteMessage,
  createMessage,
  deleteTickets,
  duplicateTicket
} from '../actions';

import { ticketStatusLUT } from '../constants';
import { formatDate, formatTicketTitle } from '../utils/format';
import CreateEditGrouping from '../components/create-edit-grouping';
import SelectServiceProvider from '../components/select-service-provider';
import TicketEdit from '../components/ticket-edit';
import DeleteModal from '../components/delete-modal';
import TicketDuplicationModal from '../components/ticket-duplication-modal';

// View for a single ticket
// Includes ticket metadata and messages
// For the administrator, it also includes:
// - an SP-assigning modal
// - a grouping-assign dropdown pane
// - notes-to-self
// - ticket duplication
var TicketSingle = React.createClass({
  displayName: 'TicketSingle',

  propTypes: {
    params: T.object,
    routeParams: T.object,
    ticket: T.object,
    dispatch: T.func,
    roles: T.array,
    groupings: T.array,
    serviceProviders: T.array,
    implementingPartners: T.array,
    threads: T.array,
    router: T.object
  },

  getInitialState: function () {
    return {
      isAddGroupingDropdownVisible: false,
      isCreateGroupingModalVisible: false,
      isServiceProviderModalVisible: false,
      isEditTicketModalVisible: false,
      isDeleteModalVisible: false,
      isDuplicationModalVisible: false
    };
  },

  componentWillMount: function () {
    const isAdmin = _.includes(this.props.roles, 'admin');

    this.props.dispatch(fetchTicketSingle(this.props.routeParams.ticketId));
    this.props.dispatch(fetchTicketThreads(this.props.routeParams.ticketId));
    if (isAdmin) {
      this.props.dispatch(fetchGroupings());
      this.props.dispatch(fetchImplementingPartners());
    }
  },

  onAddGrouping: function (groupingID) {
    this.props.dispatch(addGroupingToTicket(this.props.ticket.id, groupingID));
  },

  render: function () {
    const ticket = this.props.ticket;
    const serviceProvider = this.props.serviceProviders
      .find(sp => sp.id === ticket.sp_assigned_id);
    let roles = this.props.roles;
    let isAdmin = _.includes(roles, 'admin');
    if (Object.keys(ticket).length === 0) {
      return <div></div>;
    }
    let statusKeys = Object.keys(ticketStatusLUT);
    return (
      <div>
        <div className='inner'>

          <div style={{display: this.state.isEditTicketModalVisible ? 'block' : 'none'}}>
            <TicketEdit
              onClose={() => this.setState({isEditTicketModalVisible: false})}
              onSubmit={(updatedTicket) => {
                this.props.dispatch(putTicket(ticket.id, updatedTicket));
                this.setState({isEditTicketModalVisible: false});
              }}
              roles={roles}
              existingTicket={ticket}
              implementingPartners={this.props.implementingPartners}
            />
          </div>

          { isAdmin
            ? <div>
              <div style={{display: this.state.isServiceProviderModalVisible ? 'block' : 'none'}}>
                <SelectServiceProvider
                  onClose={() => this.setState({isServiceProviderModalVisible: false})}
                  onSubmit={(spID) => {
                    this.setState({isServiceProviderModalVisible: false});
                    this.props.dispatch(assignSPToTicket(ticket.id, spID));
                  }}
                />
              </div>

              <div style={{display: this.state.isCreateGroupingModalVisible ? 'block' : 'none'}}>
                <CreateEditGrouping
                  onClose={() => { this.setState({isCreateGroupingModalVisible: false}); }}
                  onSubmit={(title, description) => {
                    this.props.dispatch(createGroupingAndAddToTicket(title, description, this.props.ticket.id));
                    this.setState({isCreateGroupingModalVisible: false});
                  }}
                  />
              </div>

              <div style={{display: this.state.isDeleteModalVisible ? 'block' : 'none'}}>
                <DeleteModal
                  onClose={() => { this.setState({isDeleteModalVisible: false}); }}
                  onSubmit={(title, description) => {
                    this.props.dispatch(deleteTickets([this.props.ticket.id], () => this.props.router.push('/')));
                    this.setState({isDeleteModalVisible: false});
                  }}
                  />
              </div>

              <div style={{display: this.state.isDuplicationModalVisible ? 'block' : 'none'}}>
                <TicketDuplicationModal
                  onClose={() => { this.setState({isDuplicationModalVisible: false}); }}
                  onSubmit={ipID => {
                    this.props.dispatch(duplicateTicket(ticket.id, ipID, this.props.router.push));
                    this.setState({isDuplicationModalVisible: false});
                  }}
                  implementingPartners={this.props.implementingPartners}
                  />
              </div>
            </div>
            : ''
          }
          <header className='ticket__header'>
          <div className='ticket__header--content'>
            <h1 className='ticket__title'>{`Ticket ${formatTicketTitle(ticket.id)}`}</h1>
            <p className='ticket__description'>{`created on ${formatDate(ticket.created_at)} by ${ticket.created_by}`}</p>
          </div>
          <ul className='ticket__header--actions'>
            { isAdmin ? <li className='ticket__actions-item'><button className='button button--primary' onClick={() => this.setState({isDeleteModalVisible: true})}>Delete</button></li> : '' }
            { isAdmin ? <li className='ticket__actions-item'><button className='button button--secondary-bounded' onClick={() => this.setState({isDuplicationModalVisible: true})}>Duplicate Ticket</button></li> : '' }
            <li className='ticket__actions-item'><button className='button button--base' onClick={() => this.setState({isEditTicketModalVisible: true})}>Edit</button></li>
          </ul>
          </header>
          <section className='ticket__body'>
          <div className='ticket__status'>
            <h2 className='inpage__label'>{`Status: ${ticketStatusLUT[ticket.status]}`}</h2>
            <ul className='ticket__status-group'>
              {statusKeys.map((status, i) => {
                return <li className={c('ticket__status-bar', status, {'ticket__status-bar-empty': i > statusKeys.indexOf(ticket.status)})} key={`status-${status}`}></li>;
              })}
            </ul>
          </div>
          <div className='fields__group'>
            <div className='profile-fields'>
              <h2 className='field__title'>IP Contact Name</h2>
            { isAdmin
              ? <p className='field__description'><Link className='link--deco' to={`/partners/${ticket.ip_assigned_id}`}>{ticket.ticket_ip_name}</Link></p>
              : <p className='field__description'>{ticket.ticket_ip_name}</p>
            }</div>
            <div className='profile-fields'>
              <h2 className='field__title'>IP Contact Address</h2>
              <p className='field__description'>{ticket.ticket_ip_contact}</p>
            </div>
            <div className='profile-fields'>
              <h2 className='field__title'>SP Contact Name</h2>
            { isAdmin
              ? <p className='field__description'><Link className='link--deco' to={`/service-providers/${ticket.sp_assigned_id}`}>{ticket.ticket_sp_name}</Link></p>
              : <p className='field__description'>{ticket.ticket_ip_name}</p>
            }</div>
            <div className='profile-fields'>
              <h2 className='field__title'>SP Contact Address</h2>
              <p className='field__description'>{ticket.ticket_sp_contact}</p>
            </div>
            <div className='profile-fields'>
              <h2 className='field__title'>Date of Incident</h2>
              <p className='field__description'>{ticket.date_of_incident ? ticket.date_of_incident.substring(0, 10) : ''}</p>
            </div>
            <div className='profile-fields'>
              <h2 className='field__title'>Incident Type</h2>
              <p className='field__description'>{ticket.incident_type.join(', ')}</p>
            </div>
            <div className='profile-fields'>
              <h2 className='field__title'>Description of Issue</h2>
              <p className='field__description'>{ticket.description}</p>
            </div>
            <div className='profile-fields'>
              <h2 className='field__title'>Steps Taken To Mitigate</h2>
              <p className='field__description'>{ticket.steps_taken}</p>
            </div>
          </div>

          <Threads
            threads={this.props.threads}
            ipName={ticket.ticket_ip_name}
            spName={serviceProvider ? serviceProvider.name : ''}
            roles={roles}
            delete={messageID => this.props.dispatch(deleteMessage(messageID))}
            create={(threadID, content) => {
              if (content !== '') {
                this.props.dispatch(createMessage(threadID, content));
              }
            }
                   }
          />
          </section>
         { isAdmin ? <aside className='ticket__sidebar'>
            <div className='sidebar__action'>
              <h2 className='sidebar__action--title heading--xsmall'>Service Provider</h2>
              <div className='assigned-sps'>
                { serviceProvider
                  ? (
                    <div>
                      <Link to={`/service-providers/${serviceProvider.id}`} className='link--deco'>{serviceProvider.name}</Link>
                      <button className='button--remove' onClick={() => this.props.dispatch(removeSPFromTicket(ticket.id, serviceProvider.id))}></button>
                    </div>
                  )
                  : ''
                }
              </div>
              <button onClick={() => this.setState({isServiceProviderModalVisible: true})} className='button button--medium button--unbounded button--plus'>
                { serviceProvider ? 'Change Provider' : 'Assign a Provider' }
              </button>
              <h2 className='sidebar__action--title heading--xsmall'>Groupings</h2>
              <div className='current__groupings'>
                {ticket.groupings.map((key) => {
                  return (
                    <div key={key.grouping_id} className='current__groupings--item'>
                      <Link key={key.grouping_id} to={`/groupings/${key.id || key.grouping_id}`} className='button button--grouping-tag button--small'><span>{key.title}</span></Link>
                      <button className='button--remove' onClick={() => this.props.dispatch(removeGroupingFromTicket(ticket.id, key.grouping_id))}></button>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => this.setState({isAddGroupingDropdownVisible: !this.state.isAddGroupingDropdownVisible})} className='button button--medium button--unbounded button--plus'>Add a Grouping</button>
              <div style={{display: this.state.isAddGroupingDropdownVisible ? 'block' : 'none'}}>
                <div className='dropdown__container drop__content drop__content--react add-grouping'>
                  <ul className='drop__menu'>
                    {this.props.groupings
                      .filter(g => ticket.groupings.every(tg => tg.grouping_id !== g.id))
                      .map(g =>
                        <li key={g.id} className='drop__menu-item' onClick={() => { this.onAddGrouping(g.id); this.setState({isAddGroupingDropdownVisible: false}); }}>
                          {g.title}
                        </li>
                      )}
                    <li className='drop__menu-item' onClick={() => this.setState({
                      isAddGroupingDropdownVisible: false,
                      isCreateGroupingModalVisible: true
                    })}>Create New Grouping</li>
                  </ul>
                  </div>
                </div>
              </div>
            </aside> : ''}
        </div>
      </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const mapStateToProps = (state, ownProps) => {
  const { groupings, ticketSingle, serviceProviders, implementingPartners, threads } = state;
  return Object.assign({}, ticketSingle, {
    roles: state.auth.roles,
    serviceProviders: serviceProviders.list,
    groupings: groupings.groupings,
    implementingPartners: implementingPartners.list,
    threads: threads.threads
  });
};

export default connect(mapStateToProps)(TicketSingle);
