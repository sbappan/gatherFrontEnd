import React, { Component, useContext } from 'react';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import SearchBar from './SearchBar';
import { getAllItems } from '../Helpers';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const [countObj, setCountObj] = useState();
  const [search, setSearch] = useState();

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
    // const authContext = useContext(AuthContext);
    const { search, countObj } = this.state;
    return (
      <>
        <h1>Hi Full Name. Welcome to the Gather admin dashboard.</h1>
        {/* Once the log in use case is completed,
          enable loading this dashboard only for super admins */}
        {(Object.keys(countObj).length > 0)
          ? <AdminDashboard countObj={countObj} />
          : <h3>Loading...</h3>}
        {/* Once the log in use case is completed,
          enable loading UserDashboard for all other users */}
        {(Object.keys(search).length > 0) && <SearchBar search={search} />}
        <UserDashboard />
      </>
    );
  }
}
