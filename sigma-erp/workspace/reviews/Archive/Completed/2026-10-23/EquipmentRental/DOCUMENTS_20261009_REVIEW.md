# Equipment Rental documents conformance review — 2026-10-09

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Scope | `EquipmentQuotation` and `EquipmentMasterAgreement` frontend source |
| Contract | Existing frozen API/field/business contract retained |
| Evidence | Current frontend source, frozen handoff, canonical UI blocks 10/13/14/17/19/22/28, phase 03/04/06 packets, approved shared/reference source |

## Packet and evidence gate

`Generate-SigmaRecipes.ps1 -Check` passed for PLAN-00 and phases 00–06 before the generated packets were used. No screenshot or video was supplied. The historical `EQUIPMENT_RENTAL_FRONTEND_CONTRACT_FREEZE.md` remains unchanged and source-supported; this bounded continuation introduces no endpoint, payload, field, approval tuple, calculation, permission, persistence, or accounting change.

## Conformance and result

| Concern | Canonical owner | Reference/shared source | Final target evidence | Status |
|---|---|---|---|---|
| Routed dirty exit | UI10, UI28 | Movements deferred discard; `shared/utils/form-state.ts` | Both routed document editors now create the confirmation inside `defer`, recheck record/version/mode and busy state at subscription, freeze controls without events, and restore only the same active editor | Implemented |
| Intentionally disabled customer | UI10 | `freezeFormState` | Master Agreement temporary discard freeze restores the pre-existing disabled `customerId` when a quotation owns it | Implemented |
| Child row removal | UI14 | `EditableRows.freezeParentOnConfirmation` | Quotation details and Master Agreement sale-order rows opt into parent-form freezing; existing full snapshots, row identity and `canMutate` gates remain unchanged | Implemented |
| Embedded editor dirty exit | UI10, UI13, UI28 | shared `EditorDialog`; Movements dialog exit | Sale Orders confirmation is subscription-deferred and rechecks visibility, agreement identity, request version and busy state before opening and before accepting | Implemented |
| Embedded PO integration exit | UI10, UI28 | shared `freezeFormState`; embedded Purchase Order editor instance | Quotation list selects the actual visible Create/Edit editor, captures its instance and source ids, defers and single-uses the confirmation, and freezes its form. Result/restore require the captured surface identity; pending-gate release uses a private decision-owner token, so an accepted close can release its own lock after hiding while an obsolete decision cannot clear a newer lock | Implemented |
| Async lookup identity | UI22, UI28 | current version-gated request patterns | Quotation and Master Agreement lookup batches have independent versions; stale results/finalizers cannot populate or clear loading for a later route mode/record | Implemented |
| Single-use decision | UI10 | deferred Movements/Lease exit pattern | Each returned discard Observable owns a one-shot subscription flag; a second subscription returns `false` and cannot reopen the same confirmation | Implemented |
| Frozen-state async gate | UI10, UI28 | shared form-state plus current busy gates | Public lookup/retry/edit entry points reject work while discard, row confirmation or save is pending; dependent contact/customer requests cannot start against a frozen form | Implemented |
| Sale-order save identity | UI10, UI28 | shared `freezeFormState`; current request-version pattern | Save captures request/agreement identity, ignores stale next/error/finalize callbacks, and restores prior controls only for the same visible non-loading dialog | Implemented |
| Dialog identity hierarchy | UI13 | shared `EditorDialogComponent` | Purchase Orders and Sale Orders keep a translated screen title and translated identifier subtitle; routed editors keep title plus record number subtitle | Matched; no source change |
| Dates and validation | UI17, UI19 | shared date utilities, DatePicker and FieldError | Existing `toPickerDate` hydration, `parseDateValue` payload transport, validators and messages retained | Matched |
| Failure handling | UI22 | shared state/error helpers | Declared and transport failures remain visible with retry where applicable; no empty error callbacks found in scope | Matched |

## Decisions and contract checks

| Decision | Evidence and result |
|---|---|
| Editor shape | Quotation and Master Agreement remain routed type02 editors. Linked PO/SO surfaces remain controlled shared dialogs. |
| Data contract | Existing typed forms and full detail/sale-order snapshots are unchanged. No model or service change was required. |
| Exit identity | Routed identity is the current load version + record id + route mode. Embedded SO identity is request version + agreement id + visibility. |
| Busy gates | Save/detail load/lookup or dependent lookup/row confirmation/close confirmation block a second exit decision as applicable. |
| Subscription lifecycle | One guard Observable can open at most one confirmation; repeated subscriptions cannot duplicate a discarded or cancelled decision. |
| Restore rule | Cancellation restores the captured control state only for the same active editor and never during save/detail loading. |
| Action state | Existing approval and linked-order action availability remains unchanged; no domain transition was added or removed. |
| Calculation/mapping | No calculation, AutoMapper, backend mapping, or derived value changed. |

## Files changed

- `EquipmentQuotation/components/details/details.component.ts`
- `EquipmentQuotation/components/list/list.component.ts`
- `EquipmentMasterAgreement/components/details/details.component.ts`
- `EquipmentMasterAgreement/components/sales-orders/sales-orders.component.ts`
- This bounded review artifact.

## Source-only verification

- Reviewed the complete scoped frontend diff from the Angular repository root.
- `git diff --check` passed for both owned feature folders.
- Checked shared exports for `freezeFormState` and `freezeParentOnConfirmation` against their current public declarations.
- Checked scoped source for merge markers, empty error callbacks, affected imports, route guards, dialog title/subtitle bindings, and stale async identity gates.
- No shared, translation, backend, guide/book, generated packet, migration, or model snapshot file was edited.
- Build, tests, lint, browser/runtime, database, migrations, commit, push, deployment, Sigma MCP and Graphify were not run, as required.

## Guide handoff and owner verification

The screen behavior to cover in the root-owned Equipment Rental user-guide update is unchanged: creating/viewing/editing quotations and master agreements, approval-dependent editability, linked purchase/sale order workflows, unsaved-change confirmation, and preservation of the quotation-owned customer lock. This worker did not edit shared guide reader/menu/translation files because they are outside the assigned ownership.

Owner verification remains pending for TypeScript compilation and these interactions: invoking a guard without subscription opens no dialog; subscribing twice to one returned decision opens only one dialog; Cancel preserves values, dirty state and the locked customer; confirmed exit navigates once; stale route/dialog decisions and stale sale-order saves cannot close, mark pristine or re-enable a replacement record; row-removal confirmation freezes and restores the parent form; lookup retry and rapid mode/record changes ignore stale responses; RTL/theme/visual dialog title and subtitle presentation.

No migration is required. Suggested Angular commit message: `fix equipment rental document editor state guards`.

No additional subagents were used because ownership was already delegated as one bounded, tightly related frontend workstream.
