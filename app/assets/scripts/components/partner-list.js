'use strict';
import React, { PropTypes as T } from 'react';

import IPCard from '../components/partner-card';

var PartnerList = React.createClass({

  propTypes: {
    partners: T.array,
    getImplementingPartner: T.func
  },

  render: function () {
    return (
      <div className='content__results'>
        {this.props.partners.map(partner => <IPCard key={partner.id} partner={partner} getImplementingPartner={this.props.getImplementingPartner}/>)}
      </div>
    );
  }
});

module.exports = PartnerList;
