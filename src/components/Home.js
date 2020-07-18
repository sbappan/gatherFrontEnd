import React, { useState, useContext, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import UserDashboard from './UserDashboard';
import SearchBar from './SearchBar';
import { getAllItems } from '../Helpers';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const authContext = useContext(AuthContext);
  const { authState: { userInfo } } = authContext;
  const [countObj, setCountObj] = useState({});
  const [search, setSearch] = useState({});

  useEffect(() => {
    const getHomePageData = async () => {
      const usersPromise = getAllItems('users');
      const groupsPromise = getAllItems('groups');
      const eventsPromise = getAllItems('events');
      const interestsPromise = getAllItems('interests');
      const [users, groups, events, interests] = await Promise.all([usersPromise,
        groupsPromise,
        eventsPromise,
        interestsPromise]);

      setCountObj({
        users: users.length,
        groups: groups.length,
        events: events.length,
        interests: interests.length,
      });
      setSearch({
        interests, groups, events,
      });
    };

    getHomePageData();
  }, []);

  return (
    <>
      <h1>{`Hi ${userInfo.fname} ${userInfo.lname}. Welcome to Gather!`}</h1>
      {(Object.keys(countObj).length > 0)
        ? (
          <>
            {authContext.isAdmin() && <AdminDashboard countObj={countObj} />}
            <SearchBar search={search} />
            <UserDashboard />
          </>
        )
        : <h2>Loading...</h2>}
    </>
  );
};

export default Home;
