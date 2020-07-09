import React, { Component } from 'react';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import SearchBar from './SearchBar';
import { getAllItems } from '../Helpers';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      countObj: {},
      search: {},
    };
  }

  async componentDidMount() {
    try {
      const usersPromise = getAllItems('users');
      const groupsPromise = getAllItems('groups');
      const eventsPromise = getAllItems('events');
      const interestsPromise = getAllItems('interests');
      const [users, groups, events, interests] = await Promise.all([usersPromise,
        groupsPromise,
        eventsPromise,
        interestsPromise]);
      const countObj = {
        users: users.length,
        groups: groups.length,
        events: events.length,
        interests: interests.length,
      };

      this.setState({
        countObj,
        search: {
          interests, groups, events,
        },
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  render() {
    const { search, countObj } = this.state;
    return (
      <>
        <h1>Hi Full Name. Welcome to the Gather admin dashboard.</h1>
        {/* Once the log in use case is completed,
          enable loading this dashboard only for super admins */}
        <AdminDashboard countObj={countObj} />
        {/* Once the log in use case is completed,
          enable loading UserDashboard for all other users */}
        {(Object.keys(search).length > 0) && <SearchBar search={search} />}
        <UserDashboard />
      </>
    );
  }
}
