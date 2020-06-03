import React, { Component } from 'react';

class ViewGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      group: {},
    };
  }

  async componentDidMount() {
    try {
      const groupId = '5ece7b0cb840c08079e5ea1f';
      const res = await fetch(`${process.env.REACT_APP_API_LINK}/groups/${groupId}`);
      const group = await res.json();
      this.setState({ group });
    } catch (error) {
      console.log('error: ', error);
    }
  }

  render() {
    const { group } = this.state;
    return (
      <div>
        <h2>{group.name}</h2>
        <p>{group.description}</p>
        <div>
          <div>
            <h4>Status</h4>
            <p>Flagged: <span>{group.status ? (group.status.isFlagged ? "Yes" : "No") : ""}</span></p>
            <p>Reason: <span>{group.status ? group.status.reason : ""}</span></p>
          </div>
          <div>
            <h4>Interests</h4>
            {!group.interests ? "" : group.interests.map(interest => (
            <p key={interest._id}> {interest.name} </p>
          ))}
          </div>
        </div>
        <div>
          <h4>Members</h4>
          {!group.members ? "" : group.members.map(member => (
          <p key={member._id}> {member.fname} {member.lname} {member.isAdmin ? "(admin)" : ""}</p>
        ))}
        </div>
      </div>
    );
  }
}

export default ViewGroup;