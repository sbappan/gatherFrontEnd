import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bodyData = {
      email,
      appUrl: 'gatherapp.xyz',
    };

    const updatedData = await fetch(`${process.env.REACT_APP_API_LINK}/users/forgot`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    })
      .then((response) => response.json())
      .then((_data) => _data)
      .catch((error) => error);

    setMessage(updatedData.message);
  };

  return (
    <>
      <h2>Recover password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input className="safe" type="submit" value="Submit" />
      </form>
      <br />
      {message && <p>{message}</p>}
    </>
  );
};

export default ForgotPassword;
