# Purchasing forms — bounded UI review

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-21 |

## Scope and frozen authority

PR, PO, GRN and Bill editor/approval components only. Root owns translations,
guides and cross-cycle integration. Frozen handoff:
`PURCHASING_SUPPLIERS_CYCLE_CONTRACT_FREEZE.md`. Existing dirty source is
preserved. No builds, tests, lint, runtime, browser, database, migration or Git
mutations are authorized. Recipe check passed all eight packets in root discovery.

Selected shape: UI catalog 02 routed aggregate editors; Bill additionally follows
catalog 08 financial document. Existing PO embedded source workflow remains.

## Before-edit reference conformance

| Concern | Owning blocks | Actual reference/shared owner | Target decision |
|---|---|---|---|
| Container and fixed totals/footer | UI1/13/14 | Workshop/Job/components/editor/editor.component.html; shared sigma-editor shell | Keep existing route host, form/body/pane chain and bounded active panels; no private shell or CSS |
| Accessible workspace tabs | UI13 | EditorTabsComponent typed EditorTab, disabled input, tabId/panelId | Retain PR/PO/GRN keys and add Bill approval key with matching panel/label; existing busy guards govern switching |
| Duplicate section titles | UI13 | FormSectionComponent showHeading; header encloses projected actions | Set duplicated section headings to printing(), move Add to collection public toolbar, keep PR Import in content |
| Collection toolbar | UI14 | EditableCollectionTableComponent addLabel/addDisabled/addRequested, headingVisible | Hide repeated table heading; preserve Add independently using existing owner |
| Approval | UI7/22 | Existing PR/PO ApprovalCycleComponent; BillDetailsComponent approve/unapprove | Preserve saved record status/history and existing action flags; Bill uses no invented approval history |
| Scroll ownership | UI1/13 | sigma-editor-scroll, FormSection fill, PO ApprovalCycle host sigma-editor-form | Remove redundant parent PO approval scroll wrapper; retain child scroll owner |
| Print | UI13/14 | Existing ReportPrintSession printing signal and sigma-print-flow | Keep printable Basic/Details/Documents headings and mount sections independently of active tab |

## Findings and implemented source changes

- PR: Basic, Details and Documents FormSection headings now appear only during
  printing; the Approval heading is suppressed under its named tab. Import and
  Add Detail remain in the section content toolbar. Add Document now uses the
  existing collection addLabel/addDisabled/addRequested contract.
- PO: same heading treatment. Add Detail and Add Document move to the existing
  collection toolbar with the same eligibility methods. The approval child
  already has a sigma-editor-form host and sigma-editor-scroll body; remove its
  redundant parent sigma-editor-scroll to retain a single scroll owner.
- GRN: suppress Basic and View Documents section headings except for printing,
  and suppress the repeated Details/Documents table titles. The table Add
  toolbar remains independent of headingVisible, preserving linked-source
  restrictions and upload/confirmation guards.
- Bill: add the typed `approval` tab and matching
  `bill-editor-panel-approval` / `bill-editor-tab-approval` association. It shows
  saved bill number, supplier, persisted approval status and lifecycle. Move
  the existing Approve/Unapprove controls into it and keep a header shortcut.
  Existing handlers, server flags, void exclusions, confirmation, response
  handling and saved-detail refresh remain unchanged. Create shows save-first;
  Edit shows saved status and guidance to open View. Retain header status,
  printing, allocation, supplier debit, void, journal and installments actions.
  Existing Bill duplicate-heading suppression was already present and preserved.

Only these five application files were edited by this workstream (paths relative
to `F:/My Work/Sigma/SiGmaAngularFrontEnd`):

1. `src/app/modules/Vouchers/PurchaseRequests/PurchaseRequest/components/details/details.component.html`
2. `src/app/modules/Vouchers/PurchaseOrders/PurchaseOrder/components/details/details.component.html`
3. `src/app/modules/Vouchers/GRNs/GoodsReceivedNote/components/details/details.component.html`
4. `src/app/modules/Vouchers/Bills/Bill/components/details/details.component.html`
5. `src/app/modules/Vouchers/Bills/Bill/components/details/details.component.ts`

The repository already contains extensive uncommitted editor rewrites. Those
were preserved, not attributed to this bounded task. The incremental changes
and final template/control context were reviewed against the scoped Git diff;
root owns whole-cycle reconciliation of all inherited changes. No list, shared
component, service, DTO, backend, guide, translation, SCSS, spec or runtime entry
file was modified by this workstream.

## Final conformance and source verification

| Concern | Final evidence | Result |
|---|---|---|
| Public inputs and outputs | FormSection exports boolean showHeading/fill; EditableCollectionTable exports headingVisible/addLabel/addDisabled/addRequested and renders Add independently of headingVisible | Match |
| Standalone registration | Existing four consumers already import/register FormSection, collection/row, tabs, primary button, Translate/Common and StateMessage owners. Bill adds no new dependency | Match |
| Typed tabs and ARIA | BillTab union and readonly EditorTab array include approval; template panel id/label match shared idPrefix. Existing three tabs and PR/PO approval panels remain | Match |
| Bounded panes | Shared sigma-editor-form/body use flex1/min-height0/overflow hidden; feature tab panels flex1/min-height0; FormSection fill forwards shrinking content; sigma-editor-scroll owns form scrolling | Match from source; visual pending |
| Pending switching and mutation | PR/PO busy includes approvalPending, child confirmations and uploads; all four tab handlers and disabled bindings retain busy/cleanup guards. Bill actionPending freezes root and disables switching | Preserved |
| Blank-state avoidance | Bill unsaved approval tab has save-first; saved Edit has status/openView. Failed initial/reload details retain parent error/Retry; global LoadingService owns pending detail load. No second spinner or invented history | Match |
| Unsaved values and invalid Save | One parent form retained; section mounting never recreates controls. Existing invalid-save selection targets basic/details/documents and child empty requirements | Preserved |
| Print | Basic/Details/Documents remain mounted whenever printing; duplicate section titles return in that state; approval panels remain nonprint; header saved approval badge survives Bill print | Preserved |
| Business contract | BillDetailsDTO owns approvalStatus/canApprove/canUnapprove/isVoided. BillService existing POST Bill/{id}/approve and /unapprove used; handlers retain duplicate/stale checks and both failure channels | Preserved |
| Translations | Root added bill.approval.tab/saveFirst/openView to en.ts and ar.ts; inspected exact Bill nesting and existing listApprovalStatus/lifecycle/liveStatus keys | Match |
| Source parsing | Installed Angular compiler parseTemplate and TypeScript createSourceFile parseDiagnostics across four details HTML/TS pairs | 0 syntax errors; not compilation |
| Git/source hygiene | Scoped git diff and diff --check reviewed; no whitespace errors, merge markers, new imports or runtime compilation roots | Match; existing CRLF normalization warnings only |

No new shared extraction is needed: current FormSection, collection toolbar,
EditorTabs and button APIs express all changes without a new wrapper or style.

## Pending owner verification and integration

Root must include these screens in the existing Purchasing user-guide update
and final cycle report. Owner verification remains required for:

- Create/Edit/View tab transitions, persisted draft fields, empty details and
  invalid Save focus; Import/Add Detail/Add Document and pending confirmation.
- PR/PO approval status/history and manual actions; Bill saved View approval,
  blocked reversal, void exclusions, failure/retry and refresh on the same tab.
- Print from every tab, including Approvals: full Basic/Details/Documents and
  headings; PO embedded source creation; long documents/history scrolling.
- Shared layouts above/below 1024px and700px, FormSection760px, representative
  intermediate widths and short heights; keyboard tabs, Arabic/RTL and themes.

No independent GRN approval state/API is present in the frozen contract; none
was fabricated. Bill has no approval-history endpoint in this contract, so the
tab shows persisted current status and supported actions only. Future approval
policy/settings are separate business work, not silently added here. No backend,
calculation, AutoMapper or schema changes; no migration required for this slice.

Applied Phase3 presentation and bounded Phase4 existing-action placement, with
source Phase6 checks. Root owns Phase0/1/5 and overall Phase6. No builds, tests,
lint, runtime/browser, database, migrations, commits or pushes were run.

Suggested frontend commit message (suggestion only):
`refactor(purchasing): clarify form tabs and bill approvals`
