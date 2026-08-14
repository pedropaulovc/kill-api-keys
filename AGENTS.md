# AGENTS.md

## Repository

This is a buildless static site. Keep changes in the existing HTML, CSS, and vanilla JavaScript unless the task requires deployment tooling.

Public files are packaged by `scripts/package-pages.sh`. If a page starts using another local asset, add that asset to the script's allowlist and to the workflow smoke list. Never deploy the repository root. Files under `.git`, `.github`, `.claude`, `.playwright-cli`, `.wrangler`, `scripts`, or `node_modules` are not site content.

## Commands

```bash
pnpm install
pnpm dev
pnpm lint
scripts/package-pages.sh dist
```

`pnpm typecheck`, `pnpm test`, and `pnpm e2e` are placeholders until those test layers exist.

## Deployment contract

| Environment | Account ID | Pages project |
| --- | --- | --- |
| `cloudflare-production` | `22848e82150fbc3e17d88d21d48efdc4` | `kill-api-keys` |
| `cloudflare-ppe` | `91054c375dd473e2ff1a2730bbef1b12` | `kill-api-keys-ppe` |

Both GitHub environments provide variable `CLOUDFLARE_ACCOUNT_ID` and secret `CLOUDFLARE_API_TOKEN`. Do not add a repository-level credential, hard-coded token, shared token, default account, or source-account fallback.

Production deploys only from `main`. Same-repository pull requests deploy to PPE as branch `pr-<number>`; fork pull requests must never enter a credentialed job. PR cleanup may delete only preview deployments in `kill-api-keys-ppe` whose metadata branch exactly matches that PR. It must not delete the PPE project or any production resource.

Cloudflare Pages projects are direct-upload projects. Do not reconnect Pages Git integration. The workflows pin both the action commit and Wrangler version and assert their account before deployment or cleanup.

The live production apex is `killapikeys.fyi`. Its zone belongs in production account `22848e82150fbc3e17d88d21d48efdc4`. Cloudflare Web Analytics is destination-project configuration, not a script checked into this repository.

## Change checklist

- Keep `README.md`, `AGENTS.md`, and `CLAUDE.md` aligned when deployment names, accounts, paths, or runbooks change.
- Package only committed public files.
- Smoke `/`, `/hall-of-shame.html`, `styles.css`, all four JavaScript assets, `logo.svg`, and `og-image.png` on direct deployment URLs.
- Preserve untracked local state. Do not commit `.claude/`, `.playwright-cli/`, `.wrangler/`, or generated `dist/`.
- All changes to `main` go through a pull request.
