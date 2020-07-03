import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getOneItem, getAllItemsAsObject } from '../Helpers';

class ViewGroupDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      group: {},
      events: [],
      usersObj: {},
      active: 'description',
    };
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const groupId = match.params._id;
      // const res = await fetch(`${process.env.REACT_APP_API_LINK}/groups/${groupId}`);
      const group = await getOneItem('groups', groupId);
      const res2 = await fetch(`${process.env.REACT_APP_API_LINK}/events/group/${groupId}`);
      const events = await res2.json();
      const usersObj = await getAllItemsAsObject('users');
      this.setState({ group, events, usersObj });
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
      group, usersObj, events, active,
    } = this.state;
    return (
      <div>
        <h1><strong>{group.name}</strong></h1>
        <img
          src="data:image/png;base64,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"
          alt="members Icon"
          height="2%"
          width="2%"
        />

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
        <br />
        <br />
        <br />
        <button type="button" id="description" variant="light" className="safe" onClick={(e) => this.handleClick(e)}>Description</button>
        <button id="members" type="button" variant="light" className="safe" onClick={(e) => this.handleClick(e)}>Members</button>
        <button id="events" type="button" variant="light" className="safe" onClick={(e) => this.handleClick(e)}>Events</button>
        <button id="feed" type="button" variant="light" className="safe" onClick={(e) => this.handleClick(e)}>Feed</button>

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
