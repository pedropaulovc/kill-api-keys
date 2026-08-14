# CLAUDE.md

## Project overview

Kill API Keys is a buildless static site about better machine authentication. The production site is `https://killapikeys.fyi`.

The public surface is:

- `index.html` — manifesto and interactive authentication decision tree
- `hall-of-shame.html` — provider clearinghouse
- `styles.css` — shared styles
- `decision-tree.js` and `ui.js` — decision-tree data and rendering
- `hall-of-shame-data.js` and `hall-of-shame-ui.js` — provider data and rendering
- `logo.svg` and `og-image.png` — public images

## Commands

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm e2e
pnpm dev
scripts/package-pages.sh dist
```

The typecheck, unit-test, and end-to-end commands are placeholders. There is no application build.

## Deployment

Cloudflare Pages uses direct uploads from GitHub Actions. Do not deploy the repository root or reconnect Pages Git integration.

| Use | GitHub environment | Account ID | Pages project |
| --- | --- | --- | --- |
| Production | `cloudflare-production` | `22848e82150fbc3e17d88d21d48efdc4` | `kill-api-keys-vza-net-prod` |
| PPE | `cloudflare-ppe` | `91054c375dd473e2ff1a2730bbef1b12` | `kill-api-keys-ppe` |

Each environment provides variable `CLOUDFLARE_ACCOUNT_ID` and secret `CLOUDFLARE_API_TOKEN`. The credentials are account-specific and must not have a shared or default fallback.

`deploy-production.yml` accepts only `main` and asserts the production account. `deploy-ppe.yml` accepts same-repository pull requests, uploads branch `pr-<number>` to PPE, and skips forks before entering the protected environment. `cleanup-ppe.yml` deletes only PPE preview deployments whose metadata branch matches the closed PR.

`scripts/package-pages.sh` builds `dist/` with `git archive` and a public-file allowlist. That keeps repository files, tooling, and untracked private state out of Pages. Deploy jobs smoke both pages, the stylesheet, every required script, and both images on the returned deployment URL.

The `killapikeys.fyi` zone and Pages custom domain belong in the production account. The former Pages Git project remains named `kill-api-keys` only through the rollback window; the production workflow must never target it. Web Analytics must be enabled on `kill-api-keys-vza-net-prod` after cutover. See `README.md` for the zone transfer, verification, rollback, and former-project cleanup sequence. No application secrets or data need migration.

## CI and repository policy

`.github/workflows/ci.yml` runs the four protected checks (`lint`, `typecheck`, `unit-tests`, and `e2e-tests`) and also checks the Pages artifact. The `main` branch is merge-only. Do not commit local `.claude/`, `.playwright-cli/`, `.wrangler/`, or generated `dist/` state.

Repository settings and rulesets come from `typescript-project/scripts/provision-repo.sh`. Run it as `scripts/provision-repo.sh pedropaulovc/kill-api-keys` from that repository when settings must be reapplied.
