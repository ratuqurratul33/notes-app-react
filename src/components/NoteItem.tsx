import { useState } from 'react';
import { showFormattedDate, getTextStats } from '../utils';
import { highlightText, renderNoteBody } from '../utils/textRender';
import { NOTE_COLORS } from '../constants/colors';
import NoteActionButton from './NoteActionButton';
import NoteForm from './NoteForm';
import ConfirmDialog from './ConfirmDialog';
import type { NoteFormValues } from './NoteForm';
import type { Note, NoteColor } from '../types';

interface NoteItemProps {
  note: Note;
  onDelete: (id: number) => void;
  onArchive: (id: number) => void;
  onUpdate: (id: number, values: NoteFormValues) => void;
  onTogglePin: (id: number) => void;
  onColorChange: (id: number, color: NoteColor) => void;
  searchKeyword?: string;
}

function NoteItem({
  note,
  onDelete,
  onArchive,
  onUpdate,
  onTogglePin,
  onColorChange,
  searchKeyword = '',
}: NoteItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setConfirmingDelete] = useState(false);
  const { wordCount, readingTimeMinutes } = getTextStats(note.body);

  if (isEditing) {
    return (
      <div className="note-item note-item--editing" data-testid="note-item" data-note-id={note.id}>
        <NoteForm
          initialValues={{ title: note.title, body: note.body }}
          submitLabel="Simpan"
          testIdPrefix="note-item-edit"
          onSubmit={(values) => {
            onUpdate(note.id, values);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div
      className={`note-item${note.pinned ? ' note-item--pinned' : ''}`}
      data-testid="note-item"
      data-note-id={note.id}
      data-color={note.color}
    >
      {note.pinned && (
        <span className="note-item__pin-badge" aria-label="Disematkan">
          📌
        </span>
      )}
      <div className="note-item__content" data-testid="note-item-content">
        <h3 className="note-item__title" data-testid="note-item-title">
          {highlightText(note.title, searchKeyword)}
        </h3>
        <p className="note-item__date" data-testid="note-item-date">
          {showFormattedDate(note.createdAt)}
        </p>
        <div className="note-item__body" data-testid="note-item-body">
          {renderNoteBody(note.body, searchKeyword)}
        </div>
        <p className="note-item__meta" data-testid="note-item-meta">
          {wordCount} kata &middot; {readingTimeMinutes} menit baca
        </p>
        <div className="note-item__colors" data-testid="note-item-colors">
          {NOTE_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              className={`note-item__color-dot note-item__color-dot--${color}`}
              aria-label={`Warna ${color}`}
              aria-pressed={note.color === color}
              onClick={() => onColorChange(note.id, color)}
              data-testid={`note-item-color-${color}`}
            />
          ))}
        </div>
      </div>
      <div className="note-item__action" data-testid="note-item-action">
        <NoteActionButton variant="pin" onClick={() => onTogglePin(note.id)}>
          {note.pinned ? 'Lepas' : 'Pin'}
        </NoteActionButton>
        <NoteActionButton variant="edit" onClick={() => setIsEditing(true)}>
          Edit
        </NoteActionButton>
        <NoteActionButton variant="archive" onClick={() => onArchive(note.id)}>
          {note.archived ? 'Aktifkan' : 'Arsipkan'}
        </NoteActionButton>
        <NoteActionButton variant="delete" onClick={() => setConfirmingDelete(true)}>
          Hapus
        </NoteActionButton>
      </div>

      {isConfirmingDelete && (
        <ConfirmDialog
          title="Hapus catatan?"
          message={`Catatan "${note.title}" akan dihapus. Kamu masih bisa mengurungkannya sesaat setelah ini.`}
          onConfirm={() => {
            setConfirmingDelete(false);
            onDelete(note.id);
          }}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </div>
  );
}

export default NoteItem;