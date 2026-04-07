---
name: pr-description
description: Writes pull request descriptions. Use when create a PR, writing a PR, or when the user asks to summarize changes for a pull request.
---

Write a pull request description for the current changes.

1. Run `git diff main...HEAD` and `git log main...HEAD --oneline` to understand all changes.
2. Produce a PR description with these sections:
   - **Summary**: 2-4 bullet points describing what changed and why.
   - **Changes**: grouped by area (backend, frontend, infra, etc.) with concise bullets.
   - **Test plan**: checklist of steps to verify the changes work correctly.
3. Keep the title under 70 characters, imperative mood (e.g. "Add Terraform frontend hosting").
4. Do not mention implementation details that are obvious from the diff (e.g. "changed line 42").
