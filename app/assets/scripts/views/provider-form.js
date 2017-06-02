/*
 * Form to register new SP
 */

'use strict';

import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import formToObject from 'form-to-object';
import _ from 'lodash';
import {
  languages,
  serviceTypes,
  startTime,
  secureChannels,
  perWeekAvailability
} from '../constants';

import { createSpProfile } from '../actions';

// A form view to create new Service Providers
var ProviderForm = React.createClass({
  displayName: 'ProviderForm',

  propTypes: {
    dispatch: T.func,
    roles: T.array,
    router: T.object
  },

  handleSubmit: function (e) {
    const isAdmin = _.includes(this.props.roles, 'admin');

    // Don't send the form
    // The form will (still) do native HTML5 validation before executing
    e.preventDefault();

    // Assign default empty-array values to each of the multi-option fields
    const MULTI_OPTION_FIELDS = [
      'languages',
      'services',
      'secure_channels'
    ];
    const data = formToObject(this.form);
    MULTI_OPTION_FIELDS.forEach(mof => {
      if (typeof data[mof] === 'undefined') { data[mof] = []; }
      if (!Array.isArray(data[mof])) { data[mof] = [data[mof]]; }
    });
    data.rating = Number(data.rating);

    this.props.dispatch(createSpProfile(data, isAdmin))
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

    return (
      <div>
        <section className='inpage__body'>
          <div className='inner'>
            <h1 className='heading--small'>Create Provider Profile</h1>
            <form className='inpage__form' onSubmit={this.handleSubmit} ref={thisForm => { this.form = thisForm; }}>

              <div className='form__group'>
                <label className='form__label-dark' htmlFor='form-name'>Name</label>
                <input
                  type='text'
                  id='form-name'
                  required={true}
                  className='form__control form__control--medium'
                  name='name'
                />
              </div>

              {isAdmin
                ? <div className='form__group'>
                  <label className='form__label-dark' htmlFor='form-openid'>OpenID</label>
                  <input
                    type='text'
                    id='form-openid'
                    required={true}
                    className='form__control form__control--medium'
                    name='openid'
                  />
                </div>
                : ''
              }

              <div className='form__group'>
                <label className='form__label-dark' htmlFor='form-description'>Description</label>
                <p className='form__help'>A brief description of your organization. This will be used by the CiviCDR team in introductory e-mails to Implementing Partners and for identifying appropriate service providers.</p>
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
                <label className='form__label-dark' htmlFor='form-contact'>Primary E-mail</label>
                <p className='form__help'>The primary E-mail address to use for your organization or team. This will be the default address used for updates about incidents you are supporting.</p>
                <input
                  type='email'
                  id='form-contact'
                  required={true}
                  className='form__control form__control--medium'
                  name='contact'
                />
              </div>

              <div className='form__group'>
                <label className='form__label-dark' htmlFor='form-start_time'>Start Time</label>
                <p className='form__help'>The speed at which your organization/team is able to start new cases once they have been accepted. (You will be able to change this at any time to reflect your current capacity.)</p>
                <select
                  id='form-start_time'
                  className='form__control form__control--medium'
                  required={true}
                  name='start_time'
                >
                  {startTime.map(st =>
                    <option value={st} key={st}>{st}</option>
                  )}
                </select>
              </div>

              <div className='form__group'>
                <label className='form__label-dark' htmlFor='form-per_week_availability'>Availability</label>
                <p className='form__help'>The amount of time each week your team/organization has available to spend on new cases. (You will be able to change this at any time to reflect your current capacity.)</p>
                <select
                  id='form-per_week_availability'
                  className='form__control form__control--medium'
                  required={true}
                  name='per_week_availability'
                >
                  {perWeekAvailability.map(pwa =>
                    <option value={pwa} key={pwa}>{pwa}</option>
                  )}
                </select>
              </div>

              <div className='form__group checkboxes-light form__group--large'>
                <label className='form__label-dark'>Secure Channels</label>
                <p className='form__help'>Please choose any/all of the alternative secure channels that your team is willing/able to use to communicate with the CiviCDR team and Implementing Partners.</p>
                {secureChannels.map(sc => (
                  <label className='form__option form__option--custom-checkbox' key={'secure-channel-' + sc}>
                    <input
                      type='checkbox'
                      name='secure_channels'
                      value={sc}
                    />
                    <span className='form__option__text'>{sc}</span>
                    <span className='form__option__ui'></span>
                  </label>
                ))}
              </div>

              <div className='form__group'>
                <label className='form__label-dark' htmlFor='form-pgp_key'>PGP Key</label>
                <p className='form__help'>Provide the public PGP key for the e-mail address provided above. (Optional)</p>
                <textarea
                  id='form-pgp_key'
                  className='form__control'
                  rows='12'
                  name='pgp_key'
                >
                </textarea>
              </div>

              <div className='form__group'>
                <label className='form__label-dark' htmlFor='form-fees'>Fees</label>
                <p className='form__help'>Provide an overview of any fees and the services that they apply to. Please include links to any public fee schedules or other relevant documentation if possible.</p>
                <textarea
                  id='form-fees'
                  className='form__control'
                  rows='4'
                  required={true}
                  name='fees'
                >
                </textarea>
              </div>

              <div className='form__group checkboxes-light form__group--medium'>
                <label className='form__label-dark'>Languages</label>
                <p className='form__help'>The languages spoken by your team members. CiviCDR will use this to pair implementing partners with Service Providers who speak the same languages, and to provide translation support when necessary. (Choose any/all that apply.)</p>
                {languages.map(language => (
                  <label className='form__option form__option--custom-checkbox' key={'languages-' + language}>
                    <input
                      type='checkbox'
                      name='languages'
                      value={language}
                    />
                    <span className='form__option__text'>{language}</span>
                    <span className='form__option__ui'></span>
                  </label>
                ))}
              </div>

              <div className='form__group checkboxes-light'>
                <label className='form__label-dark'>Services</label>
                <p className='form__help'>The type of services provided by your organization/team. (Choose any/all that apply.)</p>
                <div className='form__group--xlarge'>
                  {serviceTypes.map(type =>
                    <label key={'service-' + type.name} className='form__option form__option--custom-checkbox'>
                      <input
                        type='checkbox'
                        name='services'
                        value={type.name}
                      />
                      <span className='form__option__text'>{type.name}</span>
                      <p className='form__option__description'>{type.description}</p>
                      <span className='form__option__ui'></span>
                    </label>
                  )}
                </div>
              </div>

              {isAdmin
                ? <div className='form__group'>
                  <label className='form__label-dark'>Rating</label>
                    {[1, 2, 3, 4, 5].map(rating =>
                    <label key={rating} className="form__option form__option--inline form__option--custom-radio">
                      <input
                        type='radio'
                        className='form__control form__control--medium'
                        required={true}
                        name='rating'
                        value={rating}
                      />
                      <span className='form__option__text'>{rating}</span>
                      <span className="form__option__ui"></span>
                    </label>
                  )}
                </div>
                : ''
              }

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
                    <button className='button button--large button--primary' onClick={() => this.props.router.push('/service-providers')}>
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
    provider: state.serviceProviders.list.find(sp => sp.id === props.params.providerID),
    roles: state.auth.roles
  };
};

export default connect(mapStateToProps)(ProviderForm);
