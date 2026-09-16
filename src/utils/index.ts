import type { Note, SortOption } from '../types';

const showFormattedDate = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(date).toLocaleDateString('id-ID', options);
};

const WORDS_PER_MINUTE = 200;

function getTextStats(body: string) {
  const trimmed = body.trim();
  const wordCount = trimmed === '' ? 0 : trimmed.split(/\s+/).length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
  return { wordCount, charCount: body.length, readingTimeMinutes };
}

function sortNotes(notes: Note[], sortOption: SortOption): Note[] {
  const compareBy: Record<SortOption, (a: Note, b: Note) => number> = {
    newest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    oldest: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    'title-asc': (a, b) => a.title.localeCompare(b.title, 'id-ID'),
  };

  return [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return compareBy[sortOption](a, b);
  });
}

export { showFormattedDate, getTextStats, sortNotes };