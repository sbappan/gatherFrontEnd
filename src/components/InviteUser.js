import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const InviteUser = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const authContext = useContext(AuthContext);
  const { authState: { userInfo } } = authContext;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bodyData = {
      name,
      email,
      senderName: `${userInfo.fname} ${userInfo.lname}`,
    };

    const updatedData = await fetch(`${process.env.REACT_APP_API_LINK}/users/invite`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    })
      .then((response) => response.json())
      .then((_data) => _data)
      .catch((err) => err);

    if (updatedData.message.includes('Invitation email has been sent to')) {
      setMessage(updatedData.message);
    }
  };

  return (
    <>
      <h2>Invite user</h2>
      <form onSubmit={handleSubmit} className="inviteForm">
        <p style={{ margin: 0 }}>Name:</p>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter a name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <p style={{ margin: 0 }}>Email:</p>
        <input
          type="email"
          name="email"
          placeholder="Enter an email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input className="safe" type="submit" value="Send" />
        {message && <p style={{ color: '#00d1ff' }}>{message}</p>}
      </form>
    </>
  );
};

export default InviteUser;
