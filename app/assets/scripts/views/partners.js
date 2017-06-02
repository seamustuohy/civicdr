/*
 * View to render all IPs
 */

'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'lodash';

import PartnerList from '../components/partner-list';
import PartnerFilters from '../components/partner-filters';
import ListActions from '../components/list-actions';
import downloadObject from '../utils/download-object';

import {
  fetchImplementingPartners,
  getImplementingPartner,
  getImplementingPartners,
  deleteImplementingPartners
} from '../actions';

const contactDownloadFields = [
  'name',
  'contact',
  'secure_channels',
  'notification_prefs',
  'notification_languages',
  'pgp_key'
];

// A view that lists all Implementing Partners
var Partners = React.createClass({
  propTypes: {
    implementingPartners: T.array,
    dispatch: T.func,
    filters: T.object,
    roles: T.array
  },

  filterPartner: function (ip) {
    const { filters } = this.props;
    // returns list of all filters
    return Object.keys(filters).every(key => {
      if (!filters[key].length) return true;
      // returns ip with key values that match the filter key values
      if (key === 'notification_prefs') {
        return filters[key].some(f => ip.notification_prefs.includes(f));
      } else if (key === 'notification_languages') {
        return filters[key].some(f => ip.notification_languages.includes(f));
      } else {
        return filters[key].includes(ip[key]);
      }
    });
  },

  componentDidMount: function () {
    this.props.dispatch(fetchImplementingPartners());
  },

  render: function () {
    const { implementingPartners, filters, dispatch } = this.props;
    // filtering all tickets
    const ipToDisplay = implementingPartners.filter(this.filterPartner);
    const checked = implementingPartners.filter(ip => ip.checked);
    return (
      <div className='dashboard'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <h1 className=''>Implementing Partners</h1>
            </div>
            <div className='header__actions'>
              <Link to={'/partners/new'} className='button button--secondary-bounded'>Add Implementing Partner</Link>
            </div>
          </div>
        </header>
        <div className='inner'>
          <div className='inpage__body'>
            <PartnerFilters filters={filters} partners={implementingPartners} dispatch={dispatch}/>
            <div className='inpage__content'>
              <ListActions
                elementName='Implementing Partners'
                elements={ipToDisplay}
                roles={this.props.roles}
                isChecked={Boolean(implementingPartners.length && implementingPartners.every(ip => ip.checked))}
                onCheck={() => {
                  const allChecked = implementingPartners.every(ip => ip.checked);
                  dispatch(getImplementingPartners(implementingPartners.map(ip => Object.assign({}, ip, { checked: !allChecked }))));
                }}
                onDownload={() => downloadObject(checked.map(ip => _.omit(ip, 'checked')), 'Implementing Partners')}
                onDownloadContact={() => downloadObject(checked.map(ip => _.pick(ip, contactDownloadFields)), 'Implementing Partners Contacts')}
                onDelete={() => dispatch(deleteImplementingPartners(checked.map(ip => ip.id)))}
                />
              <PartnerList partners={ipToDisplay} getImplementingPartner={ ip => dispatch(getImplementingPartner(ip))}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

function selector (state) {
  return {
    implementingPartners: state.implementingPartners.list || [],
    filters: state.implementingPartners.filters,
    roles: state.auth.roles
  };
}

module.exports = connect(selector)(Partners);
