# Lease Agreement confirmed fixes — source reconciliation, 2026-10-27

| Item | Disposition |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Overall Lease completion | Root-owned; this contribution does not declare overall completion |
| Remaining confirmed Agreement UI behavioral defect | None found in the complete 24-file Agreement diff inspected here |
| Agent application changes | Trimmed trailing whitespace only in Closing, Deposit, Discounts, Extend Rate Period and Vehicle Replacement TypeScript files, with explicit root coordination |
| Verification | Source inspection and scoped Git diff/check only; build, tests, lint, browser/runtime, database/SQL plans and migrations not run |

## Authority and boundaries

Reconciled the current `LEASE_CONFIRMED_FIXES_CONTRACT_FREEZE.md` (Frozen), the three dated Lease source audits, workspace AGENTS, current screen skill and canonical Master5/7 and UI2/21/22 requirements. The applicable shapes remain the routed aggregate Agreement editor, shared list and action dialogs. The active route at `pages/routing.ts:261` loads `LeaseAgreement_Routes`; the closed compatibility route loads the same list/details components, rather than the retired copied components. Workshop Job's actual list/editor and the named shared owners were inspected as references, without modifying them.

Entry recipe check found Phase02/03/06 stale. Root regenerated and semantically reconciled the packets; this agent's final `Generate-SigmaRecipes.ps1 -Check` passed all eight packets. No generated file was edited directly.

Paths below are relative to `SiGmaAngularFrontEnd/src/app/` unless stated otherwise. This is an implementation-evidence supplement to the existing exact URL/cache/loading/performance inventories in `LEASE_AGREEMENT_UI_AUDIT_20261027.md`, not a replacement for them.

## Frozen correction reconciliation

| Finding / target | Final producer-to-consumer evidence | Status |
|---|---|---|
| L02 / A01 — tariff failure preservation and current-context Save gate | Details TS389–405 synchronously clears `tariffReady`, then replaces the previous timer/request through `switchMap`; context reset cancels the inner request. TS1012–1051 retains booking charges on false/HTTP failure and sets readiness only after successful current replacement. TS689 and template Save both require readiness. TS486 and the tariff error action call the same Subject for Retry. Existing detail hydration establishes readiness for the saved context; no derived financial field enters the write DTO. | Implemented, source-only |
| L05 / A02 — full routed print | Details uses `ReportPrintService.createSession(DestroyRef)` / TS805 `print`; manual and list-triggered print share that owner. Template retains Detail, Provisions, Clauses and Pre-Termination panels in the DOM. Inactive panels hide only under `@media screen`; tabs, actions and errors are `no-print`. All bounded editor/collection/form-section layers opt into shared `sigma-print-flow`; collection height/sticky/minimum-width inputs release during preparation. The old Lease rule hiding the application root has been removed from `src/styles.scss`; shared stylesheet/component owners release their own interiors. | Implemented, source-only; paper layout/browser dialog pending |
| L13/19 / A03 — list live reference adoption | List finite Branch/Customer success applies options before `referenceLookups.bind`; selected ID and current-option getters retain historical labels with the filter default eligibility. Staff remains a direct, finite source. `contextChanges` cancels bootstrap, clears all choices and grid, and exposes existing Retry; list requests cancel on reset. DestroyRef ends bindings. | Implemented, source-only |
| L13/19 / A03 — editor live options and historical labels | Details TS1141–1197 keeps finite six-source bootstrap; Vehicle/Customer watchers bind only on matching successful envelopes and pass selected/current getters plus `disableRetainedOptions=true`. Direct car-model/driver/staff/clause choices retain their direct contracts. TS1270 finite detail-label merge uses the new optional read-only DTO labels and existing clause type names; fresh source labels win, retained unavailable rows are disabled through Select metadata. Watch callbacks never merge detail labels. TS409 clears both cached/direct options, fences and unsubscribes pending detail/bootstrap, marks old detail labels ineligible and keeps IDs/draft intact. | Implemented, source-only |
| L13/19 — Deposit, Closing and Vehicle Replacement reference adoption | Deposit binds successful Branch/PaymentMethod finite reads; Closing binds Branch; Vehicle Replacement binds Branch/Country. Their selected/current getters retain selected rows disabled when absent from fresh eligible choices; corresponding Select controls read `disabled`. Each subscribes to `contextChanges` before starting bootstrap, cancels/fences pending reads and clears arrays/context without mutating draft IDs. Closing/Vehicle Replacement retries preserve an already hydrated draft while reacquiring context. | Implemented, source-only |
| L15 / A05 — direct Deposit prerequisite and selected-method recovery | Deposit TS366 tracks the direct Agreement-to-customer read, both failure channels, unsubscribe/destroy and Retry. Template mounts DocumentCurrency only for a resolved customer. TS440 merges value changes with a separate explicit method Retry, retains switchMap cancellation and reset cancellation; false/HTTP errors invalidate method readiness. A same-ID Retry avoids clearing the existing card/bank draft before the fresh response. One aggregate dialog lookup status displays the customer/options/method tail; it defers its pending ring while nested DocumentCurrency owns progress. Payload still contains no client-owned currency/customer authority. | Implemented, source-only |
| L01 — ordinary Extend preview includes extras | `models/extend.ts` adds optional read-only `additionalChargesTotal`; Extend Period subtotal reduction starts at `context()?.additionalChargesTotal ?? 0` (TS126). Existing discount/tax/total preview therefore includes extras. `buildPayload` still sends only the existing approved input fields. Backend context producer at `LeaseAgreementService.cs:860` returns `AdditionalChargesTotal`; root owns complete backend reconciliation. | Implemented, source-only |
| L14/17/18 / A04 — routed progress | List keeps paired global list/export/action leases and explicitly suppresses the table indicator. Details retains paired global detail/save leases, adds a paired tariff lease and drives bootstrap through page-default ReferenceLookupStatus. Neither Agreement route declares a silent override; the real shell `layout.component.html:38` renders its page-loading host when enabled. Existing shared loading scope resolves page lookups to that host. | Implemented, source-only; actual visibility/timing pending |
| L14/17/18 — body-dialog progress | Read-only local tails in Additional Charges, Billing History, Delivery Date, Discounts, Documents, Driver Replacement, Extend Period, Extend Rate Period, Logs and Payment Instructions no longer increment the hidden global page count. Existing local StateMessage or aggregate ReferenceLookupStatus remains paired with loading/finalize/DestroyRef and Retry. Closing and Vehicle Replacement join context and lookup status. EditorDialog provides the local scope; writes retain their original global leases and independent save/disabled safety. | Implemented, source-only |

## Cache source and loading owner confirmation

The actual opted-in services remain Branch, Customer, Vehicle, Country and PaymentMethod (`cacheSelect=true`). Their inherited `BaseService.getSelectList` uses the exact `/{controller}/GetSelect` URL, `watchSelectList` uses the same owner/key, and `refreshSelectList` invalidates that source. Existing successful source writers use `invalidateSelectOnSuccess`; no new source opt-in, financial cache or feature-local replay layer was added in this slice. Producer/import/topic details remain recorded in the original source matrix and are root-reconciled with shared changes.

`ReferenceLookupBindings.bind` is once per key/DestroyRef: successful fresh snapshots merge incoming rows first with only selected prior rows; unavailable editor rows become disabled; null-context reset clears rows; retained refresh failure preserves usable prior rows and exposes Retry. `ReferenceLookupStatus` contributes an identity-owned page lease by default and emits a local StateMessage under the EditorDialog scope. Actual rendered behavior remains an owner runtime acceptance item, not inferred from these symbols.

## Diff and verification evidence

Inspected the complete Agreement-scoped diff: 24 files covering all changed TypeScript, templates, styles and DTO models, including the small local-read lease removals. Rechecked the five whitespace-only cleanup edits. Final scoped `git diff --check -- src/app/modules/Lease/LeaseAgreement` passed; scoped merge-marker search returned no matches. No source behavioral fix was needed during this final audit. This does not establish compilation or runtime execution.

No UI schema/migration change is required. Original source performance observations and exact index proposals remain in the existing Agreement/full-stack/backend audits: reference bootstrap is still finite and parallel, direct policy and operational reads remain fresh, and Deposit still has its existing Agreement-to-customer-to-currency waterfall. Watch adoption/loader conformance is not a measured speedup. Root must retain pending owner latency, payload/render, SQL-plan and candidate-index acceptance evidence.

## Owner acceptance still pending

- Run authorized build/type/template checks and the current/closed routes' Create/Edit/View workflows.
- Fail and replace an in-flight tariff read; verify rates remain, Retry succeeds only for current vehicle/dates and Save cannot submit unresolved rates; verify legitimate zero and manual overrides after success.
- Reset context during the first bootstrap and after watches mount; verify arrays clear, old labels do not reappear, Retry recovers and selected IDs/drafts stay unchanged.
- Fail Deposit customer/method reads, retry the same method and confirm bank/card draft retention, one local progress owner and unchanged server-owned financial result.
- Print each selected Agreement tab on both active routes with long saved child arrays; verify all four sections flow across paper and cancel restores the same tab/view.
- Extend an agreement with active additional charges and compare preview/authoritative server amounts under unchanged tax/discount rules.

Root owns the full repository diff, shared print/loading changes, both vocabularies, in-app Lease guide and overall final reconciliation; their completion is deliberately not asserted by this slice report.
