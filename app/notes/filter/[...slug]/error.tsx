"use client";

import css from "@/app/notes/NotesPage.module.css";

interface FilteredNotesErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function FilteredNotesError({
  error,
  reset,
}: FilteredNotesErrorProps) {
  return (
    <main className={css.app}>
      <p role="alert">Could not load filtered notes. {error.message}</p>
      <button className={css.button} type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
