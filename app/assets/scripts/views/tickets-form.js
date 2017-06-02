/*
 * Form to create a ticket
 */
'use strict';

import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import formToObject from 'form-to-object';
import _ from 'lodash';
import { ticketStatusLUT, incidentTypes } from '../constants';
import {
  createTicket,
  fetchImplementingPartners
} from '../actions';

// Form view to create a new ticket
var TicketsForm = React.createClass({
  displayName: 'TicketsForm',

  propTypes: {
    dispatch: T.func,
    roles: T.array,
    router: T.object,
    implementingPartners: T.array,
    profile: T.object
  },

  componentDidMount: function () {
    const isAdmin = _.includes(this.props.roles, 'admin');
    if (isAdmin) {
      this.props.dispatch(fetchImplementingPartners());
    }
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

    createTicket(data)
      .then(() => {
        if (this.state && this.state.pathToRedirect) {
          this.props.router.push(this.state.pathToRedirect);
        } else {
          this.form.reset();
        }
      });
  },

  render: function () {
    const isAdmin = _.includes(this.props.roles, 'admin');
    const hasProfile = Boolean(this.props.profile.name);

    return (
      // Force an update of the `defaultValue` fields by attaching a `key`
      <div key={hasProfile ? this.props.profile.name : ''}>
        <section className='inpage__body'>
          <div className='inner'>
            <h1 className='heading--small'>Create Ticket</h1>
            <form className='inpage__form' onSubmit={this.handleSubmit} ref={thisForm => { this.form = thisForm; }}>

              {isAdmin
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
                        defaultChecked={value === 'unassigned'}
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
                  >
                    <option value=''></option>
                    {this.props.implementingPartners.map(ip =>
                      <option value={ip.id} key={ip.id}>{ip.name}</option>
                    )}
                  </select>
                </div>
                : ''
              }

              <div className='form__row'>
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
                    defaultValue={hasProfile ? this.props.profile.name : ''}
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
                    defaultValue={hasProfile ? this.props.profile.contact : ''}
                  />
                </div>
              </div>

              <div className='form__group'>
                <label className='form__label-dark' htmlFor='form-date_of_incident'>Date Incident was Identified</label>
                <p className='form__help'>The date when the incident occurred or was identified by the Implementing Partner.</p>
                <input
                  type='date'
                  id='form-date_of_incident'
                  required={true}
                  className='form__control form__control--medium'
                  name='date_of_incident'
                />
              </div>

              <div className='form__group checkboxes-light'>
                <label className='form__label-dark'>Incident Type</label>
                <p className='form__help'>The type of incident. (Choose all/any that apply.)</p>
                <div className='form__group--xlarge'>
                  {incidentTypes.map(type => (
                    <label className='form__option form__option--custom-checkbox' key={'incident_type-' + type.name}>
                      <input
                        type='checkbox'
                        name='incident_type'
                        value={type.name}
                      />
                      <span className='form__option__text'>{type.name}</span>
                      <p className='form__option__description'>{type.description}</p>
                      <span className='form__option__ui'></span>
                    </label>
                  ))}
                </div>
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
                >
                </textarea>
              </div>

              <footer className='form__footer'>
                <ul className='form__actions'>
                  <li className='form__actions-item'>
                    <input type='submit' value='Save' onClick={() => this.setState({pathToRedirect: '/'})} className='button button--large button--base'/>
                  </li>
                  { isAdmin
                    ? <li className='form__actions-item'>
                      <input type='submit' value='Save and Add Another' className='button button--large button--secondary-bounded'/>
                    </li>
                    : ''
                  }
                  <li className='form__actions-item'>
                    <button className='button button--large button--primary' onClick={() => this.props.router.push('/')}>
                      Cancel
                    </button>
                  </li>
                </ul>
              </footer>

            </form>
          </div>
        </section>
      </div>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const mapStateToProps = (state, props) => {
  return {
    implementingPartners: state.implementingPartners.list,
    roles: state.auth.roles,
    profile: state.auth.profile
  };
};

export default connect(mapStateToProps)(TicketsForm);
