'use strict';
import React, { PropTypes as T } from 'react';
import { notificationPrefs, notificationLang } from '../constants';

import { updateImplementingPartnerFilters } from '../actions';

var PartnerFilters = React.createClass({
  displayName: 'PartnerFilters',

  propTypes: {
    filters: T.object,
    partners: T.array,
    dispatch: T.func
  },

  handleFilterSelection (checked, filterKey, filterValue) {
    const { filters, dispatch } = this.props;
    const filterList = filters[filterKey] || [];
    const newFilterList = checked
      ? filterList.filter(opt => opt !== filterValue)
      : filterList.concat(filterValue);

    dispatch(updateImplementingPartnerFilters(filterKey, newFilterList));
  },

  render: function () {
    const { partners, filters } = this.props;
    return (
        <aside className='inpage__aside'>
          <h2 className='filters__headline'>Filter Providers</h2>
          <div className='filters filters--status'>
            <h3 className='filters__title heading--label'>Notification Preferences</h3>
            <div className='filters__group'>
              { notificationPrefs.map((pref) => {
                const checked = (filters.notification_prefs || []).includes(pref.name);
                const id = pref.name.split(' ').join('-');
                return (
                  <label key={id} className='form__option form__option--custom-checkbox'>
                    <input checked={checked} type="checkbox" name={`pref-checkbox-${id}`} id={`pref-checkbox-${id}`} onChange={this.handleFilterSelection.bind(this, checked, 'notification_prefs', pref.name)} />
                    <span className='form__text__group'><span className='form__option__text'>{pref.name}</span><small className={id}>{partners.filter(ip => ip.notification_prefs.includes(pref.name)).length}</small></span>
                    <span className='form__option__ui'></span>
                  </label>
                );
              })}
            </div>
          </div>
          <div className='filters filters--status'>
            <h3 className='filters__title heading--label'>Notification Languages</h3>
            <div className='filters__group'>
              { notificationLang.map((lang) => {
                const checked = (filters.notification_languages || []).includes(lang);
                const id = lang.split(' ').join('-');
                return (
                  <label key={id} className='form__option form__option--custom-checkbox'>
                    <input checked={checked} type="checkbox" name={`lang-checkbox-${id}`} id={`lang-checkbox-${id}`} onChange={this.handleFilterSelection.bind(this, checked, 'notification_languages', lang)} />
                    <span className='form__text__group'><span className='form__option__text'>{lang}</span><small className={id}>{partners.filter(ip => ip.notification_languages.includes(lang)).length}</small></span>
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

module.exports = PartnerFilters;
