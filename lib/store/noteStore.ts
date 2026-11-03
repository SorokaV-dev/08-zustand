import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { NewNote } from "@/types/note";

export const initialDraft: NewNote = {
  title: "",
  content: "",
  tag: "Todo",
};

interface NoteStore {
  draft: NewNote;
  setDraft: (draft: NewNote) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "notehub-create-note-draft",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ draft }) => ({ draft }),
      skipHydration: true,
    },
  ),
);
