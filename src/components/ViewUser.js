import React, { Component } from 'react';
import { getOneItem } from '../Helpers';
import { LinkButtonAdmin } from './Buttons';
import ViewProfile from './ViewProfile';

export default class ViewUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
    };
  }

  async componentDidMount() {
    try {
      const { match: { params: { _id: userId } } } = this.props;
      const user = await getOneItem('users', userId);

      this.setState({ user });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  render() {
    const { user } = this.state;

    if (Object.keys(user).length === 0) {
      return <h3>Loading...</h3>;
    }

    return (
      <div>
        <LinkButtonAdmin className="success" text="Back to Users" collection="users" />
        <ViewProfile itemId={user._id} />
        {user.status && (
          <p>
            <b>Status: </b>
            {user.status.isFlagged ? 'Flagged' : 'Not flagged'}
          </p>
        )}
        {user.status && user.status.isFlagged && (
          <p>
            <b>Reason: </b>
            {user.status.reason}
          </p>
        )}
        {user.emailUpdates && (
        <>
          <p>
            <b>Message Updates: </b>
            {user.emailUpdates.messageUpdates ? 'On' : 'Off'}
          </p>
          <p>
            <b>New Group Updates: </b>
            {user.emailUpdates.newGroupUpdates ? 'On' : 'Off'}
          </p>
          <p>
            <b>New Event Updates: </b>
            {user.emailUpdates.newEventUpdates ? 'On' : 'Off'}
          </p>
          <p>
            <b>Reply Updates: </b>
            {user.emailUpdates.replyUpdates ? 'On' : 'Off'}
          </p>
        </>
        )}
      </div>
    );
  }
}
