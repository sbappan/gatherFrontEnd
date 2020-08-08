import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router';
import moment from 'moment';
import { AuthContext } from '../context/AuthContext';
import {
  getOneItem,
  getAllItemsAsObject,
  createOrUpdateItem,
} from '../Helpers';

const GroupChat = () => {
  const [chatMessage, setChatMessage] = useState('');
  const { _id: groupId } = useParams();
  const [group, setGroup] = useState({});
  const [usersObj, setUsersObj] = useState({});
  const authContext = useContext(AuthContext);
  const { authState: { userInfo } } = authContext;

  useEffect(() => {
    const getData = async () => {
      const groupPromise = getOneItem('groups', groupId);
      const usersObjPromise = getAllItemsAsObject('users');

      const [groupData, usersObjData] = await Promise.all([groupPromise,
        usersObjPromise]);

      setGroup(groupData);
      setUsersObj(usersObjData);
    };

    getData();
  }, [groupId]);


  useEffect(() => {
    const timer = setInterval(() => {
      const getData = async () => {
        const groupData = await getOneItem('groups', groupId);
        setGroup(groupData);
      };

      getData();
    }, 2000);
    return () => clearTimeout(timer);
  }, [groupId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      const newChat = {
        message: chatMessage,
        createdBy: userInfo._id,
      };
      const newChatArr = [...group.chat, newChat];
      const bodyData = {
        chat: newChatArr,
      };

      const updatedData = await createOrUpdateItem('PUT', 'groups', bodyData, groupId);
      if (updatedData._id) {
        setGroup(updatedData);
        setChatMessage('');
      } else {
        // console.log('updatedData', updatedData);
      }
    }
  };

  return (
    <>
      <h2>Group Chat</h2>
      <div className="chatContainer">
        {group && group.chat && group.chat.map((chat, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index}>
            <div className="chatLine">
              <div className="senderName">
                <h4>{usersObj && usersObj[chat.createdBy] && usersObj[chat.createdBy].userName}</h4>
              </div>
              <div className="chatMessage">
                <p>
                  {chat.message}
                  <span style={{ fontSize: '.65rem', color: '#909090' }}>
                    &nbsp;&nbsp;&nbsp;
                    {moment(chat.date).toNow(true)}
                    {' '}
                    ago
                  </span>

                </p>

              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="chatInput">
        <div className="senderName">
          <p>{userInfo.userName}</p>
        </div>
        <div className="inputMessage">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="chatMessage"
              placeholder="Enter your message..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
            />
            <input className="safe" type="submit" value="Send" />
          </form>
        </div>
      </div>
    </>
  );
};

export default GroupChat;
