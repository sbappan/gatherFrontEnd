import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <h1>Welcome to Gather</h1>
      <Link to="/admin/groups/">
        <button type="button" className="safe">Go to groups</button>
      </Link>
      <Link to="/admin/users/">
        <button type="button" className="safe">Go to Users</button>
      </Link>
    </>
  );
}

export default Home;
