import React from 'react';
import { Link } from 'react-router-dom';

export function LinkButtonAdmin({
  className, text, collection, itemId,
}) {
  const toLink = itemId ? `/admin/${collection}/flag/${itemId}` : `/admin/${collection}/`;
  return (
    <Link to={toLink}>
      <button type="button" className={className}>{text}</button>
    </Link>
  );
}

export function ToggleFlagButton({
  itemId, handleClick, flag, className, text,
}) {
  return (
    <button type="button" className={className} onClick={() => handleClick(itemId, flag)}>{text}</button>
  );
}

export function FilterButton({ text, handleFilter, active }) {
  return (
    <button type="button" className={`filterButton${active ? ' activeFilter' : ''}`} onClick={() => handleFilter(text)}>{text}</button>
  );
}

export function FlagItemButtons({
  item, isFlagged, collection, handleClick,
}) {
  return (
    <>
      <ToggleFlagButton className="danger" itemId={item._id} flag handleClick={handleClick} text="Submit" />

      { isFlagged ? (
        <>
          <ToggleFlagButton className="safe" itemId={item._id} flag={false} handleClick={handleClick} text="Unflag" />
          <LinkButtonAdmin className="success" text={`Back to ${collection}`} collection={collection} />
        </>
      )
        : (
          <LinkButtonAdmin className="safe" text="Cancel" collection={collection} />
        )}
    </>
  );
}

export function FlagItemRowButtons({ item, collection, handleClick }) {
  return (
    <>
      {!item.status.isFlagged
        ? <LinkButtonAdmin collection={collection} itemId={item._id} text="Flag" className="danger" />
        : (
          <span className="flagButtons">
            <ToggleFlagButton className="safe" itemId={item._id} handleClick={handleClick} text="Unflag " />
            <LinkButtonAdmin collection={collection} itemId={item._id} text="Edit reason" className="success" />
          </span>
        )}
    </>
  );
}

export function FilterItemsButtons({ handleFilter, activeFilter }) {
  return (
    <div>
      <FilterButton text="All" handleFilter={handleFilter} active={activeFilter === 'All'} />
      <FilterButton text="Flagged" handleFilter={handleFilter} active={activeFilter === 'Flagged'} />
      <FilterButton text="Unflagged" handleFilter={handleFilter} active={activeFilter === 'Unflagged'} />
    </div>
  );
}
