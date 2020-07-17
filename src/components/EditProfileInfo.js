import React, { Component } from 'react';
import {
  getOneItem, getAllItemsAsObject, getAssociatedItems, createOrUpdateItem,
} from '../Helpers';
import profile from '../stockProfileImage.jpg';

class EditProfileInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      events: [],
      groups: [],
      interestsObj: {},
      email: '',
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
        user, events, interestsObj, groups, email: user.email,
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  async handleClick(userId) {
    const { email } = this.state;
    const bodyData = {
      email,
    };

    const updatedData = await createOrUpdateItem('PUT', 'users', bodyData, userId);
    if (updatedData.length > 0) {
      this.setState(bodyData.email);
    }
  }

  render() {
    const {
      user, events, interestsObj, groups, email,
    } = this.state;
    const profileStyle = { width: '10rem', height: 'auto' };

    return (
      <form action="" method="PUT" style={profileStyle}>
        <h2>
          Edit Profie:
        </h2>
        <h2>
          {`${user.fname} ${user.lname} (${user.userName})`}
        </h2>
        {/* <textarea
          name="name"
          value={`${user.fname} ${user.lname}`}
          onChange={this.handleChange}
          required
        /> */}

        <img src={profile} alt="Profile" style={profileStyle} />

        <textarea
          name="email"
          value={email}
          onChange={this.handleChange}
          required
        />

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

        <div>
          <button type="button" className="safe" onClick={() => this.handleClick()}>Save</button>
        </div>
      </form>
    );
  }
}

export default EditProfileInfo;
