import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const HeaderDropdown = () => {
  const authContext = useContext(AuthContext);
  const { authState: { userInfo } } = authContext;
  const style = {
    display: 'flex',
    minWidth: '15%',
    justifyContent: 'space-between',
  };

  return (
    authContext.isAuthenticated()
    && (
    <div style={style}>
      <h2>{`${userInfo.fname} ${userInfo.lname}`}</h2>
      <button type="button" onClick={authContext.logout}>Logout</button>
    </div>
    )
  );
};

export default HeaderDropdown;
