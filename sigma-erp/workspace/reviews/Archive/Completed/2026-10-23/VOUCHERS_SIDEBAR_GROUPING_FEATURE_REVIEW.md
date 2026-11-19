# Vouchers sidebar grouping

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-21 |

Owner approves the exact proposed five-group Vouchers organization. UI shell
navigation exception, canonical UI1 SidebarMenuComponent/groupHeader and
MenuCatalogService are actual references/owners. Master4/5/7 plus skill apply;
initial all8 recipe checks pass; PHASE05 wiring and PHASE06 source reconciliation.
No backend/grid/DTO/accounting/schema contract changes or new feature route.

Frozen groups under Vouchers (third level is links only): invoices/notes
(Invoice,CreditNote,DebitNote); purchasing/suppliers (PurchaseRequest,
PurchaseOrder,GoodsReceivedNote,Bill,PurchaseReturn); receipts/payments
(Receipt,Payment,CashDeposit); journals/adjustments (JournalVoucher,SalaryVoucher,
Amortization,Provision,MonthlyPosting,Accruals); fees/fines (Tolls,DARB,TrafficFine).
Keep existing leaf titles/icons/tone classes/links, including existing Bill-route
aliases for Accruals/Tolls/DARB, which remain a known preexisting navigation
limitation rather than inventing missing routes. Keep /UserGuide/invoice directly
under Vouchers. Add EN/AR group labels and any missing labels of moved leaves.

Existing Angular two accordion levels (root+group) already support this shape;
no recursive renderer or fourth level. Existing route/search defaults,
explicit disclosure choices/sibling close, internal scroll, keyboard/native
buttons and theme styles remain. MenuCatalog recursively indexes new groups;
leaf identity is URL-based, so leaf pins/recent keep identities. Old Provisions
group disappears when its two children become direct accounting-group leaves;
read compatibility expands that saved group pin into the two same leaf pins
at its old order position, preserving pinned destinations without adding the
whole wider accounting group. Other pin IDs/storage schema stay unchanged.

Conformance: UI1 actual groupHeader selects existing two groups/leaf slots;
MenuCatalog descendantLinks/index visits preserved route leaves;
SidebarShortcuts existing Reports alias precedes local pin normalization.
Guide update in existing Vouchers reader at /UserGuide/invoice, no extra menu.
No subagents: one small sequential catalog/compatibility change, coordination
cost exceeds work. No build/test/lint/browser/runtime/DB/migration/snapshot/
commit/push/deploy. Source AST parsing/inventory and scoped diff only.

## Owner steering — guide per subgroup (supersedes direct-root guide)

Owner requests a guide beneath each second-level Vouchers group for easier
reading. Each group gets its own unique /UserGuide/vouchers-* section through
the existing GuideReader and existing route :sectionId, composed from the same
source-owned existing topics (not duplicate copies). Existing /UserGuide/invoice
remains supported as the full legacy guide and its topic links. New focused
sections have relevant overview/journey and route-filtered topics only; no
invented missing workflows. Existing detailed guides do not yet cover every
legacy leaf, so focused overviews name their group scope without asserting
undocumented screen behavior. Legacy saved general guide pin normalizes to the
new invoices-and-notes guide; leaf feature routes and other pins unchanged.
No new reader, route declaration or runtime source file; existing invoice-guide
exports focused sections and existing reader imports them. Root general guide
link is removed from menu per latest owner instruction.

## Final source reconciliation

Implemented the five approved second-level groups with third-level screen links
only, and final User Guide leaf in each group per latest owner steering. AST
inventory before:21 leaves including original general guide; after:25 leaves,
20 original feature leaves preserved plus5 focused guides. Group leaf counts
including guide:4/6/4/7/4. No unexpected nested group/fourth level. Every original
feature title/URL remains; full menu diff reviewed for icon/tone preservation.
Labels for five groups and User Guide exist EN/AR; repaired previously missing
Arabic moved-leaf labels (deposits/amortization/accruals/tolls/darb/provisions/
monthly posting) without changing their original English/route contracts.

Six edited frontend files: sidebar-menu-data.ts; sidebar-shortcuts.service.ts;
i18n/vocabs/en.ts and ar.ts; UserGuide/content/invoice-guide.ts; existing
UserGuide/components/reader/guide-reader.component.ts. No shared menu renderer,
CSS, API, route declarations, runtime files registration, backend, DTO, domain,
AutoMapper, totals or financial rules changed. No migration required.

Focused GuideSection IDs vouchers-invoices/purchasing/cash/journals/fees registered
with existing reader and all five menu links match. Sections reuse filtered
original topic objects instead of copying Bill/PO/GRN/etc documentation. Legacy
/UserGuide/invoice and existing topic links remain in reader. Scoped overview
explains current destinations where legacy fees/Accrual aliases still point to
Bill. Missing detailed topics of other legacy screens are not invented; this
change organizes available documentation rather than certifying those screens.
Old general guide pin normalizes to the new invoice-group guide; old Provisions
group pin expands to same two leaf destinations; Set de-duplicates existing
pins while preserving order. Other URL-based leaf pins, recent identity and
saved storage keys unchanged. The same SidebarMenuComponent route/search
(default) and explicit-user disclosure state owners remain untouched.

Source-only verification:6 TS createSourceFile parses, zero syntax diagnostics;
static five guide route/ID matches; preserved20 feature title/route pairs;
all moved menu/group keys resolve EN/AR; complete current scoped menu/shortcut/
guide/reader diff and new translation entries reviewed, whitespace check clear
(only existing LF/CRLF informational warnings). No executable tests or app code
execution; no claimed Angular typecheck/build, runtime search/pin or visual pass.
All8 initial recipe Check pass; no canonical rule/packet changed in this feature.
Only scope-specific grouping decisions recorded, no generic engine extraction
needed because existing catalog/disclosure already supports this shape.

Phases: discovery/freeze, navigation integration and final reconciliation;
backend/domain/editor/action phases not applicable. No subagents for this small
single sequential workstream. Existing dirty changes elsewhere preserved.
Owner checks: expand/collapse five groups, active route defaults and user
choices, search by EN/AR screen/group labels and clear, pin old/new links/groups,
all five guide readers including print and Screens tab, minimized/mobile/
short-height/RTL/dark scroll and keyboard. Existing identical /Bill aliases can
activate more than one branch; they are a preexisting route limitation and were
not silently retargeted in a navigation-grouping task.

Suggested commit only: feat(navigation): group vouchers and add focused guides.
No build/tests/lint/browser/runtime/DB/migration/snapshot/commit/push/deploy was run.
