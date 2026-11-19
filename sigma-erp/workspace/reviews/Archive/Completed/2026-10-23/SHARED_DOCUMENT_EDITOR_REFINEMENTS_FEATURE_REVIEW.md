| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

# Shared document editor refinements — 2026-10-15

Owner request: consolidate the Purchase Requests refinements for implementation in similar screens. This task maintains the authoritative books, their skill digest, screen navigation and generated Phase3 workflow; it does not bulk-refactor application screens or copy Purchase Request business rules.

## Frozen documentation scope and evidence

| Concern | Canonical owner | Actual implementation evidence | Generalization |
|---|---|---|---|
| Peer sections | UI13 | PurchaseRequestDetailsComponent tabs/basic/details/documents; shared EditorTabs | Default to separate peer tabs in comparable routed documents, only for sections that exist; preserve ordered-step/special shapes |
| Header choices | UI13/16 | FormSection header projection; PrimeNG numeric radios and enumOptions | Compact beside-title single-choice group when the discriminator is singular; no independent booleans |
| Header row/Notes | UI1 | sigma-editor-grid public columns6/5; Notes full span | Dense wide first row, discount among short header inputs, Notes separate; feature chooses fitting count, shared responsive fallback |
| Card edges | UI3 | workspace modifier/styles and no FormSection mx-2 | Equal sibling title/choices/tabs/content/summary/footer region edges |
| Scroll | UI14 | bounded pane/fill table/sticky frame | Complete height chain, frame owns both axes, enough-row acceptance required |
| Totals/footer gap | UI24 | SummaryCards slim/row/min140/max80 host mb-2; fixed footer | Reuse public density/placement, small host gap before footer without duplicating existing parent gap |
| Conditional validation | UI16/BE8 | Parent enum row revalidation and PurchaseRequestService preparation helper | Freeze type-field matrix, apply immediate UI and server validation, retain valid draft values |
| Output/guards | UI13/21 | PrintSession printing mounts all sections; persistent parent form/tracker | Every saved section prints, invalid-tab selection and busy/dirty/upload guards persist |

Initial generator -Check passed all eight packets. Existing source/book/packet changes are preserved. Phase3 is the owning execution handoff; the screen02 navigation points to canonical rules without owning duplicates. No new plan or application implementation is necessary for this documentation-only generalization. No subagents: one tightly connected documentation contract.

## Boundary

Do not generalize General/Stock/Asset enum members, field-specific requiredness, required UOM persistence, tax/discount formulas, linked edit locks or approval/Create PO deferrals. Similar screens keep their own frozen domain/API contract. Existing shared presentation fixes already affect their consumers; this task establishes adoption/verification requirements for future in-scope implementation/reviews and does not claim all existing screens have been migrated.

## Final source reconciliation

UI13 now owns one combined11-row implementation/conformance checklist and promotes peer-section tabs to the default for comparable documents under the owner's generalization. UI1 owns dense row/Notes placement, UI24 owns the totals/footer gap, UI16 owns radio identity/conditional UI agreement, and BE8 owns conditional server validation. Existing UI3 card-edge and UI14 full scroll-chain rules are referenced rather than duplicated. Skill §2.5/§5.2 and revision history match; its special repeated-group workspace is explicitly distinguished from peer-section tabs. Screen02 links to the owning checklist, and the Phase3 template now requires applicability/evidence plus a presentation reconciliation output.

All eight packets regenerated through Generate-SigmaRecipes.ps1; final -Check passed all eight. Scoped documentation/template whitespace checks passed. Reviewed canonical changes, skill digest and generated Phase3 text for matching ownership/constraints; generated semantic content change is the intended Phase3 procedure/output addition, with other packet changes reflecting source fingerprints. Existing UI0/UI1/UI3/UI5/UI13/UI14/UI19 changes were preserved. No generated file was edited directly. No application source, in-app help, business contracts, configuration, entities, mappings, migrations or snapshots were changed in this documentation-only follow-up.

Applied documentation governance, canonical rule consolidation and Phase3 recipe maintenance; application implementation/runtime phases are Not Applicable. No runtime/visual acceptance is implied by documentation checks. Existing Purchase Requests implementation remains source-only; actual compilation, row-overflow/print and all relevant viewport/RTL/theme checks remain owner pending. No builds/tests/lint/browser/database/migrations/commits/pushes/deployment ran. No migration needed. Suggested documentation commit: `docs(ui): consolidate comparable document editor refinements`.
