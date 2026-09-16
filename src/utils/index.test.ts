import { describe, expect, it } from 'vitest';
import { getTextStats, sortNotes } from './index';
import type { Note } from '../types';

describe('getTextStats', () => {
  it('should count words and estimate reading time', () => {
    const stats = getTextStats('Satu dua tiga empat lima');
    expect(stats.wordCount).toBe(5);
    expect(stats.readingTimeMinutes).toBe(1);
  });

  it('should return zero words for an empty body', () => {
    expect(getTextStats('   ').wordCount).toBe(0);
  });
});

describe('sortNotes', () => {
  const base: Note = {
    id: 0,
    title: '',
    body: '',
    createdAt: '2025-01-01T00:00:00.000Z',
    archived: false,
    pinned: false,
    color: 'default',
  };

  const notes: Note[] = [
    { ...base, id: 1, title: 'Banana', createdAt: '2025-01-01T00:00:00.000Z' },
    { ...base, id: 2, title: 'Apple', createdAt: '2025-03-01T00:00:00.000Z' },
    { ...base, id: 3, title: 'Cherry', createdAt: '2025-02-01T00:00:00.000Z', pinned: true },
  ];

  it('should always place pinned notes first regardless of sort option', () => {
    const result = sortNotes(notes, 'oldest');
    expect(result[0].id).toBe(3);
  });

  it('should sort by newest createdAt within the same pin status', () => {
    const result = sortNotes(notes, 'newest');
    expect(result.map((note) => note.id)).toEqual([3, 2, 1]);
  });

  it('should sort by title alphabetically when requested', () => {
    const unpinned = notes.filter((note) => !note.pinned);
    const result = sortNotes(unpinned, 'title-asc');
    expect(result.map((note) => note.title)).toEqual(['Apple', 'Banana']);
  });
});
