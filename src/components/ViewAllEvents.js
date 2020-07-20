import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FlagItemRowButtons, FilterItemsButtons } from './Buttons';
import {
  createOrUpdateItem, getAllItems, getAllItemsAsObject, updateAllItemsArray,
} from '../Helpers';
import { AuthContext } from '../context/AuthContext';

const ViewAllEvents = () => {
  const authContext = useContext(AuthContext);
  const { authState } = authContext;
  const [events, setEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [groupsObj, setGroupsObj] = useState({});
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const getData = async () => {
      const eventsData = await getAllItems('events');
      const groupsObjData = await getAllItemsAsObject('groups');
      setEvents(eventsData);
      setAllEvents(eventsData);
      setGroupsObj(groupsObjData);
    };
    getData();
  }, []);

  useEffect(() => {
    let filteredEvents = [];
    if (activeFilter === 'All') {
      filteredEvents = allEvents;
    } else {
      const condition = activeFilter === 'Flagged';
      filteredEvents = allEvents.filter((event) => event.status.isFlagged === condition);
    }
    setEvents(filteredEvents);
  }, [activeFilter, allEvents]);

  const handleFilter = (text) => {
    setActiveFilter(text);
  };

  const handleClick = async (eventId) => {
    const bodyData = {
      status: {
        isFlagged: false,
        reason: '',
        updatedBy: authState.userInfo._id,
      },
    };

    const updatedData = await createOrUpdateItem('PUT', 'events', bodyData, eventId);

    if (updatedData._id) {
      setAllEvents(updateAllItemsArray(allEvents, updatedData));
      handleFilter(activeFilter);
    }
  };

  if (allEvents.length === 0) {
    return <h3>Loading....</h3>;
  }

  return (
    <div className="allItemsList">
      <div style={{ paddingBottom: '10px' }}>
        <h2>Events</h2>
        <h2>Group</h2>
        <FilterItemsButtons handleFilter={handleFilter} activeFilter={activeFilter} />
        {(events.some((event) => event.status.isFlagged)) && <h4>Reason for flagging </h4>}
      </div>
      <div>
        {events.map((event) => (
          <EventRow
            key={event._id}
            event={event}
            handleClick={handleClick}
            groupsObj={groupsObj}
          />
        ))}
        {events.length === 0 && <p>No events found. </p>}
      </div>
    </div>
  );
};

function EventRow({ event, handleClick, groupsObj }) {
  const rowHeight = { height: '5rem' };
  return (
    <div style={rowHeight}>
      <div style={{ width: '20rem', paddingRight: '10px' }}>
        <Link to={`/admin/events/${event._id}`}>
          {event.name}
        </Link>
      </div>
      <div style={{ width: '15rem' }}>
        <Link to={`/admin/groups/${event.group}`}>
          {groupsObj[event.group] && groupsObj[event.group].name}
        </Link>
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

export default ViewAllEvents;
