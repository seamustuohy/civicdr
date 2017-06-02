'use strict';

import React, { PropTypes as T } from 'react';
import formToObject from 'form-to-object';
import _ from 'lodash';
import { ticketStatusLUT, incidentTypes } from '../constants';

const TicketEdit = React.createClass({
  displayName: 'TicketEdit',

  propTypes: {
    onClose: T.func,
    onSubmit: T.func,
    existingTicket: T.object,
    roles: T.array,
    implementingPartners: T.array,
    router: T.object
  },

  handleClose: function (e) {
    e.preventDefault();
    this.props.onClose();
  },

  handleSubmit: function (e) {
    // Don't send the form
    // The form will (still) do native HTML5 validation before executing
    e.preventDefault();

    // Assign default empty-array values to each of the multi-option fields
    const MULTI_OPTION_FIELDS = [
      'incident_type'
    ];
    const data = formToObject(this.form);
    MULTI_OPTION_FIELDS.forEach(mof => {
      if (typeof data[mof] === 'undefined') { data[mof] = []; }
      if (!Array.isArray(data[mof])) { data[mof] = [data[mof]]; }
    });

    this.props.onSubmit(data);
  },

  render: function () {
    let roles = this.props.roles;
    let isAdmin = _.includes(roles, 'admin');
    let isSP = _.includes(roles, 'SP');
    let isIP = _.includes(roles, 'IP');

    return (
      // Use `key` here to force a form re-render once the async fetch of
      // IPs is complete and passed in. Otherwise, no way to populate
      // the `defaultValue` for that `<select>`.
      <section className='modal modal--large' key={this.props.implementingPartners.length}>
        <div className='modal__inner modal__form'>
          <h1 className='inpage__title heading--medium'>Edit Ticket</h1>
          <form onSubmit={this.handleSubmit} ref={thisForm => { this.form = thisForm; }}>

            {isAdmin || isSP
              ? <div className='form__group'>
                <label className='form__label-dark'>Status</label>
                  {_.map(ticketStatusLUT, (display, value) =>
                  <label key={value} className="form__option form__option--inline form__option--custom-radio">
                    <input
                      type='radio'
                      className='form__control form__control--medium'
                      required={true}
                      name='status'
                      value={value}
                      defaultChecked={this.props.existingTicket.status === value}
                    />
                    <span className='form__option__text'>{display}</span>
                    <span className="form__option__ui"></span>
                  </label>
                )}
              </div>
              : ''
            }

            {isAdmin
              ? <div className='form__group'>
                <label className='form__label-dark' htmlFor='form-ip_assigned_id'>Implementing Partner</label>
                <select
                  id='form-ip_assigned_id'
                  className='form__control form__control--medium'
                  required={true}
                  name='ip_assigned_id'
                  onChange={(e) => {
                    const ip = this.props.implementingPartners.find(ip => ip.id === e.target.value);
                    if (ip) {
                      this.ticket_ip_name.value = ip.name;
                      this.ticket_ip_contact.value = ip.contact;
                    }
                  }}
                  defaultValue={this.props.existingTicket.ip_assigned_id}
                >
                  <option value=''></option>
                  {this.props.implementingPartners.map(ip =>
                    <option value={ip.id} key={ip.id}>{ip.name}</option>
                  )}
                </select>
              </div>
              : ''
            }

          {isAdmin || isIP
            ? <div className='form__row'>
              <div className='form__group'>
           <label className='form__label-dark' htmlFor='form-ticket_ip_name'>Team Member Name</label>
           <p className='form__help'>The member of your organization/team who will be managing this ticket. (Optional)</p>
                <input
                  type='text'
                  id='form-ticket_ip_name'
                  required={true}
                  className='form__control form__control--medium'
                  name='ticket_ip_name'
                  ref={thisInput => { this.ticket_ip_name = thisInput; }}
                  defaultValue={this.props.existingTicket.ticket_ip_name}
                />
              </div>

              <div className='form__group'>
           <label className='form__label-dark' htmlFor='form-ticket_ip_contact'>Team Member E-mail</label>
           <p className='form__help'>An alternative email address to use for notifications related to this ticket. (Optional)</p>
                <input
                  type='email'
                  id='form-ticket_ip_contact'
                  required={true}
                  className='form__control form__control--medium'
                  name='ticket_ip_contact'
                  ref={thisInput => { this.ticket_ip_contact = thisInput; }}
                  defaultValue={this.props.existingTicket.ticket_ip_contact}
                />
              </div>
            </div>
            : ''
          }

          { isAdmin || isSP
            ? <div className='form__row'>
              <div className='form__group'>
                <label className='form__label-dark' htmlFor='form-ticket_sp_name'>Service Provider Name for This Ticket</label>
                <input
                  type='text'
                  id='form-ticket_sp_name'
                  required={this.props.existingTicket.ticket_sp_name}
                  className='form__control form__control--medium'
                  name='ticket_sp_name'
                  ref={thisInput => { this.ticket_sp_name = thisInput; }}
                  defaultValue={this.props.existingTicket.ticket_sp_name}
                />
              </div>

              <div className='form__group'>
                <label className='form__label-dark' htmlFor='form-ticket_sp_contact'>Service Provider Contact for This Ticket</label>
                <input
                  type='email'
                  id='form-ticket_sp_contact'
                  required={this.props.existingTicket.ticket_sp_contact}
                  className='form__control form__control--medium'
                  name='ticket_sp_contact'
                  ref={thisInput => { this.ticket_sp_contact = thisInput; }}
                  defaultValue={this.props.existingTicket.ticket_sp_contact}
                />
              </div>
            </div>
            : ''
          }

          {isAdmin || isIP
          ? <div>
              <div className='form__group'>
                <label className='form__label-dark' htmlFor='form-date_of_incident'>Date Incident was Identified</label>
                <p className='form__help'>The date when the incident occurred or was identified by the Implementing Partner.</p>
                <input
                  type='date'
                  id='form-date_of_incident'
                  required={true}
                  className='form__control form__control--medium'
                  name='date_of_incident'
                  defaultValue={this.props.existingTicket.date_of_incident.slice(0, 10)}
                />
              </div>

              <div className='form__group checkboxes-light form__group--medium'>
                <label className='form__label-dark'>Incident Type</label>
                <p className='form__help'>The type of incident. (Choose all/any that apply.)</p>
                {incidentTypes.map(type => (
                  <label className='form__option form__option--custom-checkbox' key={'incident_type-' + type.name}>
                    <input
                      type='checkbox'
                      name='incident_type'
                      value={type.name}
                      defaultChecked={this.props.existingTicket.incident_type.includes(type.name)}
                    />
                    <span className='form__option__text'>{type.name}</span>
                    <span className='form__option__ui'></span>
                  </label>
                ))}
              </div>

              <div className='form__group'>
                <label className='form__label-dark' htmlFor='form-description'>Description</label>
                <p className='form__help'>Provide a brief description of the incident. (CiviCDR staff will follow up to collect more information.)</p>
                <textarea
                  id='form-description'
                  className='form__control'
                  rows='4'
                  required={true}
                  name='description'
                  defaultValue={this.props.existingTicket.description}
                >
                </textarea>
              </div>

              <div className='form__group'>
                <label className='form__label-dark' htmlFor='form-steps_taken'>Steps Taken to Mitigate</label>
                <p className='form__help'>Provide information about any steps the affected parties have already taken to address the issue or protect themselves.</p>
                <textarea
                  id='form-steps_taken'
                  className='form__control'
                  rows='4'
                  required={true}
                  name='steps_taken'
                  defaultValue={this.props.existingTicket.steps_taken}
                >
                </textarea>
              </div>
            </div>
            : ''
          }
            <footer className='form__footer'>
              <ul className='form__actions'>
                <li className='form__actions-item'>
                  <input type='submit' value='Save' onClick={() => this.setState({pathToRedirect: '/'})} className='button button--large button--base'/>
                </li>
                <li className='form__actions-item'>
                  <button onClick={this.handleClose} className='button button--large button--primary'>
                    Cancel
                  </button>
                </li>
              </ul>
            </footer>
          </form>
          <button className='modal__button-dismiss' title='close' onClick={this.handleClose}></button>
        </div>
      </section>
    );
  }
});

module.exports = TicketEdit;
