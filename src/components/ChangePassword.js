import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const authContext = useContext(AuthContext);
  const { authState: { userInfo } } = authContext;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2 || password2.length < 6) {
      setError(true);
    } else {
      setError(false);

      const bodyData = {
        password,
        currentPassword,
        id: userInfo._id,
      };

      const updatedData = await fetch(`${process.env.REACT_APP_API_LINK}/users/change`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      })
        .then((response) => response.json())
        .then((_data) => _data)
        .catch((err) => err);

      setMessage(updatedData.message);
      if (updatedData.message.includes('Password has been changed')) {
        setSuccess(true);
        setCurrentPassword('');
        setPassword('');
        setPassword2('');
        setTimeout(() => {
          setMessage('');
          setSuccess(false);
        }, 4500);
      }
    }
  };

  return (
    <>
      <h2>Change password</h2>
      <form onSubmit={handleSubmit}>
        <h4>Current Password</h4>
        <input
          type="password"
          name="currentPassword"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <h4>Password</h4>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <h4>Confirm Password</h4>
        <input
          type="password"
          name="password2"
          placeholder="Confirm Password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />
        <div style={{ color: error ? 'red' : 'black' }}>
          {password2.length > 1 && password !== password2 && <p>Passwords do not match</p>}
          {password2.length > 0
          && password2.length < 6
          && <p>Passwords has to be at least 6 characters in length</p>}
        </div>
        <br />
        <input className="safe" type="submit" value="Submit" />
      </form>
      {message && <p style={{ color: success ? '#8de48d' : 'red' }}>{message}</p>}
    </>
  );
};

export default ChangePassword;
