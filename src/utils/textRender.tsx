import type { ReactNode } from 'react';

function highlightText(text: string, keyword: string): ReactNode {
  if (!keyword || keyword.trim() === '') return text;

  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => (regex.test(part) ? <mark key={index}>{part}</mark> : part));
}

function renderInline(text: string, keyword: string, keyPrefix: string): ReactNode {
  const boldRegex = /\*\*(.+?)\*\*/g;
  const segments: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push(
        <span key={`${keyPrefix}-${key++}`}>{highlightText(text.slice(lastIndex, match.index), keyword)}</span>
      );
    }
    segments.push(<strong key={`${keyPrefix}-${key++}`}>{highlightText(match[1], keyword)}</strong>);
    lastIndex = boldRegex.lastIndex;
  }
  if (lastIndex < text.length) {
    segments.push(<span key={`${keyPrefix}-${key++}`}>{highlightText(text.slice(lastIndex), keyword)}</span>);
  }
  return segments;
}

function renderNoteBody(body: string, keyword = ''): ReactNode {
  const lines = body.split('\n');
  const blocks: ReactNode[] = [];
  let listBuffer: string[] = [];

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ul key={key}>
        {listBuffer.map((item, index) => (
          <li key={index}>{renderInline(item, keyword, `${key}-li-${index}`)}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      listBuffer.push(trimmed.slice(2));
      return;
    }
    flushList(`list-${index}`);
    if (trimmed === '') return;
    blocks.push(<p key={`line-${index}`}>{renderInline(line, keyword, `line-${index}`)}</p>);
  });
  flushList('list-end');

  return blocks;
}

export { highlightText, renderNoteBody };