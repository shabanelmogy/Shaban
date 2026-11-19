| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-23 |

# Company document dates and stable validation rows

## Manifest and frozen scope

- Request: explain/fix the row displacement caused by validation and disable unacceptable document dates in the calendar. Evidence E1: `C:/Users/user/Desktop/www.PNG`, Company Edit / Documents, English/LTR; capture date/version unknown.
- UI shape: canonical screen 03, routed step-form record; nested editable collection (UI12/14/17/19). Backend: Pattern 2, Company aggregate with driver/document children (CompanyService). Backend behavior is read-only evidence for this frontend repair.
- Scope: CompanyPartner Documents component (also consumed by its driver editor), shared EditableCollectionTable validation-row presentation, owning customer guide, canonical guidance/digest/derived packets.
- Approved references inspected: IndividualPartner details shell; shared EditableCollectionTable, FieldError and appDatePicker; shared partner-editor-forms factory/validator; Company driver-fields Documents composition. Reference feature sources will remain unchanged.
- Existing routes remain CompanyPartner create/edit/:id/view/:id/details/:id. Company GET detail, POST/PUT Company and Result wrappers remain unchanged. Add/Remove, upload, Save and navigation retain their current owners. AuthGuard supplies authentication; no permission API is introduced.
- Existing unrelated frontend work: Country/CompanyDriver/UOM services, shared base service, reference lookup cache/specs and shared-screen-guidance. Documentation repository has substantial existing book/template/generated changes. Preserve all of them and review scoped differences against pre-task snapshots.
- No planning packet required: bounded confirmed defect, existing contracts; no unresolved business redesign. Recipe check passed all eight packets before use; selected phase00, phase03 and phase06, with existing date contract checked at phase01. No list/grid/API/domain-action/integration changes.

## Functional evidence

| Evidence | Classification | Behavior / disposition |
|---|---|---|
| E1: issue and expiry both 13/06/2026; expiry-after-issue error shown | Explicit | Preserve strict expiry > issue; calendar prevents selecting the same/earlier expiry day. |
| E1: type, number, issuer, issue, expiry, attachment, international flag and Remove | Explicit | Preserve fields/actions and column order. Screenshot geometry is defect evidence, not a design reference. |
| E1 plus written request: neighboring fields move down when an error expands its cell | Explicit request; source-confirmed cause | Shared middle cell alignment centers differently sized field/error groups; attachment and Remove already have a separate top exception. Use one first-control track across validation-capable editable rows. |
| Request to disable unacceptable dates | Explicit | Derive reciprocal picker bounds from existing strict date-order validator; do not invent future/today restrictions. |

## Decisions frozen before edits

| Concern | Contract / evidence |
|---|---|
| Shared presentation | Owner's current validation-row correction, together with the standing general shared-presentation instruction, supersedes whole-field/error centering only for shared editable rows containing FieldError or FileField. Top-align all their cells, preserving table semantics; center standalone 15px checkboxes within the first 34px control line. Other table rows/headers retain middle alignment. No opt-in or feature CSS. |
| Document dates | Existing DocumentRow fields are Date/string/null, required and real-date validated. documentDatesValidator rejects expiry <= issue; CustomerDocumentAddVM uses Required + DateAfter(IssueDate). Bind expiry minimum to issue + 1 local calendar day and issue maximum to expiry - 1 local day. |
| Missing/partial opposite date | No derived limit until the opposite field is a valid complete date. Preserve values, dirty state and validation errors; never silently correct dates. Use existing shared parser/hydration, no UTC arithmetic. |
| Payload / read contract | issueDate and expiryDate remain date-only strings/null in PartnerDocumentPayload and existing document DTOs; no added payload/model fields. Other document controls/required flags unchanged. |
| List / actions / routing | Main list columns/ListVM/filters, risky actions, routes/providers/interceptors, confirmation and upload lifecycle are outside this bounded repair and unchanged. No new requests or actions. |
| Backend / mapping / calculations / migration | No server, EF, AutoMapper or financial-calculation change; no migration. |
| User guide | Update Company customer topic in customer-profile-topics.ts, existing /UserGuide/customers reader/menu; document strict bounds, manual-date validation and stable inline errors in English/Arabic. |

## Reference conformance before edits

| Concern | Book block | Reference symbol / shared owner | Target comparison |
|---|---|---|---|
| Validation row | UI6/14/19 | EditableCollectionTable stylesheet; FieldError | Found middle!important global and partial attachment/action top override. Current user correction authorizes one shared validation-row track; keep 34px controls, 7px/9px cell padding, 15px checkbox, inline error flow. |
| Date control | UI17 | appDatePicker; partnerApiDate / partnerPickerDate / documentDatesValidator | Company Documents already uses masked, typeable body-appended DatePicker; missing min/max bindings. Preserve all defaults, only add bounds matching strict order. |
| Driver reuse | UI12/14/17 | driver-fields template -> app-documents | Same component/form factory means driver Documents inherits exactly the same existing rule and picker bounds. |
| Screen shell | UI12 | IndividualPartner details and shared step/section/summary | Existing Company step shell preserved; no shell edits. |

## Verification handoff

Implementation and final scoped source reconciliation will be appended below. Build/test/lint/runtime/browser/database/commits/push/deployment are not authorized. No subagents: this small repair has tightly coupled source/documentation work and does not meet the independent-workstream gate.

## Implementation and final reconciliation — 2026-10-23

The scope/decisions above were Frozen before edits. No subsequent business-contract change was needed.

| Comparison | Final source result |
|---|---|
| E1 displacement -> shared producer | EditableCollectionTable tbody rows with FieldError/FileField now top-align every cell with sufficient specificity to override the global middle!important. Empty/header/non-form rows retain middle. Full error messages stay in flow; cell padding and table layout/scroll contracts are unchanged. |
| Checkboxes / Remove -> first control line | Direct standalone checkbox gets block display and (34px - 15px)/2 logical top margin; Remove uses the same 34px control track on validation rows. Captioned checks keep the existing wrapper. |
| Existing strict date rule -> picker bounds | Documents template binds issue maxDate to documentDateLimit(expiry,-1), expiry minDate to documentDateLimit(issue,1). Existing form/group and backend DateAfter (AllowEqual=false by default) agree on calendar-day strictness. |
| Invalid/empty/partial opposite value | dateValueValidator rejects incomplete text and invalid Dates before shared partnerApiDate/partnerPickerDate hydration. Such values return null bounds. No form value is patched, cleared or normalized by this change. |
| Date arithmetic / publisher integration | Local setDate handles month/year/day rollover; no UTC or millisecond shift. A per-control WeakMap caches the normalized source day/offset and Date so unrelated change detection does not invoke new minDate/maxDate setter values. Installed PrimeNG setters rebuild months and do not change model values. |
| Driver reuse / modes | Existing driver-fields app-documents consumes the same component and factory; limits apply without duplicate implementation. Existing View/disabled/upload/mutation gates remain untouched. |
| Payload / server / mappings | PartnerDocumentPayload fields and documentPayload unchanged. CompanyAddVM.Documents -> CustomerDocumentAddVM Required/DateAfter already enforce the date contract. No API, server, AutoMapper, aggregate reconciliation, domain calculation or EF changes. |
| Reference conformance | Final shared producer matches the frozen 34px/15px/7px/9px values and exact selector scope above. Existing Company appDatePicker options, translated inline errors, field IDs and step shell preserved. No unresolved source mismatch in this repair. |
| User guide | customer-profile-topics.ts Company topic now explains both date limits, manual validation, clears and stable inline errors in EN/AR. Existing customers-guide imports this topic; sidebar-menu-data.ts links /UserGuide/customers; existing reader route is unchanged. Driver-draft warning preserved as its own note. |
| Documentation learning | UI6 records bounded exception to general middle rule, UI14 owns row/checkbox/action implementation and UI17 owns picker/order parity. Skill rule and revision row updated together; older attachment-only wording explicitly generalized. |

### Files changed by this task

Paths below are relative to their named owners.

Frontend repository `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/documents/documents.component.ts`
- `src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/documents/documents.component.html`
- `src/app/modules/shared/components/editable-collection-table/editable-collection-table.component.scss`
- `src/app/modules/UserGuide/content/customer-profile-topics.ts`

Documentation repository `F:/My Work/Shaban Documents/Shaban`:

- `sigma-erp/ui/06-grid-and-footer.md`
- `sigma-erp/ui/14-editable-collection-table.md`
- `sigma-erp/ui/17-dates.md`
- Generator refreshed all eight packets; changed canonical provenance dependencies concern UI6/14/17 in the affected packets, notably phase02/03/06. No generated file was edited manually.

Local instruction/review layer: `.agents/skills/sigma-screen-refactor/SKILL.md` and this review.

### Verification evidence and execution boundary

- Identified frontend and documentation Git roots with rev-parse; reviewed complete scoped frontend diff and owning-book Git diffs. Compared local skill against its pre-task snapshot; pre-existing book work and unrelated frontend files were preserved.
- Reviewed packet diff and canonical dependency/approved-reference roles: phase03 still routes compact collections to EditableCollectionTable, masked date controls to UI17 and field errors to UI19. New rules fit those owners; phase02/06 retain their read/reconciliation scope. All eight packets passed the final generator -Check. No template/manifest edit required.
- Scoped Git diff --check passed for all four frontend files, the three changed book blocks and generated packets. Inspected typed controls/imports, template binding signatures, date validator/parser/hydration, server DateAfter day comparison, route/menu/guide links, existing translations and scoped merge markers. No new translation key required.
- Applied phases: 0 evidence/shape, 1 existing date-contract confirmation/freeze, 3 implementation/guide, 6 source reconciliation. Skipped 2 (no read-grid contract change), 4 (no domain transition), 5 (no wiring change). No broad-plan phase required.
- No builds, tests, lint, browser/app/runtime verification, database commands, migrations, commits, pushes or deployment were run. No subagents: bounded, tightly coupled repair; delegation overhead and shared ownership would exceed useful parallel work.
- No migration required. No unresolved Missing/Conflicting/Uncertain business requirement within scope. Actual visual/input acceptance and compilation remain pending, especially because shared validation-row presentation is inherited by current consumers.

### Owner verification

1. Edit a company document; reveal required, date-order and attachment errors, including a wrapped message. Check that fields, attachment, international checkbox and Remove stay on the same first control line.
2. Set issue to 13/06/2026; expiry must disable 13/06 and all earlier dates, allowing 14/06 onward. Set expiry and verify issue disables the expiry day and later dates. Verify previous/next month, year rollover and leap day.
3. Clear either date and enter a partial year; the opposite derived limit should disappear until the date is complete and valid. Typed equal/reversed dates must still block progression/save; existing entered values must not be silently changed.
4. Repeat in the existing driver Documents editor, then inspect View, Arabic/RTL, both themes, narrow widths and table scrolling. Check another shared validation-capable collection for aligned checkboxes/actions and intact errors.

### Suggested commits (suggestions only)

Frontend, limited to the four task files:

```text
fix(company-documents): align validation rows and constrain dates
```

Documentation, limited to the three blocks and their derivative packet changes:

```text
docs(ui-book): document stable validation rows and date bounds
```

Local skill/review files have no current Git owner under the workspace instructions.
