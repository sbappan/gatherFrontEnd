import React, { Component } from 'react';
import { getOneItem, getAllItemsAsObject } from '../Helpers';
import { LinkButtonAdmin } from './Buttons';

class ViewGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      group: {},
      usersObj: {},
      interestsObj: {},
    };
  }

  async componentDidMount() {
    try {
      const { match: { params: { _id: groupId } } } = this.props;
      const group = await getOneItem('groups', groupId);
      const usersObj = await getAllItemsAsObject('users');
      const interestsObj = await getAllItemsAsObject('interests');
      this.setState({ group, usersObj, interestsObj });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  render() {
    const { group, usersObj, interestsObj } = this.state;
    return (
      <div>
        <LinkButtonAdmin className="success" text="Back to groups" collection="groups" />
        <h2>{group.name}</h2>
        <p>{group.description}</p>
        <div>
          <div>
            <p>
              <b>Status:  </b>
              <span>{group.status && (group.status.isFlagged ? 'Flagged' : 'Not flagged')}</span>
            </p>
            {group.status && group.status.isFlagged && (
              <p>
                <b>Reason:</b>
                {`  ${group.status.reason}`}
              </p>
            )}
          </div>
          <div>
            <h4>Interests</h4>
            {group.interests && group.interests.map((interest) => (
              <p key={interest}>
                {interestsObj[interest].name}
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
