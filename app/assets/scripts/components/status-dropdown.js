'use strict';

import React from 'react';
import _ from 'lodash';
import { ticketStatusLUT } from '../constants';

export class StatusDropdown extends React.Component {
  constructor () {
    super();
    this.state = {isDropdownVisible: false};
  }

  render () {
    return (
      <li className='actions__updates-item'>
        <button
          className='button button--unbounded button--dropdown'
          onClick={() => this.setState({isDropdownVisible: !this.state.isDropdownVisible})}
        >
          Mark Status As
        </button>
        <div style={{display: this.state.isDropdownVisible ? 'block' : 'none'}}>
          <div className='dropdown__container drop__content drop__content--react'>
            <ul className='drop__menu'>
              {_.map(ticketStatusLUT, (statusDisplay, statusValue) =>
                <li
                  key={statusValue}
                  className='drop__menu-item'
                  onClick={() => {
                    this.props.onMarkStatus(statusValue, this.props.checked);
                    this.setState({isDropdownVisible: false});
                  }}
                >
                  {statusDisplay}
                </li>
              )}
            </ul>
          </div>
        </div>
      </li>
    );
  }
}

StatusDropdown.propTypes = {
  onMarkStatus: React.PropTypes.func,
  checked: React.PropTypes.array
};
