import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { getAllItemsAsObject, getOneItem } from '../Helpers';


class ViewEventDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: {},
      usersObj: [],
      group: {},

    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const eventId = match.params._id;
      const event = await getOneItem('events', eventId);
      const group = await getOneItem('groups', event.group);
      const usersObj = await getAllItemsAsObject('users');
      this.setState({ event, usersObj, group });
    } catch (error) {
      //
    }
  }

  render() {
    const { event, usersObj, group } = this.state;
    return (
      <div>
        <h1><strong>{event.name}</strong></h1>
        <h3>
          Associated Group:
          {' '}
          <Link to={`../groups/${group._id}`}>{group.name}</Link>

        </h3>
        <p>{event.description}</p>
        <h3>Attendees</h3>
        <div>
          {event.attendees && event.attendees.map((attendee) => (
            <p key={attendee}>
              <Link to={`../users/${attendee}`}>
                {`${usersObj[attendee].fname} ${usersObj[attendee].lname} `}
              </Link>
            </p>
          ))}
        </div>
        <p>
          Being held at:
          {' '}
          {event.location && event.location.line1}
          {', '}
          {event.location && event.location.line2}
          {' '}
          {event.location && event.location.city}
          {', '}
          {event.location && event.location.province}
          {', '}
          {event.location && event.location.postalCode}
          {' on '}
          {moment(event.date).format('LLL')}
        </p>
      </div>
    );
  }
}


export default ViewEventDetails;
