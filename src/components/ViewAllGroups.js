import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UnflagButton from './UnflagButton';

class ViewAllGroups extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groups: [],
    };
    this.handleClick = this.handleClick.bind(this);
  }

  // Consider adding an option for filtering flagged, unflagged and all groups

  async componentDidMount() {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_LINK}/groups`);
      const groups = await res.json();
      this.setState({ groups });
    } catch (error) {
      console.log('error: ', error);
    }
  }

  handleClick(groupId) {
    const method = 'PUT';
    const bodyData = {
      status: {
        isFlagged: false,
        reason: '',
      },
    };

    fetch(`${process.env.REACT_APP_API_LINK}/groups/${groupId}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ groups: data });
      })
      .catch((error) => {
      });
  }

  render() {
    const { groups } = this.state;

    if (groups.length === 0) {
      return <h3>Loading....</h3>;
    }

    return (
      <div className="allGroups">
        <div>
          <h2>Groups</h2>
          <h4>Reason for flagging </h4>
        </div>
        <div>
          {groups.map((group) => (
            <div key={group._id}>
              <div>
                <div>
                  <Link to={`/groups/${group._id}`}>
                    {group.name}
                  </Link>
                  {!group.status.isFlagged
                    ? <Button group={group} text="Flag Group" className="danger" />
                    : (
                      <span className="flagButtons">
                        <UnflagButton groupId={group._id} handleClick={this.handleClick} />
                        <Button group={group} text="Edit Reason" className="success" />
                      </span>
                    )}
                </div>
                <div>
                  {group.status.isFlagged && (
                  <div className="overflowEllipsis">
                    {group.status.reason}
                  </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

function Button({ group, className, text }) {
  return (
    <Link to={`/groups/flag/${group._id}`} key={group._id}>
      <button type="button" className={className}>
        {text}
      </button>
    </Link>
  );
}

export default ViewAllGroups;
