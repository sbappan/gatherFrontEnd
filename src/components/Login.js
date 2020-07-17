import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router';
import jwtDecode from 'jwt-decode';
import { AuthContext } from '../context/AuthContext';
import { getOneItem } from '../Helpers';

const Login = () => {
  const authContext = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirectOnLogin, setRedirectOnLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bodyData = {
      email,
      password,
    };

    const updatedData = await fetch(`${process.env.REACT_APP_API_LINK}/users/login`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    })
      .then((response) => response.json())
      .then((_data) => _data)
      .catch((error) => error);

    if (updatedData.success) {
      const decoded = jwtDecode(updatedData.token);
      const userInfo = await getOneItem('users', decoded.id);

      const data = {
        token: updatedData.token,
        userInfo,
        expiresAt: decoded.exp,
      };
      authContext.setAuthState(data);
      setTimeout(() => {
        setRedirectOnLogin(true);
      }, 1000);
    }
  };

  return (
    <>
      {redirectOnLogin && <Redirect to="/" />}
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <h4>Email</h4>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <br />
        <br />
        <input className="safe" type="submit" value="Submit" />
      </form>
    </>
  );
};

export default Login;
