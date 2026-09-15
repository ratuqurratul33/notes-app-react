import type { ChangeEvent } from 'react';

interface NoteSearchProps {
  onSearch: (keyword: string) => void;
}

function NoteSearch({ onSearch }: NoteSearchProps) {
  function onSearchChange(event: ChangeEvent<HTMLInputElement>) {
    onSearch(event.target.value);
  }

  return (
    <div className="note-search" data-testid="note-search">
      <input
        className="note-search__input"
        type="text"
        placeholder="Cari catatan ..."
        onChange={onSearchChange}
        data-testid="note-search-input"
      />
    </div>
  );
}

export default NoteSearch;
