// View User

import React, { Component } from 'react';
import { getOneItem, getAllItemsAsObject } from '../Helpers';
import { LinkButton } from './Buttons';

export default class ViewUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: [],
      interestsObj: [],
      groupsObj: [],
      eventsObj: [],
      isBanned: true,
      bannedReason: 'N/A',
      messageUpdates: false,
      newGroupUpdates: false,
      newEventUpdates: false,
      replyUpdates: false,
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const userId = match.params._id;
      const user = await getOneItem('users', userId);
      const interestsObj = await getAllItemsAsObject('interests');
      const groupsObj = await getAllItemsAsObject('groups');
      const eventsObj = await getAllItemsAsObject('events');
      this.setState({
        user,
        interestsObj,
        groupsObj,
        eventsObj,
        isBanned: user.status.isBanned,
        bannedReason: user.status.reason,
        messageUpdates: user.emailUpdates.messageUpdates,
        newGroupUpdates: user.emailUpdates.newGroupUpdates,
        newEventUpdates: user.emailUpdates.newEventUpdates,
        replyUpdates: user.emailUpdates.replyUpdates,
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  render() {
    const {
      user,
      interestsObj,
      groupsObj,
      eventsObj,
      isBanned,
      bannedReason,
      messageUpdates,
      newGroupUpdates,
      newEventUpdates,
      replyUpdates,
    } = this.state;

    return (
      <div>
        <LinkButton className="success" text="Back to Users" collection="users" />

        <h2>
          {user.fname}
          {' '}
          {user.lname}
        </h2>

        <p>
          <b>Id: </b>
          {user._id}
        </p>

        <p>
          <b>Username: </b>
          {user.userName}
        </p>

        <p>
          <b>Email: </b>
          {user.email}
        </p>

        <p>
          <b>Profile Picture: </b>
          <img src="src\stockProfileImage.jpg" alt="Profile Pic (alt)" />
        </p>

        <p>
          <b>Interests :</b>
          {user.interests && user.interests.map((interest) => (
            <p key={interest}>
              {interestsObj[interest].name}
            </p>
          ))}
        </p>

        <p>
          <b>Groups :</b>
          {user.groups && user.groups.map((group) => (
            <p key={group}>
              {groupsObj[group].name}
            </p>
          ))}
        </p>

        <p>
          <b>Events :</b>
          {user.events && user.events.map((event) => (
            <p key={event}>
              {eventsObj[event].name}
            </p>
          ))}
        </p>

        <p>
          <b>Status: </b>
          {isBanned ? 'True' : 'False'}
        </p>

        <p>
          <b>Reason: </b>
          {isBanned && bannedReason}
        </p>

        <p>
          <b>Message Updates: </b>
          {messageUpdates ? 'True' : 'False'}
        </p>

        <p>
          <b>New Group Updates: </b>
          {newGroupUpdates ? 'True' : 'False'}
        </p>

        <p>
          <b>New Event Updates: </b>
          {newEventUpdates ? 'True' : 'False'}
        </p>

        <p>
          <b>Reply Updates: </b>
          {replyUpdates ? 'True' : 'False'}
        </p>

      </div>
    );
  }
}
