import React, { Component } from 'react';
import { getOneItem, getAllItemsAsObject } from '../Helpers';
import { LinkButtonAdmin } from './Buttons';

class ViewEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: {},
      group: {},
      usersObj: {},
    };
  }

  async componentDidMount() {
    try {
      const { match: { params: { _id: eventId } } } = this.props;
      const event = await getOneItem('events', eventId);
      const group = await getOneItem('groups', event.group);
      const usersObj = await getAllItemsAsObject('users');
      this.setState({ event, group, usersObj });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  render() {
    const { event, group, usersObj } = this.state;
    return (
      <div>
        <LinkButtonAdmin className="success" text="Back to events" collection="events" />
        <h2>{event.name}</h2>
        <p><b>Group Name:</b></p>
        <p>{group.name}</p>
        <p><b>Description:</b></p>
        <p>{event.description}</p>
        <div>
          <div>
            <p>
              <b>Status:  </b>
              <span>{event.status && (event.status.isFlagged ? 'Flagged' : 'Not flagged')}</span>
            </p>
            {event.status && event.status.isFlagged && (
              <p>
                <b>Reason:</b>
                {`  ${event.status.reason}`}
              </p>
            )}
          </div>

        </div>
        <div>
          <p><b>Attendees:</b></p>
          {event.attendees && event.attendees.map((attendee) => (
            <p key={attendee}>
              {`${usersObj[attendee].fname} ${usersObj[attendee].lname} `}
            </p>
          ))}
        </div>

        <div>
          <p><b>Date:</b></p>
          <p>{new Date(event.date).toLocaleString('en-CA', { timeZone: 'UTC' })}</p>

          <p><b>Location:</b></p>
          <div>
            {event.location && (
              <p>
                {`${event.location.line1}`}
                {', '}
                {(event.location.line2 != null ? <p>{`${event.location.line2}`}</p> : '')}
                {`${event.location.city}`}
                {', '}
                {`${event.location.province}`}
                {', '}
                {`${event.location.postalCode}`}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ViewEvent;
