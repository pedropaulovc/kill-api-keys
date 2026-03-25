# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static website advocating for better API authentication practices. Hosted on Cloudflare Pages.

- **Production domain:** killapikeys.fyi (eventual), killapikeys.vza.net (current)
- **DNS zone:** vza.net (managed in Cloudflare)
- **Hosting:** Cloudflare Pages (static files, no build step — Pages serves from repo root)

## Commands

```bash
pnpm install          # install dependencies
pnpm lint             # htmlhint on index.html
pnpm typecheck        # placeholder (no TS yet)
pnpm test             # placeholder (no unit tests yet)
pnpm e2e              # placeholder (no e2e tests yet)
pnpm dev              # local dev server (npx serve .)
```

## Architecture

Single-page static site — all content lives in `index.html` (HTML + CSS + vanilla JS, no build pipeline).

The page is an interactive decision tree that guides users through choosing the right API authentication method. Data (`allNodes` and `results` objects) and rendering logic are both inline in `<script>` tags within the HTML.

## CI / branch protection

GitHub Actions CI (`.github/workflows/ci.yml`) runs four jobs matching the required status checks: `lint`, `typecheck`, `unit-tests`, `e2e-tests`. The `main` branch is protected via rulesets (merge-only, no squash/rebase). Tags matching `v*` are immutable.

## Repo policies

Repo settings and rulesets are provisioned by the script at https://github.com/pedropaulovc/typescript-project/blob/main/scripts/provision-repo.sh — run it with `scripts/provision-repo.sh pedropaulovc/kill-api-keys` to reapply.
