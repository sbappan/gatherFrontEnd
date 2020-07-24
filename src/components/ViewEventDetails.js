import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import moment from 'moment';
import ReactRating from 'react-rating';
import { AuthContext } from '../context/AuthContext';

import { getAllItemsAsObject, getOneItem } from '../Helpers';

const ViewEventDetails = () => {
  const authContext = useContext(AuthContext);
  const { authState: { userInfo } } = authContext;
  const [event, setEvent] = useState({});
  const [group, setGroup] = useState({});
  const [usersObj, setUsersObj] = useState({});
  const { _id: eventId } = useParams();

  useEffect(() => {
    const getData = async () => {
      const eventPromise = getOneItem('events', eventId);
      const usersObjPromise = getAllItemsAsObject('users');
      const [eventData, usersObjData] = await Promise.all([eventPromise,
        usersObjPromise]);

      setEvent(eventData);
      setUsersObj(usersObjData);

      if (event.group) {
        const groupData = await getOneItem('groups', event.group);
        setGroup(groupData);
      }
    };
    getData();
  }, [eventId, event.group]);

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
        Being held at:
        {' '}
        {event.location && event.location.line1}
        {', '}
        {event.location && event.location.line2}
        {' '}
        {event.location && event.location.city}
        {', '}
        {event.location && event.location.province}
        {', '}
        {event.location && event.location.postalCode}
        {' on '}
        {moment(event.date).format('LLL')}
      </p>
      {group.members
      && group.members.filter((m) => m.isAdmin).map((m) => m._id).includes(userInfo._id)
      && (
      <div>
        <Link to={`/events/edit/${event._id}`}>
          <button type="button" className="success" collection="events">Edit Event</button>
        </Link>
      </div>
      )}
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
  );
};

export default ViewEventDetails;
