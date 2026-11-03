import Link from "next/link";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

export interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
  deletingId?: string | null;
}

export default function NoteList({
  notes,
  onDelete,
  deletingId = null,
}: NoteListProps) {
  if (notes.length === 0) return null;

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li className={css.listItem} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <Link className={css.link} href={`/notes/${note.id}`}>
              View details
            </Link>
            <button
              className={css.button}
              type="button"
              onClick={() => onDelete(note.id)}
              disabled={deletingId === note.id}
              aria-label={`Delete note ${note.title}`}
            >
              {deletingId === note.id ? "Deleting…" : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
