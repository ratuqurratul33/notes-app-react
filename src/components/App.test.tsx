import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
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

    await user.type(screen.getByTestId('note-search-input'), 'Babel');

    expect(screen.getByTestId('active-notes-list')).toHaveTextContent('Babel');
    expect(screen.getByTestId('active-notes-list')).not.toHaveTextContent('ESM');
  });
});
