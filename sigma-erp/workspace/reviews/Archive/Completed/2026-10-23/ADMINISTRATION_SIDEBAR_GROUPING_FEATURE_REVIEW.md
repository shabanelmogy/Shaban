# Administration sidebar grouping proposal

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-21 |

Scope: source-read-only grouping proposal in response to the owner's question,
following the same proposal-then-approval flow as Vouchers. No app source edit.
Canonical shape: UI1 shared SidebarMenuComponent two accordion levels plus
MenuCatalogService recursive catalog, already inspected in this conversation;
Master4/5 and sigma-screen-refactor skill apply. Initial all8 packet checks pass.

Actual Administration inventory includes CustomerRequest, existing15-leaf Data
Import group, Branch/Currency/Country/SponserShip/Industry/ContactGroup/
PaymentMethod/CostCenter/EmailTemplates/ChecklistItem/CustomLookup/three reasons/
CorrectVehicleStatus/Role/User/Language/auditTrail/messageLogs/errorLogs/
SaleOrigin/Settings/CustomerProject and general UserGuide/administration link.

Propose seven second-level groups with screen links at level3 only:
1 Company and master data: Branch,Country,SponserShip,Industry.
2 Financial setup: Currency,PaymentMethod,CostCenter.
3 Customers and communication: CustomerRequest,ContactGroup,CustomerProject,
  SaleOrigin,EmailTemplates.
4 Operations and lookups: ChecklistItem,CustomLookup,VehicleNotReadyReason,
  ReplacementReason,VoucherReason,CorrectVehicleStatus.
5 Users and system: User,Role,Language,Settings.
6 Monitoring and logs: auditTrail,messageLogs,errorLogs.
7 Existing Data Import group: all15 existing import links unchanged.

If approved, each group ends with its focused User Guide through existing
reader/topic ownership, preserving all routes/search/leaf pin identities and
existing DataImport group identity. No fourth nesting, backend, schema, rights,
financial rule or screen behavior change. Keep any missing guide details honest
instead of inventing workflows. User/system group is navigation, not an added
permission boundary. Any implementation will freeze exact routes/topics first.
No subagents: one bounded sequential proposal. No build/test/lint/browser/
runtime/DB/migration/snapshot/commit/push/deploy performed.

## Approved implementation handoff (2026-10-21)

Owner says "تمام طبق". Status Frozen for implementation of the seven groups
above and a focused guide last in each. Existing UI1 shared disclosure/catalog,
Master4/5/7 and PHASE05 are the selected owners; all8 initial recipe checks pass.
Keep DataImport original title/path identity and15 screen leaf order; no fourth
level. Original41? inventory to be counted from source AST before edit (do not
assume count). Preserve every existing title/link/icon/tone/exclusion property.

Guide section IDs: admin-company,admin-finance,admin-customers,admin-operations,
admin-system,admin-monitoring,admin-import. Existing administration-guide exports
focused GuideSection projections from ADMINISTRATION_GUIDE.topics, using route
ownership incl Settings child routes and existing imports; existing reader
registers them through :sectionId. Original combined /UserGuide/administration
and topic links remain valid for profile help/legacy. New guides do not copy
screen text or invent undocumented screen actions. Saved old general guide pin
normalizes to admin-system; all existing screen pins/recent keep URL identity,
DataImport group ID unchanged. Add six new bilingual group labels; existing
DataImport/userGuide labels retained. No new source file/tsconfig roots/API/route
config/schema changes. Source syntax/AST inventory/diff checks only; no tests,
build/browser/DB/runtime action. No delegation for this small sequential scope.

## Source implementation and final reconciliation

Implemented owner-approved seven groups; original40 feature leaves preserved
exactly by title/link/icon/tone properties compared to the saved source inventory.
Before41 leaves included the combined guide; after47 leaves:40 features plus7
focused guides. Group sizes including final guide are5/4/6/7/5/4/16. No direct
ungrouped child or fourth-level group. Existing15 import leaf order and original
DataImport title/icon/group identity retained. No leaf screen route changed.

Six files changed: sidebar-menu-data.ts; sidebar-shortcuts.service.ts;
i18n/vocabs/en.ts and ar.ts; UserGuide/content/administration-guide.ts;
UserGuide/components/reader/guide-reader.component.ts. Existing dirty Vouchers,
Bill and unrelated edits preserved. No shared renderer/CSS/DTO/API/domain/
financial/authorization change, no new runtime source file or tsconfig entry.

Guides use existing reader :sectionId and same owning topic objects, selecting
only each group's routes (Settings child topics included). Repeated topics for
the same route use the later specific source topic rather than repeating the
old generic Users topic. Original combined guide remains registered for existing
profile help and topic links. Saved old general-guide pin normalizes to the new
Users/System focused guide; all other feature pins/recent identities untouched.
The existing Vouchers/Reports compatibility rules remain. Common disclosure,
search, sibling close, route defaults and scroll/focus behavior unchanged.

Conformance actual values: existing SidebarMenuComponent renders root group ->
subgroup -> leaf with shared groupHeader and isGroupOpen/toggleGroup; no renderer
extension. MenuCatalogService indexes title-path group IDs and URL leaf IDs
recursively, so new guides have distinct destinations and DataImport ID remains
stable. Shared guide reader retains typed section registry and same print/tab
owners. No duplicate copied screen documentation. Six EN/AR group labels resolve,
all moved/group labels resolve; no duplicate Administration vocabulary keys.

Source checks:6 TS createSourceFile syntax parses clean; static menu property
inventory,7 section IDs/menu destinations and depth checks pass; scoped whitespace
check clean (only existing Git LF/CRLF warnings). Scoped catalog/shortcut/reader/
guide diffs and added translation keys reviewed against source. All8 recipe
checks passed before using PHASE05; no canonical rule/packet change in this task.
No build/typecheck/runtime/browser acceptance is inferred from syntax parsing.

Phases: source discovery, approved contract freeze, navigation integration and
final reconciliation. Backend/write/domain-action phases not applicable. No
subagents because this is one small sequential catalog/guide change. No migration
required. Suggested commit only: feat(navigation): group administration and add
focused user guides. Owner verifies all7 groups, search/clear, active route
opening/user close choices, old pins/recent, imports pin,7 guides and legacy
profile help/print, EN/AR/narrow/short-height/RTL/dark keyboard/internal scroll.
No build/test/lint/browser/runtime/DB/migration/snapshot/commit/push/deploy run.

## Follow-up — explicit screen icons (2026-10-21)

Owner reports sidebar entries without visible icons. Source confirms40
Administration feature/import leaves omit explicit icon metadata and rely on
MenuCatalogService.prepare -> guessMenuIcon; source alone does not establish
that their runtime icon element is blank. All groups/guides already have icons.
Frozen scoped correction: assign semantic installed Bootstrap Icons explicitly
to these40 leaves in existing shared sidebar catalog data; verify Vouchers
explicit icons resolve through current normalizer to installed glyphs. Keep
shared catalog, fallback, template/aria-hidden slots, styles, routes, pins,
translations and all other menus unchanged. No CSS or library repair without
runtime/source evidence. User-guide overview records icon+text navigation.
UI1 actual catalog/leaf/group header and UI24 installed icon set are owners;
all8 recipe checks pass. No subagents for single sequential metadata edit.
No build/test/lint/browser/runtime/DB/migration/snapshot/commit/push/deploy.

### Explicit-icon follow-up result

Added40 semantic Bootstrap Icons to Administration's25 normal feature leaves
and15 import leaves. Both catalog branches now have explicit icon metadata on
all nodes: Administration55 nodes and Vouchers31 nodes (groups/guides included).
Static normalization comparison against installed bootstrap-icons.css confirms
all86 resolve to existing glyphs. Existing toBootstrapIcon/guessMenuIcon,
MenuCatalog, template, CSS and semantic text labels unchanged; appbar consumers
inherit explicit catalog icons. No new colors, icon package or fallback engine.

Changed only existing sidebar-menu-data.ts and administration-guide.ts overview
in this follow-up. AST source syntax parses clean; all40 original title/route
pairs still present; whitespace check clean except existing line-ending notices.
Reviewed semantic assignments in final Administration subtree and existing
Vouchers conversion metadata. Updated in-app combined guide overview; focused
reader paths and content ownership unchanged. Source evidence establishes valid
explicit glyph assignments, not the user's exact prior runtime visual cause or
a browser pass. Owner refreshes and checks both branches in light/dark/RTL.
No migration and no prohibited build/test/lint/browser/runtime/DB/commit action.
Suggested commit only: fix(navigation): define icons for administration entries.
