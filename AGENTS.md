<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Mandatory Inspection and Feature Log

Rules:

- Before any code change, inspect the relevant existing files first.
- Do not guess project structure.
- Do not modify, generate, delete, or refactor code before inspection.
- Every feature must have exactly one tracking markdown file named after the feature: `<feature-name>.md`.
- Always update the existing tracking file.
- Do not create duplicate tracking files such as `notes.md`, `todo.md`, `progress.md`, `feature-log.md`, or `changelog.md`.
- If inspection is not possible, stop and report: `INSPECTION_REQUIRED_REPORT`.
