import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UnflagButton from './UnflagButton';

class FlagGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      group: {},
      reason: '',
      isFlagged: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    try {
      const groupId = this.props.match.params._id;
      const res = await fetch(`${process.env.REACT_APP_API_LINK}/groups/${groupId}`);
      const group = await res.json();
      this.setState({ group, reason: group.status.reason, isFlagged: group.status.isFlagged });
    } catch (error) {
      console.log('error: ', error);
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event, groupId) {
    event.preventDefault();

    const { reason } = this.state;
    const method = 'PUT';
    const bodyData = {
      status: {
        isFlagged: true,
        reason,
      },
    };
    console.log('bodyData: ', bodyData);

    fetch(`${process.env.REACT_APP_API_LINK}/groups/${groupId}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ isFlagged: true });
      })
      .catch((error) => {
      });
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
        this.setState({ isFlagged: false, reason: '' });
      })
      .catch((error) => {
      });
  }

  render() {
    const { group, reason, isFlagged } = this.state;

    return (
      <div className="flagGroup">
        <h2>Flag Group</h2>
        <h3>Group Name:</h3>
        <p>{group.name}</p>
        <h3>Group Description:</h3>
        <p>{group.description}</p>
        <h3>Group status:</h3>
        <p>{isFlagged ? 'Flagged' : 'Not flagged'}</p>
        <form onSubmit={(e) => this.handleSubmit(e, group._id)}>
          <h3>Reason:</h3>
          <textarea
            name="reason"
            placeholder="Please enter the reason for flagging the group"
            value={reason}
            onChange={this.handleChange}
            required
          />
          <br />
          <br />
          <button type="submit" className="danger">Submit</button>

          { isFlagged
            ? (
              <>
                <UnflagButton groupId={group._id} handleClick={this.handleClick} />
                <Link to="/groups/">
                  <button type="button" className="success">Back to groups list</button>
                </Link>
              </>
            )
            : <Link to="/groups/"><button type="button" className="safe">Cancel</button></Link>}

        </form>
      </div>
    );
  }
}

export default FlagGroup;
