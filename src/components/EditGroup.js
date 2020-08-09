import React, { useState, useEffect /* , useContext */ } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { createOrUpdateItem, getOneItem, getAllItems } from '../Helpers';
// import { AuthContext } from '../context/AuthContext';

const EditGroup = () => {
  // const authContext = useContext(AuthContext);
  // const { authState: { userInfo } } = authContext;
  const { _id: groupId } = useParams();
  const [group, setGroup] = useState({});
  const [allInterests, setAllInterests] = useState([]);
  // const [user, setUser] = useState({});

  const [name, setGroupName] = useState('');
  const [description, setGroupDescription] = useState('');

  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const getGroup = async () => {
      const eventData = await getOneItem('groups', groupId);
      setGroup(eventData);
      setGroupName(eventData.name);
      setGroupDescription(eventData.description);
    };
    getGroup();
  }, [groupId]);

  useEffect(() => {
    const getData = async () => {
      const interests = await getAllItems('interests');
      if (group._id) {
        const interestsData = interests.map((interest) => ({
          selected: group.interests.includes(interest._id),
          ...interest,
        }));
        setAllInterests(interestsData);
      }
    };
    getData();
  }, [group.interests]);

  /*
  useEffect(() => {
    const getUser = async () => {
      const userData = await getOneItem('users', group.updatedBy);
      setUser(userData);
    };

    if (group.updatedBy) {
      getUser();
    }
  }, [group.updatedBy]);
  */

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

  const handleClick = async (gId) => {
    const interests = allInterests.filter((i) => i.selected).map((i) => i._id);

    const bodyData = {
      name,
      description,
      interests,
      createdBy: group.createdBy,
      // updatedBy: userInfo._id,
      status: {
        isFlagged: false,
        reason: '',
        updatedBy: group.status.updatedBy,
      },
    };

    if (bodyData.name && bodyData.description && bodyData.interests) {
      const updatedData = await createOrUpdateItem('PUT', 'groups', bodyData, gId);

      if (!updatedData.errors) {
        setRedirectToReferrer(true);
      } else {
        // console.log(updatedData.errors);
      }
    } else {
      setServerError('Please make sure the form is complete.');
    }
  };

  if (redirectToReferrer === true) {
    return <Redirect to={`/groups/${group._id}`} />;
  }
  const formStyle = {
    width: '60%',
  };

  /*
    <h3>Last updated by:</h3>
    <p>{user._id && `${user.fname} ${user.lname} on ${moment(group.updatedAt).format('LLL')}`}</p>
    <b />
  */

  const interestStyle = {
    display: 'flex',
    alignItems: 'baseline',
  };
  const interestFieldSetStyle = {
    marginTop: '.5rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(10rem, 1fr))',
    width: '60%',
  };

  return (
    <>
      <h2>Edit Group</h2>
      <form action="" method="post" style={formStyle}>
        <h4>Group Name</h4>
        <input
          type="text"
          name="name"
          placeholder="Group name"
          value={name}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />
        <h4>Description</h4>
        <textarea
          name="description"
          placeholder="Group description"
          value={description}
          onChange={(e) => setGroupDescription(e.target.value)}
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
        <p style={{ color: 'red' }}>{serverError}</p>
        <button
          type="button"
          className="safe"
          onClick={() => handleClick(group._id)}
        >
          Submit
        </button>
        <Link to={`/groups/${group._id}`}>
          <button type="button" className="success">Back</button>
        </Link>
      </form>
    </>
  );
};

export default EditGroup;
