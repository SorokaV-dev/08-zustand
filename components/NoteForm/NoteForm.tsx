"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createNote } from "@/lib/api";
import { noteKeys } from "@/lib/query/keys";
import { initialDraft, useNoteStore } from "@/lib/store/noteStore";
import { NOTE_TAGS, type NewNote, type NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
}

function readNote(formData: FormData): NewNote | null {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const rawTag = String(formData.get("tag") ?? "");

  if (
    title.length < 3 ||
    title.length > 50 ||
    content.length > 500 ||
    !NOTE_TAGS.includes(rawTag as NoteTag)
  ) {
    return null;
  }

  return { title, content, tag: rawTag as NoteTag };
}

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);
  const [isHydrated, setIsHydrated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: noteKeys.all });
      clearDraft();
      router.back();
    },
  });

  useEffect(() => {
    if (useNoteStore.persist.hasHydrated()) {
      setIsHydrated(true);
      return;
    }

    let isMounted = true;

    void Promise.resolve(useNoteStore.persist.rehydrate())
      .catch(() => undefined)
      .finally(() => {
        if (isMounted) setIsHydrated(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setDraft({ ...draft, title: event.currentTarget.value });
  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setErrorMessage(null);
    setDraft({ ...draft, content: event.currentTarget.value });
  };

  const handleTagChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setErrorMessage(null);
    setDraft({ ...draft, tag: event.currentTarget.value as NoteTag });
  };

  const handleFormAction = async (formData: FormData) => {
    const note = readNote(formData);
    if (!note) {
      setErrorMessage("Check the title, content, and tag, then try again.");
      return;
    }

    setErrorMessage(null);

    try {
      await createMutation.mutateAsync(note);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  const handleCancel = () => router.back();

  if (!isHydrated) {
    return <p role="status">Loading draft…</p>;
  }

  return (
    <form className={css.form} action={handleFormAction}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          className={css.input}
          minLength={3}
          maxLength={50}
          required
          value={draft?.title ?? initialDraft.title}
          onChange={handleTitleChange}
          aria-describedby="title-error"
        />
        <span id="title-error" className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          maxLength={500}
          value={draft?.content ?? initialDraft.content}
          onChange={handleContentChange}
          aria-describedby="content-error"
        />
        <span id="content-error" className={css.error} />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          required
          value={draft?.tag ?? initialDraft.tag}
          onChange={handleTagChange}
          aria-describedby="tag-error"
        >
          {NOTE_TAGS.map((tag) => (
            <option value={tag} key={tag}>
              {tag}
            </option>
          ))}
        </select>
        <span id="tag-error" className={css.error} />
      </div>

      {errorMessage && (
        <p className={css.error} role="alert">
          {errorMessage}
        </p>
      )}

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Creating…" : "Create note"}
        </button>
      </div>
    </form>
  );
}
