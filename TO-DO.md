# TO-DO — containerized Google Docs MCP

- [x] Docker image `mcp-google-docs:local` builds from the vendored source.
- [x] stdio handshake verified: 27 tools, protocol `2025-06-18`, clean exit.
- [x] Host port: **none** (stdio over `docker run -i`). Verified 2026-11-24 against live
      daemon state: existing published ports are `8000`, `8100`, `3000`, `18080`, `8880`,
      `27017`, `8080`; no new port is consumed.
- [ ] Fill `C:\Users\raych\.local\share\google-docs-mcp\credentials.env` with the OAuth
      client ID/secret and refresh token, then restart OpenCode's MCP connection.
- [x] Push `main` to `raychorn/mcp-google-docs` after the token's `Contents: write`
      permission was restored (`1fa14b1`).
- [x] Push the parent repository's submodule pointer (`1fa1b15`); remote gitlink SHA
      matches the submodule's `refs/heads/main`.
