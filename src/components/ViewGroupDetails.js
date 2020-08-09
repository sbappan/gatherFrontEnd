import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, Redirect } from 'react-router-dom';
import {
  getOneItem, getAllItemsAsObject, getGroupEvents, createOrUpdateItem, deleteItem,
} from '../Helpers';
import { AuthContext } from '../context/AuthContext';
import GroupPost from './GroupPost';

const ViewGroupDetails = () => {
  const authContext = useContext(AuthContext);
  const { authState: { userInfo } } = authContext;
  const [group, setGroup] = useState({});
  const [events, setEvents] = useState([]);
  const [usersObj, setUsersObj] = useState({});
  const [interestsObj, setInterestsObj] = useState({});
  const [activeTab, setActiveTab] = useState('description');
  const { _id: groupId } = useParams();

  const [redirectToReferrer, setRedirectToReferrer] = useState(false);

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

  // console.log(group.comments.message);

  const handleChangeTab = (tab) => {
    setActiveTab(tab);
  };

  const handleJoinClick = async (gId) => {
    const existingMembers = group.members.filter((m) => m._id);
    existingMembers.push({
      _id: userInfo._id,
      isAdmin: false,
    });

    const bodyData = {
      members: existingMembers,
    };

    const updatedData = await createOrUpdateItem('PUT', 'groups', bodyData, gId);
    if (updatedData._id) {
      setGroup(updatedData);
    } else {
      // console.log(updatedData.errors);
    }
  };

  const handleLeaveClick = async (gId) => {
    const existingMembers = group.members.filter((m) => m._id);

    existingMembers.map((_id, i) => {
      if (existingMembers[i]._id === userInfo._id) {
        existingMembers.splice(i, 1);
      }
      return existingMembers;
    });

    const bodyData = {
      members: existingMembers,
    };

    const updatedData = await createOrUpdateItem('PUT', 'groups', bodyData, gId);
    if (updatedData._id) {
      setGroup(updatedData);
    } else {
      // console.log(updatedData.errors);
    }
  };

  const handleDeleteClick = async (gId) => {
    const updatedData = await deleteItem('groups', gId);

    if (!updatedData.errors) {
      setRedirectToReferrer(true);
    } else {
      // console.log(updatedData.errors);
    }
  };

  if (redirectToReferrer === true) {
    return <Redirect to="/admin/groups" />;
  }

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
        {group.comments && group.comments.map((comment) => (
          <p key={comment}>
            {group.comments[comment] && group.comments.message}
          </p>
        ))}
      </div>
      {group.members
      && group.members.map((m) => m._id).includes(userInfo._id)
      && (
      <div>
        <Link to={`/groups/feed/${group._id}`}>
          <button type="button" className="success" collection="groups">Create Post</button>
        </Link>
      </div>
      )}
      <br />
      {group.members
      && group.members.filter((m) => m.isAdmin).map((m) => m._id).includes(userInfo._id)
      && (
      <div>
        <Link to={`/events/create/${group._id}`}>
          <button type="button" className="success" collection="groups">Create Event</button>
        </Link>
        <br />
        <br />
      </div>
      )}
      {group.members
      && group.members.filter((m) => m.isAdmin).map((m) => m._id).includes(userInfo._id)
      && (
      <div>
        <Link to={`/groups/edit/${group._id}`}>
          <button type="button" className="success">Edit Group</button>
        </Link>
        <br />
        <br />
      </div>
      )}
      {group.members
      && group.members.filter((m) => m._id).map((m) => m._id).includes(userInfo._id)
      && (
      <div>
        <Link to={`/groups/chat/${group._id}`}>
          <button type="button" className="safe">Group Chat</button>
        </Link>
      </div>
      )}
      <br />
      {group.members
      && group.members.filter((m) => m._id).map((m) => m._id).includes(userInfo._id)
        ? (
          <button type="button" className="danger" collection="users" onClick={() => handleLeaveClick(group._id)}>Leave Group</button>
        ) : (
          <button type="button" className="safe" collection="users" onClick={() => handleJoinClick(group._id)}>Join Group</button>
        )}
      <br />
      <br />
      {group.members
      && group.members.filter((m) => m.isAdmin).map((m) => m._id).includes(userInfo._id)
      && (
      <div>
        <button
          type="button"
          className="danger"
          collection="events"
          onClick={() => {
            if (window.confirm(`Are you sure you wish to delete: ${group.name}\n(Careful, there is no undoing this request!)`)) { handleDeleteClick(group._id); }
          }}
        >
          Delete Group
        </button>
      </div>
      )}
      <br />
      <button type="button" id="description" variant="light" className={activeTab === 'description' ? 'success' : 'safe'} onClick={() => handleChangeTab('description')}>Description</button>

      <button id="members" type="button" variant="light" className={activeTab === 'members' ? 'success' : 'safe'} onClick={() => handleChangeTab('members')}>Members</button>

      <button id="events" type="button" variant="light" className={activeTab === 'events' ? 'success' : 'safe'} onClick={() => handleChangeTab('events')}>Events</button>

      <button id="feed" type="button" variant="light" className={activeTab === 'feed' ? 'success' : 'safe'} onClick={() => handleChangeTab('feed')}>Feed</button>

      <div>
        {activeTab === 'description' && <DescriptionTab description={group.description} />}
        {activeTab === 'members' && <MembersTab members={usersObj} group={group} />}
        {activeTab === 'events' && <EventsTab events={events} />}
        {activeTab === 'feed' && <GroupFeedTab group={group} members={usersObj} />}
      </div>
    </div>
  );
};

function DescriptionTab({ description }) {
  return (
    <div className="groupTab">
      <p>{ description }</p>
    </div>
  );
}

function MembersTab({ members, group }) {
  return (
    <div className="groupTab">
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
    <div className="groupTab">
      {events.map((event) => <p key={event._id}><Link to={`/events/${event._id}`}>{event.name}</Link></p>)}
    </div>
  );
}


function GroupFeedTab({ group, members }) {
  return (
    <div className="groupFeedContainer groupTab">
      {group.posts && group.posts.map((post) => (
        <GroupPost post={post} posts={group.posts} group={group._id} members={members} key={`${post._id} ${post.date}`} />
      ))}
    </div>
  );
}

export default ViewGroupDetails;
