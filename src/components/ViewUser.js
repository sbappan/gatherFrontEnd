// View User

import React, { Component } from 'react';
import { getOneItem } from '../Helpers';
import { LinkButton } from './Buttons';

export default class ViewUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: [],
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const userId = match.params._id;
      const user = await getOneItem('users', userId);

      this.setState({ user });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  render() {
    const { user } = this.state;

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
          {user._id}
        </p>

        <p>
          <b>Groups :</b>
          {user.groups && user.groups.map((groups) => (
            <p key={groups}>
            // Left off here
            </p>
          ))}
        </p>

        <p>
          <b>Events :</b>
          {user._id}
        </p>

      </div>
    );
  }
}
