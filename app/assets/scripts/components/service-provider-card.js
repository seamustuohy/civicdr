'use strict';
import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';
import c from 'classnames';

var SPCard = React.createClass({
  displayName: 'SPCard',

  propTypes: {
    provider: T.object,
    getServiceProvider: T.func
  },

  render: function () {
    const { provider } = this.props;
    return (
      <article className='card service-provider-card'>
        <label className="form__option form__option--custom-checkbox">
          <input type="checkbox" name={`form-checkbox-${provider.id}`} id={`form-checkbox-${provider.id}`} checked={Boolean(provider.checked)} onChange={(e) => {
            this.props.getServiceProvider(Object.assign({}, provider, { checked: !provider.checked }));
          }}/>
          <span className="form__option__ui"></span>
        </label>
        <Link to={`/service-providers/${provider.id}`} className='card__content'>
          <div className='card__body'>
            <h1 className='card__title heading--small'>{provider.name}</h1>
            <p className='card__description'>{provider.services.join(', ')}</p>
          </div>
          <div className='card__meta'>
           <div className='rating__group'>
              <h2 className='card__rating heading--xsmall'>Rating</h2>
              <ul className='card__rating-list'>
                {Array(5).fill(0).map((_, index) => <li key={index} className={c('card__rating-item', {'rating-filled': provider.rating >= index + 1})} ></li>)}
              </ul>
            </div>
            <p className='card__assigned'>{`Assigned to ${provider.ticket_count} tickets`}</p>
          </div>
        </Link>
      </article>
    );
  }
});

module.exports = SPCard;
