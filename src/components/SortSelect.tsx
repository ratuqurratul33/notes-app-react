import type { ChangeEvent } from 'react';
import type { SortOption } from '../types';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'title-asc', label: 'Judul A-Z' },
];

function SortSelect({ value, onChange }: SortSelectProps) {
  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    onChange(event.target.value as SortOption);
  }

  return (
    <select
      className="sort-select"
      value={value}
      onChange={onSelectChange}
      aria-label="Urutkan catatan"
      data-testid="sort-select"
    >
      {OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default SortSelect;
