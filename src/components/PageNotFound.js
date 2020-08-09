import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => (
  <>
    <div className="pageNotFound">
      <h1>
        404
      </h1>
      <p>
        This is not the page you are looking for. Please go back
        {' '}
        <Link to="/" style={{ color: 'dodgerblue' }}>
          Home
        </Link>
        .
      </p>
    </div>
  </>
);

export default PageNotFound;
