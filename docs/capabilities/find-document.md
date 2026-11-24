# Google Docs: Find a document by name — MCP tool

**Google Docs MCP tool:** Finds a Google Doc by full or partial name, or a name fragment, and resolves the best single match.

Technical name: `find_document`

## What task it solves

> I want to locate a Google Doc when I only know part of its name.

Returns the best-matching document (`match`) plus a ranked list of candidates (`id`, `name`, `score`, `modifiedTime`) so a name fragment or partial title can be resolved to a single document id.

## When to use it

Use it before any document tool when you have a name or fragment rather than an id — for example to find "ClearSight wearable glasses" without browsing Drive. The score (0–1) indicates confidence; when it is low, inspect `candidates` and pick manually.

## What to provide

- `query` — **required**. Full or partial document name, or a distinctive fragment of it.
- `max_results` — optional, default 5, max 25. How many ranked candidates to return.

## What it returns

An object with `query`, `match` (the best single document `{ id, name, score }` or `null` when nothing clears the confidence threshold) and `candidates` (ranked list with `id`, `name`, `score`, `modifiedTime`).

## What changes in Google Docs

Nothing — the tool reads Google Drive metadata and does not change it.

## Example request

> Find the document named "tusk-tech-ClearSight-wearable-glasses" and return its id.

## Errors and limitations

Name matching is fuzzy and based on Drive's case-insensitive substring search plus client-side scoring; very short or common fragments may return multiple candidates. Only Google Docs (not Sheets, Slides or other Drive files) are considered, and trashed documents are excluded. Access depends on token permissions, quotas and upstream API limits.

## Related MCP tools

- [Get document structure](./get-document.md) — `get_document`
- [Read document as text](./read-document-text.md) — `read_document_text`
- [Export a document](./export-document.md) — `export_document`

## Technical details

- **Impact:** read-only
- **Group:** Documents and Markdown
- **Description source:** `find_document` registration in `src/tools/find.ts`
- [Full technical reference](../TOOLS.md)
- [All MCP capabilities](./index.md)