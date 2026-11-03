import axios, { type AxiosInstance } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createNote, deleteNote, fetchNoteById, fetchNotes } from "@/lib/api";
import type { Note } from "@/types/note";

vi.mock("axios", () => ({
  default: { create: vi.fn() },
}));

const note: Note = {
  id: "note-1",
  title: "Study plan",
  content: "Review the Next.js lesson",
  createdAt: "2026-10-01T10:00:00.000Z",
  updatedAt: "2026-10-01T10:00:00.000Z",
  tag: "Todo",
};

const get = vi.fn();
const post = vi.fn();
const remove = vi.fn();
const createClient = vi.mocked(axios.create);

beforeEach(() => {
  process.env.NEXT_PUBLIC_NOTEHUB_TOKEN = "test-token";
  createClient.mockClear();
  get.mockReset();
  post.mockReset();
  remove.mockReset();
  createClient.mockReturnValue({
    get,
    post,
    delete: remove,
  } as unknown as AxiosInstance);
});

afterEach(() => {
  vi.clearAllMocks();
  delete process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
});

describe("NoteHub API", () => {
  it("requests paginated notes and omits an empty search", async () => {
    const data = { notes: [note], totalPages: 2 };
    get.mockResolvedValue({ data });

    await expect(
      fetchNotes({ page: 2, perPage: 12, search: "  " }),
    ).resolves.toEqual(data);
    expect(createClient).toHaveBeenCalledWith({
      baseURL: "https://notehub-public.goit.study/api",
      headers: { Authorization: "Bearer test-token" },
    });
    expect(get).toHaveBeenCalledWith("/notes", {
      params: { page: 2, perPage: 12 },
    });
  });

  it("trims the note search term", async () => {
    get.mockResolvedValue({ data: { notes: [note], totalPages: 1 } });

    await fetchNotes({ page: 1, perPage: 12, search: " plan " });

    expect(get).toHaveBeenCalledWith("/notes", {
      params: { page: 1, perPage: 12, search: "plan" },
    });
  });

  it("filters notes by tag without adding an empty tag", async () => {
    get.mockResolvedValue({ data: { notes: [note], totalPages: 1 } });

    await fetchNotes({ page: 1, perPage: 12, tag: "Work" });

    expect(get).toHaveBeenCalledWith("/notes", {
      params: { page: 1, perPage: 12, tag: "Work" },
    });
  });

  it("fetches, creates, and deletes notes by their API routes", async () => {
    get.mockResolvedValue({ data: note });
    post.mockResolvedValue({ data: note });
    remove.mockResolvedValue({ data: note });

    await expect(fetchNoteById(note.id)).resolves.toEqual(note);
    await expect(
      createNote({ title: note.title, content: note.content, tag: note.tag }),
    ).resolves.toEqual(note);
    await expect(deleteNote(note.id)).resolves.toEqual(note);

    expect(get).toHaveBeenCalledWith("/notes/note-1");
    expect(post).toHaveBeenCalledWith("/notes", {
      title: note.title,
      content: note.content,
      tag: note.tag,
    });
    expect(remove).toHaveBeenCalledWith("/notes/note-1");
  });

  it("requires a token before sending a request", async () => {
    process.env.NEXT_PUBLIC_NOTEHUB_TOKEN = "";

    await expect(fetchNotes({ page: 1, perPage: 12 })).rejects.toThrow(
      "Add your personal NEXT_PUBLIC_NOTEHUB_TOKEN",
    );
    expect(createClient).not.toHaveBeenCalled();
  });
});
