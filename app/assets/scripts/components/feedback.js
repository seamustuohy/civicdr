'use strict';
import React, { PropTypes as T } from 'react';
import _ from 'lodash';

var Feedback = React.createClass({
  displayName: 'Feedback',

  propTypes: {
    roles: T.array
  },

  render: function () {
    let roles = this.props.roles;
    let isAdmin = _.includes(roles, 'admin');
    return (
      <div>
        { isAdmin ? <section className='feedback__container'>
          <ul className='threads__nav'>
            <li className='threads__item'><h2 className='field__title'>Feedback</h2></li>
          </ul>
          <div className='comms__container'>
            <header className='comms__header'>
              <p className='comms__title'> Added by User on <span className='notes__date'> 3/1/12 <small className='timestamp'>11:05 pm</small></span></p>
              <a className='comms__delete link--secondary'>Delete</a>
            </header>
            <div className='comms__body'>
              <p className='comms__prose'>Vestibulum aliquet imperdiet magna, at mollis elit cursus blandit. Ut nunc velit, commodo ut ipsum eu, pellentesque tempor lectus. Donec fringilla tortor eu purus mattis auctor. </p>
            </div>
          </div>
          <div className='add__thread-content'>
            <textarea className="form__control add" id="form-textarea-1" rows="4" placeholder="This is a placeholder"></textarea>
            <button className='button button--large button--base'>Add Feedback</button>
          </div>
        </section> : ''}
      </div>
    );
  }
});

module.exports = Feedback;
