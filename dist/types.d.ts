export { BuildCtx, CSSResource, ChangeEvent, FilePath, FullSlug, JSResource, PageGenerator, PageMatcher, ProcessedContent, QuartzEmitterPlugin, QuartzEmitterPluginInstance, QuartzFilterPlugin, QuartzFilterPluginInstance, QuartzPageTypePlugin, QuartzPageTypePluginInstance, QuartzPluginData, QuartzTransformerPlugin, QuartzTransformerPluginInstance, StaticResources, VirtualPage } from '@quartz-community/types';

interface NotePropertiesOptions {
    /** Include all frontmatter properties in the display. When false, only `includedProperties` are shown. */
    includeAll: boolean;
    /** Properties to include when `includeAll` is false. Ignored when `includeAll` is true. */
    includedProperties: string[];
    /** Properties to exclude from display. Applied after inclusion logic. */
    excludedProperties: string[];
    /** Hide the visual properties panel while still processing frontmatter and resolving links. */
    hidePropertiesView: boolean;
    /** Omit properties whose value is null, undefined, empty string, or empty array. */
    hideEmptyProperties: boolean;
    /**
     * "always" — always render tags as a legacy .tags list instead of the properties panel.
     * "only"   — use legacy rendering when tags is the only non-empty visible property.
     * "never"  — always use the standard properties panel (default).
     */
    legacyTag: "always" | "only" | "never";
    /** Frontmatter delimiters. Defaults to "---". */
    delimiters: string | [string, string];
    /** Frontmatter language. Defaults to "yaml". */
    language: "yaml" | "toml";
}

export type { NotePropertiesOptions };
