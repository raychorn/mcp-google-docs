# Docker deployment (Default Project submodule)

This fork is vendored as the `mcp-google-docs` submodule of `raychorn/Default-Project`.
The upstream server is **stdio-only**, so it runs as a short-lived container attached to
OpenCode's stdin/stdout. No Node.js installation and no published host port are required.

## Host port / conflict check

**Host port: none.** The server speaks JSON-RPC over stdio through `docker run -i`; it does
not listen on a socket. No port conflict is possible. Verified against the live daemon on
2026-11-24: running containers publish `8000`, `8100`, `3000`, `18080`, `8880`, `27017`
and `8080`, none of which are used here.

## Build

From the parent repository root:

```powershell
docker build -t mcp-google-docs:local .\mcp-google-docs
```

The image is multi-stage: `node:22-alpine` compiles TypeScript, then a second
`node:22-alpine` stage installs production dependencies only and runs as the unprivileged
`mcp` user. Telemetry is disabled in the image (`ASKADS_TELEMETRY=0`).

## Credentials

Create `C:\Users\raych\.local\share\google-docs-mcp\credentials.env` with:

```dotenv
GOOGLE_DOCS_CLIENT_ID=
GOOGLE_DOCS_CLIENT_SECRET=
GOOGLE_DOCS_REFRESH_TOKEN=
ASKADS_TELEMETRY=0
```

Create `C:\Users\raych\.local\share\google-docs-mcp\state` for persisted tokens.

The in-chat PKCE login opens a one-shot listener on `127.0.0.1` **inside** the container,
which a host browser cannot reach. Obtain the refresh token on the host once (Google OAuth
Playground with your own Desktop-app OAuth client, scopes `documents` and `drive`; use
`documents.readonly` and `drive.readonly` for read-only access), then fill the env file.
Enable **Google Docs API** and **Google Drive API** in the same Google Cloud project.

With empty values the server still starts and answers `initialize`/`tools/list`, but tool
calls fail with `CredentialsError` until the file is filled and OpenCode is restarted.

## OpenCode config

Global `~/.config/opencode/opencode.json` entry:

```json
"google-docs": {
  "type": "local",
  "command": [
    "docker",
    "run",
    "--rm",
    "-i",
    "--env-file",
    "C:\\Users\\raych\\.local\\share\\google-docs-mcp\\credentials.env",
    "-v",
    "C:\\Users\\raych\\.local\\share\\google-docs-mcp\\state:/home/mcp/.config/mcp-google-docs",
    "mcp-google-docs:local"
  ]
}
```

Restart OpenCode (or reconnect MCP servers) after changing the config.

## Upstream updates

`upstream` is pinned to `https://github.com/A1-x-Tech/mcp-google-docs.git`. To pick up a
new release:

```bash
git fetch upstream main
git merge upstream/main
```

Then rebuild the image and update the submodule pointer in the parent repository.
