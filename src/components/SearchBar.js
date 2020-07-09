import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter } from '../Helpers';

// TODO: Add comments for the whole file

function getFilteredItems(items, value, interests = '') {
  if (interests) {
    const fInterests = interests
      .filter((int) => int.name.toLowerCase().includes(value.toLowerCase()))
      .map((int) => int._id);

    const fGroupsByInterest = items
      .filter((group) => (fInterests
        .filter((int) => group.interests.includes(int))).length > 0);

    const fGroupsByValue = items
      .filter((group) => group.name.toLowerCase().includes(value.toLowerCase()));

    const fGroups = fGroupsByValue.concat(fGroupsByInterest);
    return [...new Set(fGroups)];
  }

  const fItems = items.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()));
  return fItems;
}

export default class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchString: '',
      interests: [],
      groups: [],
      filteredGroups: [],
      events: [],
      filteredEvents: [],
    };

    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount() {
    try {
      const {
        search: {
          interests,
          groups,
          events,
          groups: filteredGroups,
          events: filteredEvents,
        },
      } = this.props;
      this.setState({
        interests,
        groups,
        events,
        filteredGroups,
        filteredEvents,
      });
    } catch (error) {
      // console.log('error: ', error);
    }
  }

  handleChange(e) {
    const { name, value } = e.target;
    const { groups, events, interests } = this.state;
    const fGroups = !value ? groups : getFilteredItems(groups, value.trim(), interests);
    const fEvents = !value ? events : getFilteredItems(events, value.trim());
    this.setState({
      [name]: value,
      filteredGroups: fGroups,
      filteredEvents: fEvents,
    });
  }

  render() {
    const { searchString, filteredGroups, filteredEvents } = this.state;

    return (
      <div style={{ marginBottom: '2rem', width: '100%' }}>
        <h3>Search</h3>
        <input
          type="text"
          name="searchString"
          placeholder="Search for a group, event or interest"
          onChange={this.handleChange}
          style={{ width: '100%', margin: '1rem 0', height: '3.25rem' }}
        />
        {searchString && (
          <div className="searchResults">
            {filteredGroups.map((group) => <SearchResult key={group._id} item={group} itemType="group" />)}
            {filteredEvents.map((event) => <SearchResult key={event._id} item={event} itemType="event" />)}
          </div>
        )}
      </div>
    );
  }
}

function SearchResult({ item, itemType }) {
  const divStyle = {
    margin: '1rem',
    padding: '1rem',
    border: `2px solid ${itemType === 'group' ? '#6b5b95' : '#d64161'}`,
  };
  const linkStyle = { textDecoration: 'none', color: '#222' };

  return (
    <Link to={`/admin/${itemType}s/${item._id}`} style={linkStyle}>
      <div style={divStyle}>
        <p>
          {`[${capitalizeFirstLetter(itemType)}] - ${item.name}`}
        </p>
      </div>
    </Link>
  );
}
