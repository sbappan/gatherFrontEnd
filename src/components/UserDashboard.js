import React from 'react';
import { Link } from 'react-router-dom';

export default function UserDashboard() {
  return (
    <div>
      <h3>User Dashboard</h3>
      <Link to="/groups/create">
        <button type="button" className="safe">Create Group</button>
      </Link>
      <Link to="/events/create">
        <button type="button" className="safe">Create Event</button>
      </Link>
    </div>
  );
}
