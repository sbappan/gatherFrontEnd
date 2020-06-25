import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getAllItems } from '../Helpers';

export default class ViewAllUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      allUsers: [],
    };
  }

  async componentDidMount() {
    try {
      const users = await getAllItems('users');
      this.setState({ users, allUsers: users });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  render() {
    const { users, allUsers } = this.state;

    if (allUsers.length === 0) {
      return <h3>Loading...</h3>;
    }

    return (
      <div className="allItemsList">
        <div>
          <h2>Users</h2>
        </div>
        <div>
          {users.map((user) => (
            <UserRow key={user._id} user={user} />
          ))}
          {users.length === 0 && <p>No users found.</p>}
        </div>
      </div>
    );
  }
}

function UserRow({ user }) {
  return (
    <div>
      <div>
        <Link to={`/admin/users/${user._id}`}>
          <h4>{user.userName}</h4>
        </Link>
      </div>

      <div>
        <h4>
          {user.fname}
          {' '}
          {user.lname}
        </h4>
      </div>
    </div>
  );
}
