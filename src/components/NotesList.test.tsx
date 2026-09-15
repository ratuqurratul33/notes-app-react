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
  },
  {
    id: 2,
    title: 'Catatan Mei',
    body: 'Isi catatan kedua',
    createdAt: '2025-05-01T00:00:00.000Z',
    archived: false,
  },
];

describe('NotesList', () => {
  it('should show empty message when there are no notes', () => {
    render(<NotesList notes={[]} onDelete={vi.fn()} onArchive={vi.fn()} />);
    expect(screen.getByText('Tidak ada catatan')).toBeInTheDocument();
  });

  it('should group notes by month and year', () => {
    render(<NotesList notes={notes} onDelete={vi.fn()} onArchive={vi.fn()} />);
    expect(screen.getByTestId('2025-04-group')).toBeInTheDocument();
    expect(screen.getByTestId('2025-05-group')).toBeInTheDocument();
  });
});
