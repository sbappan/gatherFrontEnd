import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FlagItemRowButtons, FilterItemsButtons } from './Buttons';
import { createUpdateItem, getAllItems } from '../Helpers';

export default class ViewAllGroups extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groups: [],
      allGroups: [],
      activeFilter: 'All',
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  async componentDidMount() {
    try {
      const groups = await getAllItems('groups');
      this.setState({ groups, allGroups: groups });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  async handleClick(groupId) {
    const { activeFilter } = this.state;
    const bodyData = {
      status: {
        isFlagged: false,
        reason: '',
      },
    };

    const updatedData = await createUpdateItem('PUT', 'groups', groupId, bodyData);
    if (updatedData.length > 0) {
      this.setState({ allGroups: updatedData });
      this.handleFilter(activeFilter);
    }
  }

  handleFilter(text) {
    const { allGroups } = this.state;
    if (text === 'All') {
      this.setState({ groups: allGroups, activeFilter: text });
    } else {
      const condition = text === 'Flagged';
      const filteredGroups = allGroups.filter((group) => group.status.isFlagged === condition);
      this.setState({ groups: filteredGroups, activeFilter: text });
    }
  }

  render() {
    const { groups, allGroups, activeFilter } = this.state;

    if (allGroups.length === 0) {
      return <h3>Loading....</h3>;
    }

    return (
      <div className="allItemsList">
        <div>
          <h2>Groups</h2>
          <FilterItemsButtons handleFilter={this.handleFilter} activeFilter={activeFilter} />
          {(groups.some((group) => group.status.isFlagged)) && <h4>Reason for flagging </h4>}
        </div>
        <div>
          {groups.map((group) => (
            <GroupRow key={group._id} group={group} handleClick={this.handleClick} />
          ))}
          {groups.length === 0 && <p>No groups found. Please modify the filter option.</p>}
        </div>
      </div>
    );
  }
}

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
