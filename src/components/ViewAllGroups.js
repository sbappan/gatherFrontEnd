import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FlagItemRowButtons, FilterItemsButtons } from './Buttons';
import { createOrUpdateItem, getAllItems, updateAllItemsArray } from '../Helpers';
import { AuthContext } from '../context/AuthContext';

const ViewAllGroups = () => {
  const authContext = useContext(AuthContext);
  const { authState } = authContext;

  const [groups, setGroups] = useState([]);
  const [allGroups, setAllGroups] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const getData = async () => {
      const groupsData = await getAllItems('groups');
      setGroups(groupsData);
      setAllGroups(groupsData);
    };
    getData();
  }, []);

  useEffect(() => {
    let filteredGroups = [];
    if (activeFilter === 'All') {
      filteredGroups = allGroups;
    } else {
      const condition = activeFilter === 'Flagged';
      filteredGroups = allGroups.filter((group) => group.status.isFlagged === condition);
    }
    setGroups(filteredGroups);
  }, [activeFilter, allGroups]);

  const handleFilter = (text) => {
    setActiveFilter(text);
  };

  const handleClick = async (groupId) => {
    const bodyData = {
      status: {
        isFlagged: false,
        reason: '',
        updatedBy: authState.userInfo._id,
      },
    };

    const updatedData = await createOrUpdateItem('PUT', 'groups', bodyData, groupId);

    if (updatedData._id) {
      setAllGroups(updateAllItemsArray(allGroups, updatedData));
      handleFilter(activeFilter);
    }
  };

  if (allGroups.length === 0) {
    return <h3>Loading....</h3>;
  }

  return (
    <div className="allItemsList">
      <div>
        <h2>Groups</h2>
        <FilterItemsButtons handleFilter={handleFilter} activeFilter={activeFilter} />
        {(groups.some((group) => group.status.isFlagged)) && <h4>Reason for flagging </h4>}
      </div>
      <div>
        {groups.map((group) => (
          <GroupRow key={group._id} group={group} handleClick={handleClick} />
        ))}
        {groups.length === 0 && <p>No groups found. Please modify the filter option.</p>}
      </div>
    </div>
  );
};

function GroupRow({ group, handleClick }) {
  return (
    <div>
      <div>
        <Link to={`/admin/groups/${group._id}`}>
          {group.name}
        </Link>
        <FlagItemRowButtons item={group} collection="groups" handleClick={handleClick} />
      </div>
      <div>
        {group.status.isFlagged && (
        <div className="overflowEllipsis">
          {group.status.reason}
        </div>
        )}
      </div>
    </div>
  );
}


export default ViewAllGroups;
