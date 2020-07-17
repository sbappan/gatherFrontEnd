import React, { Component } from 'react';
import { FlagItemButtons } from './Buttons';
import { createOrUpdateItem, getOneItem } from '../Helpers';

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
  }

  async componentDidMount() {
    try {
      // nested destructuring with _id renamed as groupId
      const { match: { params: { _id: groupId } } } = this.props;
      const group = await getOneItem('groups', groupId);
      this.setState({ group, reason: group.status.reason, isFlagged: group.status.isFlagged });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  async handleClick(groupId, flag) {
    let { reason } = this.state;
    reason = flag ? reason : '';
    const bodyData = {
      status: {
        isFlagged: flag,
        reason,
      },
    };

    if (reason.trim() || !flag) {
      const updatedData = await createOrUpdateItem('PUT', 'groups', bodyData, groupId);
      if (!updatedData.errorMsg) {
        this.setState(updatedData.status);
      }
    } else {
      this.setState({ reason: '' });
    }
  }

  render() {
    const { group, reason, isFlagged } = this.state;

    return (
      <div className="flagItem">
        <h2>Flag Group</h2>
        <h3>Group Name:</h3>
        <p>{group.name}</p>
        <h3>Group Description:</h3>
        <p>{group.description}</p>
        <h3>Group status:</h3>
        <p>{isFlagged ? 'Flagged' : 'Not flagged'}</p>
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
        <FlagItemButtons item={group} isFlagged={isFlagged} collection="groups" handleClick={this.handleClick} />
      </div>
    );
  }
}

export default FlagGroup;
