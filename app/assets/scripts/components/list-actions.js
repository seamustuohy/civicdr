'use strict';

import React, { PropTypes as T } from 'react';
import _ from 'lodash';
import { StatusDropdown } from './status-dropdown';
import DeleteModal from './delete-modal';

export class ListActions extends React.Component {
  constructor (props) {
    super(props);
    this.state = {isDeleteModalVisible: false};
  }

  render () {
    let roles = this.props.roles;
    let isAdmin = _.includes(roles, 'admin');
    const checked = this.props.elements.filter(e => e.checked);
    return (
      <div>
        <div style={{display: this.state.isDeleteModalVisible ? 'block' : 'none'}}>
          <DeleteModal
            onClose={() => this.setState({isDeleteModalVisible: false})}
            onSubmit={() => {
              this.props.onDelete();
              this.setState({isDeleteModalVisible: false});
            }}
          />
        </div>

        <div className='content__actions'>
          <div className='actions__display'>
            <h2 className='heading--xsmall'>Showing {this.props.elements.length} {this.props.elementName}</h2>
          </div>
          <div className='content__actions'>
            <div className='actions__updates'>
              <label className='form__option form__option--custom-checkbox'>
                {this.props.onCheck ? <input type='checkbox' checked={this.props.isChecked} name='form-checkbox' id='form-checkbox-1' value='Checkbox 1' onChange={this.props.onCheck} /> : ''}
                <span className='form__option__text'>Select All</span>
                <span className='form__option__ui'></span>
              </label>
              <ul className='actions__updates-selects'>
                {this.props.onMarkStatus && isAdmin ? <StatusDropdown onMarkStatus={this.props.onMarkStatus} checked={checked}/> : ''}
                {this.props.onDownloadContact ? <li className='actions__updates-item'><button className='button button--unbounded' onClick={this.props.onDownloadContact}>Download Contacts</button></li> : ''}
                {this.props.onDownload ? <li className='actions__updates-item'><button className='button button--unbounded' onClick={this.props.onDownload}>Download Data</button></li> : ''}
                {this.props.onDelete && isAdmin ? <li className='actions__updates-item'><button className='button button--unbounded' onClick={() => this.setState({isDeleteModalVisible: true})}>Delete</button></li> : ''}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ListActions.propTypes = {
  elementName: T.string,
  elements: T.array,
  isChecked: T.bool,
  onCheck: T.func,
  onMarkStatus: T.func,
  onDownload: T.func,
  onDownloadContact: T.func,
  onDelete: T.func,
  roles: T.array
};

export default ListActions;
