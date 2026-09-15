import { showFormattedDate } from '../utils';
import NoteActionButton from './NoteActionButton';
import type { Note } from '../types';

function highlightText(text: string, keyword: string) {
  if (!keyword || keyword.trim() === '') return text;

  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => (regex.test(part) ? <mark key={index}>{part}</mark> : part));
}

interface NoteItemProps {
  note: Note;
  onDelete: (id: number) => void;
  onArchive: (id: number) => void;
  searchKeyword?: string;
}

function NoteItem({ note, onDelete, onArchive, searchKeyword = '' }: NoteItemProps) {
  return (
    <div className="note-item" data-testid="note-item" data-note-id={note.id}>
      <div className="note-item__content" data-testid="note-item-content">
        <h3 className="note-item__title" data-testid="note-item-title">
          {highlightText(note.title, searchKeyword)}
        </h3>
        <p className="note-item__date" data-testid="note-item-date">
          {showFormattedDate(note.createdAt)}
        </p>
        <p className="note-item__body" data-testid="note-item-body">
          {highlightText(note.body, searchKeyword)}
        </p>
      </div>
      <div className="note-item__action" data-testid="note-item-action">
        <NoteActionButton variant="delete" onClick={() => onDelete(note.id)}>
          Hapus
        </NoteActionButton>
        <NoteActionButton variant="archive" onClick={() => onArchive(note.id)}>
          {note.archived ? 'Aktifkan' : 'Arsipkan'}
        </NoteActionButton>
      </div>
    </div>
  );
}

export { highlightText };
export default NoteItem;
