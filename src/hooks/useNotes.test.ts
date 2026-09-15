import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import useNotes from './useNotes';

describe('useNotes', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should load initial notes when localStorage is empty', () => {
    const { result } = renderHook(() => useNotes());
    expect(result.current.notes.length).toBeGreaterThan(0);
  });

  it('should add a new note', () => {
    const { result } = renderHook(() => useNotes());
    const initialCount = result.current.notes.length;

    act(() => {
      result.current.addNote({ title: 'Judul baru', body: 'Isi catatan baru yang panjang' });
    });

    expect(result.current.notes).toHaveLength(initialCount + 1);
    expect(result.current.notes.at(-1)?.title).toBe('Judul baru');
  });

  it('should delete a note by id', () => {
    const { result } = renderHook(() => useNotes());
    const targetId = result.current.notes[0].id;

    act(() => {
      result.current.deleteNote(targetId);
    });

    expect(result.current.notes.find((note) => note.id === targetId)).toBeUndefined();
  });

  it('should toggle archive status', () => {
    const { result } = renderHook(() => useNotes());
    const targetId = result.current.notes[0].id;
    const initialArchived = result.current.notes[0].archived;

    act(() => {
      result.current.toggleArchive(targetId);
    });

    const updated = result.current.notes.find((note) => note.id === targetId);
    expect(updated?.archived).toBe(!initialArchived);
  });

  it('should persist notes to localStorage', () => {
    const { result } = renderHook(() => useNotes());

    act(() => {
      result.current.addNote({ title: 'Persisted', body: 'Catatan ini harus tersimpan di localStorage' });
    });

    const stored = JSON.parse(window.localStorage.getItem('notes-app/notes') ?? '[]');
    expect(stored.some((note: { title: string }) => note.title === 'Persisted')).toBe(true);
  });
});
