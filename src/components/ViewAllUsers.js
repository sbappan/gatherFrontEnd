import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FlagItemRowButtons, FilterItemsButtons } from './Buttons';
import { getAllItems, createOrUpdateItem, updateAllItemsArray } from '../Helpers';

export default class ViewAllUsers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      allUsers: [],
      activeFilter: 'All',
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  async componentDidMount() {
    try {
      const users = await getAllItems('users');
      this.setState({ users, allUsers: users });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  async handleClick(userId) {
    const { activeFilter, allUsers } = this.state;
    const bodyData = {
      status: {
        isFlagged: false,
        reason: '',
      },
    };

    const updatedData = await createOrUpdateItem('PUT', 'users', bodyData, userId);

    if (!updatedData.errorMsg) {
      this.setState({ allUsers: updateAllItemsArray(allUsers, updatedData) });
      this.handleFilter(activeFilter);
    }
  }

  async handleFilter(text) {
    const { allUsers } = this.state;
    if (text === 'All') {
      this.setState({ users: allUsers, activeFilter: text });
    } else {
      const condition = text === 'Flagged';
      const filteredUsers = allUsers.filter((user) => user.status.isFlagged === condition);
      this.setState({ users: filteredUsers, activeFilter: text });
    }
  }

  render() {
    const { users, allUsers, activeFilter } = this.state;

    if (allUsers.length === 0) {
      return <h3>Loading...</h3>;
    }

    return (
      <div className="allItemsList">
        <div>
          <h2>Users</h2>
          <FilterItemsButtons handleFilter={this.handleFilter} activeFilter={activeFilter} />
          {(users.some((user) => user.status.isFlagged)) && <h4>Reason for flagging</h4>}
        </div>
        <div>
          {users.map((user) => (
            <UserRow key={user._id} user={user} handleClick={this.handleClick} />
          ))}
          {users.length === 0 && <p>No users found. Please modify the filter option.</p>}
        </div>
      </div>
    );
  }
}

function UserRow({ user, handleClick }) {
  return (
    <div>
      <div>
        <Link to={`/admin/users/${user._id}`}>
          {user.fname}
          {' '}
          {user.lname}
          {' ('}
          {user.userName}
          {') '}
        </Link>
        <FlagItemRowButtons item={user} collection="users" handleClick={handleClick} />
      </div>
      <div>
        {user.status.isFlagged && (
          <div className="overflowEllipsis">
            {user.status.reason}
          </div>
        )}
      </div>
    </div>
  );
}
