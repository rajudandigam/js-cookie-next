# Template guide — renaming for a new library

Use this checklist when turning this template into your own npm library. Do every step; order matters where noted.

**Note:** This repo (js-cookie-next) was created from the template. It is a **vanilla** browser utility (no React layer) and has **no demo app**. The checklist below reflects the full template; adapt by skipping React and demo steps.

## 1. Package identity

- [ ] **package.json**
  - `name`: change `oss-npm-lib-template` → your package name (e.g. `my-cool-lib`).
  - `description`: set to your library’s description.
  - `repository.url`: replace `YOUR_GITHUB_ORG/your-repo` with your org/repo.
  - `bugs.url`: same repo, `/issues`.
  - `homepage`: same repo, `#readme`.

## 2. Repository URLs

- [ ] **README.md** — Replace any template repo links with your repo URL.
- [ ] **docs/** — In TEMPLATE-GUIDE, PROMPT-LIBRARY, playbooks, replace template repo references with your repo.

## 3. Exports and entry names

If your library has different entry points:

- [ ] **package.json** `exports` — Adjust keys (e.g. keep `.` only, or add `./core` if you have a separate core entry).
- [ ] **tsup.config.ts** — Match `entry` keys to export paths (e.g. `index` only, or `index` + `core`).
- [ ] If you use a demo app: **demo/vite.config.ts** — Update `resolve.alias` to match your `dist` filenames.

## 4. Source code renames

- [ ] **src/core/** — Rename files and types to your domain (e.g. `parse.ts`, `serialize.ts`, `types.ts`).
- [ ] **src/index.ts** — Re-export your public API.
- [ ] (Template only: **src/react/** and **src/core.ts**, **src/react.ts** — omit for vanilla libraries.)

## 5. Tests

- [ ] **src/** `__tests__/` — Add or rename unit tests for your API.
- [ ] If you use E2E: **playwright/tests/** — Point at your harness (e.g. minimal HTML page or demo).

## 6. Demo app (template only)

- [ ] Skip if building a vanilla lib without demo. Otherwise: **demo/** — Replace template usage with your library’s API.

## 7. GitHub workflows

- [ ] **.github/workflows/ci.yml** — Job names are generic; optionally add env or matrix. Remove or no-op Playwright if no E2E harness.
- [ ] **.github/workflows/publish.yml** — No renames required. Ensure npm package has **Trusted Publishing** configured (see RELEASE-PLAYBOOK.md).

## 8. Docs and Cursor

- [ ] **docs/DEV-ARCHITECTURE.md** — Rewrite for your library: goals, API contract, layout, release flow.
- [ ] **docs/PROMPT-LIBRARY.md** — Keep structure; replace placeholders with your function/API names.
- [ ] **docs/RELEASE-PLAYBOOK.md** — Update repo/project name if needed; OIDC steps stay the same.
- [ ] **.cursorrules** — Keep strict rules; point to your `docs/DEV-ARCHITECTURE.md` (or docs/ARCH.md) if path is unchanged.
- [ ] **.cursor/rules/architecture.mdc** — Update the one-line description and pointer to your project docs.

## 9. Optional cleanups

- [ ] Remove or repurpose `GPT-SUGGESTED_TEMPLATE.md` / `NPM-LIBRARY-TEMPLATE.md` if you don’t need them.
- [ ] Add a real **LICENSE** (this repo uses MIT) and keep copyright notice.
- [ ] Set `publishConfig.access` in package.json if you need restricted access.

After renaming, run: `npm run test:all` (typecheck, unit, build, size; plus Playwright if E2E harness exists) and fix any failures.
