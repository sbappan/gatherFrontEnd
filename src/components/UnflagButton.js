import React from 'react';


function UnflagButton(props) {
  const { handleClick, groupId } = props;
  return (
    <button type="button" className="safe" onClick={() => handleClick(groupId)}>
      Unflag Group
    </button>
  );
}


export default UnflagButton;
