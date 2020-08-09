import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { createOrUpdateItem } from '../Helpers';
import { AuthContext } from '../context/AuthContext';

const GroupPost = ({
  post, posts, members, group,
}) => {
  const [commentMessage, setCommentMessage] = useState('');
  const [postState, setPostState] = useState(post);
  const authContext = useContext(AuthContext);
  const { authState: { userInfo }, isAdmin } = authContext;

  const updatePostComments = async (newCommentArr) => {
    let updatedPost = posts.filter((p) => p._id === postState._id)[0];
    const otherPosts = posts.filter((p) => p._id !== postState._id);
    updatedPost = { ...updatedPost, comments: newCommentArr };

    const bodyData = {
      posts: [...otherPosts, updatedPost],
    };

    const updatedData = await createOrUpdateItem('PUT', 'groups', bodyData, group);
    if (updatedData._id) {
      const updatedPostData = updatedData.posts.filter((p) => p._id === postState._id)[0];
      setPostState(updatedPostData);
      setCommentMessage('');
    } else {
      // console.log('updatedData', updatedData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (commentMessage.trim()) {
      const newComment = {
        message: commentMessage,
        createdBy: userInfo._id,
      };

      updatePostComments([...postState.comments, newComment]);
    }
  };

  const handleRemove = async (id) => {
    updatePostComments(postState.comments.filter((c) => c._id !== id));
  };

  return (
    <div>
      <p>
        {`Message: ${postState.message}`}
        <br />
        {`Date: ${(`${moment(postState.date).format('ll')} @ ${moment(postState.date).format('LT')}`)}`}
        <br />
        <Link to={`/users/${postState.createdBy}`}>{`Post author: ${members[postState.createdBy].fname} ${members[postState.createdBy].lname}`}</Link>
        <br />
        <br />
      </p>
      {postState.comments && postState.comments.map((comment) => (
        <div key={comment._id} className="postComment">
          <p>{comment.message}</p>
          <p style={{ fontSize: '.75rem', color: '#909090' }}>
            {members && members[comment.createdBy] && `${members[comment.createdBy].fname} ${members[comment.createdBy].lname}`}
            <span style={{ fontSize: '.65rem' }}>
              &nbsp;&nbsp;&nbsp;
              {moment(comment.date).toNow(true)}
              {' '}
              ago
            </span>
            {(isAdmin() || comment.createdBy === userInfo._id) && group && <button type="button" className="danger" style={{ padding: '2px', height: 'unset', marginLeft: '1rem' }} onClick={() => handleRemove(comment._id)}>Remove</button>}
          </p>
        </div>
      ))}
      {group && (
      <div className="inputChat">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="commentMessage"
            placeholder="Enter your comment..."
            value={commentMessage}
            onChange={(e) => setCommentMessage(e.target.value)}
          />
          <input className="safe" type="submit" value="Send" />
        </form>
      </div>
      )}
    </div>
  );
};

export default GroupPost;
