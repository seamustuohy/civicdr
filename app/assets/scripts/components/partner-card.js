'use strict';
import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';
// import c from 'classnames';

var IPCard = React.createClass({

  propTypes: {
    partner: T.object,
    getImplementingPartner: T.func
  },

  render: function () {
    const { partner } = this.props;
    return (
      <article className='card service-provider-card'>
        <label className="form__option form__option--custom-checkbox">
          <input type="checkbox" name={`form-checkbox-${partner.id}`} id={`form-checkbox-${partner.id}`} checked={Boolean(partner.checked)} onClick={(e) => {
            this.props.getImplementingPartner(Object.assign({}, partner, { checked: !partner.checked }));
          }}/>
          <span className="form__option__ui"></span>
        </label>
        <Link to={`/partners/${partner.id}`} className='card__content'>
          <div className='card__body'>
            <h1 className='card__title heading--small'>{partner.name}</h1>
            <p className='card__description'>{partner.types_of_work.join(', ')}</p>
          </div>
          <div className='card__meta'>
            <p className='card__assigned'>{`Assigned to ${partner.ticket_count} tickets`}</p>
          </div>
        </Link>
      </article>
    );
  }
});

module.exports = IPCard;
