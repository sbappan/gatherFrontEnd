import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { getAllItems, createOrUpdateItem } from '../Helpers';

export default class CreateGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      interests: [],
      allInterests: [],
      redirectToReferrer: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckInterest = this.handleCheckInterest.bind(this);
  }

  async componentDidMount() {
    try {
      const interests = await getAllItems('interests');
      const allInterests = interests.map((interest) => ({ selected: false, ...interest }));
      this.setState({ allInterests });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  handleCheckInterest(id) {
    this.setState((prevState) => {
      const updatedInterests = prevState.allInterests.map((interest) => {
        if (interest._id === id) {
          return {
            ...interest,
            selected: !interest.selected,
          };
        }
        return interest;
      });
      // filter for selected interests and store the id of the selected interests in the array
      const interests = updatedInterests.filter((i) => i.selected).map((i) => i._id);
      return {
        allInterests: updatedInterests,
        interests,
      };
    });
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  async handleClick() {
    const { name, description, interests } = this.state;
    // ToDo: Once Log In use case is done, add to body the logged in user as group admin
    // ToDo: Add client side and server side validation to ensure required fields are present
    const bodyData = {
      name,
      description,
      interests,
      members: [],
      comments: [],
      status: {
        isFlagged: false,
        reason: '',
      },
    };
    const updatedData = await createOrUpdateItem('POST', 'groups', bodyData);
    if (updatedData.insertedCount === 1) {
      this.setState({ redirectToReferrer: true });
    }
  }

  render() {
    const {
      allInterests, name, description, redirectToReferrer,
    } = this.state;
    if (redirectToReferrer === true) {
      return <Redirect to="/" />;
    }
    const interestStyle = {
      display: 'flex',
      alignItems: 'baseline',
    };
    const interestFieldSetStyle = {
      marginTop: '.5rem',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
    };
    const formStyle = {
      width: '60%',
    };

    return (
      <>
        <h2>Create Group</h2>
        <form action="" method="post" style={formStyle}>
          <h4>Name</h4>
          <input
            type="text"
            name="name"
            placeholder="Group name"
            value={name}
            onChange={this.handleChange}
            required
          />
          <h4>Description</h4>
          <textarea
            name="description"
            placeholder="Group description"
            value={description}
            onChange={this.handleChange}
            required
          />
          <h4>Interests</h4>
          <div style={interestFieldSetStyle}>
            {allInterests.map((interest) => (
              <div key={interest._id} style={interestStyle}>
                <label htmlFor={`${interest.name}-id`}>
                  <input
                    id={`${interest.name}-id`}
                    type="checkbox"
                    checked={interest.selected}
                    onChange={() => this.handleCheckInterest(interest._id)}
                  />
                  {interest.name}
                </label>
              </div>
            ))}
          </div>
          <button type="button" className="safe" onClick={() => this.handleClick()}>Submit</button>
        </form>
      </>
    );
  }
}
