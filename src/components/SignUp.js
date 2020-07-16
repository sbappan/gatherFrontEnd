import React, { Component } from 'react';
import { getAllItems } from '../Helpers';

export default class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allInterests: [],
      interests: [],
      userName: '',
      email: '',
      fname: '',
      lname: '',
      password: '',
      password2: '',
      messageUpdates: false,
      newGroupUpdates: false,
      newEventUpdates: false,
      replyUpdates: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckInterest = this.handleCheckInterest.bind(this);
    this.handleEmailUpdateChange = this.handleEmailUpdateChange.bind(this);
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

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleEmailUpdateChange(event) {
    const { name, checked } = event.target;
    this.setState({ [name]: checked });
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

  async handleClick() {
    const {
      userName,
      email,
      fname,
      lname,
      password,
      password2,
      interests,
      messageUpdates,
      newGroupUpdates,
      newEventUpdates,
      replyUpdates,
    } = this.state;

    // ToDo: Photo upload has to be handled later

    const bodyData = {
      userName,
      email,
      fname,
      lname,
      password,
      password2,
      interests,
      emailUpdates: {
        messageUpdates,
        newGroupUpdates,
        newEventUpdates,
        replyUpdates,
      },
    };
    // const updatedData = await createOrUpdateItem('POST', 'groups', bodyData);
    // /register

    const updatedData = await fetch(`${process.env.REACT_APP_API_LINK}/users/register`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    })
      .then((response) => response.json())
      .then((_data) => _data)
      .catch((error) => error);

    console.log('updatedData: ', updatedData);
    // if (!updatedData.errors) {
    //   // this.setState({ redirectToReferrer: true });
    // } else {
    //   // this.setState({ serverError: 'Please make sure the form is complete.' });
    // }
  }

  render() {
    const {
      allInterests,
      userName,
      email,
      fname,
      lname,
      password,
      password2,
      messageUpdates,
      newGroupUpdates,
      newEventUpdates,
      replyUpdates,
    } = this.state;

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
      width: '80%',
    };
    return (
      <>
        <h2>Sign Up</h2>
        <form action="" method="post" style={formStyle}>
          <h4>Username</h4>
          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={userName}
            onChange={this.handleChange}
            required
          />
          <h4>Email</h4>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={this.handleChange}
            required
          />
          <h4>First Name</h4>
          <input
            type="text"
            name="fname"
            placeholder="First name"
            value={fname}
            onChange={this.handleChange}
            required
          />
          <h4>Last Name</h4>
          <input
            type="text"
            name="lname"
            placeholder="Last name"
            value={lname}
            onChange={this.handleChange}
            required
          />
          <h4>Password</h4>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={this.handleChange}
            required
          />
          <h4>Confirm Password</h4>
          <input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            value={password2}
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
          <h4>Email Updates</h4>
          <label htmlFor="messageUpdates">
            <input
              id="messageUpdates"
              name="messageUpdates"
              type="checkbox"
              checked={messageUpdates}
              onChange={this.handleEmailUpdateChange}
            />
            Message updates
          </label>
          <br />
          <label htmlFor="newGroupUpdates">
            <input
              id="newGroupUpdates"
              name="newGroupUpdates"
              type="checkbox"
              checked={newGroupUpdates}
              onChange={this.handleEmailUpdateChange}
            />
            New group updates
          </label>
          <br />
          <label htmlFor="newEventUpdates">
            <input
              id="newEventUpdates"
              name="newEventUpdates"
              type="checkbox"
              checked={newEventUpdates}
              onChange={this.handleEmailUpdateChange}
            />
            New event updates
          </label>
          <br />
          <label htmlFor="replyUpdates">
            <input
              id="replyUpdates"
              name="replyUpdates"
              type="checkbox"
              checked={replyUpdates}
              onChange={this.handleEmailUpdateChange}
            />
            Reply updates
          </label>
          <br />
          <br />
          <button type="button" className="safe" onClick={() => this.handleClick()}>Submit</button>
        </form>
      </>
    );
  }
}
