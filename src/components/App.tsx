import { useMemo, useState } from 'react';
import useNotes from '../hooks/useNotes';
import useTheme from '../hooks/useTheme';
import { sortNotes } from '../utils';
import NoteInput from './NoteInput';
import NotesList from './NotesList';
import NoteSearch from './NoteSearch';
import SortSelect from './SortSelect';
import NoteDataActions from './NoteDataActions';
import UndoToast from './UndoToast';
import type { SortOption } from '../types';

function App() {
  const {
    notes,
    addNote,
    updateNote,
    requestDelete,
    pendingDelete,
    undoDelete,
    dismissDelete,
    toggleArchive,
    togglePin,
    setNoteColor,
    replaceAllNotes,
  } = useNotes();
  const { theme, toggleTheme } = useTheme();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  const filteredNotes = useMemo(
    () =>
      notes.filter(
        (note) =>
          note.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          note.body.toLowerCase().includes(searchKeyword.toLowerCase())
      ),
    [notes, searchKeyword]
  );

  const activeNotes = useMemo(
    () => sortNotes(filteredNotes.filter((note) => !note.archived), sortOption),
    [filteredNotes, sortOption]
  );

  const archivedNotes = useMemo(
    () => sortNotes(filteredNotes.filter((note) => note.archived), sortOption),
    [filteredNotes, sortOption]
  );

  return (
    <div className="note-app" data-theme={theme} data-testid="note-app">
      <div className="note-app__header" data-testid="note-app-header">
        <h1>Quick Notes</h1>
        <NoteSearch onSearch={setSearchKeyword} />
        <SortSelect value={sortOption} onChange={setSortOption} />
        <NoteDataActions notes={notes} onImport={replaceAllNotes} />
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
      <div className="note-app__body" data-testid="note-app-body">
        <NoteInput addNote={addNote} />
        <section aria-labelledby="active-notes-title" data-testid="active-notes-section">
          <h2 id="active-notes-title">Catatan Aktif</h2>
          <NotesList
            notes={activeNotes}
            onDelete={requestDelete}
            onArchive={toggleArchive}
            onUpdate={updateNote}
            onTogglePin={togglePin}
            onColorChange={setNoteColor}
            dataTestId="active-notes-list"
            searchKeyword={searchKeyword}
          />
        </section>
        <section aria-labelledby="archived-notes-title" data-testid="archived-notes-section">
          <h2 id="archived-notes-title">Arsip</h2>
          <NotesList
            notes={archivedNotes}
            onDelete={requestDelete}
            onArchive={toggleArchive}
            onUpdate={updateNote}
            onTogglePin={togglePin}
            onColorChange={setNoteColor}
            dataTestId="archived-notes-list"
            searchKeyword={searchKeyword}
          />
        </section>
      </div>

      {pendingDelete && (
        <UndoToast
          message={`"${pendingDelete.title}" dihapus`}
          onUndo={undoDelete}
          onDismiss={dismissDelete}
        />
      )}
    </div>
  );
}

export default App;