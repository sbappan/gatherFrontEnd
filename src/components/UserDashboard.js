import React, { useContext } from 'react';
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

  return (
    <div>
      <h3>User Dashboard</h3>
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
  );
};

export default UserDashboard;
