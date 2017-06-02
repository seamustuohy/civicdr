'use strict';
import React, { PropTypes as T } from 'react';
import _ from 'lodash';

import { ticketStatusLUT, incidentTypes } from '../constants';
import { updateTicketFilters } from '../actions';

var TicketFilters = React.createClass({
  displayName: 'TicketFilters',

  propTypes: {
    filters: T.object,
    dispatch: T.func,
    tickets: T.array,
    roles: T.array
  },

  handleFilterSelection (checked, filterKey, filterValue) {
    const { filters, dispatch } = this.props;
    const filterList = filters[filterKey] || [];
    const newFilterList = checked
      ? filterList.filter(opt => opt !== filterValue)
      : filterList.concat(filterValue);

    dispatch(updateTicketFilters(filterKey, newFilterList));
  },

  render: function () {
    const { tickets, filters } = this.props;
    let roles = this.props.roles;
    let isAdmin = _.includes(roles, 'admin');
    return (
        <aside className='inpage__aside'>
          <h2 className='filters__headline'>Filter Tickets</h2>
          <div className='filters filters--status'>
            <h3 className='filters__title heading--label'>Status</h3>
            <div className='filters__group'>
                {Object.keys(ticketStatusLUT).map((key) => {
                  const checked = (filters.status).includes(key);
                  return (
                    <label key={key} className="form__option form__option--custom-checkbox">
                      <input checked={checked} type="checkbox" name={`type-checkbox-${key}`} id={`type-checkbox-${key}`} onChange={this.handleFilterSelection.bind(this, checked, 'status', key)}/>
                      <span className='form__text__group'><span className="form__option__text">{ticketStatusLUT[key]}</span>
                      <small className={key}>{tickets.filter(ticket => ticket.status === key).length}</small></span>
                      <span className="form__option__ui"></span>
                    </label>
                  );
                })}
            </div>
            <h3 className='filters__title heading--label'>TYPE</h3>
            <div className='filters__group'>
              {incidentTypes.map((type) => {
                const checked = (filters.incident_type).includes(type.name);
                return (
                  <label key={type.name} className="form__option form__option--custom-checkbox">
                    <input checked={checked} type="checkbox" name={`type-checkbox-${type.name}`} id={`type-checkbox-${type.name}`} onChange={this.handleFilterSelection.bind(this, checked, 'incident_type', type.name)}/>
                    <span className='form__text__group'><span className="form__option__text">{type.name}</span><small>{tickets.filter(ticket => ticket.incident_type.includes(type.name)).length}</small></span>
                    <span className="form__option__ui"></span>
                  </label>
                );
              })}
            </div>
            { isAdmin ? <h3 className='filters__title heading--label'>Groupings</h3> : '' }
            { isAdmin ? <div className='filters__group'>
              {_.uniqBy(_.flatten(tickets.map(ticket => ticket.groupings)), a => a.grouping_id).map(grouping => {
                const checked = (filters.grouping).includes(grouping.grouping_id);
                return (
                  <label key={grouping.grouping_id} className="form__option form__option--custom-checkbox">
                    <input checked={checked} type="checkbox" name={`type-checkbox-${grouping.grouping_id}`} id={`type-checkbox-${grouping.grouping_id}`} onChange={this.handleFilterSelection.bind(this, checked, 'grouping', grouping.grouping_id)}/>
                    <span className='form__text__group'><span className="form__option__text">{grouping.title}</span><small>{tickets.filter(ticket => ticket.groupings.map(g => g.grouping_id).includes(grouping.grouping_id)).length}</small></span>
                    <span className="form__option__ui"></span>
                  </label>
                );
              })}
            </div> : '' }
          </div>
        </aside>
    );
  }
});

module.exports = TicketFilters;
