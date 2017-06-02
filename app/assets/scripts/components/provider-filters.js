'use strict';
import React, { PropTypes as T } from 'react';
import { serviceTypes, perWeekAvailability, startTime } from '../constants';

import { updateServiceProviderFilters } from '../actions';

var ProviderFilters = React.createClass({
  displayName: 'ProviderFilters',

  propTypes: {
    filters: T.object,
    providers: T.array,
    dispatch: T.func
  },

  handleFilterSelection (checked, filterKey, filterValue) {
    const { filters, dispatch } = this.props;
    const filterList = filters[filterKey] || [];
    const newFilterList = checked
      ? filterList.filter(opt => opt !== filterValue)
      : filterList.concat(filterValue);

    dispatch(updateServiceProviderFilters(filterKey, newFilterList));
  },

  render: function () {
    const { providers, filters } = this.props;
    return (
        <aside className='inpage__aside'>
          <h2 className='filters__headline'>Filter Providers</h2>
          <div className='filters filters--status'>
            <h3 className='filters__title heading--label'>Services</h3>
            <div className='filters__group'>
              { serviceTypes.map((type) => {
                const checked = (filters.services || []).includes(type.name);
                const id = type.name.split(' ').join('-');
                return (
                  <label key={id} className='form__option form__option--custom-checkbox'>
                    <input checked={checked} type="checkbox" name={`type-checkbox-${id}`} id={`type-checkbox-${id}`} onChange={this.handleFilterSelection.bind(this, checked, 'services', type.name)} />
                    <span className='form__text__group'><span className='form__option__text'>{type.name}</span><small className={id}>{providers.filter(sp => sp.services.includes(type.name)).length}</small></span>
                    <span className='form__option__ui'></span>
                  </label>
                );
              })}
            </div>
            <h3 className='filters__title heading--label'>Start Time Frame</h3>
            <div className='filters__group'>
              { startTime.map((option) => {
                const checked = (filters.start_time || []).includes(option);
                const id = option.split(' ').join('-');
                return (
                  <label key={id} className='form__option form__option--custom-checkbox'>
                    <input checked={checked} type="checkbox" name={`type-checkbox-${id}`} id={`type-checkbox-${id}`} onChange={this.handleFilterSelection.bind(this, checked, 'start_time', option)} />
                    <span className='form__text__group'><span className='form__option__text'>{option}</span><small className={id}>{providers.filter(sp => sp.start_time === option).length}</small></span>
                    <span className='form__option__ui'></span>
                  </label>
                );
              })}
            </div>
            <h3 className='filters__title heading--label'>Availabity</h3>
            <div className='filters__group'>
              { perWeekAvailability.map((option) => {
                const checked = (filters.per_week_availability || []).includes(option);
                const id = option.split(' ').join('-');
                return (
                  <label key={id} className='form__option form__option--custom-checkbox'>
                    <input checked={checked} type="checkbox" name={`type-checkbox-${id}`} id={`type-checkbox-${id}`} onChange={this.handleFilterSelection.bind(this, checked, 'per_week_availability', option)} />
                    <span className='form__text__group'><span className='form__option__text'>{option}</span><small className={id}>{providers.filter(sp => sp.per_week_availability === option).length}</small></span>
                    <span className='form__option__ui'></span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>
    );
  }
});

module.exports = ProviderFilters;
