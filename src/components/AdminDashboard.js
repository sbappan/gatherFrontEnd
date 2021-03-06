import React from 'react';
import { Link } from 'react-router-dom';
import { capitalizeFirstLetter } from '../Helpers';

export default function AdminDashboard(props) {
  const { countObj } = props;
  const countArr = Object.entries(countObj);
  const style = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
  };

  return (
    <div>
      <h3 style={{ margin: '3rem 0 2rem' }}>Admin Dashboard</h3>
      <div style={style}>
        {countArr && countArr.map((elem) => (
          <div key={elem[0]}>
            <CountBox collection={elem[0]} count={elem[1]} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CountBox({ collection, count }) {
  const linkStyle = {
    color: '#271033',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem',
    borderRadius: '1rem',
    backgroundColor: '#b7d7e8',
  };
  const pStyle = {
    fontSize: '3rem',
    margin: 0,
  };

  const collectionLink = collection !== 'interests' ? `/admin/${collection}` : '';

  return (
    <div>
      <Link to={collectionLink} style={linkStyle}>
        <h4>
          {`No of ${capitalizeFirstLetter(collection)}`}
        </h4>
        <p style={pStyle}>{count}</p>
      </Link>
    </div>
  );
}
