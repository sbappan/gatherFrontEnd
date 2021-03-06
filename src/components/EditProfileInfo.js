import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  getAssociatedItems, createOrUpdateItem, getAllItems, getOneItem, deleteItem,
} from '../Helpers';
import profile from '../stockProfileImage.png';

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
  const [messageUpdates, setMssageUpdates] = useState(userInfo.emailUpdates.messageUpdates);
  const [newGroupUpdates, setNewGroupUpdates] = useState(userInfo.emailUpdates.newGroupUpdates);
  const [newEventUpdates, setNewEventUpdates] = useState(userInfo.emailUpdates.newEventUpdates);
  const [replyUpdates, setReplyUpdates] = useState(userInfo.emailUpdates.replyUpdates);

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

    const cloudName = `${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}`;
    const cloudPreset = `${process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}`;

    const { files } = document.querySelector('input[type="file"]');
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('upload_preset', cloudPreset);
    const options = {
      method: 'POST',
      body: formData,
    };

    const photoUploadPromise = await fetch(`https://api.Cloudinary.com/v1_1/${cloudName}/image/upload`, options);

    const photoObj = await photoUploadPromise.json();

    const bodyData = {
      fname,
      lname,
      userName,
      email,
      photo: photoObj.secure_url,
      interests,
      updatedAt: new Date().toLocaleString('en-CA'),
      emailUpdates: {
        messageUpdates,
        newGroupUpdates,
        newEventUpdates,
        replyUpdates,
      },
    };

    if (fname !== '' && lname !== '' && userName !== '' && email !== '') {
      const updatedData = await createOrUpdateItem('PUT', 'users', bodyData, user._id);
      if (updatedData._id) {
        setUser(updatedData);
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

  const handleDeleteClick = async (uId) => {
    groups.map((m, i) => {
      groups[i].members.map((id, j) => {
        if (groups[i].members[j]._id === userInfo._id) {
          groups[i].members.splice(j, 1);

          const bodyData = {
            members: groups[i].members,
          };
          createOrUpdateItem('PUT', 'groups', bodyData, groups[i]._id);
        }
        return groups[i].members;
      });
      return groups;
    });

    const updatedData = await deleteItem('users', uId);

    if (!updatedData.errors) {
      authContext.logout(true);
    } else {
    // console.log(updatedData.errors);
    }
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
  const userPhoto = user.photo || profile;

  return (
    <>
      <form action="" method="PUT">
        <h2>
          Edit Profile:
        </h2>
        <h2>
          {`${user.fname} ${user.lname} (${user.userName})`}
        </h2>

        <h4>Profile picture</h4>
        <img src={userPhoto} alt="Profile" style={profileStyle} />
        <div className="form-group">
          <p>Upload new photo:</p>
          <input type="file" accept="image/png, image/jpeg" />
        </div>
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
        <div>
          <Link to="/changepassword/">
            <button type="button" className="success">Change password</button>
          </Link>
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

        <h4>Email Updates</h4>
        <label htmlFor="messageUpdates">
          <input
            id="messageUpdates"
            name="messageUpdates"
            type="checkbox"
            checked={messageUpdates}
            onChange={(e) => setMssageUpdates(e.target.checked)}
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
            onChange={(e) => setNewGroupUpdates(e.target.checked)}
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
            onChange={(e) => setNewEventUpdates(e.target.checked)}
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
            onChange={(e) => setReplyUpdates(e.target.checked)}
          />
          Reply updates
        </label>

        <div>
          <button type="button" className="safe" onClick={handleSubmit}>Save</button>
        </div>
        <div style={{ color: 'dodgerblue' }}>
          {submitMessage}
        </div>

      </form>

      <br />
      <br />
      <h2 style={{ color: 'red' }}>Please be careful. Deactivating your account is permanent.</h2>
      <br />
      <button
        type="button"
        className="danger"
        style={{ width: '15rem' }}
        collection="events"
        onClick={() => {
          // eslint-disable-next-line no-alert
          if (window.confirm(`Are you sure you want to deactivate your account: ${user.userName}?\n(Careful, there is no undoing this request!)`)) { handleDeleteClick(user._id); }
        }}
      >
        Deactivate Account
      </button>
      {/* </>
      )} */}
    </>
  );
};

export default EditProfileInfo;
