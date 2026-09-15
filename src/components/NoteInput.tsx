import { useState, type ChangeEvent, type FormEvent } from 'react';

interface NoteInputProps {
  addNote: (note: { title: string; body: string }) => void;
}

const MAX_TITLE_LENGTH = 50;
const MIN_BODY_LENGTH = 10;

function NoteInput({ addNote }: NoteInputProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [bodyError, setBodyError] = useState('');

  const remainingChars = MAX_TITLE_LENGTH - title.length;

  function onTitleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (value.length <= MAX_TITLE_LENGTH) {
      setTitle(value);
    }
  }

  function onBodyChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const value = event.target.value;
    setBody(value);
    setBodyError(
      value.length > 0 && value.length < MIN_BODY_LENGTH
        ? `Isi catatan minimal harus ${MIN_BODY_LENGTH} karakter`
        : ''
    );
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (body.length < MIN_BODY_LENGTH) {
      setBodyError(`Isi catatan minimal harus ${MIN_BODY_LENGTH} karakter`);
      return;
    }

    addNote({ title, body });
    setTitle('');
    setBody('');
    setBodyError('');
  }

  return (
    <div className="note-input" data-testid="note-input">
      <h2>Buat catatan</h2>

      {bodyError && <p className="note-input__feedback--error">{bodyError}</p>}

      <form onSubmit={onSubmit} data-testid="note-input-form">
        <p className="note-input__title__char-limit" data-testid="note-input-title-remaining">
          {remainingChars} karakter tersisa
        </p>
        <input
          className="note-input__title"
          type="text"
          placeholder="Ini adalah judul ..."
          value={title}
          onChange={onTitleChange}
          required
          data-testid="note-input-title-field"
        />
        <textarea
          className="note-input__body"
          placeholder="Tuliskan catatanmu di sini ..."
          value={body}
          onChange={onBodyChange}
          required
          data-testid="note-input-body-field"
        />
        <button type="submit" data-testid="note-input-submit-button">
          Buat
        </button>
      </form>
    </div>
  );
}

export default NoteInput;
