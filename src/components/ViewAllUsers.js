import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FlagItemRowButtons, FilterItemsButtons } from './Buttons';
import { getAllItems, createOrUpdateItem, updateAllItemsArray } from '../Helpers';
import { AuthContext } from '../context/AuthContext';

const ViewAllUsers = () => {
  const authContext = useContext(AuthContext);
  const { authState } = authContext;

  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const getData = async () => {
      const usersData = await getAllItems('users');
      setUsers(usersData);
      setAllUsers(usersData);
    };
    getData();
  }, []);

  useEffect(() => {
    let filteredEvents = [];
    if (activeFilter === 'All') {
      filteredEvents = allUsers;
    } else {
      const condition = activeFilter === 'Flagged';
      filteredEvents = allUsers.filter((user) => user.status.isFlagged === condition);
    }
    setUsers(filteredEvents);
  }, [activeFilter, allUsers]);

  const handleFilter = (text) => {
    setActiveFilter(text);
  };

  const handleClick = async (userId) => {
    const bodyData = {
      status: {
        isFlagged: false,
        reason: '',
        updatedBy: authState.userInfo._id,
      },
    };

    const updatedData = await createOrUpdateItem('PUT', 'users', bodyData, userId);

    if (updatedData._id) {
      setAllUsers(updateAllItemsArray(allUsers, updatedData));
      handleFilter(activeFilter);
    }
  };

  if (allUsers.length === 0) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="allItemsList">
      <div>
        <h2>Users</h2>
        <FilterItemsButtons handleFilter={handleFilter} activeFilter={activeFilter} />
        {(users.some((user) => user.status.isFlagged)) && <h4>Reason for flagging</h4>}
      </div>
      <div>
        {users.map((user) => (
          <UserRow key={user._id} user={user} handleClick={handleClick} />
        ))}
        {users.length === 0 && <p>No users found. Please modify the filter option.</p>}
      </div>
    </div>
  );
};

function UserRow({ user, handleClick }) {
  return (
    <div>
      <div>
        <Link to={`/admin/users/${user._id}`}>
          {`${user.fname} ${user.lname} (${user.userName})`}
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

export default ViewAllUsers;
