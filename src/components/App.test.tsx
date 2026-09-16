import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should show the empty state when there are no notes yet', () => {
    render(<App />);
    expect(screen.getByTestId('active-notes-list-empty')).toBeInTheDocument();
  });

  it('should add a new note and show it in the active notes list', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByTestId('note-input-title-field'), 'Catatan baru');
    await user.type(screen.getByTestId('note-input-body-field'), 'Isi catatan yang cukup panjang');
    await user.click(screen.getByTestId('note-input-submit-button'));

    expect(screen.getByTestId('active-notes-list')).toHaveTextContent('Catatan baru');
  });

  it('should filter notes based on the search keyword', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByTestId('note-input-title-field'), 'Resep nasi goreng');
    await user.type(screen.getByTestId('note-input-body-field'), 'Bahan: nasi, telur, kecap manis, bawang putih');
    await user.click(screen.getByTestId('note-input-submit-button'));

    await user.type(screen.getByTestId('note-input-title-field'), 'Jadwal meeting');
    await user.type(screen.getByTestId('note-input-body-field'), 'Meeting tim setiap hari senin jam 10 pagi');
    await user.click(screen.getByTestId('note-input-submit-button'));

    await user.type(screen.getByTestId('note-search-input'), 'nasi goreng');

    expect(screen.getByTestId('active-notes-list')).toHaveTextContent('Resep nasi goreng');
    expect(screen.getByTestId('active-notes-list')).not.toHaveTextContent('Jadwal meeting');
  });
});