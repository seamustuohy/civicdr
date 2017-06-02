/*
 * View to render single form
 */

'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import c from 'classnames';

import config from '../config';
import ListActions from '../components/list-actions';
import TicketList from '../components/ticket-list';
import ServiceProviderEdit from '../components/service-provider-edit';
import downloadObject from '../utils/download-object';
import DeleteModal from '../components/delete-modal';

import {
  fetchServiceProvider,
  deleteServiceProviders,
  putServiceProvider,
  getServiceProvider,
  deleteServiceProviderTickets,
  assignStatusToSPTickets
} from '../actions';

// View of a single Service Provider
// Includes the SP's metadata, as well as all assigned tickets
var ServiceProviderSingle = React.createClass({
  propTypes: {
    provider: T.object,
    dispatch: T.func,
    params: T.object,
    router: T.object,
    roles: T.array
  },

  getInitialState: function () {
    return {
      isEditModalVisible: false,
      isDeleteModalVisible: false
    };
  },

  componentDidMount: function () {
    const { dispatch, params } = this.props;
    dispatch(fetchServiceProvider(params.providerID));
  },

  render: function () {
    const { provider } = this.props;
    let roles = this.props.roles;
    let isAdmin = _.includes(roles, 'admin');
    if (!provider) {
      return <div className='empty-component'></div>;
    }
    provider.tickets = provider.tickets || [];
    const checked = provider.tickets.filter(t => t.checked);
    return (
      <section className='section grouping-single'>
        <div style={{display: this.state.isEditModalVisible ? 'block' : 'none'}}>
          <ServiceProviderEdit
            onClose={() => this.setState({isEditModalVisible: false})}
            onSubmit={updatedServiceProvider => {
              this.props.dispatch(putServiceProvider(provider.id, updatedServiceProvider));
              this.setState({isEditModalVisible: false});
            }}
            roles={roles}
            existingServiceProvider={provider}
          />
        </div>

        <div style={{display: this.state.isDeleteModalVisible ? 'block' : 'none'}}>
          <DeleteModal
            onClose={() => { this.setState({isDeleteModalVisible: false}); }}
            onSubmit={(title, description) => {
              this.props.dispatch(deleteServiceProviders([provider.id], () => this.props.router.push('/service-providers')));
              this.setState({isDeleteModalVisible: false});
            }}
            warningText={'This action will delete the service provider profile and unassign all associated tickets.'}
            />
        </div>

        <div className='inner inner-shadow'>
          <header className='ticket__header'>
            <div className='grouping__header--content'>
             <div className='headline__group'>
                <h1 className='ticket__title'>{provider.name}</h1>
                <p className='ticket__description'>{moment(provider.created_at).format('YYYY-MM-DD')}</p>
              </div>
              {isAdmin
                ? <div className='inpage__stats'>
                  <ul className='inpage__stats-list'>
                    <li className='inpage__stats-item'>Assigned Tickets <small className='totals'>{provider.ticket_count || (provider.tickets && provider.tickets.length) || 0}</small></li>
                  </ul>
                </div>
                : ''
              }
            </div>
            <ul className='ticket__header--actions'>
              { isAdmin ? <li className='ticket__actions-item'><button className='button button--primary' onClick={() => this.setState({isDeleteModalVisible: true})}>Delete</button></li> : '' }
              <li className='ticket__actions-item'><button className='button button--base' onClick={() => this.setState({isEditModalVisible: true})}>Edit</button></li>
            </ul>
          </header>
          <section className='inpage__content'>
           { isAdmin ? <div className='inpage__rating'>
              <p className='inpage__label'>Rating</p>
              <ul className='inpage__rating-list'>
                {Array(5).fill(0).map((_, index) => <li key={index} className={c('inpage__rating-item', {'rating-filled': provider.rating >= index + 1})} ></li>)}
              </ul>
            </div> : '' }
            <div className='fields__group'>
              <div className='profile-fields'>
                <h2 className='field__title'>Services Provided</h2>
                <p className='field__description'>{provider.services.join(', ')}</p>
              </div>
              <div className='profile-fields'>
                <h2 className='field__title'>Description</h2>
                <p className='field__description'>{provider.description}</p>
              </div>
              <div className='profile-fields'>
                <h2 className='field__title'>Contact</h2>
                <p className='field__description'>{provider.contact}</p>
              </div>
              <div className='profile-fields'>
                <h2 className='field__title'>Available Secure Channels</h2>
                <p className='field__description'>{provider.secure_channels.join(', ')}</p>
              </div>
              <div className='profile-fields'>
                <h2 className='field__title'>Start Time Frame</h2>
                <p className='field__description'>{provider.start_time}</p>
              </div>
              <div className='profile-fields'>
                <h2 className='field__title'>Hours Available Per Week</h2>
                <p className='field__description'>{provider.per_week_availability}</p>
              </div>
              <div className='profile-fields'>
                <h2 className='field__title'>Cost or Fees</h2>
                <p className='field__description'>{provider.fees}</p>
              </div>
              <div className='profile-fields'>
                <h2 className='field__title'>Languages Spoken</h2>
                <p className='field__description'>{provider.languages.join(', ')}</p>
              </div>
              <div className='profile-fields'>
                <h2 className='field__title'>PGP Public Key</h2>
                <a target='_blank' className='field__description link--deco'href={`${config.baseUrl}/sp_profiles/${provider.id}/key`}> View Key</a>
              </div>
            </div>
          </section>
        </div>
        {isAdmin
          ? <section className='dashboard'>
            <div className='inpage__content'>
              <div className='inpage__body'>
                <div className='inner'>
                  <ListActions
                    elementName='Tickets'
                    elements={provider.tickets}
                    roles={roles}
                    isChecked={Boolean(provider.tickets.length && provider.tickets.every(t => t.checked))}
                    onCheck={() => {
                      const allChecked = provider.tickets.every(t => t.checked);
                      const properlyCheckedTickets = provider.tickets.map(t => Object.assign({}, t, { checked: !allChecked }));
                      this.props.dispatch(getServiceProvider(Object.assign({}, provider, { tickets: properlyCheckedTickets })));
                    }}
                    onMarkStatus={(status, tickets) => this.props.dispatch(assignStatusToSPTickets(status, tickets.map(t => t.id), provider))}
                    onDownload={() => downloadObject(checked.map(t => _.omit(t, 'checked')), `Tickets from Provider ${provider.name}`)}
                    onDelete={() => {
                      const ticketIDsToDelete = checked.map(t => t.id);
                      const newSP = Object.assign({}, provider, { tickets: provider.tickets.filter(t => !ticketIDsToDelete.includes(t.id)) });
                      this.props.dispatch(deleteServiceProviderTickets(newSP, ticketIDsToDelete));
                    }}
                  />
                  <TicketList
                    tickets={provider.tickets}
                    roles={this.props.roles}
                    onCheck={(id, checked) => {
                      const newTickets = provider.tickets.map(t => {
                        if (t.id === id) { t.checked = checked; }
                        return t;
                      });
                      this.props.dispatch(getServiceProvider(Object.assign({}, provider, { tickets: newTickets })));
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

function selector (state, props) {
  return {
    provider: state.serviceProviders.list.find(sp => sp.id === props.params.providerID),
    roles: state.auth.roles
  };
}

module.exports = connect(selector)(ServiceProviderSingle);
