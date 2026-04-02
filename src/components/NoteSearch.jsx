import React from 'react';

function NoteSearch({ onSearch }) {
  function onSearchChangeHandler(event) {
    onSearch(event.target.value);
  }

  return (
    <div className="note-search" data-testid="note-search">
      <input
        className="note-search__input"
        type="text"
        placeholder="Cari catatan ..."
        onChange={onSearchChangeHandler}
        data-testid="note-search-input"
      />
    </div>
  );
}

export default NoteSearch;
