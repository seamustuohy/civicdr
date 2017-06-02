/*
 * View to render a single IP
 */

'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import downloadObject from '../utils/download-object';

import config from '../config';
import { formatDate } from '../utils/format';
import ListActions from '../components/list-actions';
import TicketList from '../components/ticket-list';
import ImplementingPartnerEdit from '../components/partner-edit';
import DeleteModal from '../components/delete-modal';

import {
  fetchImplementingPartner,
  getImplementingPartner,
  putIpProfile,
  deleteImplementingPartners,
  deleteImplementingPartnerTickets,
  assignStatusToIPTickets
} from '../actions';

// View for a single Implementing Partner
// Contains IP metadata, as well as all assigned tickets
var ImplemetingPartnerSingle = React.createClass({
  propTypes: {
    roles: T.array,
    partner: T.object,
    dispatch: T.func,
    params: T.object,
    router: T.object
  },

  getInitialState: function () {
    return {
      isEditModalVisible: false,
      isDeleteModalVisible: false
    };
  },

  componentDidMount: function () {
    const { dispatch, params } = this.props;
    dispatch(fetchImplementingPartner(params.partnerID));
  },

  render: function () {
    const { roles, partner } = this.props;
    let isAdmin = _.includes(roles, 'admin');
    if (!partner) {
      return <div className='empty-component'></div>;
    }
    partner.tickets = partner.tickets || [];
    const checked = partner.tickets.filter(t => t.checked);
    return (
      <section className='section partner-single'>

        <div style={{display: this.state.isEditModalVisible ? 'block' : 'none'}}>
          <ImplementingPartnerEdit
            onClose={() => this.setState({isEditModalVisible: false})}
            onSubmit={updatedImplementingPartner => {
              this.props.dispatch(putIpProfile(partner.id, updatedImplementingPartner));
              this.setState({isEditModalVisible: false});
            }}
            roles={roles}
            existingImplementingPartner={partner}
          />
        </div>

        <div style={{display: this.state.isDeleteModalVisible ? 'block' : 'none'}}>
          <DeleteModal
            onClose={() => { this.setState({isDeleteModalVisible: false}); }}
            onSubmit={() => {
              this.props.dispatch(deleteImplementingPartners([partner.id], () => this.props.router.push('/partners')));
              this.setState({isDeleteModalVisible: false});
            }}
            warningText={'This action will delete the implementing partner profile and all associated tickets.'}
            />
        </div>

        <div className='inner inner-shadow'>
          <header className='ticket__header'>
            <div className='grouping__header--content'>
             <div className='headline__group'>
                <h1 className='ticket__title'>{partner.name}</h1>
                <p className='ticket__description'>Joined on {formatDate(partner.created_at)}</p>
              </div>
              {isAdmin
                ? <div className='inpage__stats'>
                  <ul className='inpage__stats-list'>
                    <li className='inpage__stats-item'>Assigned Tickets <small className='totals'>{partner.tickets ? partner.tickets.length : ''}</small></li>
                  </ul>
                </div>
                : ''
              }
            </div>
            <ul className='ticket__header--actions'>
              {isAdmin
                ? <li className='ticket__actions-item'>
                  <button onClick={() => this.setState({isDeleteModalVisible: true})} className='button button--primary'>
                    Delete
                  </button>
                </li>
                : ''
              }
              <li className='ticket__actions-item'><button className='button button--base' onClick={() => this.setState({isEditModalVisible: true})}>Edit</button></li>
            </ul>
          </header>
          <section className='inpage__main'>
            <div className='inpage__content'>
              <div className='fields__group'>
                <div className='profile-fields'>
                  <h2 className='field__title'>Location</h2>
                  <p className='field__description'>{partner.location}</p>
                </div>
                <div className='profile-fields'>
                  <h2 className='field__title'>Contact</h2>
                  <p className='field__description'>{partner.contact}</p>
                </div>
                <div className='profile-fields'>
                  <h2 className='field__title'>Recieve Email Alerts from Platform?</h2>
                  <p className='field__description'>{partner.email_notification ? 'Yes' : 'No'}</p>
                </div>
                <div className='profile-fields'>
                  <h2 className='field__title'>Newsletter Notification Preferences</h2>
                  <p className='field__description'>{partner.notification_prefs.join(', ')}</p>
                </div>
                <div className='profile-fields'>
                  <h2 className='field__title'>Newsletter Notification Languages</h2>
                  <p className='field__description'>{partner.notification_languages.join(', ')}</p>
                </div>
                <div className='profile-fields'>
                  <h2 className='field__title'>Secure Channels Available</h2>
                  <p className='field__description'>{partner.secure_channels.join(', ')}</p>
                </div>
                <div className='profile-fields'>
                  <h2 className='field__title'>What level of internal technical support do you have?</h2>
                  <p className='field__description'>{partner.internal_level}</p>
                </div>
                <div className='profile-fields'>
                  <h2 className='field__title'>Types of Work</h2>
                  <p className='field__description'>{partner.types_of_work.join(', ')}</p>
                </div>
                <div className='profile-fields'>
                  <h2 className='field__title'>Languages Spoken</h2>
                  <p className='field__description'>{partner.languages.join(', ')}</p>
                </div>
                <div className='profile-fields'>
                  <h2 className='field__title'> PGP Public Key</h2>
                  <a target='_blank' className='field__description link--deco' href={`${config.baseUrl}/ip_profiles/${partner.id}/key`}>View key</a>
                </div>
              </div>
            </div>
          </section>
        </div>
        {isAdmin
          ? <section className='dashboard'>
            <div className='inpage__body'>
              <div className='inpage__content'>
                <div className='inner'>
                  <ListActions
                    elementName='Tickets'
                    elements={partner.tickets}
                    roles={roles}
                    isChecked={partner.tickets.length && partner.tickets.every(t => t.checked)}
                    onCheck={() => {
                      const allChecked = partner.tickets.every(t => t.checked);
                      const properlyCheckedTickets = partner.tickets.map(t => Object.assign({}, t, { checked: !allChecked }));
                      this.props.dispatch(getImplementingPartner(Object.assign({}, partner, { tickets: properlyCheckedTickets })));
                    }}
                    onMarkStatus={(status, tickets) => this.props.dispatch(assignStatusToIPTickets(status, tickets.map(t => t.id), partner))}
                    onDownload={() => downloadObject(checked.map(t => _.omit(t, 'checked')), `Tickets from Partner ${partner.name}`)}
                    onDelete={() => {
                      const ticketIDsToDelete = checked.map(t => t.id);
                      const newIP = Object.assign({}, partner, { tickets: partner.tickets.filter(t => !ticketIDsToDelete.includes(t.id)) });
                      this.props.dispatch(deleteImplementingPartnerTickets(newIP, ticketIDsToDelete));
                    }}
                  />
                  <TicketList
                    tickets={partner.tickets}
                    onCheck={(id, checked) => {
                      const newTickets = partner.tickets.map(t => {
                        if (t.id === id) { t.checked = checked; }
                        return t;
                      });
                      this.props.dispatch(getImplementingPartner(Object.assign({}, partner, { tickets: newTickets })));
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
          : ''
        }
      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state, props) {
  return {
    partner: state.implementingPartners.list.find(ip => ip.id === props.params.partnerID),
    roles: state.auth.roles
  };
}

module.exports = connect(selector)(ImplemetingPartnerSingle);
