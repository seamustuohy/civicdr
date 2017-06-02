'use strict';

import React from 'react';
import formToObject from 'form-to-object';
import {
  notificationPrefs,
  notificationLang,
  secureChannels,
  typesOfWork,
  languages
} from '../constants';

const ImplementingPartnerEdit = React.createClass({
  displayName: 'ImplementingPartnerEdit',

  propTypes: {
    onClose: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    existingImplementingPartner: React.PropTypes.object,
    roles: React.PropTypes.array
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
      'notification_prefs',
      'secure_channels',
      'types_of_work',
      'languages'
    ];
    const data = formToObject(this.form);
    MULTI_OPTION_FIELDS.forEach(mof => {
      if (typeof data[mof] === 'undefined') { data[mof] = []; }
      if (!Array.isArray(data[mof])) { data[mof] = [data[mof]]; }
    });
    this.props.onSubmit(data);
  },

  render: function () {
    const isAdmin = this.props.roles && this.props.roles.includes('admin');

    return (
      <section className='modal modal--xlarge'>
        <div className='modal__inner modal__form'>
          <h1 className='inpage__title heading--medium'>Edit Implementing Partner</h1>
          <form onSubmit={this.handleSubmit} ref={thisForm => { this.form = thisForm; }}>

            <div className='form__group'>
              <label className='form__label-dark' htmlFor='form-name'>Name</label>
              <p className='form__help'>The member of your organization/team who will be managing this ticket. (Optional)</p>
              <input
                type='text'
                id='form-name'
                required={true}
                className='form__control form__control--medium'
                name='name'
                defaultValue={this.props.existingImplementingPartner.name}
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
                  defaultValue={this.props.existingImplementingPartner.openid}
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
                defaultValue={this.props.existingImplementingPartner.location}
              />
            </div>

            <div className='form__group'>
              <label className='form__label-dark' htmlFor='form-contact'>Primary E-mail</label>
              <p className='form__help'>The primary E-mail address for your organization or team. This will be the default address used for updates about your incidents.</p>
              <input
                type='email'
                id='form-contact'
                required={true}
                className='form__control form__control--medium'
                name='contact'
                defaultValue={this.props.existingImplementingPartner.contact}
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
                      defaultChecked={this.props.existingImplementingPartner.email_notification}
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
                      defaultChecked={!this.props.existingImplementingPartner.email_notification}
                    />
                    <span className='form__option__text'>No</span>
                    <span className='form__option__ui'></span>
                  </label>
              </div>

            <div className='form__group checkboxes-light'>
              <label className='form__label-dark'>Notification Preferences</label>
              <p className='form__help'>Which informational notifications would you like to receive from CiviCDR? (These do not include platform notifications which can be turned off below.)</p>
              {notificationPrefs.map(pref => (
                <label className='form__option form__option--inline form__option--custom-checkbox' key={'notification_pref-' + pref.name}>
                  <input
                    type='checkbox'
                    name='notification_prefs'
                    value={pref.name}
                    defaultChecked={this.props.existingImplementingPartner.notification_prefs.includes(pref.name)}
                  />
                  <span className='form__option__text'>{pref.name}</span>
                  <span className='form__option__ui'></span>
                </label>
              ))}
            </div>

            <div className='form__group checkboxes-light'>
              <label className='form__label-dark'>Notification Languages</label>
              <p className='form__help'>Which languages would you like to receive informational notifications in?</p>
              {notificationLang.map(lang => (
                <label className='form__option form__option--inline form__option--custom-checkbox' key={'notification_pref-' + lang}>
                  <input
                    type='checkbox'
                    name='notification_prefs'
                    value={lang}
                    defaultChecked={this.props.existingImplementingPartner.notification_prefs.includes(lang)}
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
                    defaultChecked={this.props.existingImplementingPartner.secure_channels.includes(sc)}
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
                defaultValue={this.props.existingImplementingPartner.internal_level}
              >
              </textarea>
            </div>

            <div className='form__group checkboxes-light form__group--medium'>
              <label className='form__label-dark'>Types of Work</label>
              <p className='form__help'>The type of work that your organization/team conducts. (Choose any/all that apply.)</p>
              {typesOfWork.map(type => (
                <label className='form__option form__option--custom-checkbox' key={'types_of_work-' + type.name}>
                  <input
                    type='checkbox'
                    name='types_of_work'
                    value={type.name}
                    defaultChecked={this.props.existingImplementingPartner.types_of_work.includes(type)}
                  />
                  <span className='form__option__text'>{type.name}</span>
                  <span className='form__option__ui'></span>
                </label>
              ))}
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
                    defaultChecked={this.props.existingImplementingPartner.languages.includes(language)}
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
                defaultValue={this.props.existingImplementingPartner.pgp_key}
              >
              </textarea>
            </div>

            <footer className='form__footer'>
              <ul className='form__actions'>
                <li className='form__actions-item'>
                  <input type='submit' value='Save' className='button button--large button--base'/>
                </li>
                <li className='form__actions-item'>
                  <button className='button button--large button--primary' onClick={this.handleClose}>
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

module.exports = ImplementingPartnerEdit;
