'use strict';

import React, { PropTypes as T } from 'react';
import _ from 'lodash';

// Components
import Ticket from '../components/ticket';

const PAGE_SIZE = 15;

export class TicketList extends React.Component {
  constructor (props) {
    super(props);
    this.state = {pageNum: 1};
  }

  render () {
    const pageIndex = this.state.pageNum - 1;
    const pagesTotal = Math.ceil(this.props.tickets.length / PAGE_SIZE);

    // First, sort by whether a ticket has notifications
    // Second, sort by datetime of update
    // Third, sort by ticket ID (mostly needed for seed data with same datetimes)
    // Last, apply pagination
    const toDisplay = _.orderBy(this.props.tickets, ['notify', 'updated_at', 'id'], ['desc', 'desc', 'asc'])
      .slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);

    return (
      <div>
        <div className="content__results">
          {toDisplay.map(ticket => (
            <Ticket
              ticket={ticket}
              key={ticket.id || ticket.ticket_id}
              onCheck={this.props.onCheck}
              roles={this.props.roles}
            />
          ))}
        </div>

        {pagesTotal > 1
          ? <div className='content__pagination-container'>
            <div className='content__pagination button--group button-group--horizontal'>
              <button className='button button--base button--previous' style={{ visibility: this.state.pageNum > 1 ? 'visible' : 'hidden' }} onClick={() => this.setState({pageNum: this.state.pageNum - 1})}>
              </button>
              {
                _.range(1, pagesTotal + 1).map(page => {
                  return (
                    <button
                      className={'button button--pagination' + (this.state.pageNum === page ? ' content__pagination--active' : '')}
                      onClick={() => this.setState({pageNum: page})}
                      key={page}
                    >
                      {page}
                    </button>
                  );
                })
              }
              {this.state.pageNum < pagesTotal
                ? <button className='button button--base button--next' onClick={() => this.setState({pageNum: this.state.pageNum + 1})}>
                </button>
                : ''
              }
            </div>
          </div>
          : ''
        }
      </div>
    );
  }
}

TicketList.propTypes = {
  tickets: T.array,
  onCheck: T.func,
  roles: T.array
};

export default TicketList;
