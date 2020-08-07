import React, { useState } from 'react';
import { useParams, Redirect } from 'react-router';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const [message, setMessage] = useState('');
  const { id, token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== password2 || password2.length < 6) {
      setError(true);
    } else {
      setError(false);


      const bodyData = {
        id,
        token,
        password,
      };

      const updatedData = await fetch(`${process.env.REACT_APP_API_LINK}/users/reset`, {
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
      if (updatedData.message === 'Password has been reset. Redirecting to login page...') {
        setTimeout(() => {
          setRedirectToLogin(true);
        }, 3500);
      }
    }
  };

  if (redirectToLogin === true) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <h2>Recover password</h2>
      <form onSubmit={handleSubmit}>
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
          {password2.length > 1
          && password2.length < 6
          && <p>Passwords has to be at least 6 characters in length</p>}
        </div>
        <br />
        <input className="safe" type="submit" value="Submit" />
      </form>
      {message && <p>{message}</p>}
    </>
  );
};

export default ResetPassword;
