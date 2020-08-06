import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import ReactRating from 'react-rating'; // https://www.npmjs.com/package/react-rating
import { AuthContext } from '../context/AuthContext';

import {
  getAllItemsAsObject, getOneItem, deleteItem, createOrUpdateItem,
} from '../Helpers';

const ViewEventDetails = () => {
  const authContext = useContext(AuthContext);
  const { authState: { userInfo } } = authContext;
  const [event, setEvent] = useState({});
  const [group, setGroup] = useState({});
  const [usersObj, setUsersObj] = useState({});
  const [redirectToReferrer, setRedirectToReferrer] = useState(false);
  const { _id: eventId } = useParams();
  const passed = moment(event.date).isBefore(moment());

  useEffect(() => {
    const getEventData = async () => {
      const eventData = await getOneItem('events', eventId);
      setEvent(eventData);
      if (event.group) {
        const groupData = await getOneItem('groups', event.group);
        setGroup(groupData);
      }
    };
    const getUsersData = async () => {
      const usersObjData = await getAllItemsAsObject('users');
      setUsersObj(usersObjData);
    };
    getEventData();
    getUsersData();
  }, [eventId, event.group]);

  const handleAttendanceClick = async (eId) => {
    let newAttendees = [];
    if (event.attendees.includes(userInfo._id)) {
      newAttendees = event.attendees.filter((uId) => uId !== userInfo._id);
    } else {
      newAttendees = event.attendees.concat(userInfo._id);
    }

    const bodyData = {
      attendees: newAttendees,
    };

    const updatedData = await createOrUpdateItem('PUT', 'events', bodyData, eId);

    if (updatedData._id) {
      setEvent(updatedData);
    }
  };

  const handleDeleteClick = async (eId) => {
    const updatedData = await deleteItem('events', eId);

    if (!updatedData.errors) {
      setRedirectToReferrer(true);
    } else {
      // console.log(updatedData.errors);
    }
  };

  if (redirectToReferrer === true) {
    return <Redirect to="/admin/events" />;
  }

  return (
    <div>
      <h1><strong>{event.name}</strong></h1>
      <h3>
        Associated Group:
        {' '}
        <Link to={`../groups/${group._id}`}>{group.name}</Link>

      </h3>
      <p>{event.description}</p>
      <h3>Attendees</h3>
      <div>
        {event.attendees && event.attendees.map((attendee) => (
          <p key={attendee}>
            <Link to={`../users/${attendee}`}>
              {usersObj[attendee] && `${usersObj[attendee].fname} ${usersObj[attendee].lname} `}
            </Link>
          </p>
        ))}
      </div>
      <p>
        Location:
        {event.location
        && `${event.location.line1} ${event.location.line2} ${event.location.city} ${event.location.province} ${event.location.postalCode}`}
      </p>
      <p>{`Date & Time: ${moment(event.date).format('LLL')}`}</p>
      {group.members
      && group.members.filter((m) => m.isAdmin).map((m) => m._id).includes(userInfo._id)
      && (
      <div>
        <Link to={`/events/edit/${event._id}`}>
          <button type="button" className="success" collection="events">Edit Event</button>
        </Link>
      </div>
      )}
      {group.members
      && group.members.filter((m) => m.isAdmin).map((m) => m._id).includes(userInfo._id)
      && (
      <div>
        <button
          type="button"
          className="danger"
          collection="events"
          onClick={() => {
            // eslint-disable-next-line no-alert
            if (window.confirm(`Are you sure you wish to cancel: ${event.name}?\n(Careful, there is no undoing this request!)`)) { handleDeleteClick(event._id); }
          }}
        >
          Cancel Event
        </button>
      </div>
      )}
      {group.members
      && (group.members.map((m) => m._id).includes(userInfo._id)
      || group.members.filter((m) => m.isAdmin).map((m) => m._id).includes(userInfo._id))
      && (event.attendees && (event.attendees.includes(userInfo._id)) ? (
        <div>
          <button
            type="button"
            className="safe"
            collection="events"
            onClick={() => {
            // eslint-disable-next-line no-alert
              if (window.confirm(`Are you sure you want to cancel your attendence to: ${event.name}?`)) { handleAttendanceClick(event._id); }
            }}
          >
            Cancel Event Attendance
          </button>
        </div>
      ) : (!passed
      && (
      <div>
        <button
          type="button"
          className="success"
          collection="events"
          onClick={() => {
            handleAttendanceClick(event._id);
          }}
        >
          Attend Event
        </button>
      </div>
      )

      )
      )}


      {passed
      && (
      <div>
        <div>
          <Link to={`/events/review/${event._id}`}>
            <button type="button" className="success" collection="groups">Review Event</button>
          </Link>
        </div>


        <div>
          {event.reviews && event.reviews.map((review) => (
            <div key={review.createdBy}>
              <h4>Review</h4>
              <p>{`Review text: ${review.reviewText}`}</p>
              <p>
                {/* ReactRating component causes this error in dev, but not shown in prod:
              Using UNSAFE_componentWillReceiveProps */}
                Rating:
                <ReactRating
                  name="rating"
                  initialRating={review.rating}
                  readonly
                  fullSymbol={<img src={`${process.env.PUBLIC_URL}/images/Star.png`} alt="Star" height="20px" width="20" />}
                  emptySymbol={<img src={`${process.env.PUBLIC_URL}/images/Star_Empty.png`} alt="Star" height="20px" width="20" />}
                />
              </p>
              <p>
                {usersObj[review.createdBy] && ` Review by: ${usersObj[review.createdBy].fname} ${usersObj[review.createdBy].lname} `}
              </p>
            </div>
          ))}
        </div>

      </div>
      )}
    </div>
  );
};

export default ViewEventDetails;
