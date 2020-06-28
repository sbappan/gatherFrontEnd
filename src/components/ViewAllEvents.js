import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FlagItemRowButtons, FilterItemsButtons } from './Buttons';
import { createOrUpdateItem, getAllItems, getAllItemsAsObject } from '../Helpers';

export default class ViewAllEvents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      allEvents: [],
      activeFilter: 'All',
      groupsObj: {},
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  async componentDidMount() {
    try {
      const events = await getAllItems('events');
      const groupsObj = await getAllItemsAsObject('groups');
      this.setState({
        events, allEvents: events, groupsObj,
      });
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

    const updatedData = await createOrUpdateItem('PUT', 'events', bodyData, eventId);
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
    const {
      events, allEvents, activeFilter, groupsObj,
    } = this.state;

    if (allEvents.length === 0) {
      return <h3>Loading....</h3>;
    }

    return (
      <div className="allItemsList">
        <div style={{ paddingBottom: '10px' }}>
          <h2>Events</h2>
          <h2>Group</h2>
          <FilterItemsButtons handleFilter={this.handleFilter} activeFilter={activeFilter} />
          {(events.some((event) => event.status.isFlagged)) && <h4>Reason for flagging </h4>}
        </div>
        <div>
          {events.map((event) => (
            <EventRow
              key={event._id}
              event={event}
              handleClick={this.handleClick}
              groupsObj={groupsObj}
            />
          ))}
          {events.length === 0 && <p>No events found. </p>}
        </div>
      </div>
    );
  }
}

function EventRow({ event, handleClick, groupsObj }) {
  const rowHeight = { height: '5rem' };
  return (
    <div style={rowHeight}>
      <div style={{ width: '15rem', paddingRight: '10px' }}>
        <Link to={`/admin/events/${event._id}`}>
          {event.name}
        </Link>
      </div>
      <div style={{ width: '14rem' }}>
        {groupsObj[event.group].name}
      </div>
      <div>
        <FlagItemRowButtons item={event} collection="events" handleClick={handleClick} />
      </div>
      <div style={{ width: '10rem' }}>
        {event.status.isFlagged && (
        <div className="overflowEllipsis">
          {event.status.reason}
        </div>
        )}
      </div>
    </div>
  );
}
