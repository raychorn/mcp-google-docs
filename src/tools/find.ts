import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { GoogleDocsClient } from "../client.js";
import { fail, ok, READ_ONLY } from "./util.js";

export function registerFindTools(server: McpServer, client: GoogleDocsClient): void {
  server.registerTool(
    "find_document",
    {
      title: "Find a document by name",
      annotations: READ_ONLY,
      description:
        "Finds a Google Doc by name or name fragment. Drive's name search is used to narrow candidates, then results are re-ranked by fuzzy similarity so partial names, fragments and small typos resolve to the best single match. Returns `match` (the best single document, or null when nothing clears the confidence threshold) plus a ranked `candidates` list (id, name, score, modifiedTime) for disambiguation. Read-only: Google Docs is never modified. Use the returned id with get_document/read_document_text/export_document and the other document tools.",
      inputSchema: {
        query: z
          .string()
          .min(1)
          .describe("Full or partial document name, or a distinctive fragment of it."),
        max_results: z
          .number()
          .int()
          .min(1)
          .max(25)
          .optional()
          .describe("How many ranked candidates to return (default 5, max 25)."),
      },
    },
    async ({ query, max_results }) => {
      try {
        return ok(await client.findDocuments({ query, maxResults: max_results }));
      } catch (e) {
        return fail(e);
      }
    },
  );
}