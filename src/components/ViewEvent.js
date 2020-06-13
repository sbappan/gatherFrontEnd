import React, { Component } from 'react';

class ViewEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: {},
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const eventId = match.params._id;
      const res = await fetch(`${process.env.REACT_APP_API_LINK}/events/${eventId}`);
      const event = await res.json();
      this.setState({ event });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  render() {
    const { event } = this.state;

    return (
      <div>
        <h2>{event.name}</h2>
        <p>{event.description}</p>
        <p>{event.date}</p>
        <p>{event.group}</p>

        <div>
          <h4>Location</h4>

          {event.location && event.location.line1 && event.location.city
          && event.location.postalCode && event.location.province && (
          <p>
            {`${event.location.line1}, ${event.location.city}, ${event.location.postalCode}, ${event.location.province}`}
          </p>
          )}
        </div>


        <div>
          <h4>Status</h4>
          <p>
            {'Flagged: '}
            <span>{event.status && (event.status.isFlagged ? 'Yes' : 'No')}</span>
          </p>
          {event.status && event.status.isFlagged && (
          <p>
            {`Reason: ${event.status.reason}`}
          </p>
          )}
        </div>


        <div>
          <h4>Attendees</h4>
          {event.attendees && event.attendees.map((attendee) => (
            <p>
              <p>
                {`${attendee}`}
              </p>
            </p>
          ))}
        </div>

      </div>
    );
  }
}

export default ViewEvent;
