# Sigma books completion — Maintenance / Evolution Plan

| | |
|---|---|
| Status | Implemented — source-only (R1–R8 complete 2026-10-01; owner: "ابدأ فى تنفيذ الخطة كاملة"; D4-4 decided by the owner; D4-5, D5-1…D5-4 accepted as recommended) |
| Owner verification pending | yes |
| Date | 2026-10-01 |
| Requested as | "اعمل خطة كاملة بكل المتبقى — انا عايز بعدها يكون تم مراجعة كل خطوات الباك اند وكل خطوات الفرونت اند" |
| Builds on | Audit 4 (A4.1–A4.8), and the foundation, shared-first and master-detail plans |
| Method | Read-only inspection of every block's current state (blocks not read this cycle were read for this plan: UI 9–11, Master 1–8 headings, BE 7/13/15, `ui/screens`) |

## 1. Definition of done

The review is complete when **every block** of the three books, the screen catalog and the skill has a row in the *Review ledger* (§2) marked **Reviewed** with a date. A block is **Reviewed** when all of these hold:

1. Its rules were checked against current source. Every named file, class, method, class name and token exists.
2. It states its **shared owner first**. Any feature-owned or legacy guidance is a short, dated legacy note.
3. It contradicts no other block, the Master, AGENTS or an owner decision.
4. Its references are current. Job is the list and routed-editor reference where applicable.
5. It carries no incident narrative. The rule and a one-line reason stay; the story moves to `CHANGELOG.md`.
6. Its backlog items are current.
7. The skill section that digests it matches it.

Code debt that the books record (backlog items fixed per screen) does **not** block "Reviewed". It is tracked for the screen-by-screen review.

## 2. Review ledger — current state (2026-10-01)

**Legend:** ✅ reviewed and updated this cycle · ◐ partly (remaining work named) · ⬜ open (not yet revised).

**Closed 2026-10-01 (R8):** every row below is **Reviewed**. The *Remaining* column is kept as the record of what each slice fixed; the item named there was done in the slice shown in §7, or is code debt tracked in a backlog.

### Backend book

| Block | State | Remaining |
|---|---|---|
| 00 Preamble | ✅ Reviewed 2026-10-01 | Refresh the dates at the end |
| 01 Entity | ✅ Reviewed 2026-10-01 | — |
| 02 EF configuration | ✅ Reviewed 2026-10-01 | — |
| 03 ViewModels | ✅ Reviewed 2026-10-01 | Backlog 4 (Name max length) and 6 (`ListBaseVm` plumbing) are code debt |
| 04 AutoMapper | ✅ Reviewed 2026-10-01 | Backlog 21 (`ReverseMap` ×213) is code debt |
| 05 Interface and service | ✅ Reviewed 2026-10-01 | No table of the base helpers (`BusinessFailure`, `LocalizeMessage`, `NormalizePaging`, `AllExistAsync`, `RemoveWithChildrenAsync`, the `ServiceHelper` link); `CancellationToken` depends on D5-2 |
| 06 Controller | ✅ Reviewed 2026-10-01 | Verify against `SiGmaControllerBase`; record the cancellation gap (D5-2) |
| 07 ListVM scope | ✅ Reviewed 2026-10-01 | Worked example re-verified (`BranchListVM` still has `CCEmails`/`Address`) |
| 08 Validation | ✅ Reviewed 2026-10-01 | — |
| 09 Filters | ✅ Reviewed 2026-10-01 | — |
| 10 Select | ✅ Reviewed 2026-10-01 | — |
| 11 Document numbers | ✅ Reviewed 2026-10-01 | Point to `reviews/Deferred/DOCUMENT_NUMBERING_…` instead of teaching the generator (A4-06) |
| 12 Activate | ✅ Reviewed 2026-10-01 | — |
| 13 **Pattern 1 — normal entity** | ✅ Reviewed 2026-10-01 | The snippet uses 5 literal `Fail("…")`, no `BusinessFailure`, `NormalizePaging` or `AllExistAsync`; every entity re-writes `GetManyAsync` (A4-46 → D5-1); hand-written delete reference checks; reference `BranchService` not re-verified |
| 14 Pattern 2 — master-detail | ✅ Reviewed 2026-10-01 | — |
| 15 **Pattern 3 — financial master-detail** | ✅ Reviewed 2026-10-01 | Refresh on the new helpers; VAT rounding rule (D4-4, A4-31/32); a posted document cannot be deleted (void instead) — state it next to `RemoveWithChildrenAsync`; reference `InvoiceService` not re-verified |
| 16 Pattern 4 — settings | ✅ Reviewed 2026-10-01 | The six screens are code debt (§4 R1) |
| 17 Pattern 5 — reports | ✅ Reviewed 2026-10-01 | — |
| 18 Edge cases | ✅ Reviewed 2026-10-01 | Incident narratives (A4-54) |
| 19 Backlog | living — re-ranked 2026-10-01 | Re-rank at the end |

### UI book

| Block | State | Remaining |
|---|---|---|
| 00 Preamble | ✅ Reviewed 2026-10-01 | Refresh the dates at the end |
| 01 Wiring, shells | ✅ Reviewed 2026-10-01 | — |
| 02 Service wrappers | ✅ Reviewed 2026-10-01 | Still Transitional: `Results<T> extends Result<any>`, `Result.id: any` (D5-4) |
| 03 Header | ✅ Reviewed 2026-10-01 | — |
| 04 Filters | ✅ Reviewed 2026-10-01 | — |
| 05 Columns | ✅ Reviewed 2026-10-01 | Re-check the reference names at the end |
| 06 Grid and footer | ✅ Reviewed 2026-10-01 | — |
| 07 Action cycle | ✅ Reviewed 2026-10-01 | Move the quotation register (Master 4, A4-40) here |
| 08 Export | ✅ Reviewed 2026-10-01 | — |
| 09 **Confirm: delete** | ✅ Reviewed 2026-10-01 | Reference is the Company list. A deleted row on the last page must go back a page — not stated. Failure is shown by the interceptor (block 22) — not stated. The delete of a child row points to block 14 (`EditableRows`) — not stated |
| 10 **Confirm: discard** | ✅ Reviewed 2026-10-01 | Reference is Company/Vehicle (constructor `destroy$`). `leave()` hard-codes the route and loses the list filters; the Job editor returns with the list's query params — the rule is missing. Link to the routed editor shell |
| 11 **Small modal on top** | ✅ Reviewed 2026-10-01 | The snippet removes a child row without marking the parent dirty and without the untouched-row rule; use `EditableRows` (block 14) |
| 12 Step form | ✅ Reviewed 2026-10-01 | — |
| 13 Modal with tabs | ✅ Reviewed 2026-10-01 | — |
| 14 Editable collection | ✅ Reviewed 2026-10-01 | — |
| 15 View mode | ✅ Reviewed 2026-10-01 | — |
| 16 Dropdowns | ✅ Reviewed 2026-10-01 | — |
| 17 Dates | ✅ Reviewed 2026-10-01 | — |
| 18 Documents | ✅ Reviewed 2026-10-01 | — |
| 19 Validation | ✅ Reviewed 2026-10-01 | — |
| 20 Report page | ✅ Reviewed 2026-10-01 | — |
| 21 Report print | ✅ Reviewed 2026-10-01 | — |
| 22 Loading/errors | ✅ Reviewed 2026-10-01 | — |
| 23 Translations | ✅ Reviewed 2026-10-01 | — |
| 24 Colors/buttons | ✅ Reviewed 2026-10-01 | — |
| 25 RTL/dark | ✅ Reviewed 2026-10-01 | — |
| 26 Permissions | ✅ Reviewed 2026-10-01 | — |
| 27 Focus | ✅ Reviewed 2026-10-01 | Re-check the Staff salary-revision modal; add the new-row focus of `EditableRows` |
| 28 Cancellation | ✅ Reviewed 2026-10-01 | Verify the `switchMap` reference against the Job list (the reference is still Company) |
| 29 Verification | ✅ Reviewed 2026-10-01 | — |
| 30 Backlog | living — re-ranked 2026-10-01 | Re-rank at the end |
| `ui/screens` 00–07 | ✅ Reviewed 2026-10-01 | Step 4 (A4-34…37): list reference is `Fleet/VehicleService`; routed editor is `RentalQuotation`; financial editor is Opening Balances; there is no *financial document* type and no *action dialog* type |

### Master Guide

| Block | State | Remaining |
|---|---|---|
| 00 Preamble | ✅ Reviewed 2026-10-01 | — |
| 01 Governance | ✅ Reviewed 2026-10-01 | Proportional process (D4-5); a "whole-application review order" (A4-37) |
| 02 Screenshots | ✅ Reviewed 2026-10-01 | Move the Speed Auto Systems section out of the governance book (A4-39) |
| 03 Phases | ✅ Reviewed 2026-10-01 | Re-check the phase ownership against the shared-first world (a list screen has no feature SCSS; editors use the shell) |
| 04 Decisions/artifacts | ✅ Reviewed 2026-10-01 | Move the quotation register to UI 7 and BE 14 (A4-40); decision rows for D4-2/D4-3 |
| 05 Quality gates | ✅ Reviewed 2026-10-01 | — |
| 06 Human/AI protocol | ✅ Reviewed 2026-10-01 | Re-check against the command vocabulary and delegation rules |
| 07 Reconciliation/report | ✅ Reviewed 2026-10-01 | Add the *Authorization candidates* and shared-piece gates to the final comparisons |
| 08 Packet governance | ✅ Reviewed 2026-10-01 | Add `Check-Translations.ps1` next to `Generate-SigmaRecipes.ps1` |

### Skill

| Part | State | Remaining |
|---|---|---|
| §1–4, §10, revision table | ✅ Reviewed 2026-10-01 | — |
| §5–9 (templates, loading, dialogs, backend patterns 1–3, API rules, financial preview) | ✅ Reviewed 2026-10-01 | Re-digest against the current blocks; every rule must cite its block |

## 3. Decisions needed

| # | Decision | Options | Recommendation |
|---|---|---|---|
| **D4-4** | VAT rounding | Per line / per document / per document type | **Decided 2026-10-01 by the owner: per tax rate on the document, rounded once.** The reviewer's first recommendation (per line, "because most documents already do it") was withdrawn; the owner rule *Business correctness first* (Master 1) now governs every recommendation. Shared `VatPolicy.CalculateDocumentTax`/`AllocateDocumentTax` and frontend `documentTax` added; documents move in their review (backlog 24) |
| **D4-5** | Proportional process | Same artifacts always / tiers | **Three tiers.** S (one element: fix plus a short report), M (one screen: contract freeze plus reconciliation section), L (feature or cross-cutting: the full artifact set) |
| **D5-1** | Base list hooks (A4-46) | Keep per-entity `GetManyAsync` / add `ApplyFilters` + `DefaultOrder` hooks to the base | **Add the hooks** (additive; Pattern 1 then needs no `GetManyAsync` override for filters) |
| **D5-2** | `CancellationToken` in every `IService` method (A4-04) | Now / defer | **Defer** (every override signature changes; low user value). The books state the gap |
| **D5-3** | `[contentPadded]` default (A4-56) | Flip now / after backlog 36 | **After backlog 36** (existing editors would get double padding) |
| **D5-4** | Typing `Results<T>` / `Result.id` (backlog 22) | Now with an owner build in the loop / defer | **Now, with your build** — one small change; you run `ng build` and send me the errors |

## 4. Slices (in order)

| Slice | Content | Who | Depends on |
|---|---|---|---|
| **R0** Prerequisites | `ng build` and `dotnet build` of the current work; commits; pending migrations (`AddBillTaxAdjustment`, `AddContactGroupIsDefault` and the earlier ones if not run) | owner | — |
| **R1** Settings screens | Workshop, Broker, DDA, HRM, Limousine and Payment Gateway move to the single-row shape (`GetSingleAsync`/`UpsertSingleAsync` endpoints, and Angular reads and saves the one row). Then the owner removes duplicate rows | me + owner | R0 |
| **R2** Backend blocks | See the list below. It also prepares the **journal decision sheet** (below) | me | D4-4, D5-1 |
| **R3** UI blocks | See the list below | me + owner build (D5-4) | D5-4 |
| **R4** Screen catalog (step 4) | New types: 08 *Financial document*, 09 *Action dialog*. References: Job for list and routed editor. Type 05 notes Opening Balances as legacy. Each type lists its UI and BE blocks and its reference. Plus the **whole-application review playbook**: foundation → shared-first → screen order by module, and the per-screen checklist | me | R2, R3 |
| **R5** Master Guide | See the list below | me | D4-5 |
| **R6** Narratives | A4-54: every "Found …" incident across the three books becomes a one-line reason plus a `CHANGELOG.md` row | me | R2–R5 |
| **R7** Skill re-digest | §5–9 re-checked block by block; every rule cites its block; stale rules removed; revision row | me | R2–R6 |
| **R8** Closing | See the list below | me | all |

**R2 — backend blocks:**
- BE 13: Pattern 1 refreshed; if D5-1, the base hooks are implemented (additive, in `Service.cs`) and `BranchService` is re-verified as the reference.
- BE 15: Pattern 3 refreshed; D4-4 written; delete/void rule.
- BE 5: base-helper table.
- BE 6: controller.
- BE 11: points to the numbering plan.
- BE 18: incident narratives trimmed.

**R3 — UI blocks:**
- UI 9: last-page rule; interceptor; child rows → block 14.
- UI 10: return to the list with its filters (Job reference); shell link.
- UI 11: snippet on `EditableRows`.
- UI 27 and 28: re-verified; Job reference.
- UI 2: typing if D5-4 (the owner builds).

**R5 — Master Guide:**
- Master 1: tiers (D4-5), review order.
- Master 2: Speed Auto moved to `reviews/REFERENCE_SPEED_AUTO_SYSTEMS.md`.
- Master 3: phases re-checked.
- Master 4: register moved; D4-2/D4-3 rows.
- Master 6: re-checked.
- Master 7: final comparisons gain the shared-piece and authorization-candidate checks.
- Master 8: the translation script.

**R8 — closing:**
- A read-only `Check-BookReferences.ps1` verifies that every path, class, method and CSS class the books name exists in source, and that every block cross-reference points to an existing block.
- Every ledger row is marked Reviewed with a date.
- Versions and preambles are refreshed; backlogs re-ranked; packets regenerated with `-Check` 8×OK.
- Audit 4 closed. *Audit 5 — completion* records the ledger.

**R2 — journal decision sheet.** Pattern 3 (BE 15) is the financial-document pattern, so it is refreshed together with the deferred per-document journal findings (`reviews/Deferred/JOURNAL_ENTRY_CREATION_AND_ROUNDING_FEATURE_REVIEW.md`). R2 prepares one decision sheet with a recommendation for each open question:
- F2: accounts of the General and Asset-sale receipts.
- F4: meaning of a debit note.
- F8: a credit note that only allocates.
- I1: PDC receivable.
- I2: year-end closing voucher.

The owner decides; BE 15 records the answers once.

**After R8:** the screen-by-screen review starts, following the playbook from R4. **The first module is vouchers and journals** (owner question 2026-10-01, reviewer recommendation), in this order:
1. F1 — payment vouchers post no journal.
2. F2, F3 and F5 — wrong or non-clearing accounts on receipts, credit notes, deposits and card settlements.
3. F4 — debit note.
4. F6 and F7.
5. F8–F11.

**Exception:** if the application already holds live data, F1 is fixed right after R2, because every day adds payments missing from the ledger.

## 5. What stays out (recorded, not blocking "Reviewed")

**Deferred by the owner:**
- Authorization.
- Document numbering.
- Currency.
- The remaining tax plan.

The per-document journal findings are no longer only deferred. Their decisions are prepared in R2, and they are the first module of the screen review.

**Code debt fixed per screen**, each tracked in its backlog item:
- Six settings screens (R1 handles them first).
- 60 duplicate error toasts.
- `subscriptionId` in payloads.
- 108 feature palettes.
- 38 export loops.
- 77 `FormArray` editors.
- 24 upload screens.
- `ReverseMap` ×213.
- `ListBaseVm` plumbing.
- `EnumToArrayPipe` ×67.
- Owned-children delete overrides per aggregate.
- Filtered unique indexes per entity.

## 6. Verification

- **Books:** `Generate-SigmaRecipes.ps1 -Check`, `Check-Translations.ps1` and `Check-BookReferences.ps1` (R8) are all read-only and run by me.
- **Code slices** (R1, R2 hooks, R3 typing): you run the build and the checks listed in each slice's record.

## 7. Implementation log

### R1 — single-row settings (2026-10-01) — Implemented, source-only

**`SigmaBackend`:**
- **New bases:**
  - `IServices/Bases/ISingleRowSettingsService.cs`.
  - `Services/Bases/SingleRowSettingsService.cs`: `GetMineAsync`, `SaveMineAsync`, and the legacy `AddAsync` upserts.
  - `ServerAPI/Controller/SingleRowSettingsControllerBase.cs`: `GET`/`PUT {controller}/Mine`.
- **Moved to the bases:** the service, interface and controller of Workshop, Broker, DirectDebitAuthorization, HRM, Limousine and Payment Gateway. Each constructor takes `IServiceHelper`.
- **Readers:** `LimoQuotationService` and `TripBookingService` read the latest Limousine settings row. One reader used to take the first row and another the latest, so with duplicate rows they disagreed.

**`SiGmaAngularFrontEnd`:**
- `BaseService.getMine`/`saveMine`.
- The six components read `res.entity` and save with `saveMine`, instead of listing all rows, taking the last one and POSTing a new row.

**Docs:** BE 16 (bases, legacy table updated), BE 19 backlog 22, UI 2, `CHANGELOG.md`, skill.

**Found:** `PaymentGatewayDetailVM` returns `SecretKey` to the browser. It is recorded as a security candidate for that screen's review and was not changed here.

**Owner:**
- Run `dotnet build` and `ng build`.
- Open and save each of the six screens twice: the row count stays at one.
- Then remove the duplicate rows.

**Not in R1:** Cost Centers (own upsert), API Key (PUT only), Common and Document Number (`GetMySetting`). They move in their reviews.

### R2 — backend blocks (2026-10-01) — Implemented, source-only

**Code (`SigmaBackend`):**
- **Base list hooks (D5-1).** `Service.GetManyAsync` is rebuilt on one query:
  1. scope;
  2. the generic predicate;
  3. `ApplyListFilters`;
  4. count;
  5. `ApplyListOrder` (default `Id` desc) plus the `Id` tie-breaker;
  6. clamped paging;
  7. map.

  Behaviour for existing entities is unchanged, except that unpaged lists are now ordered too.
- **`TripBookingService`:** its private `ApplyListFilters` was renamed `ApplyTripBookingFilters`, so it no longer hides the base hook.
- **`BranchService` (the reference) rewritten:**
  - it uses the hook (paging 10/1–100, `TotalCount` — it used page size 20 and returned no total);
  - it trims the name;
  - the base handles Add, Update and Remove;
  - messages are 10 localized keys in en and ar.
- **New resx key** `InvoiceSaveFailed`, used in the block 15 snippet.

**Books (backend 0.44):**
- Block 13 rewritten.
- Block 15:
  - `BusinessFailure` and `AllExistAsync`;
  - VAT per tax rate, rounded once;
  - the delete/void rule pending **J-1**;
  - the open journal decisions.
- Block 5: base-helper table and the D5-2 gap.
- Block 6: single-row controller and the cancellation note.
- Block 11: numbering plan pointer, and the child `No` overwrite to verify.

**Journal decision sheet:** `reviews/JOURNAL_ENTRIES_DECISION_SHEET.md` holds J-1 (no delete of a posted document — void or credit note), F2, F4, F8, I1 and I2. Each has its current behaviour, the business-correct recommendation, and what the accountant should confirm.

**Owner:**
- `dotnet build`.
- Branch list: search, the total, paging; create, edit and delete with an Arabic message.
- Any list without a custom `GetManyAsync` should behave as before.
- Decide the journal sheet.

### R3 — UI blocks (2026-10-01) — Implemented, source-only

**Code (`SiGmaAngularFrontEnd`):**
- **D5-4 typing.** `shared/models/result.ts` (`id: number | string | null`) and `results.ts` (`Omit<Result<never>, 'entity'>`).
- **`Fleet/Vehicle` details:** `Number(result.id) || undefined` for its two catalog reloads.
- **Job list (reference):**
  - The load error showed twice: inline **and** in the interceptor dialog. `JobService.getList` now sends `X-Skip-Error-Interceptor`.
  - The list reads the message with `apiErrorMessage`.
  - This also covers the export (`getAllList` uses `getList`).

**Books (UI 0.94):** blocks 2 (Canonical), 9, 10, 11, 27, 28 and 30 (backlog 22). Skill §10 updated.

**Owner — `ng build` after D5-4:**
- Expect errors only where code read `.entity` from a list response, or used `Result.id` as a number. Send them and I fix each the same way.
- The Job list: a failing load shows the inline alert only.

### R4 — screen catalog (2026-10-01) — Implemented, source-only

- **New types.** 08 *Financial document* and 09 *Action dialog*.
- **Updated types.** 00, 01, 02 and 05: Job is the list and routed-editor reference, and type 05 notes Opening Balances as legacy.
- **Each type** lists its UI and backend blocks and its reference.
- **The catalog** points to the review order and the per-screen checklist, which R5 wrote into Master block 1.

### R5 — Master Guide (2026-10-01) — Implemented, source-only

**Books (Master 1.18, UI 0.95):**
- **Block 1.** *Proportional process* (D4-5: tiers S/M/L) and *Whole-application review order*: vouchers and journals first, then sales and purchase documents, the remaining settings, the operational modules, and reports; plus the per-screen checklist.
- **Block 2.** The Speed Auto Systems section moved to `reviews/REFERENCE_SPEED_AUTO_SYSTEMS.md`; the book keeps the rule (behavioural evidence only).
- **Block 3.** Phases 2 and 3 adopt the shared pieces; Phase 4 voids or credits a posted document.
- **Block 4.** Rows 2, 4, 8, 15 and 17 brought to current source; rows 22–25 added (full snapshot, VAT per rate, authorization candidates, business correctness). The quotation register moved to UI block 7.
- **Block 6.** The finding format gains *Business reasoning*.
- **Block 7.** Comparisons for the error owner, shared pieces, authorization candidates and business reasoning.
- **Block 8.** The read-only companion scripts.

### R6 — narratives (2026-10-01) — Implemented, source-only

A4-54 is closed. Each incident in backend blocks 5 and 18 and UI blocks 5, 16, 17, 19, 22 and 29 is reduced to its rule and a one-line reason. The incident itself (screen, date, symptom) is now a `CHANGELOG.md` row (backend 0.45, UI 0.96).

Two notes were kept on purpose, because they are guidance rather than history:
- UI 10: the Company snippet is kept for its dirty-check shape only.
- UI 22: an `error: () => undefined` found in a review is a current defect.

### R7 — skill re-digest (2026-10-01) — Implemented, source-only

Skill §5–9 were re-checked rule by rule against the block each rule cites. Changed:
- **§6.** List requests go through `switchMap` (UI 28), replacing "deduplicate".
- **§7.**
  - New item 0: the D4-2 modal-or-page rule.
  - The white-icon rule now cites UI 3 and 20 and is owned by the shared buttons (no feature `#fff !important`).
  - The save step uses `toApiDate`/`toApiDateTime` (UI 17).
  - **Removed:** *Key-Value Summaries*. It had no owning book block (a protocol defect) and hard-coded `#cbd5e1`.
- **§8.1.**
  - Pattern 1: hooks and `BusinessFailure`.
  - Pattern 2: Canonical, with `AllExistAsync`, full snapshot (D4-3) and `RemoveWithChildrenAsync`.
  - Pattern 3: void-not-delete (J-1 pending) and VAT per tax rate rounded once (D4-4). The old per-line `CalculateTax` instruction contradicted D4-4.
- **§8.2.** `NormalizePaging`; money decimals instead of `Math.Round(…, 2)`; the hooks instead of "MUST override `GetManyAsync`".
- **§9.** Shared namespaces, `en` fallback, and `Check-Translations.ps1`.

### R8 — closing (2026-10-01) — Implemented, source-only

- **`recipe-system/Check-BookReferences.ps1`** (new, read-only). It checks that every source path, type name, `sigma-*` class, block number and markdown link named by the three books and the skill exists. The first runs found only the script's own false positives: library types, the recipe folder, `errorInterceptor`-style functions and the skill name. After those were corrected: **OK, exit 0**.
- **Backlogs re-ranked.**
  - Backend 0.46: new 25 (posted documents deletable — J-1), 26 (payment gateway secret sent to the browser), 27 (cancellation, D5-2); resolved items moved to their own section.
  - UI 0.97: 17, 27 and 34 resolved; item 5 widened to the 73 files that still use `toISOString()`.
- **Ledger.** Every row in §2 is **Reviewed 2026-10-01**.
- **Versions.** Master 1.19, backend 0.46, UI 0.97. Packets regenerated; `-Check` 8×OK.
- **Audit.** Audit 4 is closed and Audit 5 opened, in `SIGMA_DOCUMENTATION_SYSTEM_AUDIT.md`.

**After the plan:** the screen-by-screen review starts with vouchers and journals (Master block 1 *Whole-application review order*). The owner first answers the journal decision sheet.
