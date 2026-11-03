import { NOTE_TAGS, type NoteTag } from "@/types/note";

export type NoteFilter = "all" | NoteTag;

export function parseNoteFilter(slug: string[]): NoteFilter | null {
  if (slug.length !== 1) return null;

  const value = slug[0]?.toLowerCase();
  if (value === "all") return "all";

  return NOTE_TAGS.find((tag) => tag.toLowerCase() === value) ?? null;
}

export function getApiTag(filter: NoteFilter): NoteTag | undefined {
  return filter === "all" ? undefined : filter;
}
