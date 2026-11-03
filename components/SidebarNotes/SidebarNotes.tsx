import Link from "next/link";
import { NOTE_TAGS } from "@/types/note";
import type { NoteFilter } from "@/lib/notes/filter";
import css from "./SidebarNotes.module.css";

export interface SidebarNotesProps {
  activeFilter: NoteFilter;
}

const filters: { label: string; value: NoteFilter }[] = [
  { label: "All notes", value: "all" },
  ...NOTE_TAGS.map((tag) => ({ label: tag, value: tag })),
];

export default function SidebarNotes({ activeFilter }: SidebarNotesProps) {
  return (
    <nav aria-label="Note filters">
      <ul className={css.menuList}>
        {filters.map((filter) => {
          const href = `/notes/filter/${filter.value}`;
          const isActive = filter.value === activeFilter;

          return (
            <li className={css.menuItem} key={filter.value}>
              <Link
                className={css.menuLink}
                href={href}
                aria-current={isActive ? "page" : undefined}
              >
                {filter.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
