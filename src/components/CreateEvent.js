import React, { useState, useEffect, useContext } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createOrUpdateItem, getOneItem } from '../Helpers';
import { AuthContext } from '../context/AuthContext';

const CreateEvent = () => {
  const authContext = useContext(AuthContext);
  const { authState: { userInfo } } = authContext;
  const { _id: groupId } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [group, setGroup] = useState({});
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState({
    line1: '', line2: '', city: '', postalCode: '', province: '',
  });
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const getData = async () => {
      const groupData = await getOneItem('groups', groupId);
      setGroup(groupData);
    };
    getData();
  }, [groupId]);

  const handleDateChange = (newDate) => {
    setDate(newDate);
  };

  const handleClick = async () => {
    const bodyData = {
      name,
      description,
      group: group._id,
      date: date.toISOString(),
      createdBy: userInfo._id,
      updatedBy: userInfo._id,
      attendees: [userInfo._id],
      reviews: [],
      location,
      status: {
        isFlagged: false,
        reason: '',
        updatedBy: userInfo._id,
      },
    };

    const updatedData = await createOrUpdateItem('POST', 'events', bodyData);

    if (updatedData._id) {
      setRedirectToReferrer(true);
    } else {
      setServerError('Please make sure the form is complete.');
    }
  };

  if (redirectToReferrer === true) {
    return <Redirect to={`/groups/${groupId}`} />;
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
          onChange={(e) => setName(e.target.value)}
          required
        />
        <h4>Day and Time</h4>
        <DatePicker
          selected={date}
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
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <h4>Address Line 1</h4>
        <input
          type="text"
          name="line1"
          placeholder="Street Address"
          value={location.line1}
          onChange={(e) => setLocation({ ...location, line1: e.target.value })}
          required
        />
        <h4>Address Line 2 (Optional)</h4>
        <input
          type="text"
          name="line2"
          placeholder="Apartment , suite, unit, building, floor, etc."
          value={location.line2}
          onChange={(e) => setLocation({ ...location, line2: e.target.value })}
        />
        <h4>City</h4>
        <input
          type="text"
          name="city"
          placeholder="City"
          value={location.city}
          onChange={(e) => setLocation({ ...location, city: e.target.value })}
          required
        />
        <h4>Province or Territory</h4>
        <select
          type="select"
          name="province"
          onChange={(e) => setLocation({ ...location, province: e.target.value })}
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
          onChange={(e) => setLocation({ ...location, postalCode: e.target.value })}
          required
        />
        <p style={{ color: 'red' }}>{serverError}</p>
        <button
          type="button"
          className="safe"
          onClick={() => handleClick()}
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default CreateEvent;
