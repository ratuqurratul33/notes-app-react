import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useNotes from './useNotes';

describe('useNotes', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it('should update the title and body of a note', () => {
    const { result } = renderHook(() => useNotes());
    const targetId = result.current.notes[0].id;

    act(() => {
      result.current.updateNote(targetId, { title: 'Judul diedit', body: 'Isi catatan yang sudah diedit' });
    });

    const updated = result.current.notes.find((note) => note.id === targetId);
    expect(updated?.title).toBe('Judul diedit');
    expect(updated?.body).toBe('Isi catatan yang sudah diedit');
  });

  it('should remove a note immediately and expose it as pendingDelete', () => {
    const { result } = renderHook(() => useNotes());
    const targetId = result.current.notes[0].id;

    act(() => {
      result.current.requestDelete(targetId);
    });

    expect(result.current.notes.find((note) => note.id === targetId)).toBeUndefined();
    expect(result.current.pendingDelete?.id).toBe(targetId);
  });

  it('should restore the note when undoDelete is called', () => {
    const { result } = renderHook(() => useNotes());
    const targetId = result.current.notes[0].id;

    act(() => {
      result.current.requestDelete(targetId);
    });
    act(() => {
      result.current.undoDelete();
    });

    expect(result.current.notes.find((note) => note.id === targetId)).toBeDefined();
    expect(result.current.pendingDelete).toBeNull();
  });

  it('should clear pendingDelete automatically after the undo window', () => {
    const { result } = renderHook(() => useNotes());
    const targetId = result.current.notes[0].id;

    act(() => {
      result.current.requestDelete(targetId);
    });
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.pendingDelete).toBeNull();
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

  it('should toggle pinned status', () => {
    const { result } = renderHook(() => useNotes());
    const targetId = result.current.notes[0].id;

    act(() => {
      result.current.togglePin(targetId);
    });

    expect(result.current.notes.find((note) => note.id === targetId)?.pinned).toBe(true);
  });

  it('should update note color', () => {
    const { result } = renderHook(() => useNotes());
    const targetId = result.current.notes[0].id;

    act(() => {
      result.current.setNoteColor(targetId, 'blue');
    });

    expect(result.current.notes.find((note) => note.id === targetId)?.color).toBe('blue');
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
