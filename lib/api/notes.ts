import axios from "axios";
import type { AxiosResponse } from "axios";
import type { NewNote, Note, NoteTag } from "@/types/note";

const API_URL = "https://notehub-public.goit.study/api";
const PER_PAGE = 12;

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: NoteTag;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

function createApiClient() {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  if (!token) {
    throw new Error(
      "Add your personal NEXT_PUBLIC_NOTEHUB_TOKEN to the local .env file.",
    );
  }

  return axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function fetchNotes(
  params: FetchNotesParams,
): Promise<FetchNotesResponse> {
  const response: AxiosResponse<FetchNotesResponse> =
    await createApiClient().get("/notes", {
      params: {
        page: params.page,
        perPage: params.perPage || PER_PAGE,
        ...(params.search?.trim() ? { search: params.search.trim() } : {}),
        ...(params.tag ? { tag: params.tag } : {}),
      },
    });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response: AxiosResponse<Note> = await createApiClient().get(
    `/notes/${id}`,
  );

  return response.data;
}

export async function createNote(note: NewNote): Promise<Note> {
  const response: AxiosResponse<Note> = await createApiClient().post(
    "/notes",
    note,
  );

  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response: AxiosResponse<Note> = await createApiClient().delete(
    `/notes/${id}`,
  );

  return response.data;
}
