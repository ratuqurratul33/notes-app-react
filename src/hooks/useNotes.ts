import { useCallback } from 'react';
import useLocalStorage from './useLocalStorage';
import { getInitialData } from '../utils';
import type { Note } from '../types';

const STORAGE_KEY = 'notes-app/notes';

function useNotes() {
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEY, getInitialData);

  const addNote = useCallback(
    ({ title, body }: { title: string; body: string }) => {
      const newNote: Note = {
        id: +new Date(),
        title,
        body,
        createdAt: new Date().toISOString(),
        archived: false,
      };
      setNotes((prevNotes) => [...prevNotes, newNote]);
    },
    [setNotes]
  );

  const deleteNote = useCallback(
    (id: number) => {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    },
    [setNotes]
  );

  const toggleArchive = useCallback(
    (id: number) => {
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === id ? { ...note, archived: !note.archived } : note))
      );
    },
    [setNotes]
  );

  return { notes, addNote, deleteNote, toggleArchive };
}

export default useNotes;
