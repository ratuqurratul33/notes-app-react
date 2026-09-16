import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import NoteItem from './NoteItem';
import type { Note } from '../types';

const note: Note = {
  id: 1,
  title: 'Belajar React',
  body: 'Hooks membuat function component lebih powerful',
  createdAt: '2025-04-01T04:27:34.572Z',
  archived: false,
  pinned: false,
  color: 'default',
};

function renderNoteItem(overrides: Partial<Note> = {}) {
  const handlers = {
    onDelete: vi.fn(),
    onArchive: vi.fn(),
    onUpdate: vi.fn(),
    onTogglePin: vi.fn(),
    onColorChange: vi.fn(),
  };
  render(<NoteItem note={{ ...note, ...overrides }} {...handlers} />);
  return handlers;
}

describe('NoteItem', () => {
  it('should ask for confirmation before deleting, then call onDelete when confirmed', async () => {
    const user = userEvent.setup();
    const { onDelete } = renderNoteItem();

    await user.click(screen.getByTestId('note-item-delete-button'));
    expect(screen.getByTestId('confirm-dialog')).toBeInTheDocument();

    await user.click(screen.getByTestId('confirm-dialog-confirm'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('should not call onDelete when the confirmation is cancelled', async () => {
    const user = userEvent.setup();
    const { onDelete } = renderNoteItem();

    await user.click(screen.getByTestId('note-item-delete-button'));
    await user.click(screen.getByTestId('confirm-dialog-cancel'));

    expect(onDelete).not.toHaveBeenCalled();
    expect(screen.queryByTestId('confirm-dialog')).not.toBeInTheDocument();
  });

  it('should call onTogglePin with the note id', async () => {
    const user = userEvent.setup();
    const { onTogglePin } = renderNoteItem();

    await user.click(screen.getByTestId('note-item-pin-button'));
    expect(onTogglePin).toHaveBeenCalledWith(1);
  });

  it('should call onColorChange when a color dot is clicked', async () => {
    const user = userEvent.setup();
    const { onColorChange } = renderNoteItem();

    await user.click(screen.getByTestId('note-item-color-blue'));
    expect(onColorChange).toHaveBeenCalledWith(1, 'blue');
  });

  it('should switch to edit mode and call onUpdate with the new values', async () => {
    const user = userEvent.setup();
    const { onUpdate } = renderNoteItem();

    await user.click(screen.getByTestId('note-item-edit-button'));
    expect(screen.getByTestId('note-item-edit-form')).toBeInTheDocument();

    const titleField = screen.getByTestId('note-item-edit-title-field');
    await user.clear(titleField);
    await user.type(titleField, 'Judul baru hasil edit');
    await user.click(screen.getByTestId('note-item-edit-submit-button'));

    expect(onUpdate).toHaveBeenCalledWith(1, {
      title: 'Judul baru hasil edit',
      body: note.body,
    });
    expect(screen.queryByTestId('note-item-edit-form')).not.toBeInTheDocument();
  });

  it('should exit edit mode without calling onUpdate when cancelled', async () => {
    const user = userEvent.setup();
    const { onUpdate } = renderNoteItem();

    await user.click(screen.getByTestId('note-item-edit-button'));
    await user.click(screen.getByTestId('note-item-edit-cancel-button'));

    expect(onUpdate).not.toHaveBeenCalled();
    expect(screen.getByTestId('note-item-title')).toBeInTheDocument();
  });

  it('should show "Aktifkan" label when the note is archived', () => {
    renderNoteItem({ archived: true });
    expect(screen.getByTestId('note-item-archive-button')).toHaveTextContent('Aktifkan');
  });

  it('should render list markdown items in the body', () => {
    renderNoteItem({ body: '- Item satu\n- Item dua' });
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
