import React, { Component } from 'react';
import { getOneItem, getAllItems, transformArrayToObject } from '../Helpers';
import { LinkButton } from './Buttons';

class ViewGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      group: {},
      usersObj: {},
    };
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const groupId = match.params._id;
      const group = await getOneItem('groups', groupId);
      const users = await getAllItems('users');
      const usersObj = transformArrayToObject(users);
      this.setState({ group, usersObj });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  render() {
    const { group, usersObj } = this.state;
    return (
      <div>
        <LinkButton className="success" text="Back to groups" collection="groups" />
        <h2>{group.name}</h2>
        <p>{group.description}</p>
        <div>
          <div>
            <h4>Status</h4>
            <p>
              {'Flagged: '}
              <span>{group.status && (group.status.isFlagged ? 'Yes' : 'No')}</span>
            </p>
            {group.status && group.status.isFlagged && (
              <p>
                {`Reason: ${group.status.reason}`}
              </p>
            )}
          </div>
          <div>
            <h4>Interests</h4>
            {group.interests && group.interests.map((interest) => (
              <p key={interest._id}>
                {interest.name}
              </p>
            ))}
          </div>
        </div>
        <div>
          <h4>Members</h4>
          {group.members && group.members.map((member) => (
            <p key={member._id}>
              {`${usersObj[member._id].fname} ${usersObj[member._id].lname} `}
              {member.isAdmin ? '(admin)' : ''}
            </p>
          ))}
        </div>
      </div>
    );
  }
}

export default ViewGroup;
