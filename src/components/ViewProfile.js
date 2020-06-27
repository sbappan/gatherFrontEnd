import React, { Component } from 'react';
import { getOneItem, getAllItemsAsObject, getAllItems } from '../Helpers';
import profile from '../stockProfileImage.jpg';

class ViewProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      events: [],
      groupsObj: {},
      interestsObj: {},
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const userId = match.params._id;
      const user = await getOneItem('users', userId);
      const interestsObj = await getAllItemsAsObject('interests');
      const groupsObj = await getAllItemsAsObject('groups');
      const allEvents = await getAllItems('events');
      const events = allEvents.filter((event) => event.attendees.includes(user._id));

      this.setState({
        user, events, interestsObj, groupsObj,
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  render() {
    const {
      user, events, interestsObj, groupsObj,
    } = this.state;
    const profileStyle = { width: '15rem', height: 'auto' };

    return (
      <div>
        <img src={profile} alt="Profile" style={profileStyle} />
        <h4>
          {user.fname}
          {' '}
          {user.lname}
        </h4>
        <p>
          <strong>Email </strong>
          {user.email}
        </p>

        <h4>Interests</h4>
        <ul>
          {user.interests && user.interests.map((interest) => (
            <li key={interest}>
              {interestsObj[interest].name}
            </li>
          ))}
        </ul>
        <h4>Groups</h4>
        <ul>
          {user.groups && user.groups.map((group) => (
            <li key={group}>
              {groupsObj[group].name}
            </li>
          ))}
        </ul>
        <h4>Events</h4>
        <ul>
          {events.map((event) => (
            <li key={event._id}>
              {event.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ViewProfile;
