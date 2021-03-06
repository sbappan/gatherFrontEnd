import React from 'react';
import { Link } from 'react-router-dom';
import HeaderDropdown from './HeaderDropdown';

function Header() {
  return (
    <header>
      <nav style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Link to="/">
          <h2>Gather</h2>
        </Link>
      </nav>
      <HeaderDropdown />
    </header>
  );
}

export default Header;
