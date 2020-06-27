import React, { Component } from 'react';
import { getOneItem, getAllItemsAsObject, getAssociatedItems } from '../Helpers';
import profile from '../stockProfileImage.jpg';

class ViewProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      events: [],
      groups: [],
      interestsObj: {},
    };
  }

  async componentDidMount() {
    try {
      const { match, itemId } = this.props;
      const userId = itemId || match.params._id;
      const user = await getOneItem('users', userId);
      const interestsObj = await getAllItemsAsObject('interests');
      const events = await getAssociatedItems('events', user._id);
      const groups = await getAssociatedItems('groups', user._id);

      this.setState({
        user, events, interestsObj, groups,
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  render() {
    const {
      user, events, interestsObj, groups,
    } = this.state;
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

        <h4>Interests</h4>
        <ul>
          {user.interests && user.interests.map((interest) => (
            <li key={interest}>
              {interestsObj[interest].name}
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
  }
}

export default ViewProfile;
