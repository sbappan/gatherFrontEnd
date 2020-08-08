import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { createOrUpdateItem, getAllItemsAsObject } from '../Helpers';
import { AuthContext } from '../context/AuthContext';

const GroupPost = ({
  post, posts, members, group,
}) => {
  const [commentMessage, setCommentMessage] = useState('');
  const [post2, setPost2] = useState(post);
  const [usersObj, setUsersObj] = useState({});
  const authContext = useContext(AuthContext);
  const { authState: { userInfo } } = authContext;

  useEffect(() => {
    const getData = async () => {
      const usersObjData = await getAllItemsAsObject('users');

      setUsersObj(usersObjData);
    };

    getData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (commentMessage.trim()) {
      const newComment = {
        message: commentMessage,
        createdBy: userInfo._id,
      };

      const newCommentArr = [...post2.comments, newComment];

      let updatedPost = posts.filter((p) => p._id === post._id)[0];
      const otherPosts = posts.filter((p) => p._id !== post._id);
      updatedPost = { ...updatedPost, comments: newCommentArr };

      const bodyData = {
        posts: [...otherPosts, updatedPost],
      };

      const updatedData = await createOrUpdateItem('PUT', 'groups', bodyData, group);
      if (updatedData._id) {
        const updatedPostData = updatedData.posts.filter((p) => p._id === post._id)[0];
        setPost2(updatedPostData);
        setCommentMessage('');
      } else {
        // console.log('updatedData', updatedData);
      }
    }
  };

  return (
    <div>
      <p>
        {`Message: ${post2.message}`}
        <br />
        {`Date: ${(`${moment(post2.date).format('ll')} @ ${moment(post2.date).format('LT')}`)}`}
        <br />
        <Link to={`/users/${post2.createdBy}`}>{`Post author: ${members[post2.createdBy].fname} ${members[post2.createdBy].lname}`}</Link>
        <br />
        <br />
      </p>
      {post2.comments && post2.comments.map((comment, index) => (
        <div key={index} className="postComment">
          <p>{comment.message}</p>
          <p style={{ fontSize: '.75rem', color: '#909090' }}>
            {usersObj && usersObj[comment.createdBy] && `${usersObj[comment.createdBy].fname} ${usersObj[comment.createdBy].lname}`}
            <span style={{ fontSize: '.65rem' }}>
              &nbsp;&nbsp;&nbsp;
              {moment(comment.date).toNow(true)}
              {' '}
              ago
            </span>

          </p>

        </div>
      ))}
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
    </div>
  );
};

export default GroupPost;
