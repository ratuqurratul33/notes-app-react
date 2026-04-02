import React from 'react';

function NoteActionButton({ variant, onClick, children }) {
  const classMap = {
    delete: 'note-item__delete-button',
    archive: 'note-item__archive-button',
  };

  const testIdMap = {
    delete: 'note-item-delete-button',
    archive: 'note-item-archive-button',
  };

  return (
    <button
      className={classMap[variant] || `note-item__${variant}-button`}
      type="button"
      onClick={onClick}
      data-testid={testIdMap[variant] || `note-item-${variant}-button`}
    >
      {children}
    </button>
  );
}

export default NoteActionButton;
