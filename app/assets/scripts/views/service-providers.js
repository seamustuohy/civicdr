/*
 * View to render list of SPs
 */

'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';

import ProviderList from '../components/service-providers-list';
import ProviderFilters from '../components/provider-filters';
import ListActions from '../components/list-actions';
import downloadObject from '../utils/download-object';

import {
  fetchServiceProviders,
  getServiceProvider,
  getServiceProviders,
  deleteServiceProviders
} from '../actions';

// List view of all Service Providers
var ServiceProviders = React.createClass({
  propTypes: {
    serviceProviders: T.array,
    dispatch: T.func,
    filters: T.object,
    roles: T.array
  },

  filterServiceProvider: function (sp) {
    const { filters } = this.props;
    // returns list of all filters
    return Object.keys(filters).every(key => {
      if (!filters[key].length) return true;
      // returns sp with key values that match the filter key values
      return (key === 'services')
      // return true for groupings if any grouping id is in the filters.grouping array
      ? filters[key].some(f => sp.services.includes(f))
      : filters[key].includes(sp[key]);
    });
  },

  componentDidMount: function () {
    this.props.dispatch(fetchServiceProviders());
  },

  render: function () {
    const { serviceProviders, filters, dispatch } = this.props;
    // filtering all tickets
    const spToDisplay = _.orderBy(
      serviceProviders.filter(this.filterServiceProvider),
      ['rating', 'name'],
      ['desc', 'asc']
    );
    const checked = serviceProviders.filter(sp => sp.checked);
    return (
      <div className='dashboard'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className=''>Service Providers</h1>
            </div>
            <div className='header__actions'>
              <Link to={'/service-providers/new'} className='button button--secondary-bounded'>Add Service Provider</Link>
            </div>
          </div>
        </header>
        <div className='inner'>
          <div className='inpage__body'>
            <ProviderFilters filters={filters} providers={serviceProviders} dispatch={dispatch}/>
            <div className='inpage__content'>
              <ListActions
                elementName='Service Providers'
                elements={spToDisplay}
                roles={this.props.roles}
                isChecked={Boolean(serviceProviders.length && serviceProviders.every(sp => sp.checked))}
                onCheck={() => {
                  const allChecked = serviceProviders.every(sp => sp.checked);
                  dispatch(getServiceProviders(serviceProviders.map(sp => Object.assign({}, sp, { checked: !allChecked }))));
                }}
                onDownload={() => downloadObject(checked.map(sp => _.omit(sp, 'checked')), 'Service Providers')}
                onDelete={() => dispatch(deleteServiceProviders(checked.map(sp => sp.id)))}
                />
              <ProviderList providers={spToDisplay} getServiceProvider={sp => dispatch(getServiceProvider(sp))}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

function selector (state) {
  return {
    serviceProviders: state.serviceProviders.list || [],
    filters: state.serviceProviders.filters,
    roles: state.auth.roles
  };
}

module.exports = connect(selector)(ServiceProviders);
