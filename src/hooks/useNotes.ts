import { useCallback, useEffect, useRef, useState } from 'react';
import useLocalStorage from './useLocalStorage';
import type { Note, NoteColor } from '../types';

const STORAGE_KEY = 'notes-app/notes';
const UNDO_TIMEOUT_MS = 5000;

function useNotes() {
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEY, []);
  const [pendingDelete, setPendingDelete] = useState<Note | null>(null);
  const undoTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    };
  }, []);

  const addNote = useCallback(
    ({ title, body }: { title: string; body: string }) => {
      const newNote: Note = {
        id: +new Date(),
        title,
        body,
        createdAt: new Date().toISOString(),
        archived: false,
        pinned: false,
        color: 'default',
      };
      setNotes((prev) => [...prev, newNote]);
    },
    [setNotes]
  );

  const updateNote = useCallback(
    (id: number, { title, body }: { title: string; body: string }) => {
      setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, title, body } : note)));
    },
    [setNotes]
  );

  const requestDelete = useCallback(
    (id: number) => {
      const target = notes.find((note) => note.id === id);
      if (!target) return;

      if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
      setPendingDelete(target);
      undoTimerRef.current = window.setTimeout(() => setPendingDelete(null), UNDO_TIMEOUT_MS);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    },
    [notes, setNotes]
  );

  const undoDelete = useCallback(() => {
    if (!pendingDelete) return;
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    setNotes((prev) => [...prev, pendingDelete]);
    setPendingDelete(null);
  }, [pendingDelete, setNotes]);

  const dismissDelete = useCallback(() => {
    if (undoTimerRef.current) window.clearTimeout(undoTimerRef.current);
    setPendingDelete(null);
  }, []);

  const toggleArchive = useCallback(
    (id: number) => {
      setNotes((prev) =>
        prev.map((note) => (note.id === id ? { ...note, archived: !note.archived } : note))
      );
    },
    [setNotes]
  );

  const togglePin = useCallback(
    (id: number) => {
      setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, pinned: !note.pinned } : note)));
    },
    [setNotes]
  );

  const setNoteColor = useCallback(
    (id: number, color: NoteColor) => {
      setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, color } : note)));
    },
    [setNotes]
  );

  const replaceAllNotes = useCallback(
    (nextNotes: Note[]) => {
      setNotes(nextNotes);
    },
    [setNotes]
  );

  return {
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
  };
}

export default useNotes;