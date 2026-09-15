import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import NoteItem, { highlightText } from './NoteItem';
import type { Note } from '../types';

const note: Note = {
  id: 1,
  title: 'Belajar React',
  body: 'Hooks membuat function component lebih powerful',
  createdAt: '2025-04-01T04:27:34.572Z',
  archived: false,
};

describe('highlightText', () => {
  it('should return the original text when keyword is empty', () => {
    expect(highlightText('Hello world', '')).toBe('Hello world');
  });

  it('should split text into parts when keyword matches', () => {
    const result = highlightText('Hello world', 'world');
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('NoteItem', () => {
  it('should call onDelete with the note id', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<NoteItem note={note} onDelete={onDelete} onArchive={vi.fn()} />);

    await user.click(screen.getByTestId('note-item-delete-button'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('should call onArchive with the note id', async () => {
    const user = userEvent.setup();
    const onArchive = vi.fn();
    render(<NoteItem note={note} onDelete={vi.fn()} onArchive={onArchive} />);

    await user.click(screen.getByTestId('note-item-archive-button'));
    expect(onArchive).toHaveBeenCalledWith(1);
  });

  it('should show "Aktifkan" label when the note is archived', () => {
    render(<NoteItem note={{ ...note, archived: true }} onDelete={vi.fn()} onArchive={vi.fn()} />);
    expect(screen.getByTestId('note-item-archive-button')).toHaveTextContent('Aktifkan');
  });
});
