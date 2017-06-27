/*
 * Form to register a new IP
 */

'use strict';

import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import formToObject from 'form-to-object';
import {
  languages,
  typesOfWork,
  secureChannels,
  notificationPrefs,
  notificationLang
} from '../constants';
import {
  createIpProfile,
  fetchProfile
} from '../actions';

import _ from 'lodash';

// Form view to create a new IP
var PartnerForm = React.createClass({
  displayName: 'PartnerForm',

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
      'notification_prefs',
      'notification_languages',
      'secure_channels',
      'types_of_work',
      'languages'
    ];
    const data = formToObject(this.form);
    MULTI_OPTION_FIELDS.forEach(mof => {
      if (typeof data[mof] === 'undefined') { data[mof] = []; }
      if (!Array.isArray(data[mof])) { data[mof] = [data[mof]]; }
    });

    this.props.dispatch(createIpProfile(data, isAdmin))
      .then(() => {
        if (!isAdmin) { this.props.dispatch(fetchProfile()); }
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
            <h1 className='heading--small'>Create Partner Profile</h1>
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
                <label className='form__label-dark' htmlFor='form-location'>Location</label>
                <p className='form__help'>The location where your organization/team is based.</p>
                <input
                  type='text'
                  id='form-location'
                  className='form__control form__control--medium'
                  name='location'
                />
              </div>

              <div className='form__group'>
                <label className='form__label-dark' htmlFor='form-select-contact'>Primary E-mail</label>
                <p className='form__help'>The primary E-mail address for your organization or team. This will be the default address used for updates about your incidents.</p>
                <input
                  type='email'
                  required={true}
                  className='form__control form__control--medium'
                  name='contact'
                />
              </div>

              <div className='form__group'>
                <label className='form__label-dark' htmlFor='form-email-notifications'>Would you like to receive email notifications for changes to ticket statuses or assignments?</label>
                  <label className='form__option form__option--inline form__option--custom-radio'>
                    <input
                      type='radio'
                      name='email_notification'
                      required={true}
                      value={true}
                    />
                    <span className='form__option__text'>Yes</span>
                    <span className='form__option__ui'></span>
                  </label>
                  <label className='form__option form__option--inline form__option--custom-radio'>
                    <input
                      type='radio'
                      name='email_notification'
                      required={true}
                      value={false}
                    />
                    <span className='form__option__text'>No</span>
                    <span className='form__option__ui'></span>
                  </label>
              </div>

              <div className='checkboxes-light'>
                <label className='form__label-dark'>Notification Preferences</label>
                <p className='form__help'>Which informational notifications would you like to receive from CiviCDR? (These do not include platform notifications which can be turned off below.)</p>
                <div className='form__group'>
                  {notificationPrefs.map(pref => (
                    <label className='form__option form__option--custom-checkbox' key={'notification_prefs-' + pref.name}>
                      <input
                        type='checkbox'
                        name='notification_prefs'
                        value={pref.name}
                      />
                      <span className='form__option__text'>{pref.name}</span>
                      <p className='form__option__description'>{pref.description}</p>
                      <span className='form__option__ui'></span>
                    </label>
                  ))}
                </div>
              </div>

              <div className='form__group checkboxes-light'>
                <label className='form__label-dark'>Notification Languages</label>
                <p className='form__help'>Which languages would you like to receive informational notifications in?</p>
                {notificationLang.map(lang => (
                  <label className='form__option form__option--inline form__option--custom-checkbox' key={'notification_languages-' + lang}>
                    <input
                      type='checkbox'
                      name='notification_languages'
                      value={lang}
                    />
                    <span className='form__option__text'>{lang}</span>
                    <span className='form__option__ui'></span>
                  </label>
                ))}
              </div>

              <div className='form__group checkboxes-light'>
                <label className='form__label-dark'>Secure Channels</label>
                <p className='form__help'>Please choose any/all of the alternative secure channels that you are comfortable using to communicate with the CiviCDR team and Service Providers.</p>
                {secureChannels.map(sc => (
                  <label className='form__option form__option--inline form__option--custom-checkbox' key={'secure_channel-' + sc}>
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
                <label className='form__label-dark' htmlFor='form-internal_level'>Internal Technical Support</label>
                <p className='form__help'>Provide a brief description of the level of internal technical support you have within your organization/team. This will be used to guide which support services are recommended when you report incidents.</p>
                <textarea
                  id='form-internal_level'
                  className='form__control'
                  rows='4'
                  name='internal_level'
                >
                </textarea>
              </div>

              <div className='form__group checkboxes-light'>
                <label className='form__label-dark'>Types of Work</label>
                <p className='form__help'>The type of work that your organization/team conducts. (Choose any/all that apply.)</p>
                <div className='form__group--xlarge'>
                  {typesOfWork.map(type => (
                    <label className='form__option form__option--custom-checkbox' key={'types_of_work-' + type.name}>
                      <input
                        type='checkbox'
                        name='types_of_work'
                        value={type.name}
                      />
                      <span className='form__option__text'>{type.name}</span>
                      <p className='form__option__description'>{type.description}</p>
                      <span className='form__option__ui'></span>
                    </label>
                  ))}
                </div>
              </div>

              <div className='form__group checkboxes-light form__group--medium'>
                <label className='form__label-dark'>Languages</label>
                <p className='form__help'>The languages spoken by the team members who will be communicating with Service Providers and the CiviCDR team. We will use this to pair you with Service Providers who speak the same languages, and to provide translation support when necessary. (Choose any/all that apply.)</p>
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
                    <button className='button button--large button--primary' onClick={() => this.props.router.push('/partners')}>
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
    roles: state.auth.roles
  };
};

export default connect(mapStateToProps)(PartnerForm);
