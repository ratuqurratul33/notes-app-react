export type NoteColor = 'default' | 'yellow' | 'green' | 'blue' | 'pink' | 'purple';

export interface Note {
  id: number;
  title: string;
  body: string;
  createdAt: string;
  archived: boolean;
  pinned: boolean;
  color: NoteColor;
}

export type Theme = 'dark' | 'light';

export type SortOption = 'newest' | 'oldest' | 'title-asc';