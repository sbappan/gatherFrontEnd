import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <nav>
        <Link to="/">
          <h2>Gather</h2>
        </Link>
      </nav>
    </header>
  );
}

export default Header;
