# Sigma shared-first rewrite — Maintenance / Evolution Plan (step 2)

| | |
|---|---|
| Status | Implemented — source-only (S1–S3, 2026-10-01) |
| Owner verification pending | yes |
| Date | 2026-10-01 |
| Requested as | "ابدأ الخطوة التانية" — step 2 of `SIGMA_DOCUMENTATION_SYSTEM_AUDIT.md` A4.3 / A4.5 addendum |
| Packet | `PLAN-00-maintenance-evolution.md` (drift check 8×OK, 2026-10-01) |
| Guides | UI 1–8, 12–14, 16, 17, 19–25, 30 · Backend 1, 4, 7, 16, 17, 18 · Master 5 |
| Method | Read-only source inspection of `shared/`, `src/styles.scss` and the feature copies. No build, test, browser or commit |
| Findings covered | A4-21…30, A4-44, 48, 49, 50, 54, 55, 57, 58, 59, 62, 63, 65, 66, 67, 68, 69, 70, 71 · decisions D4-6, D4-7 |
| Not covered | Step 3 (master-detail toolkit): A4-11…20, 41, 42, 60, 61, 64 (`DocumentUploadTracker`). Deferred: A4-46 (backend base hooks), A4-56 (flip `[contentPadded]` — needs backlog 36 first) |

## 1. Outcome and non-goals

**Outcome.**
- Every repeated UI piece has one shared owner.
- Every block of the books states that owner first.
- The old "feature-owned" guidance becomes a short legacy note.
- Reviewing a screen then means adopting shared pieces, not writing styling.

**Non-goals.**
- Migrating existing screens. That happens per screen review.
- Changing any business rule, API or backend code.
- Flipping defaults that would change existing screens.

## 2. Existing-State Inventory (what source already has)

| Concern | Current shared owner | Current state | Evidence |
|---|---|---|---|
| Semantic colours | `src/styles.scss` `:root` and `[data-bs-theme='dark']` | **Already global**: `--sigma-text/-muted/-border/-border-strong/-surface/-surface-soft/-canvas`, `--sigma-debit-*/-credit-*/-balance-value`. The book (UI 24/25) still tells features to declare their own palettes; 108 feature stylesheets do | `styles.scss` 19–63 |
| List filters | `form[appFilterPanel]` | Used by Job only | grep |
| Report filters and totals | global `sigma-report-filter-*`, `sigma-report-summary-bar`, `sigma-report-total--debit/--credit/--balance/--net` | Used by Trial Balance, Balance Sheet, Labour Activities Report. UI 20 points to Opening Balances instead | `styles.scss` 2970–3230 |
| List shell | `sigma-route-host/-list-page/-list-panel/-list-header/-list-table/-secondary-button` | Book blocks 1, 3 and 6 still describe feature-owned panels | `styles.scss` 3982–4060 |
| Danger button | — | none shared; 17 templates use `btn-danger` variants | grep |
| Date parsing | `date-utils.ts` has `toApiDate`/`toApiDateTime`/`formatDisplayDate`/`parseFlexibleDate` | `parseDateValue`/`parseRangeString` exist only as private copies (Work Order ×2, Labour Activities Report) | grep |
| Enum options | `EnumToArrayPipe` (67 files) | Typing bug (`value: string`); a second hand-written recipe in 5 files; no helper | grep |
| Paging params / export loop | `BaseService.get()` (filters only) | Each feature builds `HttpParams` itself; 38 files carry an all-pages loop (`getAllList`) | grep |
| Editable table | `app-editable-collection-table` (`fillHeight`, `maxHeight`, …) | No sticky header input; the financial variant styles its internals | component inputs |
| Field error | — | 25 files hand-write `validationMessageKey`/error markup | grep |
| Loading/empty states | — | 7 templates hand-write "Please wait…" states | grep |
| Default date range | Skill rule 2026-09-24 "الشهر الحالي", UI 17 | Full current month. **UI 20 contradicts it** (month-to-date) | skill §3.3, UI 17/20 |

## 3. Decisions

| # | Decision | Evidence / reason |
|---|---|---|
| D4-6 | **Global semantic tokens** are the only palette. A feature declares a token only for a real domain colour | The tokens already exist in both themes. The rule only has to stop teaching feature palettes |
| D4-7 | **Full current month** (1st to last day) for list and report ranges | Existing owner rule (skill 2026-09-24, UI 17). UI 20's month-to-date is corrected; no new decision needed |
| Filters | Lists use `form[appFilterPanel]`. Reports use the global `sigma-report-filter-*` strip. Both are shared, and no feature filter CSS is allowed | Different actions (report Search/Refresh/Reset/Export vs list Search/Reset/More). Merging them is a later slice once a second list adopts the panel |
| Financial summary | The global `sigma-report-summary-bar` / `sigma-report-total--*` classes serve reports **and** financial editors. No new component | They already implement the Debit/Credit/Balance language with tokens |
| New shared pieces | `app-field-error`, `app-state-message`, `enumOptions()`, `parseDateValue()`/`parseDateRange()`/`currentMonthRange()`, `BaseService.listParams()`/`fetchAllPages()`, `sigma-danger-button`, `sigma-print-flow`, editable-table `stickyHeader`, filter-panel check/span field | Additive: no existing consumer changes |
| Book structure | Block numbers stay stable. The money/tax rules move to a new section at the **end** of block 19 (titled *Money and tax in forms*), not a new block | Renumbering would break every packet and cross-reference |

## 4. Slices

| Slice | Outcome | Files | Depends on |
|---|---|---|---|
| **S1 Shared code (additive)** | The shared pieces in §3, each with its own file (and translations en/ar where it renders text) | `shared/utils/date-utils.ts`, new `shared/utils/enum-options.ts`, `shared/service/base-service.service.ts`, new `shared/components/field-error/*`, new `shared/components/state-message/*`, `editable-collection-table` (input only), `filter-panel` SCSS (check/span), `src/styles.scss` (`sigma-danger-button`, `sigma-print-flow`), `en.ts`/`ar.ts` | — |
| **S2 Books, shared-first** | UI: 1 (panel spec → shell, container-fill reference Job), 2 (`listParams`/`fetchAllPages`), 3 (snippet), 4 (old compact strip removed; check/span fields), 6 (layers table, Fleet Alerts specifics out), 7 (`apiErrorMessage`), 8 (`fetchAllPages`), 12 (control flow), 13 (routed footer buttons), 14 (inputs only, `stickyHeader`, summary classes), 16 (one enum recipe), 17 (shared helpers, one range rule), 19 (`app-field-error`, *Money and tax in forms*), 20 (report filter/totals shared classes, `formatMoney`, full month), 21 (`sigma-print-flow`), 22 (`app-state-message`), 23 (translation check), 24/25 (global tokens, button roles), 26/27 (re-verified dates), 30 (backlog). Backend: 1 (stale tax paragraph), 4 (reference profile), 7 (`DataTableColumn`), 16 (snippet, singleton variant), 17 (Job proxy), 18/others (incident narratives → CHANGELOG), preamble dates | docs | S1 |
| **S3 Tools and records** | Read-only `Check-Translations.ps1` (en/ar parity) in the recipe system; CHANGELOG, versions, skill digest and revision rows, packets regenerated + `-Check`; Audit 4 status | docs, recipe-system | S2 |

## 5. Compatibility

- Every code change is additive. No existing template, service or style rule is removed or renamed, so existing screens render exactly as before.
- No backend change and no migration.
- Screens adopt the shared pieces during their own review, with a build (the same rule as block 2).

## 6. Verification

| Check | Who |
|---|---|
| Diff review: no existing consumer changed; new files follow the owning block | agent |
| `ng build` compiles the new shared files | owner |
| Job list and editor still look and behave the same (reference unchanged) | owner |
| New pieces are exercised when the first screen adopts them | owner, at that screen's review |

## 7. Implementation record (2026-10-01)

Owner instruction: "موافق".

### S1 — shared code (frontend, additive)

| File | Piece |
|---|---|
| `shared/utils/date-utils.ts` | `parseDateValue`, `parseDateRange`, `currentMonthRange`; `parseFlexibleDate` marked legacy (can return `Z`) |
| `shared/utils/enum-options.ts` (new) | `enumOptions(Enum, prefix)`, `enumKey(...)`, `EnumOption` |
| `shared/utils/list-query.ts` (new) | `ListQuery<T>`, `toListParams`, `fetchAllPages` (the Job service shape, generalised) |
| `shared/components/field-error/*` (new) | `app-field-error`: shared `validationMessages.<error>` keys, overrides, `custom` fallback |
| `shared/components/state-message/*` (new) | `app-state-message`: loading, empty and error with shared default keys (`general.loading`, `general.noData`, `apiErrors.unexpectedMessage`) |
| `shared/pipes/money.pipe.ts` (new) | `money` pipe over `formatMoney` (added during S2: templates cannot call `formatMoney`) |
| `shared/components/editable-collection-table/*` | `stickyHeader` input; host class `app-editable-collection-table-host--fill` when `fillHeight` |
| `shared/components/filter-panel/filter-panel.component.scss` | `sigma-filter-field--check`, `--choice` (+ `.sigma-filter-choice-options`) |
| `src/styles.scss` | `.sigma-secondary-button.sigma-danger-button`; `@media print .sigma-print-flow`; **`.sigma-list-table` gets `margin: 0 8px`** (A4-23: the grid now shares both edges with the title and the filter panel — the Job list grid becomes 16px narrower, and it is the only consumer) |

No translation keys were added: every default uses an existing key in both languages.

### S2 — books

- **UI:**
  - Rewritten or updated: blocks 0, 1, 2, 3, 4 (rewritten, 661 → 149 lines), 6, 7, 8, 12, 13, 14, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27 and 30. The UI book is now 0.90.
  - Feature-specific notes moved out, verbatim: Fleet Alerts variants to `reviews/FLEET_ALERTS_FEATURE_REVIEW.md`.
- **Backend:**
  - Updated: blocks 0, 1, 3, 4, 7, 16, 17 and 19. The backend book is now 0.39.
  - The Daily Service Logs baseline moved to `reviews/DAILY_SERVICE_LOGS_FEATURE_REVIEW.md`, with the drift found (a stale `ApprovalStatus` proxy; the pending-closing section was not found in the service).
- **Master:** block 5 gains the *Shared pieces, not feature copies* gate. The Master is now 1.16.

### S3 — tools and records

- **`recipe-system/Check-Translations.ps1`:** a new read-only en/ar parity check.
  - Verified on `job` and `validationMessages`: 155 keys each, no gaps.
  - Whole-file counts (approximate, line parser): 1,568 keys missing from `ar`, 377 missing from `en`, 5 case-only differences.
- **Records:** skill §2.1–2.4, §3, §4.1 and §10 plus a revision row; `CHANGELOG.md`; packets regenerated, with `-Check` reporting 8×OK.

### Deviations and items not done

| Item | State |
|---|---|
| Helpers location | `toListParams`/`fetchAllPages` are standalone utils, not `BaseService` methods, so services that do not extend `BaseService` can use them |
| A4-54 incident narratives → CHANGELOG | **Not done** — an editorial pass across six blocks with no rule change; left for a docs-only pass |
| A4-36 catalog references | Step 4 (catalog), not in this plan |
| A4-56 `[contentPadded]` default | Deferred (needs backlog 36) |
| Skill §2.2–2.4 and §4.1 | They still described feature page/panel CSS and the Transitional `::ng-deep` fill block, although fill mode shipped on 2026-09-30. Brought in line in this change |

### Owner verification (pending)

1. **Compile:** `ng build`. The new files compile only once a screen imports them; `tsconfig.app.json` lists runtime entries explicitly, so the first consumer adds them if reported.
2. **Job list:** the grid is now aligned with the title and filter edges (8px). Nothing else changes.
3. **Screens with `[fillHeight]`:** check Rental Quotation, Agreement charges and Job editor groups. The host now joins the flex chain (the intended block 14 behaviour); they should look the same.

- **Suggested commit** (`SiGmaAngularFrontEnd`): `Shared-first step 2: date/enum/list-query utils, app-field-error, app-state-message, money pipe, editable-table stickyHeader, filter check/choice fields, danger button, print flow, list table edge alignment`

## 8. Settings shapes — owner decision (2026-10-01)

### Decision and correction

| | |
|---|---|
| Owner decision | "انا همسح المكرر وعايز اثبت النمط لو الشاشة سطر واحد يتعدل فقط او ينشئ لو مش موجود، لو الشاشة هتسجل اعداد اكثر من سطر … هيضيف اكثر من سطر او يعدليهم — ظبط service على كده" |
| Correction | §7 marked `SyncByKeyAsync` legacy and gave a reconcile-with-delete snippet, after searching only that one method. `ServiceHelper` is in fact the shared settings owner, used by `FieldsSettingsService`, `NotificationsSettingsModelService` and `EmailTemplateService` (about 22 settings entities). Block 16 is rewritten around it. The §7 snippet is withdrawn |

### Code (`SigmaBackend`)

| File | Change |
|---|---|
| `Services/HelperServices/ServiceHelper.cs` | See the list below |
| `Services/NotificationsSettingsModelService.cs` | Own `GroupBy` removed (the helper does it); returns the helper `Result` before saving |
| `Services/EmailTemplateService.cs` | **Bug fixed:** `UpsertAsync` updated the tenant's *first* template whatever its type, so saving one `TemplateType` overwrote another. It now uses `UpsertByKeyAsync` keyed by `TemplateType`, with a null type rejected |
| `GeneralMessage.resx`, `.ar-SA.resx` | `SettingsInvalidKey` |

`ServiceHelper.cs` has two shapes:
- **Single row:**
  - `GetSingleAsync` (optional predicate), `GetSingleAsListAsync` and `UpsertAsync(list)` (legacy list contract), plus the new `UpsertSingleAsync`.
  - Every read and write targets the **latest** row (`Id` desc).
- **Several rows:**
  - `UpsertByKeyAsync` now returns `Result` and takes an optional `scope` (partition).
  - The last row wins on a repeated key, and an undefined enum key fails before any change.
  - Existing duplicate rows resolve to the latest; the old `ToDictionary` crashed on them.
- **Removed:** `SyncByKeyAsync` — delete by omission over the whole table, no callers.
- **DI:** the constructor takes `IStringLocalizer<GeneralMessage>`; it is registered already, so no change is needed.

### Docs

- **Backend 0.40:**
  - Block 16 rewritten: two shapes, no delete by omission, legacy list.
  - Block 8 settings column.
  - Backlog 22.
- **Skill:** §8.1 (4) plus a revision row.
- **Records:** `CHANGELOG.md`; packets regenerated, with `-Check` reporting 8×OK.

### Owner actions and verification

1. **Remove duplicate settings rows** (owner decision). Then add the unique index per entity when its screen is reviewed, with the owner running the migration.
2. **`dotnet build`.** No compile consumer of `SyncByKeyAsync` or of the old `UpsertByKeyAsync` return type exists. The two callers are updated.
3. **Runtime checks:**
   - Settings › Fields: load and save.
   - Settings › Notifications: load and save; a bad `Action` value is rejected.
   - Email templates: save two different types and reload both — each keeps its own body.

- **Suggested commit** (`SigmaBackend`): `Settings: ServiceHelper single-row upsert and keyed add-or-update (latest row, scope, enum-key validation), remove SyncByKeyAsync, fix EmailTemplate overwriting another template type`

### Correction — settings screens verified (2026-10-01)

§8 and backend block 16 said that "nine settings screens POST a new row on every save". Each screen was then traced (Angular screen → controller → service):

| State | Screens (controller) |
|---|---|
| Read the last row; **POST adds a new row on every save** (base `AddAsync`) | Workshop (`WorkshopSetting`), Broker (`BrokerSetting`), DDA (`DirectDebitAuthorizationSetting`), HRM (`HrmSetting`), Limousine (`LimousineSettings`), Payment Gateway (`PaymentGateway`) |
| Read the last row; own Add/Update override updating the first row | Cost Centers (`SettingsCostCentersModel`) |
| Read the last row; PUT only (first save without a row not verified) | API Key (`ApiKeySetting`) |
| Own `GetMySetting` + POST/PUT | Common, Document Number |
| On `IServiceHelper` | Fields, Notifications, Email Templates |

**Consequence.** The six "new row per save" screens must move to the single-row shape before or together with the owner's duplicate cleanup; otherwise the duplicates come back on the next save.

**Recorded in:** backend block 16 (legacy table) and backlog 22 (wording corrected). The packets must be regenerated.
