import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import GroupPost from './GroupPost';

const UserDashboard = ({ dashboardData }) => {
  const authContext = useContext(AuthContext);
  const { authState: { userInfo } } = authContext;

  // Filter for groups in which the current user is a member of,
  // get only the posts and flatten it into a single array
  const userGroupsPosts = dashboardData.groups
    .filter((g) => g.members.map((m) => m._id).includes(userInfo._id))
    .map((g) => (g.posts))
    .flat();

  // Filter for posts which area authored by a user
  // followed by the current user and flatten it into a single array
  const userFollowPosts = dashboardData.groups
    .map((g) => g.posts.filter((p) => userInfo.following.includes(p.createdBy)))
    .flat();

  const allPosts = [...new Set(userGroupsPosts.concat(userFollowPosts))];

  // Filter for groups which have at least one of the user's interests,
  // and filter out groups in which the user is already a member in
  const suggestedGroups = dashboardData.groups
    .filter((g) => g.interests.some((i) => userInfo.interests.includes(i)))
    .filter((g) => !g.members.map((m) => m._id).includes(userInfo._id));

  // Filter for groups with the user as a member
  const userGroups = dashboardData.groups
    .filter((g) => g.members.map((m) => m._id).includes(userInfo._id));

  // Filter for events with the user as an attendee
  const userEvents = dashboardData.events.filter((e) => e.attendees.includes(userInfo._id));

  return (
    <>
      <h3 style={{ margin: '1rem 0' }}>User Dashboard</h3>
      <div className="dashboard">
        <div className="postsContainer">
          {allPosts.length > 0 ? (
            <div className="groupFeedContainer groupTab">
              {allPosts.map((u) => (
                <GroupPost
                  key={u._id}
                  post={u}
                  posts={allPosts}
                  members={dashboardData.usersObj}
                />
              ))}
            </div>
          ) : <p>No posts yet</p>}
        </div>
        <div className="allGroups">
          <div className="userEvents">
            <h4>
              My events
            </h4>
            {userEvents.map((e) => (
              <p key={e._id}>
                <Link to={`/events/${e._id}`}>
                  {e.name}
                </Link>
              </p>
            ))}
          </div>
          <div className="userGroups">
            <h4>
              My groups
            </h4>
            {userGroups.map((g) => (
              <p key={g._id}>
                <Link to={`/groups/${g._id}`}>
                  {g.name}
                </Link>
              </p>
            ))}
          </div>
          <div className="suggestedGroups">
            <h4>
              Suggested groups
            </h4>
            {suggestedGroups.map((g) => (
              <p key={g._id}>
                <Link to={`/groups/${g._id}`}>
                  {g.name}
                </Link>
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
