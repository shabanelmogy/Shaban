# Cash Deposits editor workstream

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-05 |
| Ownership | CashDeposit/components/details TS, HTML, SCSS and legacy spec only |
| Contract | CASH_DEPOSITS_CONTRACT_FREEZE.md; root owns cross-layer reconciliation |

## Implemented source

- Replaced the legacy untyped header and independently routed child component with one typed aggregate form. Explicit Create/Edit/View modes come from route data. Approved, posted and voided saved documents render read-only; View offers Edit only for an editable saved state.
- Header inputs are Date, Bank, Ref No, Payment Method, optional Branch and Description. Date uses the shared structured calendar and local date transport. Saved approval/posting/void flags and lookup labels remain read-only. Header writes omit number, status, tenant/audit fields and calculated totals.
- Typed rows retain a FormGroup identity and separate immutable server source snapshots from selection and deposited-now inputs. Current receipt/payment sources use the frozen composite key. Edit excludes the current deposit from the pending endpoint and preserves saved child ids. Unavailable or duplicate historical selected rows remain visibly represented and block Save instead of disappearing through a key collision.
- A checked available source previews its full due amount; the user may replace it. Unselected amounts are disabled/zero and omitted. Validation rejects nonnumeric, zero, wrong-sign, excessive and over-two-decimal amounts, duplicate selected sources, absent eligible sources and nonpositive net totals. The backend still rechecks current eligibility and configured money precision; its rejection leaves values intact.
- Saved deselection uses shared EditableRows removal confirmation, then restores the same source row as unselected while retaining its saved identity. Confirmation gates aggregate Save, selection and navigation. Ordinary changed header/amount fields and new selections mark the aggregate dirty; the route guard uses the shared discard confirmation.
- Writes carry only typed header inputs and the full selected nonzero child snapshot. Add omits child ids; Update supplies the retained saved id or zero for a new line. Result failures and HTTP failures retain the form; mutation messaging remains interceptor-owned with a separate retained-values cue.
- Detail, lookup and voucher reads use switchMap, finalize and destroy teardown. A mode/id reset cancels dependent lookup/voucher reads and clears prior options. Failed reads show translated inline errors and controlled retries; a voucher retry preserves current selected row values.
- Save opens the saved View by the response id; Save and Print adds print=true. View reloads authoritative saved data before invoking ReportPrintService. Return list query parameters survive Save/Edit/Close and print is stripped on return. Create/Edit content is excluded from print. The saved full child array prints through the existing shared DataTable flow projection, without pagination or fixed editor column widths.
- Round off remains translated pending-rule text, excluded from writes and print. No invented zero/account/posting rule. View totals use the authoritative Amount; editable totals are explicitly previews.
- Known backend/legacy voucher labels have explicit full EN/AR keys; unknown strings remain source text and historical null is empty. Root owns model nullability and translations.
- Removed the legacy should-create-only spec scaffold. No tests were created or executed.

## Reference conformance

| Concern | Owning block | Actual reference/shared owner | Target evidence |
|---|---|---|---|
| Routed editor shell | UI1/13 | Workshop/Job/components/editor/editor.component.html; styles.scss | sigma-route-host, sigma-editor-page/panel/form/body/grid/footer; title inside primary panel; no page-height arithmetic |
| Header/source composition | UI13 | FormSectionComponent and shared sigma-editor-scroll | Two bounded regions; header host max-block-size 45% keeps narrow fields in their own scroll, lines/table hosts flex 1 1 0 with min-block-size 0; only 12 lines of host-bounds SCSS |
| Collection | UI14 | EditableCollectionTableComponent, EditableRows | Direct row directive import, fillHeight/stickyHeader, stable typed rows, savedId/duplicate helpers, shared saved-removal confirmation; readonly numeric highlight classes |
| Dates/validation | UI17/19/27 | DatePickerDirective, dateValueValidator, parseDateValue, FieldError, NumericFocusDirective | Structured dd/mm/yyyy, typed Date/string/null control, local yyyy-MM-dd writes; field errors beneath validators; first invalid field focus; existing numeric entry owner |
| Totals | UI24 | SummaryCardsComponent | Readonly SummaryCard array; slim/row/min140/max80; counts and money values outside the row scroll frame |
| Printing | UI21 | ReportPrintService/createSession; DataTableComponent flow variant; sigma-print-flow | Saved View only; full saved detail array with lazy=false/paginator=false/scrollable=false; bounded hosts marked flow; controls/errors/round-off pending cue no-print |
| Read safety/feedback | UI22/28 | Job editor; apiErrorMessage | switchMap read triggers, cancelled dependent reads on record reset, explicit false-result and transport-failure handling, finalize loading release |
| Language | UI23 | TranslateModule/TranslateService; root vocabs | Explicit full mode/voucher key maps; static selection/count labels; source-specific checkbox label receives the `{ no }` interpolation parameter; source label null/unknown preserve empty/raw semantics |

The print-only DataTable projection is a deliberate composition of an existing print owner: EditableCollectionTable's internal frame and numeric column widths have no shared print-release behavior. No private selector, deep override or feature print lifecycle was added.

## Files changed

- F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDeposit/components/details/details.component.ts
- F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDeposit/components/details/details.component.html
- F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDeposit/components/details/details.component.scss
- F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Banking/Cash Deposits/CashDeposit/components/details/details.component.spec.ts — removed legacy scaffold

Root-only integration additions: cashDeposits.columns.voucherNo (`Voucher No` / `رقم السند`), nullable historical voucherLabel in the common line model, and previously communicated editor/validation/confirmation/voucher keys. Other source files were not edited by this workstream.

## Source verification and owner acceptance

The complete scoped details diff was reviewed against the frozen producer/consumer contracts and actual shared component inputs. Scoped git diff --check passed. Scoped searches found no legacy DTO/child imports, untyped any payload, localStorage tenant writes, window.print, UTC date transport, ES2019 array helpers or merge markers.

Pending owner checks: build and route compilation; Create/Edit/View loading and retry paths; checkbox mouse/Space and saved-deselection cancel/confirm; partial date text; positive/negative due sign and bounds; retained fields after backend rejection; smaller configured currency precision; stale pending-source changes; saved-child omission; dirty route Back/Close; list query restoration; Save and Print saved reload; all rows in multi-page print; EN/AR, dark theme and narrow header/table/totals bounds. Native browser/visual behavior remains unverified.

No builds, tests, lint, database operations, migrations, browser automation, commits or pushes were run. No entity/EF/model snapshot files were touched. The root remains responsible for feature-level completion, pending accounting decisions and migration guidance.
