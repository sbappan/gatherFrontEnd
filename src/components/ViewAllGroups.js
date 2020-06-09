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

    if (groups.length === 0) {
      return <h3>Loading....</h3>;
    }

    return (
      <div className="allGroups">
        <h2>Groups</h2>
        {groups.map((group) => (
          <div key={group._id}>
            <p>
              <Link to={`/groups/${group._id}`}>
                {group.name}
              </Link>
              {!group.status.isFlagged
                ? <FlagGroupButton group={group} />
                : <UnflagGroupButton group={group} />}
            </p>
          </div>
        ))}
      </div>
    );
  }
}

function FlagGroupButton({ group }) {
  return (
    <Link to={`/groups/flag/${group._id}`} key={group._id}>
      <button type="button" className="danger">
        Flag Group
      </button>
    </Link>
  );
}

function UnflagGroupButton() {
  return (
    <button type="button" className="safe">
      Unflag Group
    </button>
  );
}

export default ViewAllGroups;
