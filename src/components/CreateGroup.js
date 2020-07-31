import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router';
import { getAllItems, createOrUpdateItem } from '../Helpers';
import { AuthContext } from '../context/AuthContext';

const CreateGroup = () => {
  const authContext = useContext(AuthContext);
  const { authState: { userInfo } } = authContext;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [allInterests, setAllInterests] = useState([]);
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const getData = async () => {
      const interestsData = await getAllItems('interests');
      const allInterestsData = interestsData.map((interest) => ({ selected: false, ...interest }));
      setAllInterests(allInterestsData);
    };
    getData();
  }, []);

  const handleCheckInterest = async (id) => {
    const updatedInterests = allInterests.map((interest) => {
      if (interest._id === id) {
        return {
          ...interest,
          selected: !interest.selected,
        };
      }
      return interest;
    });
    setAllInterests(updatedInterests);
  };

  const handleClick = async () => {
    // ToDo: Add client side and server side validation to ensure required fields are present
    const interests = allInterests.filter((i) => i.selected).map((i) => i._id);

    const bodyData = {
      name,
      description,
      interests,
      members: [{ _id: userInfo._id, isAdmin: true }],
      comments: [],
      status: {
        isFlagged: false,
        reason: '',
        updatedBy: userInfo._id,
      },
    };
    const updatedData = await createOrUpdateItem('POST', 'groups', bodyData);

    if (!updatedData.errors) {
      setRedirectToReferrer(true);
    } else {
      setServerError('Please make sure the form is complete.');
    }
  };

  const interestStyle = {
    display: 'flex',
    alignItems: 'baseline',
  };
  const interestFieldSetStyle = {
    marginTop: '.5rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
  };
  const formStyle = {
    width: '60%',
  };

  if (redirectToReferrer === true) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <h2>Create Group</h2>
      <form action="" method="post" style={formStyle}>
        <h4>Name</h4>
        <input
          type="text"
          name="name"
          placeholder="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <h4>Description</h4>
        <textarea
          name="description"
          placeholder="Group description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <h4>Interests</h4>
        <div style={interestFieldSetStyle}>
          {allInterests.map((interest) => (
            <div key={interest._id} style={interestStyle}>
              <label htmlFor={`${interest.name}-id`}>
                <input
                  id={`${interest.name}-id`}
                  type="checkbox"
                  checked={interest.selected}
                  onChange={() => handleCheckInterest(interest._id)}
                />
                {interest.name}
              </label>
            </div>
          ))}
        </div>
        <button type="button" className="safe" onClick={() => handleClick()}>Submit</button>
        <p style={{ color: 'red' }}>{serverError}</p>
      </form>
    </>
  );
};

export default CreateGroup;
