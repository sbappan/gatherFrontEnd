import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router';
import {
  getOneItem, getAllItemsAsObject, getAssociatedItems, createOrUpdateItem,
} from '../Helpers';
import profile from '../stockProfileImage.jpg';
import { AuthContext } from '../context/AuthContext';

const ViewProfile = (props) => {
  const authContext = useContext(AuthContext);
  const { setAuthState, authState: { userInfo, token, expiresAt } } = authContext;
  const { itemId } = props;
  const { _id } = useParams();
  const userId = itemId || _id;
  const [user, setUser] = useState({});
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [interestsObj, setInterestsObj] = useState({});

  useEffect(() => {
    const getData = async () => {
      const userPromise = getOneItem('users', userId);
      const interestsObjPromise = getAllItemsAsObject('interests');
      const [userData, interestsObjData] = await Promise.all([userPromise, interestsObjPromise]);
      setUser(userData);
      setInterestsObj(interestsObjData);

      const eventsPromise = getAssociatedItems('events', userId);
      const groupsPromise = getAssociatedItems('groups', userId);
      const [eventsData, groupsData] = await Promise.all([eventsPromise, groupsPromise]);
      setEvents(eventsData);
      setGroups(groupsData);
    };
    getData();
  }, [userId]);

  const handleFollowClick = async () => {
    const currentlyFollowing = [...userInfo.following];
    currentlyFollowing.push(
      userId,
    );

    const bodyData = {
      following: currentlyFollowing,
    };

    const updatedData = await createOrUpdateItem('PUT', 'users', bodyData, userInfo._id);
    if (updatedData) {
      setAuthState({ token, expiresAt, userInfo: updatedData });
    } else {
      // console.log(updatedData.errors);
    }
  };

  const handleUnfollowClick = async () => {
    const currentlyFollowing = [...userInfo.following];
    const index = currentlyFollowing.indexOf(userId);
    if (index !== -1) {
      currentlyFollowing.splice(index, 1);
    }
    const bodyData = {
      following: currentlyFollowing,
    };

    const updatedData = await createOrUpdateItem('PUT', 'users', bodyData, userInfo._id);
    if (updatedData) {
      setAuthState({ token, expiresAt, userInfo: updatedData });
    } else {
    //  console.log(updatedData.errors);
    }
  };

  const profileStyle = { width: '10rem', height: 'auto' };

  return (
    <div>
      <h2>
        {`${user.fname} ${user.lname} (${user.userName})`}
      </h2>
      <img src={profile} alt="Profile" style={profileStyle} />
      <p>
        <strong>Email </strong>
        {user.email}
      </p>
      <br />
      {userInfo.following
      && userInfo.following.includes(userId)
        ? (
          <button type="button" className="danger" collection="users" onClick={() => handleUnfollowClick()}>Unfollow</button>
        ) : (
          <button type="button" className="safe" collection="users" onClick={() => handleFollowClick()}>Follow</button>
        )}
      <h4>Interests</h4>
      <ul>
        {user.interests && user.interests.map((interest) => (
          <li key={interest}>
            {interestsObj[interest] && interestsObj[interest].name}
          </li>
        ))}
      </ul>
      {user.interests && user.interests.length === 0 && 'None'}
      <h4>Groups</h4>
      <ul>
        {groups.map((group) => (
          <li key={group._id}>
            {group.name}
          </li>
        ))}
      </ul>
      {groups.length === 0 && 'None'}
      <h4>Events</h4>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            {event.name}
          </li>
        ))}
      </ul>
      {events.length === 0 && 'None'}
    </div>
  );
};


export default ViewProfile;
