import React, { Component } from 'react';
import { FlagItemButtons } from './Buttons';
import { createOrUpdateItem, getOneItem } from '../Helpers';

export default class FlagUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      reason: '',
      isFlagged: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    try {
      const { match: { params: { _id: userId } } } = this.props;
      const user = await getOneItem('users', userId);
      this.setState({ user, reason: user.status.reason, isFlagged: user.status.isFlagged });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  async handleClick(userId, flag) {
    let { reason } = this.state;
    reason = flag ? reason : '';
    const bodyData = {
      status: {
        isFlagged: flag,
        reason,
      },
    };

    if (reason.trim() || !flag) {
      const updatedData = await createOrUpdateItem('PUT', 'users', bodyData, userId);
      if (updatedData.length > 0) {
        this.setState(bodyData.status);
      }
    } else {
      this.setState({ reason: '' });
    }
  }

  render() {
    const { user, reason, isFlagged } = this.state;

    return (
      <div className="flagItem">
        <h2>Flag User</h2>
        <h3>UserName:</h3>
        <p>{user.userName}</p>
        <h3>Name</h3>
        <p>
          {user.fname}
          {' '}
          {user.lname}
        </p>
        <h3>Email:</h3>
        <p>{user.email}</p>
        <h3>Status:</h3>
        <p>{isFlagged ? 'Flagged' : 'Not flagged'}</p>
        <h3>Reason:</h3>
        <textarea
          name="reason"
          placeholder="Please enter the reason for flagging this user"
          value={reason}
          onChange={this.handleChange}
          required
        />
        <br />
        <br />
        <FlagItemButtons item={user} isFlagged={isFlagged} collection="users" handleClick={this.handleClick} />
      </div>
    );
  }
}
