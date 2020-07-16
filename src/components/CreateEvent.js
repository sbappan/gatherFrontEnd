import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import DatePicker from 'react-datepicker'; // https://reactdatepicker.com/
import 'react-datepicker/dist/react-datepicker.css';
import { createOrUpdateItem } from '../Helpers';
// import { createOrUpdateItem /* , getOneItem */ } from '../Helpers';

export default class CreateEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      group: '',
      // group: {},
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
      /* const group = await getOneItem('groups', event.group);
       ***** No way to tell what group this event is being created for (I think) */
      /* const allInterests = interests.map((interest) => ({
        selected: false,
        ...interest,
      }));
      this.setState({ allInterests }); */
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
      group: '123',
      date: date.toISOString(),
      attendees: [],
      reviews: [],
      location: {
        line1: '123',
        city: 'Toronto',
        postalCode: 'M3J 0E4',
        province: 'ON',
      },
      status: {
        isFlagged: false,
        reason: '',
      },
    };
    console.log(bodyData.date);
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
            selected={this.state.date}
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
