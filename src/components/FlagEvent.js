import React, { Component } from 'react';
import { FlagItemButtons } from './Buttons';
import { createOrUpdateItem, getOneItem } from '../Helpers';

class FlagEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: {},
      reason: '',
      isFlagged: false,
      group: {},
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    try {
      const { match: { params: { _id: eventId } } } = this.props;
      const event = await getOneItem('events', eventId);
      const group = await getOneItem('groups', event.group);

      this.setState({
        event, reason: event.status.reason, isFlagged: event.status.isFlagged, group,
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  async handleClick(eventId, flag) {
    let { reason } = this.state;
    reason = flag ? reason : '';
    const bodyData = {
      status: {
        isFlagged: flag,
        reason,
      },
    };

    if (reason.trim() || !flag) {
      const updatedData = await createOrUpdateItem('PUT', 'events', bodyData, eventId);
      if (updatedData.length > 0) {
        this.setState(bodyData.status);
      }
    } else {
      this.setState({ reason: '' });
    }
  }

  render() {
    const {
      event, reason, isFlagged, group,
    } = this.state;

    return (
      <div className="flagItem">
        <h2>Flag Event</h2>
        <h3>Group:</h3>
        <p>{group.name}</p>
        <h3>Event Name:</h3>
        <p>{event.name}</p>
        <h3>Event Description:</h3>
        <p>{event.description}</p>
        <h3>Event status:</h3>
        <p>{isFlagged ? 'Flagged' : 'Not flagged'}</p>
        <h3>Reason:</h3>
        <textarea
          name="reason"
          placeholder="Please enter the reason for flagging the event"
          value={reason}
          onChange={this.handleChange}
          required
        />
        <br />
        <br />
        <FlagItemButtons item={event} isFlagged={isFlagged} collection="events" handleClick={this.handleClick} />
      </div>
    );
  }
}

export default FlagEvent;
