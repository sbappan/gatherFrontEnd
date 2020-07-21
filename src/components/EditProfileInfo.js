import React, { Component } from 'react';
import {
  getOneItem, getAssociatedItems, createOrUpdateItem, getAllItems,
} from '../Helpers';
import profile from '../stockProfileImage.jpg';

class EditProfileInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      events: [],
      groups: [],
      fname: '',
      lname: '',
      userName: '',
      email: '',

      allInterests: [],
      errors: {
        fnameError: '',
        lnameError: '',
        userNameError: '',
        emailError: '',
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCheckInterest = this.handleCheckInterest.bind(this);
    this.validate = this.validate.bind(this);
  }

  async componentDidMount() {
    try {
      const { match, itemId } = this.props;
      const userId = itemId || match.params._id;
      const user = await getOneItem('users', userId);
      const events = await getAssociatedItems('events', user._id);
      const groups = await getAssociatedItems('groups', user._id);

      const interests = await getAllItems('interests');
      const allInterests = interests.map((interest) => ({
        selected: user.interests.includes(interest._id),
        ...interest,
      }));

      this.setState({
        user,
        events,
        groups,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        userName: user.userName,

        allInterests,
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  validate() {
    const {
      fname,
      lname,
      userName,
      email,
    } = this.state;
    const fnameError = !fname ? 'This field is required' : '';
    const lnameError = !lname ? 'This field is required' : '';
    const userNameError = !userName ? 'This field is required' : '';
    const emailError = !email ? 'This field is required' : '';
    this.setState({
      errors: {
        fnameError, lnameError, userNameError, emailError,
      },
    });
    return !!((fnameError === '' && lnameError === '' && userNameError === '' && emailError === ''));
  }


  async handleSubmit() {
    const {
      user, email, fname, lname, userName, allInterests,
    } = this.state;
    // filter for selected interests and store the id of the selected interests in the array
    const interests = allInterests.filter((i) => i.selected).map((i) => i._id);

    const bodyData = {
      fname,
      lname,
      userName,
      email,
      interests,
    };

    if (this.validate()) {
      const updatedData = await createOrUpdateItem('PUT', 'users', bodyData, user._id);
      if (updatedData.length > 0) {
      // this.setState({ redirectToReferrer: true });
      }
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

      return {
        allInterests: updatedInterests,
      };
    });
  }


  render() {
    const {
      user, events, groups, fname, lname, email, userName, allInterests, errors,
    } = this.state;
    const profileStyle = { width: '10rem', height: 'auto' };
    const interestStyle = {
      display: 'flex',
      alignItems: 'baseline',
    };
    const interestFieldSetStyle = {
      marginTop: '.5rem',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
      width: '60%',
    };

    return (
      <form action="" method="PUT">
        <h2>
          Edit Profile:
        </h2>
        <h2>
          {`${user.fname} ${user.lname} (${user.userName})`}
        </h2>

        <img src={profile} alt="Profile" style={profileStyle} />

        <div>
          <strong>First Name: </strong>
          <input
            name="fname"
            value={fname}
            onChange={this.handleChange}
            required
          />
          <p style={{ color: 'red' }}>{errors.fnameError}</p>
        </div>


        <div>
          <strong>Last Name: </strong>
          <input
            name="lname"
            value={lname}
            onChange={this.handleChange}
            required
          />
          <p style={{ color: 'red' }}>{errors.lnameError}</p>
        </div>

        <div>
          <strong>Username: </strong>
          <input
            name="userName"
            value={userName}
            onChange={this.handleChange}
            required
          />
          <p style={{ color: 'red' }}>{errors.userNameError}</p>
        </div>

        <div>
          <strong>Email: </strong>
          <input
            name="email"
            value={email}
            onChange={this.handleChange}
            required
          />
          <p style={{ color: 'red' }}>{errors.emailError}</p>
        </div>

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

        <h4>Groups</h4>
        <ul>
          {groups.map((group) => (
            <li key={group._id}>
              {group.name}
            </li>
          ))}
        </ul>
        {groups.length === 0 && 'None'}
        <h4>Events</h4>
        <ul>
          {events.map((event) => (
            <li key={event._id}>
              {event.name}
            </li>
          ))}
        </ul>
        {events.length === 0 && 'None'}

        <div>
          <button type="button" className="safe" onClick={() => this.handleSubmit()}>Save</button>
        </div>
      </form>
    );
  }
}

export default EditProfileInfo;
