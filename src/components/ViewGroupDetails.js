import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { getOneItem, getAllItemsAsObject, getGroupEvents } from '../Helpers';

const ViewGroupDetails = () => {
  const [group, setGroup] = useState({});
  const [events, setEvents] = useState([]);
  const [usersObj, setUsersObj] = useState({});
  const [interestsObj, setInterestsObj] = useState({});
  const [activeTab, setActiveTab] = useState('description');
  const { _id: groupId } = useParams();

  useEffect(() => {
    const getData = async () => {
      const groupPromise = await getOneItem('groups', groupId);
      const eventsPromise = await getGroupEvents(groupId);
      const usersObjPromise = await getAllItemsAsObject('users');
      const interestsObjPromise = await getAllItemsAsObject('interests');

      const [groupData,
        eventsData,
        usersObjData,
        interestsObjData] = await Promise.all([groupPromise,
        eventsPromise,
        usersObjPromise,
        interestsObjPromise]);

      setGroup(groupData);
      setEvents(eventsData);
      setUsersObj(usersObjData);
      setInterestsObj(interestsObjData);
    };

    getData();
  }, [groupId]);

  const handleChangeTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <h1>{group.name}</h1>
      <span>
        {group.members && `${group.members.length} members`}
      </span>
      <br />
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcT3K4mBbZl7A_P-uOZXZ2DrGc8MZSXSmudZvdA1PMYYZH-yj9cc&usqp=CAU"
        alt="admin icon"
        height="2%"
        width="2%"
      />
      <span>
        Organized by:
        {' '}
        {group.members && group.members.filter((member) => member.isAdmin).map((member) => (
          <p key={member._id}>
            <Link to={`/users/${member._id}`}>
              {usersObj[member._id] && `${usersObj[member._id].fname} ${usersObj[member._id].lname}`}
            </Link>
          </p>
        ))}
      </span>
      <div>
        <h4>Interests</h4>
        {group.interests && group.interests.map((interest) => (
          <p key={interest}>
            {interestsObj[interest] && interestsObj[interest].name}
          </p>
        ))}
      </div>
      <div>
        <Link to={`/events/create/${group._id}`}>
          <button type="button" className="safe" collection="groups">Create Event</button>
        </Link>
      </div>
      <br />
      <br />
      <br />
      <button type="button" id="description" variant="light" className={activeTab === 'description' ? 'success' : 'safe'} onClick={() => handleChangeTab('description')}>Description</button>

      <button id="members" type="button" variant="light" className={activeTab === 'members' ? 'success' : 'safe'} onClick={() => handleChangeTab('members')}>Members</button>

      <button id="events" type="button" variant="light" className={activeTab === 'events' ? 'success' : 'safe'} onClick={() => handleChangeTab('events')}>Events</button>

      <button id="feed" type="button" variant="light" className={activeTab === 'feed' ? 'success' : 'safe'} onClick={() => handleChangeTab('feed')}>Feed</button>

      <div>
        {activeTab === 'description' && <DescriptionTab description={group.description} />}
        {activeTab === 'members' && <MembersTab members={usersObj} group={group} />}
        {activeTab === 'events' && <EventsTab events={events} />}
        {activeTab === 'feed' && <UserFeedTab />}
      </div>
    </div>
  );
};


function DescriptionTab({ description }) {
  return (
    <div>
      <p>{ description }</p>
    </div>
  );
}

function MembersTab({ members, group }) {
  return (
    <div>
      {group.members && group.members.map((member) => (
        <p key={member._id}>
          <Link to={`/users/${member._id}`}>
            {`${members[member._id].fname} ${members[member._id].lname} `}
            {member.isAdmin ? '(admin)' : ''}
          </Link>
        </p>
      ))}
    </div>
  );
}

function EventsTab({ events }) {
  return (
    <div>
      {events.map((event) => <p key={event._id}><Link to={`/events/${event._id}`}>{event.name}</Link></p>)}
    </div>
  );
}

function UserFeedTab() {
  return (
    <>
      <p>User feed</p>
    </>
  );
}

export default ViewGroupDetails;
