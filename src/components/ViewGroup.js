import React, { Component } from 'react';

class ViewGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      group: [],
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
    console.log('group: ', group.interests);
    return (
      <div>
        <h2>{group.name}</h2>
        <p>{group.description}</p>
        {/* <div>
          <h5>Members</h5>
          {!group.members ? "" : group.members.map(member => (
          <p key={member.userName}> {member.email} </p>
        ))}
        </div> */}
        <div>
          {!group.interests ? "" : group.interests.map(interest => (
          <p key={interest._id}> {interest.name} </p>
        ))}
        </div>
      </div>
    );
  }
}

export default ViewGroup;