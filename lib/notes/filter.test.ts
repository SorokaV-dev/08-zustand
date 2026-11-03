import { describe, expect, it } from "vitest";
import { getApiTag, parseNoteFilter } from "@/lib/notes/filter";

describe("note filter routes", () => {
  it("maps the all route to an unfiltered API request", () => {
    const filter = parseNoteFilter(["all"]);

    expect(filter).toBe("all");
    expect(filter && getApiTag(filter)).toBeUndefined();
  });

  it.each(["Todo", "Work", "Personal", "Meeting", "Shopping"])(
    "accepts the %s tag route",
    (tag) => {
      const filter = parseNoteFilter([tag]);

      expect(filter).toBe(tag);
      expect(filter && getApiTag(filter)).toBe(tag);
    },
  );

  it("normalizes tag casing and rejects unknown or nested filters", () => {
    expect(parseNoteFilter(["work"])).toBe("Work");
    expect(parseNoteFilter(["Unknown"])).toBeNull();
    expect(parseNoteFilter(["Work", "extra"])).toBeNull();
    expect(parseNoteFilter([])).toBeNull();
  });
});
