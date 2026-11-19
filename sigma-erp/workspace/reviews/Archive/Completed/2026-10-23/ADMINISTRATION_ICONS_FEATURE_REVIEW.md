| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |

# Administration icons

Owner request: “ظبط كل ايقونات src/app/modules/Administration”. Frozen decisions are recorded in ADMINISTRATION_ICONS_MAINTENANCE_EVOLUTION_PLAN.md. Master4/5/7, UI24/25 and the required sigma-screen-refactor digest govern the change. UI17/UI30 govern removal of already hidden calendar triggers. No screenshot was supplied; source evidence only.

## Result and decisions

- Existing Add, Save, Edit/Update, Delete, Cancel, Search and Back icons use Bootstrap Icons and the canonical UI24 symbols. Missing icons were added to existing ButtonModel definitions and native Add/Remove/Search/Reset/Retry controls. Size/color utilities, ids, labels, handlers, loading/disabled rules and business flows were retained.
- Save uses check2-circle, Add plus-lg, Edit pencil-square, Delete trash3, Cancel x-lg and Search search. Generate Key uses key rather than the former Save icon. ErrorLogs replaces all three explicit PrimeIcons references; Back has a decorative child glyph and a directional-only RTL rule.
- Decorative i elements are aria-hidden. Shared Buttons owns this for every existing optional icon consumer. Profile removal names the actual letterhead/logo with EN/AR keys; AgreementDocument remove receives the existing translated Delete/name and keyboard Enter/Space through the same handler.
- Fines, eDarb and eSalik now import/register ButtonModule, which was missing for their existing pButton footer controls. Directive-owned spans are aria-hidden in the installed PrimeNG source. Fines retains its translated child text and removes duplicate literal labels; eDarb/eSalik bind existing translated Save/Cancel keys. Existing parent templates/handlers are preserved.
- Existing canonical feature/section/status icons and the shared CSV cloud-upload identity remain valid. No new icon library, font import, shared semantic catalog, palette, button size or page layout was introduced.

## Changed files

41 attributable root files and 33 Settings files (74 total); the exact list follows. Initial icon-only edits in Administration/CostCenters/components/details/details.component.ts, Administration/PaymentMethods/components/details/details.component.ts and Administration/PaymentMethods/components/list/list.component.ts were subsequently replaced by concurrent external screen work; these three files are excluded from this task's final attributable list. Root stopped further writes there instead of replaying its old snapshot. Their current editors use the existing canonical shared footer owner. Other pre-existing Administration/import/sidebar/refactor changes were preserved.

### Non-Settings Administration (37 files)

- auditTrail/list/list.component.html
- Branches/components/details/details.component.html; Branches/components/list/list.component.html
- changeVoucherNo/components/list/list.component.ts
- ChecklistItem/components/details/details.component.ts
- ContactGroups/components/details/details.component.html; ContactGroups/components/list/list.component.html
- correctVehicleStatus/components/list/list.component.ts
- Countries/components/details/details.component.html; Countries/components/list/list.component.html
- Currencies/components/details/details.component.html; Currencies/components/list/list.component.html
- CustomerProjects/CustomerProject/components/details/details.component.ts
- CustomerRequests/components/details/details.component.html; CustomerRequests/components/list/list.component.html; CustomerRequests/components/list/list.component.ts
- CustomLookups/components/details/details.component.ts
- emailTemplates/components/list/list.component.ts
- ErrorLogs/details/details.component.html; ErrorLogs/details/details.component.scss; ErrorLogs/list/list.component.html
- Industries/components/details/details.component.html; Industries/components/list/list.component.html
- Languages/components/details/details.component.ts
- messageLogs/list/list.component.html
- ReplacementReasons/components/details/details.component.ts; ReplacementReasons/components/list/list.component.ts
- Roles/components/details/details.component.ts; Roles/components/list/list.component.ts
- SaleOrigins/SaleOrigin/components/details/details.component.ts
- SponserShips/components/details/details.component.html; SponserShips/components/list/list.component.html
- Users/components/details/details.component.ts; Users/components/list/list.component.ts
- VehicleNotReadyReasons/components/details/details.component.ts; VehicleNotReadyReasons/components/list/list.component.ts
- VoucherReasons/components/details/details.component.ts

### Settings/components (33 files)

- agreement-document/agreement-document.component.html and .ts
- api-key/api-key.component.html
- approvals/approvals.component.html and .ts
- broker/broker.component.ts
- charges/charges.component.html
- common/common.component.html and .ts
- cost-centers/cost-centers.component.ts
- dda/dda.component.ts
- document-number/document-number.component.ts
- e-darb/e-darb.component.html and .ts
- e-salik/e-salik.component.html and .ts
- equipment/equipment.component.ts
- fields/fields.component.ts
- fines/fines.component.html and .ts
- forms-and-fields/forms-and-fields.component.ts
- holidays-setting/holidays-setting.component.html and .ts
- hrm/hrm.component.ts
- limousine/limousine.component.ts
- nation-id-format/nation-idformat.component.html and .ts
- notifications/notifications.component.ts
- payment-gateway-setting/payment-gateway-setting.component.ts
- profile/profile.component.html and .ts
- user-management/user-management.component.ts
- workshop/workshop.component.ts

### Shared and guide (4 files)

- src/app/modules/shared/components/buttons/buttons.component.html
- src/app/modules/UserGuide/content/administration-guide.ts
- src/app/modules/i18n/vocabs/en.ts
- src/app/modules/i18n/vocabs/ar.ts

## Final source conformance

| Concern | Source evidence | Result |
|---|---|---|
| Glyphs and semantics | UI24 standard map; Branches ActionList; all Administration literal icon references checked against installed bootstrap-icons font CSS | Matched; no missing glyph or explicit legacy library/action spelling. |
| Button configuration | ButtonModel.icon remains optional; existing TS objects receive only icon property changes outside the three explicit ButtonModule imports | Matched; ids/text/type/class/disabled/handlers retained. |
| Decorative glyphs | PrimaryActionButton reference aria-hidden; all Administration i tags and Buttons template checked | Matched. |
| PrimeNG icon producer | Installed primeng-button.mjs ButtonDirective.createIcon sets aria-hidden; Fines/eDarb/eSalik register actual owner | Matched at source; runtime rendering pending. |
| Accessible removal | Profile contextual keys exist EN/AR; AgreementDocument translated Delete/name plus original removeDocument handler | Matched; keyboard behavior acceptance pending. |
| RTL/theme | PrimaryActionButton owns arrow flips; ErrorLogs existing component rotates only Back; existing shared theme/button mixins supply inverse glyph foreground | Matched at source; visual acceptance pending. |
| CSV/title semantics | Existing CsvImportWorkspace cloud-upload; canonical feature/section icons retained | Matched; no upload contract change. |
| Guide | Existing ADMINISTRATION_GUIDE adds bilingual explanation of symbols and image-removal tooltips | Matched; /UserGuide/administration already registered in guide reader and Administration sidebar. |

## Verification and reconciliation

- Module-scoped source parser inspection: 302 TypeScript files and 87 HTML templates, including the related shared template/guide/vocabs; zero TypeScript syntax or Angular template-parser diagnostics. This is not Angular type-checking/application compilation.
- Installed Bootstrap Icons inventory covers every literal referenced glyph. All recognized ButtonModel actions in the current source have icons; no remaining explicit pi pi-/FA icon fork or old save/trash/pencil/plus action glyph in Administration. All literal/dynamic i glyphs are decorated aria-hidden.
- Task-before snapshots and source deltas distinguish current edits from already dirty files. For root-owned TS files, stripping icon properties showed unchanged other source until detected concurrent CostCenters/PaymentMethods replacements; these portions were preserved and not re-edited. Complete Settings git diff and root task deltas reviewed. The attributable icon-file whitespace check passes. A broader later check flags new blank lines at EOF in the two concurrently replaced PaymentMethods TS files; these are preserved peer edits, not task icon changes. Existing broader git diffs are preserved prior/peer work, not attributed to this icons task.
- Recipe -Check green before packet use and final handoff: PLAN-00 and PHASE-00 through PHASE-06. No canonical rule changed, so no generator refresh/book/skill promotion required.
- Phases: proportional PLAN-00/discovery/freeze; presentation portions of read/detail/integration; final reconciliation. Backend/domain-action implementation skipped because handlers, API and business contracts are untouched.
- Backend, DTO, AutoMapper, calculations, authorization, persistence and schema: unchanged; no migration needed. No new Missing/Conflicting business decision.
- Existing no-op/console-only legacy list actions were not turned into working workflows by this icon request. Guide says “where available”; icons do not certify a missing business action.
- No builds, tests, lint, browser/runtime verification, database commands, migrations, commits, pushes or deployment were run.

## Owner verification and handoff

Run the frontend build, then inspect Administration list/editor/settings/log/import screens at desktop/mobile widths in EN/AR and light/dark themes. Check Save/Add/Edit/Delete/Search/Cancel symbols, translated profile tooltips/accessibility, AgreementDocument Enter/Space removal and Fines/eDarb/eSalik footer label/icon rendering. Verify ErrorLogs Back direction in RTL and that existing action behavior/disabled states remain as before. Visual/runtime/type-check acceptance remains pending.

Suggested frontend commit message: `fix(administration): unify action icons and accessible icon controls` (suggestion only).

Agent utilization: one bounded terra_worker (inherited model; mapped terra unavailable) owned Settings only after frozen contract. Root owned other Administration/shared/guide/translations and full reconciliation. Independent ownership reduced implementation time without overlapping source writes; all source findings were integrated and reviewed by root.

Worker handoff: 33 files (22 TS, 11 templates), source/glyph/whitespace checks green and no blocked portion. Settings SHA-256/mtime baseline and phase2/phase3 pre-write snapshots: reviews/.snapshots/administration-icons-settings-20261014/manifest.json. Root task-before snapshot: %TEMP%/sigma-admin-icons-root-before.json. These local evidence records preserve unrelated source while showing the narrow icon delta.
