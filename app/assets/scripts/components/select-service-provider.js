'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { every } from 'lodash';
import { serviceTypes, startTime, perWeekAvailability } from '../constants';

import {
  fetchServiceProviders,
  updateServiceProviderFilters
} from '../actions';

const getThisAndHigherIndex = (selected, allOptions) => {
  if (selected === '') { return allOptions; }
  const selectedIndex = allOptions.indexOf(selected);
  return allOptions.filter((option, index) => index >= selectedIndex);
};

const getThisAndLowerIndex = (selected, allOptions) => {
  if (selected === '') { return allOptions; }
  const selectedIndex = allOptions.indexOf(selected);
  return allOptions.filter((option, index) => index <= selectedIndex);
};

var SelectServiceProvider = React.createClass({
  displayName: 'SelectServiceProvider',

  propTypes: {
    serviceProviders: T.array,
    dispatch: T.func,
    filters: T.object,
    onClose: T.func,
    onSubmit: T.func
  },

  getInitialState: function () {
    return {
      isServicesDropdownVisible: false,
      services: [],
      startTime: '',
      perWeekAvailability: '',
      serviceProvider: ''
    };
  },

  componentDidMount: function () {
    this.props.dispatch(fetchServiceProviders());
  },

  onClose: function () {
    // _Also_ clear the local state
    this.setState({
      isServicesDropdownVisible: false,
      services: [],
      startTime: '',
      perWeekAvailability: '',
      serviceProvider: ''
    });
    this.props.onClose();
  },

  render: function () {
    return (
        <section className='modal modal--xxlarge sp-modal'>
          <div className='modal__inner'>
            <div className='modal__body'>
              <div className='form__group add-services'>
               <h2 className='inpage__title'>Filter Service Providers</h2>
                <button
                  onClick={() => this.setState({isServicesDropdownVisible: !this.state.isServicesDropdownVisible})}
                  className='button button-drop-select drop__toggle drop__toggle--caret'>
                    Services Provided
                </button>
                <div style={{display: this.state.isServicesDropdownVisible ? 'block' : 'none'}}>
                  <div className='dropdown__container drop__content drop__content--react add-provider'>
                    <ul className='drop__menu'>
                    {serviceTypes.map((type) => {
                      return (
                      <li key={type.name}>
                        <label className="form__option form__option--custom-checkbox">
                        <input
                          type="checkbox"
                          checked={this.state.services.includes(type.name)}
                          onClick={() => {
                            let services = this.state.services;
                            if (services.includes(type.name)) {
                              services = services.filter(s => s !== type.name);
                            } else {
                              services = services.concat(type.name);
                            }
                            this.props.dispatch(updateServiceProviderFilters('services', services));
                            this.setState({
                              services: services,
                              isServicesDropdownVisible: false
                            });
                          }}
                          name='type.name'
                          id='type.name'
                        />
                          {type.name}
                          <span className="form__option__ui"></span>
                        </label>
                      </li>
                      );
                    })}
                    </ul>
                  </div>
                </div>
                <div className='tag__group'>
                  {this.state.services.map(s =>
                    <button
                      key={s}
                      className='button button--small button--tag'
                      onClick={() => {
                        const services = this.state.services.filter(srv => srv !== s);
                        this.setState({services: services});
                        this.props.dispatch(updateServiceProviderFilters('services', services));
                      }}
                    >
                      {s}
                    </button>
                  )}
                </div>
              </div>
              <div className='form__group'>
                <label className='form__label-dark'>Start Time</label>
                <div className='style-select button drop__toggle drop__toggle--caret'>
                  <select
                    value={this.state.startTime}
                    onChange={(e) => {
                      this.setState({startTime: e.target.value});
                      this.props.dispatch(updateServiceProviderFilters('start_time', getThisAndLowerIndex(e.target.value, startTime)));
                    }}
                  >
                    <option value={''}></option>
                    {startTime.map(st =>
                      <option key={st} value={st}>{st}</option>
                    )}
                  </select>
                </div>
              </div>
              <div className='form__group'>
                <label className='form__label-dark'>Availability</label>
                <div className='style-select button drop__toggle drop__toggle--caret'>
                  <select
                    value={this.state.perWeekAvailability}
                    onChange={(e) => {
                      this.setState({perWeekAvailability: e.target.value});
                      this.props.dispatch(updateServiceProviderFilters('per_week_availability', getThisAndHigherIndex(e.target.value, perWeekAvailability)));
                    }}
                  >
                    <option value={''}></option>
                    {perWeekAvailability.map(pwa =>
                      <option key={pwa} value={pwa}>{pwa}</option>
                    )}
                  </select>
                </div>
              </div>
              <div className='form__group'>
                <h2 className='inpage__title'>Assign Service Providers</h2>
                <label className='form__label-dark'>Service Provider</label>
                <div className='style-select button drop__toggle drop__toggle--caret'>
                  <select
                    value={this.state.serviceProvider}
                    onChange={(e) => this.setState({serviceProvider: e.target.value})}
                  >
                    <option value={''}></option>
                    {this.props.serviceProviders
                      .filter(sp =>
                        every(this.props.filters, (vals, key) =>
                          (typeof sp[key] === 'string')
                            ? vals.includes(sp[key])
                            : vals.every(v => sp[key].includes(v))
                        )
                      )
                      .map(sp => <option key={sp.id} value={sp.id}>{sp.name}</option>)
                    }
                  </select>
                </div>
              </div>
            </div>
            <footer className='modal__footer'>
              <ul className='modal__actions'>
                <li className='modal__actions-item'>
                  <button
                    className='button button--large button--base'
                    disabled={this.state.serviceProvider === ''}
                    onClick={() => {
                      this.props.onSubmit(this.state.serviceProvider);
                      this.onClose();
                    }}
                  >
                    Assign Provider
                  </button>
                </li>
                <li className='modal__actions-item'><button className='button button--large button--primary' onClick={this.onClose}>Cancel</button></li>
              </ul>
            </footer>
            <button className='modal__button-dismiss' title='close' onClick={this.onClose}></button>
          </div>
        </section>
    );
  }
});

function selector (state) {
  return {
    serviceProviders: state.serviceProviders.list || [],
    filters: state.serviceProviders.filters
  };
}

module.exports = connect(selector)(SelectServiceProvider);
