import React, { useState, useEffect, useContext } from 'react';
import { Redirect } from 'react-router';
import { useParams } from 'react-router-dom';
import { getOneItem, createOrUpdateItem } from '../Helpers';
import { AuthContext } from '../context/AuthContext';

const CreateEventReviewPage = () => {
  const authContext = useContext(AuthContext);
  const { authState } = authContext;
  const { _id: eventId } = useParams();
  const [event, setEvent] = useState({});
  const [group, setGroup] = useState({});
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState('');
  const [redirectToReferrer, setRedirectToReferrer] = useState('');
  const [reviewExists, setReviewExists] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const eventData = await getOneItem('events', eventId);
      setEvent(eventData);
      if (event.group) {
        const groupData = await getOneItem('groups', event.group);
        setGroup(groupData);
      }
    };
    getData();
  }, [eventId, event.group]);

  useEffect(() => {
    if (event.reviews) {
      const existingReview = event.reviews.find((r) => (
        r.createdBy === authState.userInfo._id
      ));
      if (existingReview) {
        setReviewText(existingReview.reviewText);
        setRating(existingReview.rating);
        setReviewExists(true);
      }
    }
  }, [event.reviews, authState.userInfo._id]);

  const handleSubmit = async () => {
    let bodyData = {};

    if (reviewExists) {
      const newReviews = [...event.reviews];
      const index = newReviews.findIndex((r) => r.createdBy === authState.userInfo._id);
      newReviews[index].reviewText = reviewText;
      newReviews[index].rating = rating;
      bodyData = {
        reviews: newReviews,
      };
    } else {
      bodyData = {
        reviews: [...event.reviews, {
          reviewText,
          rating: parseFloat(rating, 10),
          createdBy: authState.userInfo._id,
        }],
      };
    }

    const updatedData = await createOrUpdateItem('PUT', 'events', bodyData, event._id);
    if (updatedData._id) {
      setRedirectToReferrer(true);
    }
  };

  if (redirectToReferrer === true) {
    return <Redirect to={`/events/${event._id}`} />;
  }

  return (
    <div>
      <h1>Event Review</h1>
      <h3>{event.name && event.name}</h3>
      <h4>
        Associated group:
        {' '}
        {group.name}

      </h4>
      <br />
      <br />
      <br />
      <p>Please leave a review below</p>
      <input name="reviewText" type="text" value={reviewText} onChange={(e) => setReviewText(e.target.value)} style={{ height: '90px', width: '800px' }} />
      <br />
      <br />
      <p>Rating</p>
      <input name="rating" type="number" onChange={(e) => setRating(e.target.value)} value={rating} placeholder="Enter a number between 1 and 5" style={{ width: '270px' }} />
      <br />
      <br />
      <button type="button" className="safe" onClick={handleSubmit}>Submit</button>

    </div>
  );
};

export default CreateEventReviewPage;
