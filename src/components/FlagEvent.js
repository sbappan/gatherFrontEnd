import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { FlagItemButtons } from './Buttons';
import { createOrUpdateItem, getOneItem } from '../Helpers';
import { AuthContext } from '../context/AuthContext';

const FlagEvent = () => {
  const authContext = useContext(AuthContext);
  const { authState } = authContext;
  const { _id: eventId } = useParams();
  const [event, setEvent] = useState({});
  const [group, setGroup] = useState({});
  const [user, setUser] = useState({});
  const [reason, setReason] = useState('');
  const [isFlagged, setIsFlagged] = useState(false);

  useEffect(() => {
    const getEvent = async () => {
      const eventData = await getOneItem('events', eventId);
      setEvent(eventData);
      setReason(eventData.status.reason);
      setIsFlagged(eventData.status.isFlagged);
    };
    getEvent();
  }, [eventId]);

  useEffect(() => {
    const getGroup = async () => {
      const groupData = await getOneItem('groups', event.group);
      setGroup(groupData);
    };
    if (event.group) {
      getGroup();
    }
  }, [event.group]);

  useEffect(() => {
    const getUser = async () => {
      const userData = await getOneItem('users', event.status.updatedBy);
      setUser(userData);
    };

    if (event.status && event.status.updatedBy) {
      getUser();
    }
  }, [event.status]);

  const handleClick = async (eId, flag) => {
    const reasonText = flag ? reason.trim() : '';
    const bodyData = {
      status: {
        isFlagged: flag,
        reason: reasonText,
        updatedBy: authState.userInfo._id,
      },
    };

    if (reasonText !== event.status.reason) {
      if (reasonText || !flag) {
        const updatedData = await createOrUpdateItem('PUT', 'events', bodyData, eId);

        if (!updatedData.errorMsg) {
          setReason(updatedData.status.reason);
          setIsFlagged(updatedData.status.isFlagged);
          setEvent(updatedData);
        }
      } else {
        setReason('');
      }
    }
  };

  return (
    <div className="flagItem">
      <h2>Flag Event</h2>
      <h3>Event Name:</h3>
      <p>{event.name}</p>
      <h3>Group:</h3>
      <p>{group.name}</p>
      <h3>Event Description:</h3>
      <p>{event.description}</p>
      <h3>Event status:</h3>
      <p>{isFlagged ? 'Flagged' : 'Not flagged'}</p>
      <h3>Last updated by:</h3>
      <p>{user._id && `${user.fname} ${user.lname}`}</p>
      <h3>Reason:</h3>
      <textarea
        name="reason"
        placeholder="Please enter the reason for flagging the event"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
      />
      <br />
      <br />
      <FlagItemButtons item={event} isFlagged={isFlagged} collection="events" handleClick={handleClick} />
    </div>
  );
};

export default FlagEvent;
