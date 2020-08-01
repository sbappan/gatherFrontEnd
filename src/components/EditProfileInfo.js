import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {
  getAssociatedItems, createOrUpdateItem, getAllItems, getOneItem,
} from '../Helpers';
import profile from '../stockProfileImage.jpg';

const EditProfileInfo = () => {
  const authContext = useContext(AuthContext);
  const {
    setAuthState, authState: { userInfo, token, expiresAt },
  } = authContext;
  const [user, setUser] = useState({});
  const [events, setEvents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [allInterests, setAllInterests] = useState([]);
  const [fname, setFName] = useState(userInfo.fname);
  const [lname, setLName] = useState(userInfo.lname);
  const [email, setEmail] = useState(userInfo.email);
  const [userName, setUserName] = useState(userInfo.userName);
  const [submitMessage, setSubmitMessage] = useState('');
  const [fnameError, setFNameError] = useState('');
  const [lnameError, setLNameError] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    const getData = async () => {
      const userData = await getOneItem('users', userInfo._id);
      setUser(userData);
      const eventsPromise = getAssociatedItems('events', user._id);
      const groupsPromise = getAssociatedItems('groups', user._id);
      const [eventsData, groupsData] = await Promise.all([eventsPromise, groupsPromise]);
      setEvents(eventsData);
      setGroups(groupsData);
    };
    getData();
  }, [userInfo._id, user._id]);
  // }, [userInfo._id, user._id, user.interests]);

  useEffect(() => {
    const getData = async () => {
      const interests = await getAllItems('interests');
      if (user._id) {
        const interestsData = interests.map((interest) => ({
          selected: user.interests.includes(interest._id),
          ...interest,
        }));
        setAllInterests(interestsData);
      }
    };
    getData();
  }, [user._id, user.interests]);


  const setErrors = async () => {
    setFNameError(!fname ? 'This field is required' : '');
    setLNameError(!lname ? 'This field is required' : '');
    setUserNameError(!userName ? 'This field is required' : '');
    setEmailError(!email ? 'This field is required' : '');
  };

  const handleSubmit = async () => {
    // filter for selected interests and store the id of the selected interests in the array
    const interests = allInterests.filter((i) => i.selected).map((i) => i._id);

    const bodyData = {
      fname,
      lname,
      userName,
      email,
      interests,
      updatedAt: new Date().toLocaleString('en-CA'),
    };

    if (fname !== '' && lname !== '' && userName !== '' && email !== '') {
      const updatedData = await createOrUpdateItem('PUT', 'users', bodyData, user._id);
      if (updatedData._id) {
        setAuthState({ token, expiresAt, userInfo: updatedData });
        setSubmitMessage('Profile updated successfully!');
        setTimeout(() => {
          setSubmitMessage('');
        }, 5000);
      }
    } else {
      setErrors();
    }
  };

  const handleCheckInterest = async (id) => {
    const updatedInterests = allInterests.map((interest) => {
      if (interest._id === id) {
        return {
          ...interest,
          selected: !interest.selected,
        };
      }
      return interest;
    });
    setAllInterests(updatedInterests);
  };

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
    <>
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
            type="text"
            name="fname"
            value={fname}
            onChange={(e) => setFName(e.target.value)}
            required
          />
          <p style={{ color: 'red' }}>{fnameError}</p>
        </div>

        <div>
          <strong>Last Name: </strong>
          <input
            name="lname"
            value={lname}
            onChange={(e) => setLName(e.target.value)}
            required
          />
          <p style={{ color: 'red' }}>{lnameError}</p>
        </div>

        <div>
          <strong>Username: </strong>
          <input
            name="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <p style={{ color: 'red' }}>{userNameError}</p>
        </div>

        <div>
          <strong>Email: </strong>
          <input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p style={{ color: 'red' }}>{emailError}</p>
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
                  onChange={() => handleCheckInterest(interest._id)}
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
          <button type="button" className="safe" onClick={handleSubmit}>Save</button>
        </div>
        <div style={{ color: 'dodgerblue' }}>
          {submitMessage}
        </div>
      </form>
    </>
  );
};

export default EditProfileInfo;
