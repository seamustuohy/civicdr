'use strict';
import React, { PropTypes as T } from 'react';

import SPCard from '../components/service-provider-card';

var ProviderList = React.createClass({
  displayName: 'ProviderList',

  propTypes: {
    providers: T.array,
    getServiceProvider: T.func
  },

  render: function () {
    return (
      <div className='content__results'>
        {this.props.providers.map(provider => <SPCard key={provider.id} provider={provider} getServiceProvider={this.props.getServiceProvider}/>)}
      </div>
    );
  }
});

module.exports = ProviderList;
