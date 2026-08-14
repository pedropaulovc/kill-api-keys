# Kill API Keys

A static site about replacing long-lived API keys with identity-based authentication. The public site is [killapikeys.fyi](https://killapikeys.fyi).

## Work locally

```bash
pnpm install
pnpm dev
pnpm lint
```

There is no build step. The site is plain HTML, CSS, and JavaScript.

## What gets deployed

`scripts/package-pages.sh` creates `dist/` from an explicit allowlist of files committed at `HEAD`:

- `index.html` and `hall-of-shame.html`
- `styles.css`
- `decision-tree.js`, `ui.js`, `hall-of-shame-data.js`, and `hall-of-shame-ui.js`
- `logo.svg` and `og-image.png`

The script uses `git archive`, so untracked files, local tools, repository settings, and private state cannot enter the upload. CI runs the packager to catch a missing or untracked public asset.

## Cloudflare Pages accounts

Production and PPE are separate direct-upload Pages projects. Neither workflow has a fallback account.

| Use | GitHub environment | Cloudflare account | Pages project | Trigger |
| --- | --- | --- | --- | --- |
| Production | `cloudflare-production` | `22848e82150fbc3e17d88d21d48efdc4` | `kill-api-keys-vza-net-prod` | Push to `main`, or a manual run whose ref is `main` |
| PPE | `cloudflare-ppe` | `91054c375dd473e2ff1a2730bbef1b12` | `kill-api-keys-ppe` | Open, update, or reopen a same-repository pull request |

Each protected GitHub environment must contain:

- variable `CLOUDFLARE_ACCOUNT_ID`, set to the account ID in the table;
- secret `CLOUDFLARE_API_TOKEN`, scoped to deploy and delete Pages deployments only in that environment's account.

Set the production environment's deployment-branch rule to `main`. Keep required reviewers on production. PPE may allow pull-request refs, but should still be protected. Tokens and account IDs must not be shared between the two environments.

The deploy jobs assert the expected account before sending credentials to Wrangler. Production always uploads branch `main` to `kill-api-keys-vza-net-prod`. A same-repository PR uploads branch `pr-<number>` to `kill-api-keys-ppe`. Fork pull requests are skipped before the PPE environment or its credentials are used.

When a same-repository PR closes, `cleanup-ppe.yml` lists preview deployments in the PPE project and deletes only those whose branch is exactly `pr-<number>`. It does not delete the project, production deployments, another PR's deployments, or anything in the production account.

Both deploy workflows smoke the direct deployment URL after upload. They check `/`, `/hall-of-shame.html`, every required JavaScript file, the stylesheet, and both images.

## Provisioning and cutover

Cloudflare projects, DNS, analytics, and GitHub environments are provisioned outside this repository. Use this order for the live move:

1. In account `91054c375dd473e2ff1a2730bbef1b12`, create the direct-upload Pages project `kill-api-keys-ppe`. Configure its production branch separately from the `pr-<number>` preview branches.
2. Add the `cloudflare-ppe` GitHub environment and its account-specific variable and token. Open a same-repository PR, then verify its workflow-provided URL and the complete smoke list.
3. In account `22848e82150fbc3e17d88d21d48efdc4`, create the globally unique direct-upload Pages project `kill-api-keys-vza-net-prod` with production branch `main`. The former project keeps its existing `kill-api-keys` name during the rollback window.
4. Add the `cloudflare-production` environment and its production-only variable and token. Run the production workflow from `main` and verify the returned `pages.dev` deployment URL before changing DNS.
5. Transfer the `killapikeys.fyi` zone to the production account, or complete a Cloudflare-supported account transfer that leaves the zone there. Recreate all required DNS records, attach `killapikeys.fyi` to `kill-api-keys-vza-net-prod`, and wait for the Pages custom domain and certificate to become active.
6. Re-run the smoke list against `https://killapikeys.fyi`. Re-enable Cloudflare Web Analytics on the destination Pages project and confirm that new visits appear. Analytics configuration is not stored in the site files.
7. Disconnect the former `kill-api-keys` Pages Git integration so a push cannot deploy back to the shared account. Keep that project during the rollback window, but remove its custom-domain association after the new domain is active.
8. After the rollback window, delete the former `kill-api-keys` Pages project and its old Analytics site. There are no application secrets, bindings, databases, or user data to migrate.

For rollback, restore the former `kill-api-keys` Pages custom-domain association and DNS while that project still exists, confirm its certificate is active, and smoke the same paths. Do not point production at the PPE project or copy PPE credentials into production. If the rollback window has ended, redeploy a known-good `main` commit to `kill-api-keys-vza-net-prod` in the production account instead.

## Workflows

- `.github/workflows/ci.yml` checks linting and the deployment artifact.
- `.github/workflows/deploy-production.yml` deploys `main` to production.
- `.github/workflows/deploy-ppe.yml` deploys same-repository PR previews to PPE.
- `.github/workflows/cleanup-ppe.yml` removes the matching PPE preview deployments when a PR closes.
