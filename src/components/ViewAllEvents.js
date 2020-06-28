import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FlagItemRowButtons, FilterItemsButtons } from './Buttons';
import { createOrUpdateItem, getAllItems } from '../Helpers';

export default class ViewAllEvents extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      allEvents: [],
      activeFilter: 'All',
      groups: [],
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  async componentDidMount() {
    try {
      const events = await getAllItems('events');
      const groups = await getAllItems('groups');
      this.setState({
        events, allEvents: events, groups,
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
      events, allEvents, activeFilter, groups,
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
          {groups.map((group) => events.map((event) => (
            <EventRow key={event._id} event={event} handleClick={this.handleClick} group={group} />
          )))}
          {events.length === 0 && <p>No events found. </p>}
        </div>
      </div>
    );
  }
}

function EventRow({ event, handleClick, group }) {
  const rowHeight = { height: '5rem' };
  return (
    <div>
      {event.group === group._id && (
        <tr style={rowHeight}>
          <td style={{ width: '15rem', paddingRight: '10px' }}>
            <Link to={`/admin/events/${event._id}`}>
              {event.name}
            </Link>
          </td>
          <td style={{ width: '14rem' }}>
            {group.name}
          </td>
          <td>
            <FlagItemRowButtons item={event} collection="events" handleClick={handleClick} />
          </td>
          <td style={{ width: '10rem' }}>
            {event.status.isFlagged && (
            <div className="overflowEllipsis">
              {event.status.reason}
            </div>
            )}
          </td>
        </tr>
      )}
    </div>
  );
}
