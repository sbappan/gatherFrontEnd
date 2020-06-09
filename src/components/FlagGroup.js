import React, { Component } from 'react';

class FlagGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      group: {},
    };
  }

  async componentDidMount() {
    try {
      const groupId = this.props.match.params._id;
      const res = await fetch(`${process.env.REACT_APP_API_LINK}/groups/${groupId}`);
      const group = await res.json();
      this.setState({ group });
    } catch (error) {
      console.log('error: ', error);
    }
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('Form submitted');
    // const randNum = Math.floor(Math.random() * this.state.allMemeImgs.length);
    // const randMemeImg = this.state.allMemeImgs[randNum].url;
    // this.setState({ randomImg: randMemeImg });
  }

  render() {
    const { group } = this.state;

    return (
      <div className="flagGroup">
        <h2>Flag Group</h2>
        <h3>Group Name:</h3>
        <p>{group.name}</p>
        <h3>Group Description:</h3>
        <p>{group.description}</p>
        <form onSubmit={this.handleSubmit}>
          <p>Reason:</p>
          <textarea />
          <br />
          <br />
          <button type="submit" className="danger">Submit</button>
          <button type="button" className="success">Cancel</button>
        </form>
      </div>
    );
  }
}

export default FlagGroup;
