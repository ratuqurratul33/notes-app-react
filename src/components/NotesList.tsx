import { AnimatePresence, motion } from 'framer-motion';
import NoteItem from './NoteItem';
import type { NoteFormValues } from './NoteForm';
import type { Note, NoteColor } from '../types';

function groupNotesByMonthYear(notes: Note[]) {
  const groups: Record<string, Note[]> = {};
  notes.forEach((note) => {
    const date = new Date(note.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(note);
  });
  return groups;
}

function formatGroupHeader(key: string) {
  const [year, month] = key.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

interface EmptyStateProps {
  dataTestId: string;
  hasSearch: boolean;
}

function EmptyState({ dataTestId, hasSearch }: EmptyStateProps) {
  return (
    <div className="notes-list__empty" data-testid={`${dataTestId}-empty`}>
      <svg viewBox="0 0 64 64" width="48" height="48" aria-hidden="true" className="notes-list__empty-icon">
        <rect x="12" y="8" width="40" height="48" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="20" y1="20" x2="44" y2="20" stroke="currentColor" strokeWidth="2" />
        <line x1="20" y1="30" x2="44" y2="30" stroke="currentColor" strokeWidth="2" />
        <line x1="20" y1="40" x2="36" y2="40" stroke="currentColor" strokeWidth="2" />
      </svg>
      <p className="notes-list__empty-message">
        {hasSearch ? 'Tidak ada catatan yang cocok dengan pencarianmu' : 'Belum ada catatan di sini'}
      </p>
    </div>
  );
}

interface NotesListProps {
  notes: Note[];
  onDelete: (id: number) => void;
  onArchive: (id: number) => void;
  onUpdate: (id: number, values: NoteFormValues) => void;
  onTogglePin: (id: number) => void;
  onColorChange: (id: number, color: NoteColor) => void;
  dataTestId?: string;
  searchKeyword?: string;
}

function NotesList({
  notes,
  onDelete,
  onArchive,
  onUpdate,
  onTogglePin,
  onColorChange,
  dataTestId = 'notes-list',
  searchKeyword = '',
}: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="notes-list" data-testid={dataTestId}>
        <EmptyState dataTestId={dataTestId} hasSearch={searchKeyword.trim() !== ''} />
      </div>
    );
  }

  const groupedNotes = groupNotesByMonthYear(notes);

  return (
    <div className="notes-list notes-list--grouped" data-testid={dataTestId}>
      {Object.entries(groupedNotes).map(([groupKey, groupNotes]) => (
        <section key={groupKey} data-testid={`${groupKey}-group`} className="notes-group">
          <div className="notes-group__header">
            <h3>{formatGroupHeader(groupKey)}</h3>
            <span data-testid={`${groupKey}-group-count`}>{groupNotes.length} catatan</span>
          </div>
          <div className="notes-group__items">
            <AnimatePresence initial={false}>
              {groupNotes.map((note) => (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                >
                  <NoteItem
                    note={note}
                    onDelete={onDelete}
                    onArchive={onArchive}
                    onUpdate={onUpdate}
                    onTogglePin={onTogglePin}
                    onColorChange={onColorChange}
                    searchKeyword={searchKeyword}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
      ))}
    </div>
  );
}

export default NotesList;