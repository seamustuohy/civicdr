'use strict';
import React from 'react';

var DeleteModal = React.createClass({
  propTypes: {
    onClose: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    warningText: React.PropTypes.string
  },

  render: function () {
    return (
      <section className='modal modal--medium delete-modal'>
        <div className='modal__inner'>
          <div className='warning__group'>
            <h2 className='inpage__title heading--small'>Are you sure you want to perform this deletion?</h2>
            <p className='inpage__description'>{ this.props.warningText || 'This information will be removed from the system permanently. It cannot be undone. Please download the data first for your records.' }</p>
            <button className='button button--large button--base' onClick={this.props.onClose}>Cancel</button>
            <button className='button button--large button--primary' onClick={this.props.onSubmit}>Delete</button>
          </div>
          <button className='modal__button-dismiss' title='close' onClick={this.props.onClose}></button>
        </div>
      </section>
    );
  }
});

module.exports = DeleteModal;
