import React, { useState, useEffect, useContext } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import { createOrUpdateItem, getOneItem } from '../Helpers';
import { AuthContext } from '../context/AuthContext';

const EditEvent = () => {
  const authContext = useContext(AuthContext);
  const { authState: { userInfo } } = authContext;
  const { _id: eventId } = useParams();
  const [event, setEvent] = useState({});
  const [group, setGroup] = useState({});
  const [user, setUser] = useState({});

  const [name, setEventName] = useState('');
  const [description, setEventDescription] = useState('');
  const [date, setEventDate] = useState(new Date());
  const [tempDate, setTempDate] = useState('');
  const [location, setEventLocation] = useState({
    line1: '', line2: '', city: '', postalCode: '', province: '',
  });
  const [attendees, setEventAttendees] = useState([]);
  const [reviews, setEventReviews] = useState([]);
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const getEvent = async () => {
      const eventData = await getOneItem('events', eventId);
      setEvent(eventData);
      setEventName(eventData.name);
      setEventDescription(eventData.description);
      setEventDate(eventData.date);
      setTempDate((`${eventData.date.substring(0, 10)} ${eventData.date.substring(12, 16)}`));
      setEventLocation(eventData.location);
      setEventAttendees(eventData.attendees);
      setEventReviews(eventData.reviews);
    };
    getEvent();
  }, [eventId]);

  useEffect(() => {
    const getGroup = async () => {
      const groupData = await getOneItem('groups', event.group);
      setGroup(groupData);
    };
    if (event.group) {
      getGroup();
    }
  }, [event.group]);

  useEffect(() => {
    const getUser = async () => {
      const userData = await getOneItem('users', event.updatedBy);
      setUser(userData);
    };

    if (event.status && event.status.updatedBy) {
      getUser();
    }
  }, [event.status]);

  const handleDateChange = (newDate) => {
    setEventDate(newDate);
    setTempDate(newDate);
  };

  const handleClick = async (eId) => {
    const bodyData = {
      name,
      description,
      group: group._id,
      date,
      createdBy: event.createdBy,
      // createdBy: userInfo._id,
      updatedBy: userInfo._id,
      attendees,
      reviews,
      location,
      status: {
        isFlagged: false,
        reason: '',
        updatedBy: event.status.updatedBy,
      },
    };

    console.log(bodyData.name);
    console.log(bodyData.description);
    console.log(bodyData.group);
    console.log(bodyData.date);
    console.log(bodyData.createdBy);
    console.log(bodyData.updatedBy);
    console.log(bodyData.attendees);
    console.log(bodyData.reviews);
    console.log(bodyData.location.line1);
    console.log(bodyData.location.line2);
    console.log(bodyData.location.city);
    console.log(bodyData.location.province);
    console.log(bodyData.location.postalCode);
    console.log(bodyData.status.updatedBy);

    const updatedData = await createOrUpdateItem('PUT', 'events', bodyData, eId);

    console.log(updatedData.errors);

    if (!updatedData.errors) {
      setRedirectToReferrer(true);
    } else {
      setServerError('Please make sure the form is complete.');
    }
  };

  if (redirectToReferrer === true) {
    return <Redirect to={`/events/${event._id}`} />;
  }
  const formStyle = {
    width: '60%',
  };

  return (
    <>
      <h2>Edit Event</h2>
      <h3>Last updated by:</h3>
      <p>{user._id && `${user.fname} ${user.lname} on ${moment(event.updatedAt).format('LLL')}`}</p>
      <b />
      <form action="" method="post" style={formStyle}>
        <h4>Group Name:</h4>
        <p>{group.name}</p>
        <h4>Event Name</h4>
        <input
          type="text"
          name="name"
          placeholder="Event name"
          value={name}
          onChange={(e) => setEventName(e.target.value)}
          required
        />
        <h4>Day and Time</h4>
        <DatePicker
          selected={tempDate}
          onChange={handleDateChange}
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
          onChange={(e) => setEventDescription(e.target.value)}
          required
        />
        <h4>Address Line 1</h4>
        <input
          type="text"
          name="line1"
          placeholder="Street Address"
          value={location.line1}
          onChange={(e) => setEventLocation({ ...location, line1: e.target.value })}
          required
        />
        <h4>Address Line 2 (Optional)</h4>
        <input
          type="text"
          name="line2"
          placeholder="Apartment , suite, unit, building, floor, etc."
          value={location.line2}
          onChange={(e) => setEventLocation({ ...location, line2: e.target.value })}
        />
        <h4>City</h4>
        <input
          type="text"
          name="city"
          placeholder="City"
          value={location.city}
          onChange={(e) => setEventLocation({ ...location, city: e.target.value })}
          required
        />
        <h4>Province or Territory</h4>
        <select
          type="select"
          name="province"
          value={location.province}
          onChange={(e) => setEventLocation({ ...location, province: e.target.value })}
          required
        >
          <option value="">Select an option</option>
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
          onChange={(e) => setEventLocation({ ...location, postalCode: e.target.value })}
          required
        />
        <p style={{ color: 'red' }}>{serverError}</p>
        <button
          type="button"
          className="safe"
          onClick={() => handleClick(event._id)}
        >
          Submit
        </button>
        <Link to={`/events/${event._id}`}>
          <button type="button" className="success">Back</button>
        </Link>
      </form>
    </>
  );
};

export default EditEvent;
