import type { Note, SortOption } from '../types';

const getInitialData = (): Note[] => [
  {
    id: 1,
    title: 'Babel',
    body: 'Babel merupakan tools open-source yang digunakan untuk mengubah sintaks ECMAScript 2015+ menjadi sintaks yang didukung oleh JavaScript engine versi lama. Babel sering dipakai ketika kita menggunakan sintaks terbaru termasuk sintaks JSX.',
    createdAt: '2025-04-01T04:27:34.572Z',
    archived: false,
    pinned: false,
    color: 'default',
  },
  {
    id: 2,
    title: 'Functional Component',
    body: 'Functional component merupakan React component yang dibuat menggunakan fungsi JavaScript. Agar fungsi JavaScript dapat disebut component ia harus mengembalikan React element dan dipanggil layaknya React component.',
    createdAt: '2025-04-02T04:27:34.572Z',
    archived: false,
    pinned: false,
    color: 'default',
  },
  {
    id: 3,
    title: 'Modularization',
    body: 'Dalam konteks pemrograman JavaScript, modularization merupakan teknik dalam memecah atau menggunakan kode dalam berkas JavaScript secara terpisah berdasarkan tanggung jawabnya masing-masing.',
    createdAt: '2025-04-03T04:27:34.572Z',
    archived: false,
    pinned: false,
    color: 'default',
  },
  {
    id: 4,
    title: 'Lifecycle',
    body: 'Dalam konteks React component, lifecycle merupakan kumpulan method yang menjadi siklus hidup mulai dari component dibuat (constructor), dicetak (render), pasca-cetak (componentDidMount), dan sebagainya. ',
    createdAt: '2025-04-08T04:27:34.572Z',
    archived: false,
    pinned: false,
    color: 'default',
  },
  {
    id: 5,
    title: 'ESM',
    body: 'ESM (ECMAScript Module) merupakan format modularisasi standar JavaScript.',
    createdAt: '2025-05-14T04:27:34.572Z',
    archived: false,
    pinned: false,
    color: 'default',
  },
  {
    id: 6,
    title: 'Module Bundler',
    body: 'Dalam konteks pemrograman JavaScript, module bundler merupakan tools yang digunakan untuk menggabungkan seluruh modul JavaScript yang digunakan oleh aplikasi menjadi satu berkas.\n- Webpack\n- Rollup\n- **Vite** (pakai esbuild & Rollup)',
    createdAt: '2025-05-20T04:27:34.572Z',
    archived: false,
    pinned: false,
    color: 'default',
  },
];

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

export { getInitialData, showFormattedDate, getTextStats, sortNotes };