# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Static website advocating for better API authentication practices. Hosted on Cloudflare Pages.

- **Production domain:** killapikeys.fyi (eventual), killapikeys.vza.net (current)
- **DNS zone:** vza.net (managed in Cloudflare)
- **Hosting:** Cloudflare Pages with GitHub Git integration (auto-deploys on push to main, no build step — Pages serves from repo root)
- **Cloudflare account ID:** 18ef3246e9f36d1560485ef53889c0ab

## Commands

```bash
pnpm install          # install dependencies
pnpm lint             # htmlhint on all HTML pages
pnpm typecheck        # placeholder (no TS yet)
pnpm test             # placeholder (no unit tests yet)
pnpm e2e              # placeholder (no e2e tests yet)
pnpm dev              # local dev server (npx serve .)
```

## Architecture

Multi-page static site (HTML + CSS + vanilla JS, no build pipeline).

Three pages: a manifesto against API keys, an interactive decision tree for choosing the right auth method, and a "Hall of Shame" clearinghouse of services and their auth support.

- `index.html` — manifesto homepage (static content, no JS)
- `decision-tree.html` — interactive decision tree page
- `hall-of-shame.html` — services clearinghouse page
- `styles.css` — shared stylesheet (design tokens, components, page-specific styles)
- `decision-tree.js` — decision tree data (`allNodes` questions and `results` recommendations)
- `ui.js` — decision tree rendering logic (breadcrumb, question cards, result cards)
- `hall-of-shame-data.js` — service directory data (auth methods per service)
- `hall-of-shame-ui.js` — Hall of Shame rendering logic (cards, filters, stats)

## Deployment

Cloudflare Pages Git integration auto-deploys on every push to `main`. No CI deploy step or API tokens needed. Preview deployments are created for all branches/PRs.

Cloudflare Pages config and custom domains can be managed via the Cloudflare API using the wrangler OAuth token at `~/.config/.wrangler/config/default.toml`. The token has `pages:write` scope but not DNS write — DNS changes require the Cloudflare dashboard.

## CI / branch protection

GitHub Actions CI (`.github/workflows/ci.yml`) runs four jobs matching the required status checks: `lint`, `typecheck`, `unit-tests`, `e2e-tests`. The `main` branch is protected via rulesets (merge-only, no squash/rebase). Tags matching `v*` are immutable.

All changes to `main` go through PRs. Direct pushes are blocked.

## Repo policies

Repo settings and rulesets are provisioned by the script at https://github.com/pedropaulovc/typescript-project/blob/main/scripts/provision-repo.sh — run it with `scripts/provision-repo.sh pedropaulovc/kill-api-keys` to reapply.
