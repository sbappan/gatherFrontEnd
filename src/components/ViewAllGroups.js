import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ViewAllGroups extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groups: [],
    };
  }

  async componentDidMount() {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_LINK}/groups`);
      const groups = await res.json();
      this.setState({ groups });
    } catch (error) {
      console.log('error: ', error);
    }
  }

  render() {
    const { groups } = this.state;
    return (
      <div>
        <h2>Groups</h2>
        {groups.map((group) => (
          <p>
            <Link to={`/groups/${group._id}`} key={group._id}>
              {group.name}
            </Link>
          </p>
        ))}
      </div>
    );
  }
}

export default ViewAllGroups;
