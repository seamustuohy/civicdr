'use strict';
import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';

// Constants
import { ticketStatusLUT } from '../constants';

// Utils
import { formatDate, formatTicketTitle } from '../utils/format';

export class Ticket extends React.Component {
  constructor (props) {
    super(props);
    this.handleCheck = this.handleCheck.bind(this);
  }

  handleCheck (e) {
    const ticketID = e.target.value;
    const checked = e.target.checked;
    this.props.onCheck(ticketID, checked);
  }

  render () {
    const ticket = this.props.ticket;
    const ticketId = ticket.id || ticket.ticket_id;
    let roles = this.props.roles;
    let isAdmin = _.includes(roles, 'admin');

    return (
      <article className={`card card--${ticket.status}`}>
        <label className='form__option form__option--custom-checkbox'>
          <input type='checkbox' checked={ticket.checked === true} name='form-checkbox' id={'checkbox' + (ticketId)} value={ticketId} onChange={this.handleCheck} />
          <span className='form__option__ui'></span>
        </label>
        <Link to={`/tickets/${ticketId}`} className={'card__content' + (ticket.notify ? ` card__content--${ticket.status}` : '')}>
          <div className='card__body'>
            <h1 className='card__title heading--small'>Ticket {formatTicketTitle(ticketId)}</h1>
            <p className='card__description'>created on {formatDate(ticket.created_at)} by {ticket.created_by}</p>
          </div>
          <div className='card__meta'>
            <h2 className='card__status heading--xsmall'>{ticketStatusLUT[ticket.status]}</h2>
            <p className='card__updated'>Last Updated on {formatDate(ticket.updated_at)}</p>
          </div>
        </Link>
       { isAdmin ? <footer className='card__footer'>
          {ticket.groupings && ticket.groupings.length
            ? ticket.groupings.map((grouping, i) => {
              return (
                <Link to={`/groupings/${grouping.id || grouping.grouping_id}`}
                  className='button button--grouping-tag button--small'
                  key={'grouping-badge-' + i}>{grouping.title}
                </Link>
              );
            })
            : ''}
        </footer> : ''}
      </article>
    );
  }
}

Ticket.propTypes = {
  ticket: T.object,
  onCheck: T.func,
  roles: T.array
};

export default Ticket;
