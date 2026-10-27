import { useRef, type ReactNode } from 'react';
import { parseImport, type ParsedFile } from '../backup';

interface Props {
  className?: string;
  children: ReactNode;
  onParsed: (result: ParsedFile) => void;
}

/** A button that opens the Files picker and parses a backup or setup file. */
export function ImportButton({ className, children, onParsed }: Props) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <>
      <button type="button" className={className ?? 'btn'} onClick={() => input.current?.click()}>
        {children}
      </button>
      <input
        ref={input}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (file) onParsed(parseImport(await file.text()));
        }}
      />
    </>
  );
}
