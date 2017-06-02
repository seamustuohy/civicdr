/*
 * View to render all tickets
 */

'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

// Components
import TicketFilters from '../components/ticket-filters';
import TicketList from '../components/ticket-list';
import ListActions from '../components/list-actions';
import downloadObject from '../utils/download-object';

import {
  fetchTickets,
  getTickets,
  deleteTickets,
  assignStatusToTickets
} from '../actions';

// Site homepage, a view that lists all tickets
// For the admin it shows all tickets in the system
// For an IP or SP, it shows all assigned tickets
export class Tickets extends React.Component {
  componentWillMount () {
    this.props.dispatch(fetchTickets());
  }

  filterTicket (ticket) {
    const { filters } = this.props;
    // returns list of all filters
    return Object.keys(filters).every(key => {
      if (!filters[key].length) return true;
      // returns tickets with key values that match the filter key values
      // switch based on key type
      switch (key) {
        case 'grouping':
          return filters[key].some(f => ticket.groupings.map(g => g.grouping_id).includes(f));
        case 'incident_type':
          return filters[key].some(f => ticket.incident_type.includes(f));
        default:
          return filters[key].includes(ticket[key]);
      }
    });
  }

  render () {
    const { tickets, filters, dispatch } = this.props;
    // filtering all tickets
    const ticketsToDisplay = tickets.filter(this.filterTicket.bind(this));
    const checked = tickets.filter(t => t.checked);
    return (
      <section className="section">
        <div className="dashboard">
          <header className="inpage__header">
            <div className="inner">
              <div className="inpage__headline">
                <h1 className="">CiviCDR Ticket Tracking</h1>
              </div>
              <div className="inpage__stats">
                <ul className="inpage__stats-list">
                  <li className="inpage__stats-item">
                    new or updated tickets<small className="totals">{tickets.filter(t => t.notify).length}</small>
                  </li>
                </ul>
              </div>
            </div>
          </header>
          <div className="inner">
            <div className="inpage__body">
              <TicketFilters dispatch={dispatch} filters={filters} tickets={tickets} roles={this.props.roles}/>
              <div className="inpage__content">
                <ListActions
                  elementName='Tickets'
                  elements={tickets}
                  isChecked={Boolean(tickets.length && tickets.every(t => t.checked))}
                  onCheck={() => {
                    const allChecked = tickets.every(t => t.checked);
                    this.props.dispatch(getTickets(tickets.map(t => Object.assign({}, t, { checked: !allChecked }))));
                  }}
                  onMarkStatus={(status, tickets) => this.props.dispatch(assignStatusToTickets(status, tickets.map(t => t.id)))}
                  onDownload={() => downloadObject(checked.map(t => _.omit(t, 'checked')), 'Tickets')}
                  onDelete={() => this.props.dispatch(deleteTickets(checked.map(t => t.id)))}
                  roles={this.props.roles}
                />
                <TicketList
                  tickets={ticketsToDisplay}
                  roles={this.props.roles}
                  onCheck={(id, checked) => {
                    this.props.dispatch(getTickets(tickets.map(t => {
                      if (t.id === id) { t.checked = checked; }
                      return t;
                    })));
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

Tickets.propTypes = {
  dispatch: T.func,
  tickets: T.array,
  filters: T.object,
  roles: T.array
};

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const mapStateToProps = state => {
  return {
    tickets: state.tickets.tickets || [],
    filters: state.tickets.filters,
    roles: state.auth.roles
  };
};

export default connect(mapStateToProps)(Tickets);
