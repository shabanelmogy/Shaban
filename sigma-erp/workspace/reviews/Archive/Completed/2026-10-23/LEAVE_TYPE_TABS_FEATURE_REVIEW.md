# Leave Type editor tabs — 2026-10-11

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Scope and frozen decisions

Owner request: split Create Leave Type into tabs. Evidence is the written request and current LeaveType details template; no screenshot supplied. UI shape: type 01 controlled modal, fields and one small ordered approver collection, no totals. The shared Create/Edit/View editor receives the same navigation. Backend shape and existing contracts remain unchanged (configuration with ordered children); backend work is excluded.

Four peer sections, initially General: General (name, leaveCategory, gender, maritalStatus); Quota/accrual (leaveQuotaType, leaveQuotaRule, accrualPeriod, accruedOn, leaveStartFrom, noOfLeaves, minLeaves, maxLeaves); Rules/pay (paidDays, halfPaidDays and existing five policy flags); Approvers (existing ordered staff collection, help, read/loading/error/retry states). These are source-supported presentation choices, not new business rules. All values remain in one existing typed FormGroup across tab changes; Add/Update/detail shapes, ordered child snapshot, validation, lookups, Save/Cancel/discard, routes and parent refresh are preserved. Invalid Save activates the first invalid control's tab before shared focusField. Navigation is disabled while saving or either confirmation is pending.

Frontend repository: F:/My Work/Sigma/SiGmaAngularFrontEnd. Scope: LeaveType/components/details/details.component.{ts,html}, leavetype blocks of i18n/vocabs/{en,ar}.ts, and LeaveType topic in UserGuide/content/hrm-leaves-topics.ts. Existing unrelated edits and existing guide/vocabulary edits belong to other work and must be preserved. No broad list/backend review, API, permission, calculation, schema or migration changes.

## Guide and reference evidence before editing

Initial Generate-SigmaRecipes.ps1 -Check: all eight packets current, no refresh needed. Applicable PHASE-03-detail-write; source integration/reconciliation under Master4/5/7 and UI29. Phase0 source discovery and Phase1 presentation contract are recorded here. Phase2 grid, Phase4 domain actions and backend work are unchanged and skipped. No plan needed for this bounded presentation change.

| Concern | Book block | Actual reference/symbol | Shared owner | Target contract |
|---|---|---|---|---|
| Controlled modal | UI13 | EditorDialogComponent public mode/contentPadded/height and template outputs | shared/editor-dialog | Retain current padded modal, min(760px, calc(100dvh - 24px)), fixed actions and controlled close |
| Accessible navigation | UI13/27 | EditorTabsComponent<T>, EditorTab<T>, tabId/panelId/onTabKeydown and HTML/SCSS | shared/editor-tabs | Typed four-key union, underline default, leavetype-editor prefix, matching panel labels, disabled busy gates; shared RTL/Home/End/arrows/theme |
| Scroll ownership | UI1/13 | styles.scss sigma-editor-form/body/scroll | global shared editor shell | Tabs above existing sigma-editor-scroll; no new CSS or second vertical scroll owner |
| Validation focus | UI19/27 | focus-field.ts focusField waits two rendering frames | shared focusField/FieldError | Select corresponding tab then focus existing inputId, keep overlay closed |
| Collection | UI13/14 | Existing approverColumns/EditableRows and collection template | shared editable-collection-table | Preserve full ordered collection, row actions and feedback inside Approvers |
| Bilingual guide | UI23; Master7 | leavetype namespace; hrmLeavesTopics /LeaveType | UserGuide reader | Matching labels/accessible name EN/AR; explain tabs and invalid Save in existing /UserGuide/hrm menu topic |

No new reusable capability is needed: shared EditorTabs already owns navigation, keyboard, labels and themes; feature-owned field-to-tab grouping is specific to LeaveType. No delegation: this small sequential change does not meet the independent-workstream gate.

## Final reconciliation

The presentation contract was Frozen before editing. One recovery refinement: staff loading/error/Retry stays above the active panel in the existing scroll region, visible from every tab, because lookup failure blocks Save regardless of the active tab. Approvers keeps its existing help, empty state, row errors and actions. No request or recovery behavior changed.

| Comparison | Final source evidence / result |
|---|---|
| Shared navigation | EditorTabsComponent is imported and registered in standalone imports; four typed keys match four panel IDs/aria-labelledby values; underline default and currentTab signal; busy and both confirmation gates use public disabled input. Matched. |
| Modal/scroll | Existing EditorDialog height/contentPadded/mode/outputs preserved. Shared tabs precede sigma-editor-body and sole sigma-editor-scroll. No feature CSS; shared keyboard/RTL/dark styling reused unchanged. Matched in source, visual acceptance pending. |
| Controls | Source comparison against original template preserves all ten literal controls, including staffId; quotaNumbers + paymentNumbers preserve all five numeric controls; policyFlags unchanged. One existing parent FormGroup, persistent FormArray and unchanged payload implementation. Matched. |
| Invalid Save | General covers name/category, Quota covers required selects and quota numbers, Policy covers pay numbers, Approvers covers invalid/duplicate/unavailable staff. currentTab switches before existing focusField's two-frame rendering delay. Matched; actual focus pending owner. |
| Existing workflows | Save/close/dirty guard, row order/removal, create/edit/view, route guard and successful parent refresh unchanged. No new API/action/permission or domain rule. |
| Translations | Added editorSections and tabs.general/quota/policy in both leavetype blocks; Approvers reuses leavetype.approvers. Check-Translations.ps1 -Block leavetype reports no missing or case-only keys. |
| User guide | UserGuide/content/hrm-leaves-topics.ts, existing /LeaveType topic under HRM_LEAVES_TOPICS. hrm-guide.ts spreads topics; reader accepts sectionId; existing HRM sidebar entry /UserGuide/hrm. Bilingual additions cover tab grouping, retained values, combined Save, invalid-field focus, busy navigation and keyboard. Other current Leave workflow text preserved. |
| Source diff | Complete details HTML/TS diff and scoped LeaveType vocabulary/guide hunks reviewed in frontend repository; git diff --check passes for all five changed source files. No merge markers in scoped editor/guide. No missing shared exports/input names or post-ES2018 API introduced. |

Files changed by this task (frontend-relative):
- src/app/modules/HRM/Leaves/LeaveType/components/details/details.component.ts
- src/app/modules/HRM/Leaves/LeaveType/components/details/details.component.html
- src/app/modules/i18n/vocabs/en.ts (LeaveType additions only)
- src/app/modules/i18n/vocabs/ar.ts (LeaveType additions only)
- src/app/modules/UserGuide/content/hrm-leaves-topics.ts (LeaveType additions only)

Phase0 discovery, Phase1 presentation freeze, Phase3 editor implementation, Phase5 source integration check and Phase6 scoped reconciliation applied. Phase2 grid and Phase4 domain transitions skipped because unchanged. Backend, API, AutoMapper, calculations and schema untouched; Add-Migration is not required. No Missing/Conflicting/Uncertain requested requirement remains. Existing unrelated working-tree edits in shared guide/vocabularies were preserved and are excluded from this task's ownership.

No subagents used: small sequential work with shared files would add coordination overhead. Existing EditorTabs/EditorDialog/FormSection/FieldError/EditableRows/focusField owners cover reusable behavior; no new shared extraction or canonical-book/skill change qualified. Field grouping is feature-owned. Recipe check remained current; no packet source changed.

Owner verification: compile, then exercise Create/Edit/View tab switching and retained values; try invalid required select, day number and duplicate/missing approver from another tab; check save failure retains all values and lookup failure/Retry remains visible; confirm busy/confirmation navigation gates and dirty Cancel/X/Escape; inspect keyboard/RTL/dark/narrow layout, fixed tabs/footer and internal scroll; open the LeaveType guide in /UserGuide/hrm. Runtime/visual/compiler acceptance is pending, not certified by source checks.

Prohibited commands not run: no build, test, lint, browser/app automation, database, migration, commit, push, deployment, Sigma MCP or Graphify. Possible remaining risk is unverified Angular compilation and runtime/visual integration only.

Suggested frontend commit (stage only the task's hunks): `refactor(leave-type): divide editor into accessible tabs`

## Owner-requested spacing/height amendment — 2026-10-11

Frozen before follow-up edits: owner reports excess internal space, Add misalignment in the last tab, and unnecessary dialog height. This supersedes the initial 760px fixed-height decision above. Use UI13's content-sized alternative: omit height, maxHeight=90dvh, existing flex-fill on form/body/scroll. Keep padded shell/compact shared sections; hide the repeated section headings in the first three tabs through public showHeading=false. Place Approvers in the same compact FormSection with its original hint and one projected shared primary Add action; hide the table's duplicate heading and omit its Add action. Keep current Add disabled predicate, row removal/reordering, validation and view-mode hiding. This uses UI13/14's section-action composition, not new shared CSS. Evidence read: EditorDialog public height/maxHeight and shrinking content; FormSection showHeading/density and action projection; EditableCollection headingVisible/addLabel; Workshop Job editor form-section-actions reference. Existing public controls cover the request; no new extraction, backend or API change.

Additional owner instruction: remove the Leave details message identified by exact text, rendered through leave.provisionalPolicy. Scope extends only to that notice in Leave/components/details/details.component.html; retain business logic, other notices and user-guide explanations.

Initial follow-up recipe -Check: all eight packets current. Same type01 modal editor and backend configuration shape. Phases0/1 scoped amendment, Phase3 implementation and Phase6 source reconciliation apply; grid, domain transitions and backend work remain excluded. No screenshot supplied; exact final appearance is pending owner verification. Follow-up reconciliation pending.

Further owner request freezes a Leave summary presentation change before editing: reduce card height to avoid unnecessary summary scroll. UI24 SummaryCards public compact density (10px/12px padding,32px icons versus comfortable14px/16px,44px) and minCardWidth220 versus260 allow more cards per row. Keep all eight cards/values/order and the saved-type-limit hint; omit the repeated savedSummary hint from each card because the same text already appears once as the summary section description. No maxHeight or hidden overflow is added: retain accessible existing scroll fallback for genuinely small viewports. Current shared SummaryCards types/styles and Leave summary computed source inspected; no local card styles or formula change.

Owner correction supersedes that experiment: preserve text/order and arrange exactly two cards per row with equal heights; only a small space reduction is wanted. Restore original minCardWidth260 and all per-card hints. Add opt-in columns/equalHeight inputs to the existing SummaryCards owner (defaults preserve other consumers), select two columns and equal fractional grid rows for Leave with compact density. Do not hide scrollbars or clip content to make a source-only no-scroll claim. No browser verification is authorized; actual fit is owner-pending. Canonical UI24 and skill must record this public sizing extension and packets must be regenerated.

Final sizing decision supersedes the intermediate compact choice: retain original comfortable density, font/icon sizes, horizontal padding,260px fallback width and every original per-card hint. Add public verticalPadding (null default retains density defaults); Leave selects12px versus original14px, reducing each card by only4px vertically. Final Leave markup selects columns2/equalHeighttrue: eight cards in four equal-height two-card rows. Print releases equal-row sizing. No artificial overflow hiding, data removal or changes to other consumers.

## Follow-up reconciliation

Status remains Implemented — source-only, owner verification pending yes. Complete scoped frontend diffs reviewed (LeaveType HTML/TS, Leave HTML/TS, guide, shared SummaryCards TS/SCSS); unrelated existing Leave layout/state/workflow changes preserved. diff --check passes. No new translation keys: existing Add/section labels and unchanged card labels/hints reused. Public component exports/import registration/inputs and one Add handler match inspected shared declarations. Existing Forms/API/mapping/calculations/schema unchanged; no migration required.

The removed notice's exact key is `leaveReview.provisionalPolicy`. It no longer appears in Leave details. Its vocabulary key remains outside the requested removal. Bilingual /Leave and /LeaveType topics updated in hrm-leaves-topics.ts under existing /UserGuide/hrm route/menu; they cover equal-height two-column cards, Add placement and content-sized modal. Source text matches final behavior; actual layout/reading remains pending.

Follow-up application files: LeaveType/components/details/details.component.{html,ts}; Leave/components/details/details.component.html; shared/components/summary-cards/summary-cards.component.{ts,scss}; UserGuide/content/hrm-leaves-topics.ts. Leave details TS was restored to its pre-follow-up content (per-card hints preserved). Documentation: UI24 and sigma-screen-refactor skill synchronized with columns/equalHeight/verticalPadding; all eight packets regenerated only through generator and -Check passes. Semantic review: shared owner remains canonical, existing size defaults/reference values preserved, no formula/API/new screen shape introduced; UI24 provenance refreshed.

Manual acceptance: compare original comfortable card fonts/icons/text/order; verify two cards each row, uniform heights and small4px/card height reduction; inspect remaining scroll at actual window size and Arabic/narrow screens without clipping; verify Add in the Approvers header, modal auto height/tab switching and fixed actions. No build/test/lint/browser/database/migration/commit/push/deployment/SigmaMCP/Graphify run. No subagents: sequential small scoped changes. Shared-extraction gate satisfied by extending the existing SummaryCards owner rather than feature CSS; optional defaults preserve other consumers.

Suggested frontend commit: `fix(leaves): refine editor spacing and summary card layout`. Suggested documentation commit: `docs(ui-book): document summary card sizing options`.

## Small padding adjustment — 2026-10-11

Frozen before editing: owner still sees a small summary overflow and requests another small reduction. Change only Leave's public verticalPadding12 → 10px (2px per side,4px per card,16px across four rows). Preserve comfortable typography/icons, original text/hints/order, two columns/equal heights, widths and existing scroll fallback. Reuse UI24's existing owner/API; no shared code, backend, schema, validation or workflow change. Guide continues to describe two equal-height cards per row, with slightly reduced spacing. Scope: Leave details HTML, one bilingual guide sentence, current-consumer evidence in UI24/skill and generated packets. No subagent: one small sequential presentation change. Source diff reviewed; diff --check passes. All eight packets regenerated and semantically checked against the same public owner/defaults, then -Check passes. Guide route/menu /UserGuide/hrm unchanged. Phase3 sizing and Phase6 source reconciliation applied; other phases unchanged. No migration or prohibited commands run. Actual window fit/compile/runtime remain owner-pending. Suggested frontend commit: `fix(leaves): slightly reduce summary card padding`.
