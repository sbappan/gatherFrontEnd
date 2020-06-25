import React, { Component } from 'react';
import { getOneItem } from '../Helpers';

class ViewProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const userId = match.params._id;
      const user = await getOneItem('users', userId);
      this.setState({ user });
    } catch (error) {
      /* console.log('error: ', error); */
    }
  }

  render() {
    const { user } = this.state;

    return (
      <div>
        {/* <img src="" alt="Image goes here"/> */}
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
              {interest}
              {' '}
            </li>
          ))}
        </ul>
        <h4>Member of</h4>
        <ul>
          {user.groups && user.groups.map((group) => (
            <li key={group}>
              {group}
              {' '}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default ViewProfile;
