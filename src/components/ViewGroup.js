import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { LinkButtonAdmin } from './Buttons';
import { getOneItem, getAllItemsAsObject } from '../Helpers';

const ViewGroup = () => {
  const [group, setGroup] = useState({});
  const [usersObj, setUsersObj] = useState({});
  const [interestsObj, setInterestsObj] = useState({});
  const { _id: groupId } = useParams();

  useEffect(() => {
    const getData = async () => {
      const groupPromise = getOneItem('groups', groupId);
      const usersObjPromise = getAllItemsAsObject('users');
      const interestsObjPromise = getAllItemsAsObject('interests');
      const [groupData, usersObjData, interestsObjData] = await Promise.all([groupPromise,
        usersObjPromise,
        interestsObjPromise]);

      setGroup(groupData);
      setUsersObj(usersObjData);
      setInterestsObj(interestsObjData);
    };

    getData();
  }, [groupId]);

  return (
    <div>
      <LinkButtonAdmin className="success" text="Back to groups" collection="groups" />
      <h2>{group.name}</h2>
      <p>{group.description}</p>
      <div>
        <div>
          <p>
            <b>Status:  </b>
            <span>{group.status && (group.status.isFlagged ? 'Flagged' : 'Not flagged')}</span>
          </p>
          {group.status && group.status.isFlagged && (
          <p>
            <b>Reason:</b>
            {`  ${group.status.reason}`}
          </p>
          )}
        </div>
        <div>
          <h4>Interests</h4>
          {group.interests && group.interests.map((interest) => (
            <p key={interest}>
              {interestsObj[interest] && interestsObj[interest].name}
            </p>
          ))}
        </div>
      </div>
      <div>
        <h4>Members</h4>
        {group.members && group.members.map((member) => (
          <p key={member._id}>
            {usersObj[member._id] && `${usersObj[member._id].fname} ${usersObj[member._id].lname} `}
            {member.isAdmin ? '(admin)' : ''}
          </p>
        ))}
      </div>
    </div>
  );
};

export default ViewGroup;
