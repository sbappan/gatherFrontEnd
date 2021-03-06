import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router';
import { useParams } from 'react-router-dom';
import { getOneItem, createOrUpdateItem } from '../Helpers';
import { AuthContext } from '../context/AuthContext';

const CreateUserPost = () => {
  const authContext = useContext(AuthContext);
  const { authState: { userInfo } } = authContext;
  const { _id: groupId } = useParams();
  const [group, setGroup] = useState({});
  const [messageText, setMessageText] = useState('');
  const [redirectToReferrer, setRedirectToReferrer] = useState('');

  useEffect(() => {
    const getData = async () => {
      const groupData = await getOneItem('groups', groupId);
      setGroup(groupData);
    };
    getData();
  }, [groupId]);

  const handleSubmit = async () => {
    let bodyData = {};

    bodyData = {
      posts: [...group.posts, {
        message: messageText,
        createdBy: userInfo._id,
        date: new Date().toISOString(),
        status: {
          isFlagged: false,
          reason: null,
          updatedBy: null,
        },
      }],
    };

    const updatedData = await createOrUpdateItem('PUT', 'groups', bodyData, group._id);
    if (updatedData._id) {
      setRedirectToReferrer(true);
    }
  };

  if (redirectToReferrer === true) {
    return <Redirect to={`/groups/${group._id}`} />;
  }

  return (
    <div>
      <h1>Create Post</h1>
      <h3>
        Associated group:
        {' '}
        {group.name}
      </h3>
      <br />
      <input name="postText" type="text" onChange={(e) => setMessageText(e.target.value)} style={{ height: '90px', width: '800px' }} />
      <br />
      <br />
      <button type="button" className="safe" onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default CreateUserPost;
