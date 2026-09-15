import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import NoteInput from './NoteInput';

describe('NoteInput', () => {
  it('should show validation error when body is less than 10 characters', async () => {
    const user = userEvent.setup();
    render(<NoteInput addNote={vi.fn()} />);

    await user.type(screen.getByTestId('note-input-title-field'), 'Judul');
    await user.type(screen.getByTestId('note-input-body-field'), 'pendek');
    await user.click(screen.getByTestId('note-input-submit-button'));

    expect(screen.getByText(/minimal harus 10 karakter/i)).toBeInTheDocument();
  });

  it('should call addNote and reset the form on valid submit', async () => {
    const user = userEvent.setup();
    const addNote = vi.fn();
    render(<NoteInput addNote={addNote} />);

    await user.type(screen.getByTestId('note-input-title-field'), 'Judul catatan');
    await user.type(screen.getByTestId('note-input-body-field'), 'Isi catatan yang cukup panjang');
    await user.click(screen.getByTestId('note-input-submit-button'));

    expect(addNote).toHaveBeenCalledWith({
      title: 'Judul catatan',
      body: 'Isi catatan yang cukup panjang',
    });
    expect(screen.getByTestId('note-input-title-field')).toHaveValue('');
  });

  it('should not allow title longer than 50 characters', async () => {
    const user = userEvent.setup();
    render(<NoteInput addNote={vi.fn()} />);

    await user.type(screen.getByTestId('note-input-title-field'), 'a'.repeat(60));

    expect(screen.getByTestId('note-input-title-field')).toHaveValue('a'.repeat(50));
  });
});
