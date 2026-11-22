"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNote, fetchNotes } from "@/lib/api";
import { noteKeys } from "@/lib/query/keys";
import type { NoteTag } from "@/types/note";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import css from "@/app/notes/NotesPage.module.css";

const PER_PAGE = 12;

interface NotesClientProps {
  initialPage: number;
  initialSearch: string;
  initialTag: NoteTag | null;
}

function getErrorMessage(error: Error | null): string {
  return error?.message ?? "Something went wrong. Please try again.";
}

export default function NotesClient({
  initialPage,
  initialSearch,
  initialTag,
}: NotesClientProps) {
  const hasToken = Boolean(process.env.NEXT_PUBLIC_NOTEHUB_TOKEN);
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [search, setSearch] = useState(initialSearch);

  const updateSearch = useDebouncedCallback((value: string) => {
    setSearch(value.trim());
    setCurrentPage(1);
  }, 350);

  const notesQuery = useQuery({
    queryKey: noteKeys.list(currentPage, search, initialTag ?? undefined),
    queryFn: () =>
      fetchNotes({
        page: currentPage,
        perPage: PER_PAGE,
        search,
        tag: initialTag ?? undefined,
      }),
    enabled: hasToken,
    placeholderData: (previousData) => previousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: noteKeys.all }),
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    updateSearch(value);
  };

  const notes = notesQuery.data?.notes ?? [];
  const totalPages = notesQuery.data?.totalPages ?? 0;
  const requestError = notesQuery.error ?? deleteMutation.error;

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage, initialTag]);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <main className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchInput} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            currentPage={Math.min(currentPage, totalPages)}
            pageCount={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>

      {!hasToken ? (
        <p role="status">
          Add your personal <code>NEXT_PUBLIC_NOTEHUB_TOKEN</code> to the local
          .env file to load your notes.
        </p>
      ) : notesQuery.isPending ? (
        <p role="status" aria-live="polite">
          Loading notes…
        </p>
      ) : requestError ? (
        <p role="alert">{getErrorMessage(requestError)}</p>
      ) : notes.length > 0 ? (
        <>
          {deleteMutation.error && (
            <p role="alert">{getErrorMessage(deleteMutation.error)}</p>
          )}
          <NoteList
            notes={notes}
            onDelete={(id) => deleteMutation.mutate(id)}
            deletingId={
              deleteMutation.isPending ? deleteMutation.variables : null
            }
          />
        </>
      ) : (
        <p role="status">No notes found.</p>
      )}
    </main>
  );
}
