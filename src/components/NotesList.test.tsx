import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import NotesList from './NotesList';
import type { Note } from '../types';

const notes: Note[] = [
  {
    id: 1,
    title: 'Catatan April',
    body: 'Isi catatan pertama',
    createdAt: '2025-04-01T00:00:00.000Z',
    archived: false,
    pinned: false,
    color: 'default',
  },
  {
    id: 2,
    title: 'Catatan Mei',
    body: 'Isi catatan kedua',
    createdAt: '2025-05-01T00:00:00.000Z',
    archived: false,
    pinned: false,
    color: 'default',
  },
];

const handlers = {
  onDelete: vi.fn(),
  onArchive: vi.fn(),
  onUpdate: vi.fn(),
  onTogglePin: vi.fn(),
  onColorChange: vi.fn(),
};

describe('NotesList', () => {
  it('should show a generic empty message when there are no notes and no search', () => {
    render(<NotesList notes={[]} {...handlers} />);
    expect(screen.getByText('Belum ada catatan di sini')).toBeInTheDocument();
  });

  it('should show a search-specific empty message when filtering yields nothing', () => {
    render(<NotesList notes={[]} {...handlers} searchKeyword="tidak ketemu" />);
    expect(screen.getByText('Tidak ada catatan yang cocok dengan pencarianmu')).toBeInTheDocument();
  });

  it('should group notes by month and year', () => {
    render(<NotesList notes={notes} {...handlers} />);
    expect(screen.getByTestId('2025-04-group')).toBeInTheDocument();
    expect(screen.getByTestId('2025-05-group')).toBeInTheDocument();
  });
});
