import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FlagItemRowButtons, FilterItemsButtons } from './Buttons';
import { createUpdateItem } from '../Helpers';

export default class ViewAllEvents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      allEvents: [],
      activeFilter: 'All',
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  async componentDidMount() {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_LINK}/events`);
      const events = await res.json();
      this.setState({ events, allEvents: events });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  async handleClick(eventId) {
    const { activeFilter } = this.state;
    const bodyData = {
      status: {
        isFlagged: false,
        reason: '',
      },
    };

    const updatedData = await createUpdateItem('PUT', 'events', eventId, bodyData);
    if (updatedData.length > 0) {
      this.setState({ allEvents: updatedData });
      this.handleFilter(activeFilter);
    }
  }

  handleFilter(text) {
    const { allEvents } = this.state;
    if (text === 'All') {
      this.setState({ events: allEvents, activeFilter: text });
    } else {
      const condition = text === 'Flagged';
      const filteredEvents = allEvents.filter((event) => event.status.isFlagged === condition);
      this.setState({ events: filteredEvents, activeFilter: text });
    }
  }

  render() {
    const { events, allEvents, activeFilter } = this.state;

    if (allEvents.length === 0) {
      return <h3>Loading....</h3>;
    }

    return (
      <div className="allItemsList">
        <div>
          <h2>Events</h2>
          <FilterItemsButtons handleFilter={this.handleFilter} activeFilter={activeFilter} />
          {(events.some((event) => event.status.isFlagged)) && <h4>Reason for flagging </h4>}
        </div>
        <div>
          {events.map((event) => (
            <EventRow key={event._id} event={event} handleClick={this.handleClick} />
          ))}
          {events.length === 0 && <p>No events found. </p>}
        </div>
      </div>
    );
  }
}

function EventRow({ event, handleClick }) {
  return (
    <div>
      <div>
        <Link to={`/events/${event._id}`} style={{ width: '300px' }}>
          {event.name}
        </Link>
        <FlagItemRowButtons item={event} collection="events" handleClick={handleClick} />
      </div>
      <div>
        {event.status.isFlagged && (
        <div className="overflowEllipsis">
          {event.status.reason}
        </div>
        )}
      </div>
    </div>
  );
}
