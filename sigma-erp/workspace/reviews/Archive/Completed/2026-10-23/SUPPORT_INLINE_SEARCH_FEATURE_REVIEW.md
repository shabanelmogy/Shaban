| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-14 |

# Support list search and actions

Owner request: SupportSlaAgreement and SupportRequest — «خلى مربع البحث مع الازرار فى صف واحد». Small, explicitly scoped frontend presentation fix. Existing Support feature and support-guide.ts are untracked user/peer work; preserve all existing content. No supplied new screenshots or ambiguous business requirement. Shape: existing paged lists with modal editors; only simple search-filter composition is in scope.

Frozen change: each existing form[appFilterPanel] selects mainColumns=1 and inlineActions=true. Search, Reset and Excel share the input row through the existing FilterPanelComponent. Title Refresh/Create remain with the title; those are separate title actions in the approved Job reference. Keep stableLayout, label association, form/submit/reset/busy/loading, request sections and all actions. No shared defaults or CSS change: user explicitly names two screens, and the public capability already exists. Update each existing topic's search step in EN/AR in the Support in-app guide.

| Concern | Governing block | Actual reference/shared owner | Target/source decision |
|---|---|---|---|
| Simple inline strip | UI4 Compact inline actions; Master4/5 | LinkAccounts details form mainColumns1/inlineActions=true; FilterPanelComponent inputs and host bindings | Both Support list forms select the same public inputs for one unvalidated field, no advanced template |
| Filter semantics and title separation | UI4; Job list form and FeatureTitle | Shared Reset and appFilterActions projection, original feature handlers | Preserve current Reset/Excel/Search actions and title Refresh/Create |
| Geometry | UI4/29 | filter-panel.component.scss inline modifier: minmax(0,1fr) auto, align-items:end; one main track; flex-wrap actions | Input line aligns to34px actions, empty toolbar start hidden; no caption/dense responsive opt-in |
| Responsive/theme/RTL | UI4/29 | Shared720/1250/1199.98 media cascade and global filter tokens | Same inline strip at desktop/intermediate; one field below720; shared disclosure below1200; action wrapping inherited |
| Guide | Master7; UI23 | UserGuide/content/support-guide.ts existing Support topics and reader registration | Update the two search steps in both languages; no new guide route/menu |

PHASE-02 layout composition and PHASE-06 source reconciliation apply. Recipe -Check passed all eight packets; no canonical rule changed or packet regeneration needed. Backend/API/write/domain/integration phases do not apply. No grid/VM, DTO, AutoMapper, calculation or schema change; no migration. No new translation keys or reusable pattern. Subagents not used: three tiny dependent changes do not meet the delegation gate.

Responsive source matrix: >=1250,1200..1249.99,720.01..1199.98 and<=720 retain one main field beside the shared toolbar; below1200 the native disclosure spans the strip and can collapse fields/actions together. Caption and responsiveColumns remain unset, so their stacking overrides are not activated. At narrow widths the action group retains shared wrapping; confirm usable search width and long Arabic labels during owner acceptance at320/390/719/720/721/1199/1200/1249/1250 and intermediate widths, both themes/directions. Source conformance is distinct from pending visual acceptance.

Verification boundary: no new build/test/lint/browser/runtime/database/migration/commit/push/deployment command for this layout task. Previous dev server is user-owned and may automatically observe file edits; no explicit build initiated here. Scoped source baseline/diff, binding exports and guide parity are reviewed before final handoff. Suggested frontend commit: fix(support): align list search and filter actions inline.

Final reconciliation: both list templates now bind mainColumns=1 and inlineActions=true while retaining every original field, action, section, busy binding and event handler. No feature/shared stylesheet or component TS change. Full task-specific diffs of the three untracked files were reviewed using git diff --no-index against the exact pre-edit copies, inside their actual frontend repository; only one form line per screen and one EN/AR search step per guide topic changed. Both HTML templates parsed with the installed Angular parser and guide TS parsed with installed TypeScript: three files, zero syntax errors. Scoped no-index whitespace checks clean; existing LF/CRLF Git normalization warnings are not content defects. Parser/source checks do not prove compilation or rendering.

Guide conformance: SUPPORT_GUIDE remains registered in UserGuide/components/reader/guide-reader.component.ts; /UserGuide/:sectionId routes it at /UserGuide/support. Existing sidebar-menu-data.ts Support guide entry links /UserGuide/support. Topics /SupportRequest and /SupportSlaAgreement explain the inline Reset/Excel/Search arrangement in both English and Arabic. Existing workflow explanations and stable links retained. No Missing/Conflicting requirement; narrow-width/Arabic/theme/keyboard/visual acceptance remains Uncertain until owner inspection. Review above source matrix during acceptance, including input usability when action captions wrap. No backend/API/schema change or Add-Migration required.
