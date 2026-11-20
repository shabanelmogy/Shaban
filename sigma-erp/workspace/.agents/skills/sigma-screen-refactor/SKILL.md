---
name: sigma-screen-refactor
description: Review, create, fix, or refactor Sigma Angular screens and their directly related .NET APIs using the current canonical books, shared owners, and frozen feature contracts. Use for Sigma screen work; unrelated application or artifact tasks use their own skills.
---

# Sigma screen review and implementation

A compact router, not an implementation manual. Read the workspace
[AGENTS.md](../../../AGENTS.md) and the core of
[SIGMA_WORKFLOW_RULES.md](../../SIGMA_WORKFLOW_RULES.md) first; they own
authority order, modes, permissions and handoff. Each row below routes to the
canonical block that owns the full rule — read that block, not this summary,
before implementing. (Master1/8)

Documentation root: `F:\My Work\Shaban Documents\Shaban\sigma-erp` (block paths
below are relative to it). Find an existing feature's artifacts by name, not by
reading the whole review index; read its `_CURRENT_STATE.md` first when present:

```text
F:\My Work\Sigma\reviews\**\<FEATURE>_*.md
```

## 1. Select the route

| Request | Route and stop condition | Owner |
|---|---|---|
| Review/audit | Source-read-only; report findings | Companion §2; Master1/3/4/7 |
| Plan / shared ambiguous change | PLAN-00; inventory existing owners and open decisions; stop at the plan | Master1/4 |
| Create or authorized fix/refactor | Discover, freeze consumed contracts, implement, test, reconcile, user guide | Master1/3/4/7 |
| One bounded element | Tier S: the affected rule only, short report, no freeze file | Master1/5 |
| Named phase or deferred decision | That phase / that recorded condition only | Companion §2; Master3/4 |

Pick the tier (Master1), then the UI shape from `ui/screens/00-catalog.md` and
the simplest backend pattern from `backend/00-preamble.md` and BE13–17. A
report's transport paging does not make it a CRUD list. A recent similar feature
is not automatically canonical. Freeze shared API/domain contracts before
splitting dependent work. Run the packet drift check before using a packet.

## 2. Evidence gates (tier M/L; tier S only where the element is touched)

- [ ] **Reference** — Speed guide/explanation, then dated Speed code cycle, then
  pinned Odoo only for remaining gaps. Map each field/group/filter/action/state/
  validation/link/charge/output to Sigma source, contract and guide as matched/
  partial/missing/blocked/excluded. Frontend evidence never proves server,
  accounting or permission rules. (Master2/4/7)
- [ ] **Loading** — trace the real route import; one visible progress owner per
  request; routed initial/filter lookups use the page loader, dialogs local,
  retained cache refresh silent; query-only navigation keeps pending progress.
  (UI22; Master5)
- [ ] **Cache** — classify every consumed read (reference cache, singleton
  exception, direct without opt-in, operational/policy, unresolved) and trace its
  lifecycle to the real shared source. Names/imports do not prove adoption. (UI2)
- [ ] **Speed** — request/query/page scope, serial/duplicate/per-row work, index
  coverage; measured before/after or explicitly pending. (Master5; UI29; BE2/7)
- [ ] **Shared owners** — reuse/extend Sigma's PrimeNG-based owners; extract
  genuinely shared behavior; no competing wrappers. (Master5)
- [ ] **Numbers** — quantities/fractional hours/meters → shared quantity policy;
  counts/identities integer; money → financial policy. (BE18; UI14/19)
- [ ] **Access** — real route/action keys and endpoint enforcement. (UI26; BE9; Master4/7)
- [ ] **Data** — experimental data: correct clean-start model, no compatibility
  paths for old rows. (Master1)
- [ ] **Verify** — scoped build, affected specs and changed-file lint during
  authorized implementation; report each separately. (Master5/7)

## 3. Read only the applicable owners

`§Name` is a section heading in the block file or its `NN/` topic folder (the
block file lists its topic files). For a file over 20 KB, list its
headings first and read only the named or needed sections by line range.

| Concern in scope | Blocks · key shared owners |
|---|---|
| Route, shell, layout, width/scroll, sidebar/drawer navigation | UI1 §Global viewport and vertical-scroll ownership, §Authenticated-shell sidebar disclosure; UI3/27/28/29; Master5 · PermissionTree, LayoutComponent |
| Services, envelopes, lookups and cache | UI2/16/28; BE3/5/6/8/10 · ReferenceLookupBindings |
| List, filters, grid menus, action eligibility, complete export | UI4/5/6/7/8/10; BE7/9 · DataTable |
| Dialogs, routed/step/tab editors, draft exit, child completion | UI13 §Shared accessible tabs, §Routed document editor baseline, §Closing a dirty tabbed modal; UI10/11/12/15/28 · EditorDialog, EditorTabs, TabSearch |
| Mock data generation | UI13 §Shared mock-data form assistance · MockDataFieldDirective, mockDataIgnore |
| Editable collections, source-line pickers, document children | UI14; UI13 §Shared source-document line picker; UI18; BE8/14/15/18 · EditableRows |
| Dates, uploads, private files, typed validation, numeric previews | UI14/17/18/19/27; BE2/3/8/15/18 · FileField, FileLink, calendarDaysBetween, toMonthPickerDate |
| Money, currency, VAT allocation, settlement, exact lexemes | UI19; BE3/15 · FinancialNumberPolicy, DocumentCurrencyComponent, TrimIncomingStrings |
| Exact monetary list/journal reads and aggregates | UI5/6/19; BE9 |
| Reports, summaries, footer rows, printing, tab/side-list titles, report context changes | UI20 §Filter bar, §Search: validate, then run, §Tabbed report sections, §Shared summary/KPI cards, §Totals footer, §Export; UI6/8/21/22/28/29; BE2/7/17 · AccountReportConfig, ReportPrintSession, DataTable.footerRows, `.sigma-print-only` |
| Inline report/filter feedback | UI22 · StateMessage.compact |
| Branch-scoped report reads and company-wide exclusions | BE9 · AgreementReturnReportQueries.LatestIdsAsync |
| Domain actions, approval workflow, journals, linked documents | Master4; UI7/9/13/22/26/28; BE8/11/12/14/15/18 · injectApprovalStatusAction, DocumentApprovalCycle |
| Authorization, current-session access, write invariants | UI7/21/26/28; BE6/8/9; Master4/5/7 · PermissionPrerequisites, CapabilityPermissions |
| Permission changes while editors/overlays are mounted | UI13 §Access changes while a body-appended editor is open; UI26/28 · EditorDialog access requirement |
| Concurrent writers, conditional grants, shared catalogs | BE8; Master4/5 · TransactionWriteLock |
| Entity/EF/DTO/mapping/service/controller, transactions, MVC routes, upload paths | BE1–6/8/13–18; Master4/5 · PrivateUploadPath, IReleasesLinksOnRemove |
| Loading, authentication, session and independent write lifetime | UI22 §Mandatory loading conformance gate, §One visible indicator, §Sign-in progress, §Sign-out transition; UI1/2/13/26/28/29 |
| Document journal dialog | UI13 §Shared document-journal read dialog; UI22/26/27/28 · DocumentJournal |
| Presentation, translations, RTL/themes, icons, keyboard/focus | Master5; UI3/4/6/13/14/19/23/24/25/27 · focusField |
| Settings screens | BE16; UI1/13 · `references/settings/README.md` |
| Migrations for authorized implementation | Master1/7 · companion `workflow/implementation-rules.md` |

## 4. Reconcile and hand off

Compare final source with frozen requirements, reference coverage and every
applicable gate. Reconcile producer/consumer types, filters, counts, shared-owner
conformance, action/state and persistence/namespace boundaries. Review the
scoped diff per repository; preserve unrelated work. An authorized screen
implementation includes the owning module's bilingual in-app guide through the
existing reader. Report source conformance, build, tests/lint and pending
runtime acceptance separately. (Master4/5/7; UI23/29)

## 5. Maintain this router

New verified rules go into their owning block. Add a row or keyword to the table
above only for a new concern; never restate a block's rule here. Record the
change in the documentation `CHANGELOG.md` (history before 2026-11-20:
`archive/SKILL_REVISION_HISTORY.md`). Regenerate packets after canonical changes
and rerun both checks. (Master8; companion section 9)
