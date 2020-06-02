import React, { Component } from 'react';

class Content extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
    };
  }

  async componentDidMount() {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_LINK}/users`);
      const users = await res.json();
      this.setState({ users });
    } catch (error) {
      console.log('error: ', error);
    }
  }

  render() {
    const { users } = this.state;
    return (
      <div>
        {users.map(user => (
          <p key={user.userName}> {user.email} </p>
        ))}
      </div>
    );
  }
}

export default Content;
