import { useState, type ChangeEvent, type FormEvent } from 'react';

interface NoteFormValues {
  title: string;
  body: string;
}

interface NoteFormProps {
  initialValues?: NoteFormValues;
  submitLabel: string;
  onSubmit: (values: NoteFormValues) => void;
  onCancel?: () => void;
  testIdPrefix?: string;
}

const MAX_TITLE_LENGTH = 50;
const MIN_BODY_LENGTH = 10;

function NoteForm({
  initialValues = { title: '', body: '' },
  submitLabel,
  onSubmit,
  onCancel,
  testIdPrefix = 'note-form',
}: NoteFormProps) {
  const [title, setTitle] = useState(initialValues.title);
  const [body, setBody] = useState(initialValues.body);
  const [bodyError, setBodyError] = useState('');

  const remainingChars = MAX_TITLE_LENGTH - title.length;

  function onTitleChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (value.length <= MAX_TITLE_LENGTH) setTitle(value);
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

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (body.length < MIN_BODY_LENGTH) {
      setBodyError(`Isi catatan minimal harus ${MIN_BODY_LENGTH} karakter`);
      return;
    }

    onSubmit({ title, body });

    if (!onCancel) {
      setTitle('');
      setBody('');
      setBodyError('');
    }
  }

  return (
    <form onSubmit={onFormSubmit} className="note-form" data-testid={`${testIdPrefix}-form`}>
      {bodyError && <p className="note-input__feedback--error">{bodyError}</p>}
      <p className="note-input__title__char-limit" data-testid={`${testIdPrefix}-title-remaining`}>
        {remainingChars} karakter tersisa
      </p>
      <input
        className="note-input__title"
        type="text"
        placeholder="Ini adalah judul ..."
        value={title}
        onChange={onTitleChange}
        required
        data-testid={`${testIdPrefix}-title-field`}
      />
      <textarea
        className="note-input__body"
        placeholder="Tuliskan catatanmu di sini ... (gunakan **tebal** atau '- ' untuk daftar)"
        value={body}
        onChange={onBodyChange}
        required
        data-testid={`${testIdPrefix}-body-field`}
      />
      <div className="note-form__actions">
        <button type="submit" data-testid={`${testIdPrefix}-submit-button`}>
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} data-testid={`${testIdPrefix}-cancel-button`}>
            Batal
          </button>
        )}
      </div>
    </form>
  );
}

export default NoteForm;
export type { NoteFormValues };