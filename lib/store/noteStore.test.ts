import { beforeEach, describe, expect, it } from "vitest";
import { initialDraft, useNoteStore } from "@/lib/store/noteStore";

describe("note draft store", () => {
  beforeEach(() => {
    useNoteStore.setState({ draft: initialDraft });
  });

  it("starts with an empty Todo draft", () => {
    expect(useNoteStore.getState().draft).toEqual({
      title: "",
      content: "",
      tag: "Todo",
    });
  });

  it("stores the latest form values", () => {
    const draft = {
      title: "Call the dentist",
      content: "Ask about an appointment.",
      tag: "Personal" as const,
    };

    useNoteStore.getState().setDraft(draft);

    expect(useNoteStore.getState().draft).toEqual(draft);
  });

  it("restores the saved draft from persistent storage", async () => {
    const draft = {
      title: "Call the dentist",
      content: "Ask about an appointment.",
      tag: "Personal" as const,
    };

    useNoteStore.setState({ draft: initialDraft });
    localStorage.setItem(
      "notehub-create-note-draft",
      JSON.stringify({ state: { draft }, version: 0 }),
    );
    await useNoteStore.persist.rehydrate();

    expect(useNoteStore.getState().draft).toEqual(draft);
  });

  it("clears values back to the initial draft", () => {
    useNoteStore.getState().setDraft({
      title: "Temporary note",
      content: "Draft text",
      tag: "Work",
    });

    useNoteStore.getState().clearDraft();

    expect(useNoteStore.getState().draft).toEqual(initialDraft);
  });
});
