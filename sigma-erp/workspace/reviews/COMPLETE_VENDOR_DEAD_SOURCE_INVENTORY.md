# Complete Vendor Retirement — Dead Source Inventory

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Scope | Angular source-only audit: obsolete pages, dead Metronic/KT source, assets, packages, and compile/test roots |
| Evidence | `SiGmaAngularFrontEnd/.angular/vendor-retirement/graph.json`, source/config/package inspection |
| Verification boundary | No build, test, lint, browser, database, or backend scan performed |

## Findings

The vendor graph reports 361 `_metronic` TypeScript nodes: 84 reachable from
`main.ts` and 277 dead. The graph is useful for the vendor tree only; it does
not prove that non-vendor files, templates, styles, assets, or package roots
are unused. The active 84 include the current shell, theme service, export
helper, and 70 domain enums. These must be moved or their consumers updated
before their old paths can be deleted.

### Safe deletion candidates after the stated prerequisite

| Candidate | Evidence and dependency edge | Decision |
|---|---|---|
| `src/app/pages/builder/` (`builder.component.ts`, `.html`, `builder.module.ts`) | No route in `src/app/pages/routing.ts` points to Builder; no other source imports `BuilderModule` or the builder files. Its only vendor edges are `builder.component.ts → ../../_metronic/layout` and `builder.module.ts → _metronic/shared/keenicon/keenicon.component`, both graph-marked `live: false`. | Delete after a final text search confirms no external route or test references. The folder is outside the vendor graph and must not be inferred safe from graph counts alone. |
| `src/assets/plugins/keenicons/{duotone,outline,solid}/demo.html` and each `demo-files/` directory | Runtime imports in `src/styles.scss` target only each `style.css`; no source/config references the demo HTML or demo JS/CSS. | Delete demos and demo support files; retain each `style.css`, `fonts/`, and the live icon font assets. |
| `src/assets/css/style.js` | No source/config reference found. | Delete after owner confirms this legacy generated script is not copied or loaded by an external host. |
| `src/assets/css/style.rtl.css` | Only commented references in `src/styles.scss`; active RTL generation is `src/assets/sass/style.rtl.scss` and `scripts/build-rtl.mjs`. | Delete after the generated RTL asset handoff is accepted; do not delete the Sass source or generated asset currently consumed by deployment. |
| `src/app/_metronic/kt/` (26 graph-dead TypeScript files) | All KT files are in `deadVendor`. Remaining source imports are confined to graph-dead legacy widgets/header/scripts-init and do not originate outside `_metronic`. | Delete only after graph-dead legacy consumers are removed and a final whole-source search finds no KT import. |
| Graph-dead demo layout/content trees under `src/app/_metronic/partials/` | 115 graph-dead TypeScript nodes: cards (9), chat-inner (3), dropdown-menus (3), widgets (84), and dead layout extras/drawers/splash files (15). | Delete the exact graph-dead component directories with their paired HTML/SCSS/spec files after checking non-TypeScript assets in each directory. Do not remove the live theme service or live shell files sharing parent directories. |
| Legacy layout demo/header/toolbar trees under `src/app/_metronic/layout/` | 39 graph-dead TypeScript nodes: old header/navbar/page-title/scripts-init (7), toolbar (12), topbar (2), config/layout services (8), dead specs and index files; current `layout.component.ts`, `layout.module.ts`, footer, sidebar menu, and utilities remain live. | Delete only the graph-dead files/directories after checking template/style sidecars and after shell imports are moved/reconciled. |

### Candidates that must be preserved or migrated first

| Candidate | Proof of dependency | Required action |
|---|---|---|
| `src/app/_metronic/shared/enums/` active set (70 files) | The graph marks 70 enum files live and many feature models/components import them directly. The graph also shows false/dead test or compatibility edges for some enums. | Root must move/update live consumers, then remove old paths only after runtime and compatibility compile roots are reconciled. |
| `src/app/_metronic/layout/core/utilities.ts` | 130 incoming source edges, including list/report screens importing `onExportToExcel`. | Move to the shared utility owner and update every consumer before deleting the old file. |
| `src/app/_metronic/partials/layout/theme-mode-switcher/theme-mode.service.ts` | Shell, error screens, and compatibility tests import the service; graph records both live runtime reachability and false compatibility edges. | Move to layout theme owner and update shell/error/test imports before deleting the old path. |
| `src/app/_metronic/layout/components/sidebar/sidebar-menu/{menu-catalog.service,sidebar-shortcuts.service}.ts` | `shell-header.component.spec.ts` imports both; graph marks these compatibility edges `live: false`, while the current shell uses the services through the live sidebar menu. | Preserve/move with the active shell and update tests; do not delete based on the false edge flag. |
| `src/app/_metronic/layout/{layout.module.ts,layout.component.ts}` and live sidebar/footer files | Root route in `src/app/app.routes.ts` lazy-loads `./_metronic/layout/layout.module`; current `LayoutComponent` imports `ShellHeaderComponent`, sidebar menu, footer, and navigation services. | Keep behavior while root agent moves shell ownership. |
| `src/assets/sass/vendor/bootstrap/`, `src/assets/sass/core/`, and active theme Sass | `src/styles.scss` uses `style.scss`, `plugins.scss`, and `style.angular.scss`; active Sass imports Bootstrap compatibility functions, variables, mixins, and utilities from `_init.scss` and multiple layout/component files. | Treat as migration work, not dead-source deletion. Remove only after replacing every import and preserving theme/RTL/print contracts. |
| `@popperjs/core` | The only TypeScript import is the graph-dead KT `MenuComponent`; Bootstrap Sass contains only CSS selectors, not a package import. | Candidate for package removal after KT deletion and an independent whole-repository search. |
| `bootstrap-icons` | `style.angular.scss` imports `bootstrap-icons/font/bootstrap-icons.css`; active templates/styles use `bi-*` classes (including print/action selectors). | Preserve until icon consumers are migrated; package removal is currently unsafe. |

## Compiler and test roots

`tsconfig.app.json` explicitly lists the current runtime files and has a narrow
`include` for FiscalYears. It does not include the builder folder. The standard
`tsconfig.spec.json` includes `src/**/*.spec.ts`; no builder spec exists. The
compatibility root `tsconfig.compat.spec.json` explicitly includes five shared
compatibility specs and does not include builder or the dead demo specs.

`src/app/app-bootstrap-compatibility.spec.ts` still imports
`./_metronic/layout/layout.module`; `src/app/layout/shell-header.component.spec.ts`
still imports the old theme and sidebar service paths. These are intentional
compatibility edges for the root migration and must be updated together with
the root agent's moves. The graph marks them `live: false` because they are
test-only; that flag is not proof that the target can be deleted.

## Package and asset conclusion

`package.json` and `package-lock.json` contain `@popperjs/core` and
`bootstrap-icons`, but no `@ng-bootstrap/ng-bootstrap` or Bootstrap JavaScript
package. Popper is currently explained by dead KT `MenuComponent`; it is a
removal candidate after that tree is deleted. Bootstrap Icons remains active
through `style.angular.scss` and `bi-*` selectors. The repository's local
Bootstrap Sass and `data-bs-theme` contract are active compatibility sources,
so they cannot be classified as dead from package evidence.

## Audit limits and handoff

This inventory is source-only and did not edit application source, package
files, generated packets, or the vendor graph. The root agent should perform a
final `rg` search after its import moves, review sidecar HTML/SCSS files for
each graph-dead directory, then delete only the candidates above. Runtime,
visual, RTL, print, build, and test acceptance remain owner-pending.

## Final retirement audit — 2026-10-23

The post-integration source/configuration audit found no operational imports of
`_metronic`, KT, `@popperjs/core`, `ng-bootstrap`, ApexCharts, SweetAlert2, or
the retired Bootstrap Sass tree. The package root and lockfile retain only
`bootstrap-icons` among the searched vendor names. The old directories still
exist as empty folders in the working tree (`src/app/_metronic`,
`src/app/pages/builder`, `src/assets/sass/vendor/bootstrap`, and the former
Sass `core/components/layout` folders); they contain zero files and are
cleanup residue rather than source dependencies.

Concrete leftovers requiring owner decision:

| Leftover | Evidence | Classification |
|---|---|---|
| `src/assets/css/style.js` | A 2,238-byte webpack development artifact remains; no source/config reference found. | Safe cleanup candidate; stale generated artifact. |
| `src/app/layout/layout.component.spec.ts:93` and `src/app/modules/i18n/translation.service.ts:291` reference `assets/css/style.rtl.css`. | The file exists and is generated from `src/assets/sass/style.rtl.scss` by `scripts/build-rtl.mjs`; the current file contains Sigma tokens and no Bootstrap selectors. | Valid current RTL asset reference, not a retired dependency. Keep and validate with the authorized RTL check. |
| `environment.ts` and `environment.prod.ts` set `appThemeName: 'Metronic'`. | Search found no consumer in runtime source. | Historical configuration value; no import edge. Rename only if the owner explicitly wants persisted/configured theme identity changed. |
| `user.model.ts` fields `newsAboutMetronicOnPartnerProductsAndOtherServices` and `tipsOnMetronicBusinessProducts`. | These are server/user contract property names; no presentation import or package edge. | Historical API field names; preserve. |
| Footer SCSS comment mentioning Metronic. | Comment only; no selector or import. | Historical comment; harmless. |

The root chain remains intact: `main.ts` bootstraps `AppComponent`,
`app.config.ts` provides one hash router and one intercepted HTTP client, and
`app.routes.ts` lazy-loads `./layout/layout.module` behind `AuthGuard`.
`layout.module.ts` continues to consume `pages/routing.ts` for feature routes.

The explicit application root in `tsconfig.app.json` lists runtime files and
uses a narrow FiscalYears include while excluding its specs. The standard test
root remains `src/**/*.spec.ts`; `tsconfig.compat.spec.json` explicitly lists
the five compatibility specs and does not reintroduce the removed builder or
KT roots. No build or test was run for this audit.

The remaining `Metronic` strings, negative KT test selectors, historical user
field names, theme storage/data attributes, and generated RTL stylesheet name
were reviewed as non-import evidence. No concrete broken moved target was
found in source/configuration searches. Empty retired directories and the
unreferenced `style.js` are the only cleanup residue identified.
