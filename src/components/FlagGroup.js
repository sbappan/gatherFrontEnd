import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { FlagItemButtons } from './Buttons';
import { createOrUpdateItem, getOneItem } from '../Helpers';
import { AuthContext } from '../context/AuthContext';

const FlagGroup = () => {
  const authContext = useContext(AuthContext);
  const { authState } = authContext;
  const { _id: groupId } = useParams();
  const [group, setGroup] = useState({});
  const [user, setUser] = useState({});
  const [reason, setReason] = useState('');
  const [isFlagged, setIsFlagged] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const groupData = await getOneItem('groups', groupId);
      setGroup(groupData);
      setReason(groupData.status.reason);
      setIsFlagged(groupData.status.isFlagged);
    };
    getData();
  }, [groupId]);

  useEffect(() => {
    const getUser = async () => {
      const userData = await getOneItem('users', group.status.updatedBy);
      setUser(userData);
    };

    if (group.status && group.status.updatedBy) {
      getUser();
    }
  }, [group.status]);

  const handleClick = async (gId, flag) => {
    const reasonText = flag ? reason.trim() : '';
    const bodyData = {
      status: {
        isFlagged: flag,
        reason: reasonText,
        updatedBy: authState.userInfo._id,
      },
    };

    if (reasonText !== group.status.reason) {
      if (reasonText || !flag) {
        const updatedData = await createOrUpdateItem('PUT', 'groups', bodyData, gId);
        if (!updatedData.errorMsg) {
          setReason(updatedData.status.reason);
          setIsFlagged(updatedData.status.isFlagged);
          setGroup(updatedData);
        }
      } else {
        setReason('');
      }
    }
  };

  return (
    <div className="flagItem">
      <h2>Flag Group</h2>
      <h3>Group Name:</h3>
      <p>{group.name}</p>
      <h3>Group Description:</h3>
      <p>{group.description}</p>
      <h3>Group status:</h3>
      <p>{isFlagged ? 'Flagged' : 'Not flagged'}</p>
      <h3>Last updated by:</h3>
      <p>{user._id && `${user.fname} ${user.lname}`}</p>
      <h3>Reason:</h3>
      <textarea
        name="reason"
        placeholder="Please enter the reason for flagging the group"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
      />
      <br />
      <br />
      <FlagItemButtons item={group} isFlagged={isFlagged} collection="groups" handleClick={handleClick} />
    </div>
  );
};

export default FlagGroup;
