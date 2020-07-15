import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getOneItem, getAllItemsAsObject, getGroupEvents } from '../Helpers';

class ViewGroupDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      group: {},
      events: [],
      usersObj: {},
      interestsObj: {},
      active: 'description',
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const groupId = match.params._id;
      const group = await getOneItem('groups', groupId);
      const events = await getGroupEvents(groupId);
      const usersObj = await getAllItemsAsObject('users');
      const interestsObj = await getAllItemsAsObject('interests');
      this.setState({
        group, events, usersObj, interestsObj,
      });
    } catch (error) {
      /* console.log('error: ', error); */
    }
  }

  async handleClick(e) {
    if (e.target.id === 'description') {
      this.setState({ active: 'description' });
    } else if (e.target.id === 'members') {
      this.setState({ active: 'members' });
    } else if (e.target.id === 'events') {
      this.setState({ active: 'events' });
    } else if (e.target.id === 'feed') {
      this.setState({ active: 'feed' });
    }
  }

  render() {
    const {
      group, usersObj, events, active, interestsObj,
    } = this.state;
    return (
      <div>
        <h1><strong>{group.name}</strong></h1>
        <span>
          {' '}
          { group.members && group.members.length}
          {' '}
          members
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
                {`${usersObj[member._id].fname} ${usersObj[member._id].lname}`}
              </Link>
            </p>
          ))}
        </span>
        <div>
          <h4>Interests</h4>
          {group.interests && group.interests.map((interest) => (
            <p key={interest}>
              {interestsObj[interest].name}
            </p>
          ))}
        </div>
        <br />
        <br />
        <br />
        <button type="button" id="description" variant="light" className={active === 'description' ? 'success' : 'safe'} onClick={(e) => this.handleClick(e)}>Description</button>

        <button id="members" type="button" variant="light" className={active === 'members' ? 'success' : 'safe'} onClick={(e) => this.handleClick(e)}>Members</button>

        <button id="events" type="button" variant="light" className={active === 'events' ? 'success' : 'safe'} onClick={(e) => this.handleClick(e)}>Events</button>

        <button id="feed" type="button" variant="light" className={active === 'feed' ? 'success' : 'safe'} onClick={(e) => this.handleClick(e)}>Feed</button>

        <div>
          {active === 'description' && <DescriptionTab description={group.description} />}
          {active === 'members' && <MembersTab members={usersObj} group={group} />}
          {active === 'events' && <EventsTab events={events} />}
          {active === 'feed' && <UserFeedTab />}
        </div>
      </div>
    );
  }
}

function DescriptionTab({ description }) {
  return (
    <div>
      <h4>{ description }</h4>
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
