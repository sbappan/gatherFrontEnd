import React, { Component } from 'react';
import Users from '../data/users';

class Content extends Component {
  render() {
    return (
      <div>
        {Users.map(user => (
          <p key={user.userName}> {user.email} </p>
        ))}
      </div>
    );
  }
}

export default Content;
