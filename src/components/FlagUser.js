import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { FlagItemButtons } from './Buttons';
import { createOrUpdateItem, getOneItem } from '../Helpers';
import { AuthContext } from '../context/AuthContext';

const FlagUser = () => {
  const authContext = useContext(AuthContext);
  const { authState } = authContext;
  const { _id: userId } = useParams();
  const [user, setUser] = useState({});
  const [flagUser, setFlagUser] = useState({});
  const [reason, setReason] = useState('');
  const [isFlagged, setIsFlagged] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const userData = await getOneItem('users', userId);
      setUser(userData);
      setReason(userData.status.reason);
      setIsFlagged(userData.status.isFlagged);
    };
    getData();
  }, [userId]);

  useEffect(() => {
    const getUser = async () => {
      const userData = await getOneItem('users', user.status.updatedBy);
      setFlagUser(userData);
    };

    if (user.status && user.status.updatedBy) {
      getUser();
    }
  }, [user.status]);

  const handleClick = async (uId, flag) => {
    const reasonText = flag ? reason.trim() : '';
    const bodyData = {
      status: {
        isFlagged: flag,
        reason: reasonText,
        updatedBy: authState.userInfo._id,
      },
    };

    if (reasonText !== user.status.reason) {
      if (reasonText || !flag) {
        const updatedData = await createOrUpdateItem('PUT', 'users', bodyData, uId);
        if (!updatedData.errorMsg) {
          setReason(updatedData.status.reason);
          setIsFlagged(updatedData.status.isFlagged);
          setUser(updatedData);
        }
      } else {
        setReason('');
      }
    }
  };


  return (
    <div className="flagItem">
      <h2>Flag User</h2>
      <h3>UserName:</h3>
      <p>{user.userName}</p>
      <h3>Name</h3>
      <p>{`${user.fname} ${user.lname}`}</p>
      <h3>Email:</h3>
      <p>{user.email}</p>
      <h3>Status:</h3>
      <p>{isFlagged ? 'Flagged' : 'Not flagged'}</p>
      <h3>Last updated by:</h3>
      <p>{flagUser._id && `${flagUser.fname} ${flagUser.lname}`}</p>
      <h3>Reason:</h3>
      <textarea
        name="reason"
        placeholder="Please enter the reason for flagging this user"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        required
      />
      <br />
      <br />
      <FlagItemButtons item={user} isFlagged={isFlagged} collection="users" handleClick={handleClick} />
    </div>
  );
};

export default FlagUser;
