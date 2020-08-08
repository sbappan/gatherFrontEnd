/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import stockProfile from '../stockProfileImage.png';

const HeaderDropdown = () => {
  const authContext = useContext(AuthContext);
  const { authState: { userInfo } } = authContext;
  // optional chaining ?.
  const profilePic = userInfo?.photo || stockProfile;

  return (
    authContext.isAuthenticated()
    && (
    <div className="dropdown">
      <div>
        <div className="profileImage">
          <img src={profilePic} alt="" />
        </div>
        <Link to={`/users/${userInfo._id}`}>
          <h3>{`${userInfo.fname} ${userInfo.lname}`}</h3>
        </Link>
      </div>
      <div className="dropdown-content">
        <div>
          <Link to="/users/edit/">
            Edit profile
          </Link>
        </div>
        <div>
          <Link to="/faq">
            <p>FAQ</p>
          </Link>
        </div>
        <div onClick={authContext.logout}>
          <p>Logout</p>
        </div>
      </div>
    </div>
    )
  );
};

export default HeaderDropdown;
