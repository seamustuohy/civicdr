'use strict';

import React from 'react';
import { formatDate, formatTime } from '../utils/format';
import _ from 'lodash';

class Threads extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      visibleThread: props.threads.length === 1 ? props.threads[0].type : 'note'
    };
  }

  componentWillReceiveProps (newProps) {
    // Handle IP and SP users, who will only have one thread
    if (this.props.threads.length === 0 && newProps.threads.length === 1) {
      this.setState({ visibleThread: newProps.threads[0].type });
    }
  }

  render () {
    // These will not exist for users who aren't authorized to view them
    const note = this.props.threads.find(t => t.type === 'note');
    const ipThread = this.props.threads.find(t => t.type === 'ip');
    const spThread = this.props.threads.find(t => t.type === 'sp' && t.status === 'active');

    const visibleThread = this.props.threads
      .find(t => t.type === this.state.visibleThread && (t.type !== 'sp' || t.status === 'active'));

    const isAdmin = _.includes(this.props.roles, 'admin');

    return (
      <section className='threads__container'>
        <ul className='threads__nav'>
          {note ? <li className={'threads__item' + (this.state.visibleThread === 'note' ? ' threads__item--active' : '')}><a className='link--deco' onClick={() => this.setState({visibleThread: 'note'})}>Notes</a></li> : ''}
          {ipThread ? <li className={'threads__item' + (this.state.visibleThread === 'ip' ? ' threads__item--active' : '')}><a className='link--deco' onClick={() => this.setState({visibleThread: 'ip'})}>{isAdmin ? 'IP Thread' : 'Comments to CiviCDR'}</a></li> : '' }
          {spThread ? <li className={'threads__item' + (this.state.visibleThread === 'sp' ? ' threads__item--active' : '')}><a className='link--deco' onClick={() => this.setState({visibleThread: 'sp'})}>{isAdmin ? 'SP Thread' : 'Comments to CiviCDR'}</a></li> : '' }
        </ul>

        {visibleThread
          ? <div>
            {visibleThread.messages.map(m => {
              const sender = m.created_by ? this.state.visibleThread : 'admin';
              const isYou = this.props.roles.some(r => r.toLowerCase() === sender);
              const senderName = isYou ? 'you'
                : sender === 'admin' ? 'Admin'
                : this.props[`${this.state.visibleThread}Name`];

              return (
                <div className='comms__container' key={m.id}>
                  <header className='comms__header'>
                    <p className='comms__title'> Comment by {senderName} on <span className='notes__date'>{formatDate(m.updated_at || m.created_at)}<small className='timestamp'>{formatTime(m.updated_at || m.created_at)}</small></span></p>
                    {isAdmin || isYou ? <a className='comms__delete link--secondary' onClick={() => this.props.delete(m.id)}>Delete</a> : ''}
                  </header>
                  <div className='comms__body'>
                    <p className='comms__prose'>{m.content}</p>
                  </div>
                </div>
              );
            })}

            <div className='add__thread-content'>
         <textarea
           ref={newMessageField => { this.newMessageField = newMessageField; }}
           className="form__control add"
           id="form-textarea-1"
           rows="4"
         >
         </textarea>
            <button
             className='button button--large button--base'
             onClick={() => {
               this.props.create(visibleThread.id, this.newMessageField.value);
               this.newMessageField.value = '';
             }
                     }>Comment</button>
            </div>
          </div>
          : ''
        }
      </section>
    );
  }
}

Threads.propTypes = {
  threads: React.PropTypes.array,
  ipName: React.PropTypes.string,
  spName: React.PropTypes.string,
  roles: React.PropTypes.array,
  delete: React.PropTypes.func,
  create: React.PropTypes.func
};

module.exports = Threads;
