import NoteForm from './NoteForm';
import type { NoteFormValues } from './NoteForm';

interface NoteInputProps {
  addNote: (note: NoteFormValues) => void;
}

function NoteInput({ addNote }: NoteInputProps) {
  return (
    <div className="note-input" data-testid="note-input">
      <h2>Buat catatan</h2>
      <NoteForm submitLabel="Buat" onSubmit={addNote} testIdPrefix="note-input" />
    </div>
  );
}

export default NoteInput;