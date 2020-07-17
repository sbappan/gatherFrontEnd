import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import DatePicker from 'react-datepicker'; // https://reactdatepicker.com/
import 'react-datepicker/dist/react-datepicker.css';
import { createOrUpdateItem, getOneItem } from '../Helpers';

export default class CreateEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      group: {},
      date: new Date(),
      location: {},
      redirectToReferrer: false,
      serverError: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  async componentDidMount() {
    try {
      const {
        match: {
          params: { _id: groupId },
        },
      } = this.props;
      const group = await getOneItem('groups', groupId);
      this.setState({
        group,
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleDateChange(newDate) {
    this.setState({
      date: newDate,
    });
  }

  async handleClick() {
    const { name, description, group, date, location } = this.state;

    const bodyData = {
      name,
      description,
      group: group._id,
      date: date.toISOString(),
      attendees: [],
      reviews: [],
      location,
      /* location: {
        line1: '123',
        city: 'Toronto',
        postalCode: 'M3J 0E4',
        province: 'ON',
      }, */
      status: {
        isFlagged: false,
        reason: '',
      },
    };
    // console.log(bodyData.group);
    // console.log(bodyData.date); // --------
    const updatedData = await createOrUpdateItem('POST', 'events', bodyData);

    if (!updatedData.errors) {
      this.setState({ redirectToReferrer: true });
    } else {
      this.setState({
        serverError: 'Please make sure the form is complete.',
      });
    }
  }

  render() {
    const {
      name,
      description,
      date,
      group,
      location,
      redirectToReferrer,
      serverError,
    } = this.state;
    if (redirectToReferrer === true) {
      return <Redirect to="/" />;
    }
    const formStyle = {
      width: '60%',
    };

    return (
      <>
        <h2>Create Event</h2>
        <form action="" method="post" style={formStyle}>
          <h4>Group Name:</h4>
          <p>{group.name}</p>
          <h4>Name</h4>
          <input
            type="text"
            name="name"
            placeholder="Event name"
            value={name}
            onChange={this.handleChange}
            required
          />
          <h4>Day and Time</h4>
          <DatePicker
            selected={date}
            onChange={this.handleDateChange}
            showTimeSelect
            minDate={new Date()}
            dateFormat="Pp"
            required
          />
          <h4>Description</h4>
          <textarea
            name="description"
            placeholder="Event description"
            value={description}
            onChange={this.handleChange}
            required
          />
          <h4>Address Line 1</h4>
          <input
            type="text"
            name="line1"
            placeholder="Street Address"
            value={location.line1}
            onChange={this.handleChange}
            required
          />
          <h4>Address Line 2 (Optional)</h4>
          <input
            type="text"
            name="line2"
            placeholder="Appartment, suite, unit, building, flor, etc."
            value={location.line2}
            onChange={this.handleChange}
          />
          <h4>City</h4>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={location.city}
            onChange={this.handleChange}
            required
          />
          <h4>Province or Territoire</h4>
          <select
            type="text"
            name="province"
            value={location.province}
            onChange={this.handleChange}
            required
          >
            <option value="ON">Ontario</option>
            <option value="AB">Alberta</option>
            <option value="BC">British Columbia</option>
            <option value="MB">Manitoba</option>
            <option value="NL">Newfoundland and Labrador</option>
            <option value="NB">New Brunswick</option>
            <option value="NT">Northwest Territories</option>
            <option value="NS">Nova Scotia</option>
            <option value="NU">Nunavut</option>
            <option value="PE">Prince Edward Island</option>
            <option value="QC">Quebec</option>
            <option value="SK">Saskatchewan</option>
            <option value="YT">Yukon</option>
          </select>
          <h4>Postal Code</h4>
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={location.postalCode}
            onChange={this.handleChange}
            required
          />
          <p style={{ color: 'red' }}>{serverError}</p>
          <button
            type="button"
            className="safe"
            onClick={() => this.handleClick()}
          >
            Submit
          </button>
        </form>
      </>
    );
  }
}
