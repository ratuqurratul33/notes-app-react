import { useRef, type ChangeEvent } from 'react';
import type { Note } from '../types';

interface NoteDataActionsProps {
  notes: Note[];
  onImport: (notes: Note[]) => void;
}

function isValidNoteArray(data: unknown): data is Note[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        item &&
        typeof item.id === 'number' &&
        typeof item.title === 'string' &&
        typeof item.body === 'string' &&
        typeof item.createdAt === 'string' &&
        typeof item.archived === 'boolean'
    )
  );
}

function NoteDataActions({ notes, onImport }: NoteDataActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notes-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const text = await file.text();
      const data: unknown = JSON.parse(text);

      if (!isValidNoteArray(data)) {
        window.alert('Format file tidak valid. Pastikan ini adalah file ekspor dari Notes App.');
        return;
      }

      const normalized = data.map((note) => ({
        ...note,
        pinned: note.pinned ?? false,
        color: note.color ?? 'default',
      }));
      onImport(normalized);
    } catch {
      window.alert('Gagal membaca file. Pastikan file berformat JSON yang valid.');
    }
  }

  return (
    <div className="note-data-actions" data-testid="note-data-actions">
      <button type="button" onClick={handleExport} data-testid="export-notes-button">
        Ekspor
      </button>
      <button type="button" onClick={handleImportClick} data-testid="import-notes-button">
        Impor
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        onChange={handleFileChange}
        hidden
        data-testid="import-notes-input"
      />
    </div>
  );
}

export default NoteDataActions;