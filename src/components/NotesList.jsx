import React from 'react';
import NoteItem from './NoteItem';

function groupNotesByMonthYear(notes) {
  const groups = {};
  notes.forEach((note) => {
    const date = new Date(note.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(note);
  });
  return groups;
}

function formatGroupHeader(key) {
  const [year, month] = key.split('-');
  const date = new Date(year, parseInt(month, 10) - 1, 1);
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

function NotesList({ notes, onDelete, onArchive, dataTestId = 'notes-list', searchKeyword = '' }) {
  const hasNotes = Array.isArray(notes) && notes.length > 0;

  if (!hasNotes) {
    return (
      <div className="notes-list" data-testid={dataTestId}>
        <p
          className="notes-list__empty-message"
          data-testid={`${dataTestId}-empty`}
        >
          Tidak ada catatan
        </p>
      </div>
    );
  }

  const groupedNotes = groupNotesByMonthYear(notes);

  return (
    <div className="notes-list" data-testid={dataTestId}>
      {Object.entries(groupedNotes).map(([groupKey, groupNotes]) => (
        <section
          key={groupKey}
          data-testid={`${groupKey}-group`}
          className="notes-group"
        >
          <div className="notes-group__header">
            <h3>{formatGroupHeader(groupKey)}</h3>
            <span data-testid={`${groupKey}-group-count`}>
              {groupNotes.length} catatan
            </span>
          </div>
          {groupNotes.map((note) => (
            <NoteItem
              key={note.id}
              note={note}
              onDelete={onDelete}
              onArchive={onArchive}
              searchKeyword={searchKeyword}
            />
          ))}
        </section>
      ))}
    </div>
  );
}

export default NotesList;
