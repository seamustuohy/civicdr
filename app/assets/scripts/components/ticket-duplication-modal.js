'use strict';

import React from 'react';

var TicketDuplicationModal = React.createClass({
  propTypes: {
    onClose: React.PropTypes.func,
    onSubmit: React.PropTypes.func,
    implementingPartners: React.PropTypes.array
  },

  render: function () {
    return (
      <section className='modal modal--medium'>
        <div className='modal__inner modal__form'>
          <div className='modal__body'>
            <form>
              <div className='form__group'>
                <h2 className='inpage__title'>Select a partner to create a duplicate ticket.</h2>
                <div className='style-select button drop__toggle drop__toggle--caret'>
                  <select ref={el => { this.ipSelect = el; }}>
                    {this.props.implementingPartners
                      .map(ip => <option key={ip.id} value={ip.id}>{ip.name}</option>)
                    }
                  </select>
                  </div>
                </div>
              <footer className='form__footer'>
                <ul className='form__actions'>
                  <li className='form__actions-item'><button className='button button--large button--base' onClick={e => { e.preventDefault(); this.props.onSubmit(this.ipSelect.value); }}>Duplicate</button></li>
                  <li className='form__actions-item'><button className='button button--large button--primary' onClick={this.props.onClose}>Cancel</button></li>
                </ul>
              </footer>
            </form>
          </div>
          <button className='modal__button-dismiss' title='close' onClick={this.props.onClose}></button>
        </div>
      </section>
    );
  }
});

module.exports = TicketDuplicationModal;
