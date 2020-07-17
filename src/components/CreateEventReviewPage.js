import React, { Component } from 'react';
import { getOneItem, createOrUpdateItem } from '../Helpers';

class CreateEventReviewPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      event: {},
      group: {},
      review: '',
      rating: '',
      errors: {
        reviewError: '',
        ratingError: '',
      },
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validate = this.validate.bind(this);
  }

  async componentDidMount() {
    try {
      const { match } = this.props;
      const eventId = match.params._id;
      const event = await getOneItem('events', eventId);
      const group = await getOneItem('groups', event.group);
      this.setState({ event, group });
    } catch (error) {
      //
    }
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value.trim() });
  }

  validate() {
    const { review, rating } = this.state;
    const ratingError = (rating < 1 || rating > 5) ? 'Rating should be between 1 and 5' : '';
    const reviewError = !review ? 'This field is required' : '';
    this.setState({ errors: { reviewError, ratingError } });
    return !!((ratingError === '' && reviewError === ''));
  }

  async handleSubmit() {
    const { review, rating, event } = this.state;
    const bodyData = {
      reviews: [...event.reviews, {
        review,
        rating: parseFloat(rating, 10),
      }],
    };
    if (this.validate()) {
      const updatedData = await createOrUpdateItem('PUT', 'events', bodyData, event._id);
      if (updatedData.insertedCount === 1) {
        // this.setState({ redirectToReferrer: true });
      }
    }
  }

  render() {
    const {
      event, group, review, rating, errors,
    } = this.state;
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
        <input name="review" type="text" value={review} onChange={(e) => this.handleChange(e)} style={{ height: '90px', width: '800px' }} />
        <p style={{ color: 'red' }}>{errors.reviewError}</p>
        <br />
        <br />
        <p>Rating</p>
        <input name="rating" type="number" onChange={(e) => this.handleChange(e)} value={rating} placeholder="Enter a number between 1 and 5" style={{ width: '270px' }} />
        <p style={{ color: 'red' }}>{errors.ratingError}</p>
        <br />
        <br />
        <button type="button" className="safe" onClick={this.handleSubmit}>Submit</button>

      </div>
    );
  }
}

export default CreateEventReviewPage;
