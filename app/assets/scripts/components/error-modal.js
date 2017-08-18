'use strict';
import React from 'react';

var ErrorModal = React.createClass({
  propTypes: {
    onClose: React.PropTypes.func,
    onLogout: React.PropTypes.func,
    errorMsg: React.PropTypes.string
  },

  render: function () {
    return (
      <section className='modal modal--medium error-modal'>
        <div className='modal__inner'>
          <div className='warning__group'>
            <h2 className='inpage__title heading--small'>An Error has occured</h2>
            <p className='inpage__description'>{ this.props.errorMsg || 'An unknown error has occured. You can try again after you close this dialogue.'}</p>
            <button className='button button--large button--primary' onClick={this.props.onClose}>Close</button>
            <button className='button button--large button--base' onClick={this.props.onLogout}>Logout</button>
          </div>
          <button className='modal__button-dismiss' title='close' onClick={this.props.onClose}></button>
        </div>
      </section>
    );
  }
});

module.exports = ErrorModal;
