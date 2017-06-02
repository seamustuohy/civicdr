'use strict';

import React from 'react';
import formToObject from 'form-to-object';

var CreateEditGrouping = React.createClass({
  displayName: 'CreateEditGrouping',

  propTypes: {
    onClose: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    existingGrouping: React.PropTypes.object
  },

  handleSubmit: function (e) {
    // Don't send the form
    // The form will (still) do native HTML5 validation before executing
    e.preventDefault();
    const data = formToObject(this.form);
    this.props.onSubmit(data.title, data.description);
  },

  handleClose: function (e) {
    e.preventDefault();
    this.form.reset();
    this.props.onClose();
  },

  render: function () {
    return (
      // Use `key` here to force a form re-render once the async fetch of
      // grouping is complete and passed in. Otherwise, no way to populate
      // the `defaultValue`s.
      <section className='modal modal--large' key={this.props.existingGrouping && this.props.existingGrouping.title}>
        <div className='modal__inner modal__form'>
          <h1 className='inpage__title heading--medium'>{this.props.existingGrouping ? 'Edit' : 'Create'} Grouping</h1>
          <form onSubmit={this.handleSubmit} ref={thisForm => { this.form = thisForm; }}>

            <div className='form__group'>
              <label className='form__label-dark' htmlFor='form-title'>Title</label>
              <input
                type='text'
                id='form-title'
                required={true}
                className='form__control form__control--medium'
                name='title'
                defaultValue={(this.props.existingGrouping && this.props.existingGrouping.title) || ''}
              />
            </div>

            <div className='form__group'>
              <label className='form__label-dark' htmlFor='form-description'>Description</label>
              <textarea
                id='form-description'
                className='form__control'
                rows='4'
                name='description'
                defaultValue={(this.props.existingGrouping && this.props.existingGrouping.description) || ''}
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

module.exports = CreateEditGrouping;
