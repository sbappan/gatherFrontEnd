import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { LinkButtonAdmin } from './Buttons';
import ViewProfile from './ViewProfile';
import Emoji from './Emoji';
import { getOneItem } from '../Helpers';

const ViewUser = () => {
  const [user, setUser] = useState({});
  const { _id: userId } = useParams();

  useEffect(() => {
    const getData = async () => {
      const userData = await getOneItem('users', userId);
      setUser(userData);
    };
    getData();
  }, [userId]);


  if (Object.keys(user).length === 0) {
    return <h3>Loading...</h3>;
  }

  return (
    <div>
      <LinkButtonAdmin className="success" text="Back to Users" collection="users" />
      <ViewProfile itemId={user._id} />
      {user.status && (
      <p>
        <b>Status: </b>
        {user.status.isFlagged ? 'Flagged' : 'Not flagged'}
      </p>
      )}
      {user.status && user.status.isFlagged && (
      <p>
        <b>Reason: </b>
        {user.status.reason}
      </p>
      )}
      {user.emailUpdates && (
        <>
          <p>
            <b>Message Updates: </b>
            <EmailUpdateStatus status={user.emailUpdates.messageUpdates} />
          </p>
          <p>
            <b>New Group Updates: </b>
            <EmailUpdateStatus status={user.emailUpdates.newGroupUpdates} />
          </p>
          <p>
            <b>New Event Updates: </b>
            <EmailUpdateStatus status={user.emailUpdates.newEventUpdates} />
          </p>
          <p>
            <b>Reply Updates: </b>
            <EmailUpdateStatus status={user.emailUpdates.replyUpdates} />
          </p>
        </>
      )}
    </div>
  );
};


function EmailUpdateStatus({ status }) {
  return status ? <Emoji symbol="&#x2705;" label="On" /> : <Emoji symbol="&#x274C;" label="Off" />;
}

export default ViewUser;
