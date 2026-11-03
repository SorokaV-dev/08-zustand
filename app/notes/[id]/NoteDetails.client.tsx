"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import { noteKeys } from "@/lib/query/keys";
import previewCss from "@/components/NotePreview/NotePreview.module.css";
import css from "./NoteDetails.module.css";

function formatDate(date: string): string {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return date;

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(value);
}

interface NoteDetailsClientProps {
  isPreview?: boolean;
  onClose?: () => void;
}

export default function NoteDetailsClient({
  isPreview = false,
  onClose,
}: NoteDetailsClientProps) {
  const styles = isPreview ? previewCss : css;
  const params = useParams<{ id: string }>();
  const id = params.id;
  const hasToken = Boolean(process.env.NEXT_PUBLIC_NOTEHUB_TOKEN);
  const noteQuery = useQuery({
    queryKey: noteKeys.detail(id),
    queryFn: () => fetchNoteById(id),
    enabled: Boolean(id) && hasToken,
  });

  if (!hasToken) {
    return (
      <main>
        <div className={styles.container}>
          <p role="status">
            Add your personal <code>NEXT_PUBLIC_NOTEHUB_TOKEN</code> to the
            local .env file to load this note.
          </p>
        </div>
      </main>
    );
  }

  if (noteQuery.isPending) {
    return (
      <main>
        <div className={styles.container}>
          <p role="status">Loading note…</p>
        </div>
      </main>
    );
  }

  if (noteQuery.error) {
    return (
      <main>
        <div className={styles.container}>
          <p role="alert">
            Could not fetch note details. {noteQuery.error.message}
          </p>
        </div>
      </main>
    );
  }

  if (!noteQuery.data) {
    return (
      <main>
        <div className={styles.container}>
          <p role="status">Note not found.</p>
        </div>
      </main>
    );
  }

  const note = noteQuery.data;

  return (
    <main>
      <div className={styles.container}>
        <article className={styles.item}>
          <header className={styles.header}>
            <h2>{note.title}</h2>
            {onClose ? (
              <button
                type="button"
                className={styles.backBtn}
                onClick={onClose}
                aria-label="Close note preview"
              >
                Close
              </button>
            ) : (
              <span className={styles.tag}>{note.tag}</span>
            )}
          </header>
          {onClose && <p className={styles.tag}>{note.tag}</p>}
          <p className={styles.content}>{note.content}</p>
          <time className={styles.date} dateTime={note.createdAt}>
            {formatDate(note.createdAt)}
          </time>
        </article>
      </div>
    </main>
  );
}
