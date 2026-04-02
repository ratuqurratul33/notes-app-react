import React from 'react';
import { getInitialData } from '../utils';
import NoteInput from './NoteInput';
import NotesList from './NotesList';
import NoteSearch from './NoteSearch';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: getInitialData(),
      searchKeyword: '',
      theme: 'dark',
    };

    this.onAddNoteHandler = this.onAddNoteHandler.bind(this);
    this.onDeleteHandler = this.onDeleteHandler.bind(this);
    this.onArchiveHandler = this.onArchiveHandler.bind(this);
    this.onSearchHandler = this.onSearchHandler.bind(this);
    this.onToggleThemeHandler = this.onToggleThemeHandler.bind(this); 
  }

  onToggleThemeHandler() {
    this.setState((prevState) => {
      return {
        theme: prevState.theme === 'dark' ? 'light' : 'dark'
      };
    });
  }

  onAddNoteHandler({ title, body }) {
    const newNote = {
      id: +new Date(),
      title,
      body,
      createdAt: new Date().toISOString(),
      archived: false,
    };
    this.setState((prevState) => ({
      notes: [...prevState.notes, newNote],
    }));
  }

  onDeleteHandler(id) {
    this.setState((prevState) => ({
      notes: prevState.notes.filter((note) => note.id !== id),
    }));
  }

  onArchiveHandler(id) {
    this.setState((prevState) => ({
      notes: prevState.notes.map((note) =>
        note.id === id ? { ...note, archived: !note.archived } : note
      ),
    }));
  }

  onSearchHandler(keyword) {
    this.setState({ searchKeyword: keyword });
  }

  render() {
    const { notes, searchKeyword, theme } = this.state; 

    const filteredNotes = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        note.body.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const activeNotes = filteredNotes
      .filter((note) => !note.archived)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const archivedNotes = filteredNotes
      .filter((note) => note.archived)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
      <div className="note-app" data-theme={theme} data-testid="note-app">
        <div className="note-app__header" data-testid="note-app-header">
          <h1>Notes</h1>
          <NoteSearch onSearch={this.onSearchHandler} />
          
          {/* 5. Ini adalah letak tombol Toggle Tema */}
          <button 
            className="theme-toggle" 
            onClick={this.onToggleThemeHandler}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
        <div className="note-app__body" data-testid="note-app-body">
          <NoteInput addNote={this.onAddNoteHandler} />
          <section
            aria-labelledby="active-notes-title"
            data-testid="active-notes-section"
          >
            <h2 id="active-notes-title">Catatan Aktif</h2>
            <NotesList
              notes={activeNotes}
              onDelete={this.onDeleteHandler}
              onArchive={this.onArchiveHandler}
              dataTestId="active-notes-list"
              searchKeyword={searchKeyword}
            />
          </section>
          <section
            aria-labelledby="archived-notes-title"
            data-testid="archived-notes-section"
          >
            <h2 id="archived-notes-title">Arsip</h2>
            <NotesList
              notes={archivedNotes}
              onDelete={this.onDeleteHandler}
              onArchive={this.onArchiveHandler}
              dataTestId="archived-notes-list"
              searchKeyword={searchKeyword}
            />
          </section>
        </div>
      </div>
    );
  }
}

export default App;