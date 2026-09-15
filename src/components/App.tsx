import { useMemo, useState } from 'react';
import useNotes from '../hooks/useNotes';
import useTheme from '../hooks/useTheme';
import NoteInput from './NoteInput';
import NotesList from './NotesList';
import NoteSearch from './NoteSearch';

function App() {
  const { notes, addNote, deleteNote, toggleArchive } = useNotes();
  const { theme, toggleTheme } = useTheme();
  const [searchKeyword, setSearchKeyword] = useState('');

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
    () =>
      filteredNotes
        .filter((note) => !note.archived)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [filteredNotes]
  );

  const archivedNotes = useMemo(
    () =>
      filteredNotes
        .filter((note) => note.archived)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [filteredNotes]
  );

  return (
    <div className="note-app" data-theme={theme} data-testid="note-app">
      <div className="note-app__header" data-testid="note-app-header">
        <h1>Notes</h1>
        <NoteSearch onSearch={setSearchKeyword} />
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
            onDelete={deleteNote}
            onArchive={toggleArchive}
            dataTestId="active-notes-list"
            searchKeyword={searchKeyword}
          />
        </section>
        <section aria-labelledby="archived-notes-title" data-testid="archived-notes-section">
          <h2 id="archived-notes-title">Arsip</h2>
          <NotesList
            notes={archivedNotes}
            onDelete={deleteNote}
            onArchive={toggleArchive}
            dataTestId="archived-notes-list"
            searchKeyword={searchKeyword}
          />
        </section>
      </div>
    </div>
  );
}

export default App;
