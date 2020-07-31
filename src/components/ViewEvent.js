import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOneItem, getAllItemsAsObject } from '../Helpers';
import { LinkButtonAdmin } from './Buttons';

const ViewEvent = () => {
  const [event, setEvent] = useState({});
  const [group, setGroup] = useState({});
  const [usersObj, setUsersObj] = useState({});
  const { _id: eventId } = useParams();

  useEffect(() => {
    const getData = async () => {
      const eventPromise = getOneItem('events', eventId);
      const usersObjPromise = getAllItemsAsObject('users');
      const [eventData, usersObjData] = await Promise.all([eventPromise,
        usersObjPromise]);

      setEvent(eventData);
      setUsersObj(usersObjData);

      if (event.group) {
        const groupData = await getOneItem('groups', event.group);
        setGroup(groupData);
      }
    };
    getData();
  }, [eventId, event.group]);

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
            {usersObj[attendee] && `${usersObj[attendee].fname} ${usersObj[attendee].lname} `}
          </p>
        ))}
      </div>

      <div>
        <p><b>Date and Time:</b></p>
        <p>{new Date(event.date).toLocaleString('en-CA', { timeZone: 'UTC' })}</p>

        <p><b>Location:</b></p>
        <div>
          {event.location && (
          <p>
            {`${event.location.line1}`}
            {', '}
            {(event.location.line2 != null ? <span>{`${event.location.line2}`}</span> : '')}
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
};

export default ViewEvent;
