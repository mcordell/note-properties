import { describe, it, expect } from "vitest";
import { VFile } from "vfile";
import { NoteProperties } from "../src/transformer";
import type { BuildCtx } from "@quartz-community/types";

type NotePropertiesData = {
  properties: Record<string, unknown>;
  hideView: boolean;
  legacyTag: "always" | "only" | "never";
  showProperties?: boolean;
  collapseProperties?: boolean;
};

function getNoteProperties(
  frontmatter: string,
  opts: Parameters<typeof NoteProperties>[0],
): NotePropertiesData {
  const plugin = NoteProperties(opts);
  const ctx = { allSlugs: [] } as unknown as BuildCtx;
  const plugins = plugin.markdownPlugins!(ctx);
  const transformer = (plugins[1] as () => (tree: unknown, file: VFile) => void)();

  const markdown = `---\n${frontmatter}\n---\ncontent`;
  const file = new VFile({
    value: new TextEncoder().encode(markdown),
    path: "note.md",
  });
  file.data = {};
  transformer(null, file);

  return file.data.noteProperties as NotePropertiesData;
}

describe("legacyTag", () => {
  describe("default", () => {
    it('defaults to "never" when not specified', () => {
      const noteProps = getNoteProperties('tags:\n  - foo', { includeAll: true });
      expect(noteProps.legacyTag).toBe("never");
    });
  });

  describe("propagation", () => {
    it('propagates "always"', () => {
      const noteProps = getNoteProperties('tags:\n  - foo', {
        includeAll: true,
        legacyTag: "always",
      });
      expect(noteProps.legacyTag).toBe("always");
    });

    it('propagates "only"', () => {
      const noteProps = getNoteProperties('tags:\n  - foo', {
        includeAll: true,
        legacyTag: "only",
      });
      expect(noteProps.legacyTag).toBe("only");
    });

    it('propagates "never"', () => {
      const noteProps = getNoteProperties('tags:\n  - foo', {
        includeAll: true,
        legacyTag: "never",
      });
      expect(noteProps.legacyTag).toBe("never");
    });

    it("propagates alongside other noteProperties fields", () => {
      const noteProps = getNoteProperties('tags:\n  - foo\ndescription: hello', {
        includeAll: true,
        legacyTag: "always",
        hidePropertiesView: true,
      });
      expect(noteProps.legacyTag).toBe("always");
      expect(noteProps.hideView).toBe(true);
      expect(noteProps.properties["tags"]).toEqual(["foo"]);
      expect(noteProps.properties["description"]).toBe("hello");
    });
  });

  describe("interaction with hideEmptyProperties", () => {
    it("empty tags array is excluded from properties when hideEmptyProperties is true", () => {
      const noteProps = getNoteProperties("tags: []", {
        includeAll: true,
        hideEmptyProperties: true,
        legacyTag: "always",
      });
      expect("tags" in noteProps.properties).toBe(false);
    });

    it("non-empty tags array is kept when hideEmptyProperties is true", () => {
      const noteProps = getNoteProperties('tags:\n  - foo', {
        includeAll: true,
        hideEmptyProperties: true,
        legacyTag: "always",
      });
      expect(noteProps.properties["tags"]).toEqual(["foo"]);
    });
  });

  describe('"only" mode — single-property condition', () => {
    // The component triggers legacy rendering when legacyTag === "only" AND
    // entries.length === 1 AND "tags" is in properties. These tests verify
    // that the transformer produces the right property shapes for those conditions.
    it("tags is the only visible property when includedProperties restricts to tags", () => {
      const noteProps = getNoteProperties('tags:\n  - foo\ndescription: hello', {
        includeAll: false,
        includedProperties: ["tags"],
        legacyTag: "only",
      });
      const entries = Object.entries(noteProps.properties);
      expect(entries).toHaveLength(1);
      expect("tags" in noteProps.properties).toBe(true);
    });

    it("multiple visible properties when includedProperties includes tags and description", () => {
      const noteProps = getNoteProperties('tags:\n  - foo\ndescription: hello', {
        includeAll: false,
        includedProperties: ["tags", "description"],
        legacyTag: "only",
      });
      const entries = Object.entries(noteProps.properties);
      expect(entries.length).toBeGreaterThan(1);
    });
  });
});
