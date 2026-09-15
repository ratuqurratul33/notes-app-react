import type { MouseEventHandler, ReactNode } from 'react';

type Variant = 'delete' | 'archive';

interface NoteActionButtonProps {
  variant: Variant;
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: ReactNode;
}

const classMap: Record<Variant, string> = {
  delete: 'note-item__delete-button',
  archive: 'note-item__archive-button',
};

const testIdMap: Record<Variant, string> = {
  delete: 'note-item-delete-button',
  archive: 'note-item-archive-button',
};

function NoteActionButton({ variant, onClick, children }: NoteActionButtonProps) {
  return (
    <button
      className={classMap[variant]}
      type="button"
      onClick={onClick}
      data-testid={testIdMap[variant]}
    >
      {children}
    </button>
  );
}

export default NoteActionButton;
