'use strict';
import React, {PropTypes as T} from 'react';
import {Link} from 'react-router';
import c from 'classnames';
import _ from 'lodash';

var PageHeader = React.createClass({
  displayName: 'PageHeader',

  propTypes: {
    className: T.string,
    roles: T.array,
    profile: T.object
  },

  getInitialState: function () {
    return {
      dataMenu: false
    };
  },

  documentListener: function (e) {
    if (e.preventClose !== true && this.state.dataMenu) {
      this.setState({dataMenu: false});
    }
  },

  dataMenuClick: function (e) {
    e.preventDefault();
    this.setState({dataMenu: !this.state.dataMenu});
  },

  onRootMenuClick: function (e) {
    document.documentElement.classList.remove('offcanvas-revealed');
  },

  offcanvasMenuClick: function (e) {
    e.preventDefault();
    document.documentElement.classList.toggle('offcanvas-revealed');
  },

  onNavDataClick: function (e) {
    // When clicking a nav block, add a property to the event indicating that
    // the block shouldn't be toggled on body click.
    e.preventClose = true;
  },

  componentDidMount: function () {
    document.addEventListener('click', this.documentListener);
    this.refs.navData.addEventListener('click', this.onNavDataClick);
  },

  componentWillUnmount: function () {
    document.removeEventListener('click', this.documentListener);
    this.refs.navData.removeEventListener('click', this.onNavDataClick);
  },

  render: function () {
    let roles = this.props.roles;
    let hasProfile = (this.props.profile !== null);
    let isAdmin = _.includes(roles, 'admin');
    let isIP = _.includes(roles, 'IP') && hasProfile;
    let isSP = _.includes(roles, 'SP') && hasProfile;
    return (
      <header className={c('page__header', this.props.className)} role="banner">
        <div className="inner">
          <div className="page__headline">
            <h1 className="page__title">
              <a href="/#/" title="Visit homepage">
                <img
                  src="/assets/graphics/layout/logo.svg"
                  alt="logotype"
                  height="65"
                />
              </a>
            </h1>
          </div>
          <nav className="page__prime-nav" role="navigation">
          <h2 className='page__prime-nav-title'><Link onClick={this.offcanvasMenuClick}></Link></h2>
            <div className='nav-block' id='nav-block-browse'>
              <ul className="browse-menu">
                {isAdmin
                  ? <li>
                      <Link
                        to="/partners"
                        title="Partners"
                        className="browse-menu__item"
                        activeClassName="browse-menu__item--active"
                      >
                        Partners
                      </Link>
                    </li>
                  : ''}
                {isAdmin
                  ? <li>
                      <Link
                        to="/service-providers"
                        title="Service Providers"
                        className="browse-menu__item"
                        activeClassName="browse-menu__item--active"
                      >
                        Providers
                      </Link>
                    </li>
                  : ''}
                {isAdmin
                  ? <li>
                      <Link
                        to="/groupings"
                        title="Groupings"
                        className="browse-menu__item"
                        activeClassName="browse-menu__item--active"
                      >
                        Groupings
                      </Link>
                    </li>
                  : ''}
                {isAdmin || isIP
                  ? <li>
                      <Link to="/tickets/new" className="browse-menu__item">
                        <button className="button button--base">
                          Create Ticket
                        </button>
                      </Link>
                    </li>
                  : ''}
                {' '}
                <li
                  className={c('browse-menu__item sub-nav-block-wrapper', {
                    'sub-revealed': this.state.dataMenu
                  })}
                  ref="navData"
                >
                  <a
                    href="#"
                    title="Show data sections"
                    className="browse-menu__item profile-nav"
                    onClick={this.dataMenuClick}
                  >
                    <span>Profile</span>
                  </a>
                  <div className="sub-nav-block" id="sub-nav-block-data">
                    <ul className="browse-menu browse-menu--sub">
                      {isIP || isSP
                        ? <li onClick={this.dataMenuClick}>
                            <Link
                              to={isIP ? `/partners/${this.props.profile.id}` : `/service-providers/${this.props.profile.id}`}
                              title="View Profile"
                              className="browse-menu__item"
                              activeClassName="browse-menu__item--active"
                            >
                              <span>View Profile</span>
                            </Link>
                          </li>
                        : ''}
                      <li>
                        <Link
                          to="/logout"
                          title="Logout"
                          className="browse-menu__item"
                          activeClassName="browse-menu__item--active"
                        >
                          <span>Logout</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    );
  }
});

module.exports = PageHeader;
