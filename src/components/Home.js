import React from 'react';
import AdminDashboard from './AdminDashboard';

function Home() {
  return (
    <>
      <h1>Hi Full Name. Welcome to the Gather admin dashboard.</h1>
      {/* Once the log in use case is completed,
          enable loading this dashboard only for super admins */}
      <AdminDashboard />
      {/* Once the log in use case is completed,
          enable loading a different dashboard for all other users */}
    </>
  );
}

export default Home;
