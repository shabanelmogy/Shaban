# Job / Job Estimation filter alignment — 2026-10-04

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Scope and frozen decision

The owner requested aligned filter controls in Job and Job Estimation. This is a presentation-only correction in the two existing list templates. Both already project six main fields into the shared FilterPanelComponent. No screenshot was supplied; written request is the functional evidence and source provides the cause. No unresolved business/API decision.

Selected UI shape: type 02, list with routed document editor; only its list-filter presentation is in scope. UI4 approves Workshop/Job/components/list as the list reference and shared/components/filter-panel as the presentation owner. Backend shape is not applicable to this correction. Existing source changes in both templates and elsewhere predate this task and must be preserved.

Freeze: opt both forms into the existing stableLayout input and reserve the existing validationMessages.date feedback below dateRange. Preserve six main columns at desktop width, shared three/one-column responsive rules, advanced filters, actions, 34px control height, themes, RTL and all query behavior. A narrow viewport continues to wrap according to UI4.

## Conformance evidence before implementation

Paths below are relative to F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules.

| Concern | Book | Actual reference / symbol | Shared owner | Target evidence / required match |
|---|---|---|---|---|
| Main-row alignment | UI4; Master5 | shared/components/filter-panel/filter-panel.component.ts: stableLayout; corresponding SCSS stable modifier | FilterPanelComponent | Both forms omit stableLayout; default align-items:end aligns other controls with the bottom of the date field, including its extra error-host grid gap. Set stableLayout=true for align-items:start. |
| Widget widths | UI4 | filter-panel.component.scss: stable dropdown/calendar rules | FilterPanelComponent | Existing public modifier bounds hosts and roots to field width, max-width100%, min-width0; selected labels shrink. Reuse unchanged. |
| Date feedback | UI19 | shared/components/field-error/field-error.component.ts/html/scss: reserveMessage | FieldErrorComponent | Both templates bind dateRange with an unreserved error host. Reserve validationMessages.date; shared invisible translated text owns wrapping, visible message remains role=alert. |
| Responsive / theme / RTL | UI4 | filter-panel.component.scss: main grid, media rules and logical paint properties | FilterPanelComponent | Main columns6; three at max1250px; one at max720px. Controls34px from shared styles. Retain all shared values and feature field order. |

Recipe drift check passed for all generated packets. Applicable packet: PHASE-02-read-grid, presentation slice only. Apply discovery/freeze decisions and scoped final source reconciliation; skip backend, editor, domain-action and runtime-wiring phases because no corresponding contract changes.

## Verification and handoff

Implemented only in Workshop/Job/components/list/list.component.html and Workshop/JobEstimation/components/list/list.component.html: stableLayout=true on each form and reserveMessage=validationMessages.date on each date error host. Final source matches every conformance row above. Both controls use dateRangeValidator, which emits only the shared date error for malformed/incomplete/reversed ranges; its translation exists in both vocabularies. No translation edits were needed.

Reviewed the complete scoped diff against HEAD in the actual frontend repository, distinguishing pre-existing changes from this task's two edits per template. git diff --check passed for both files; merge-marker search found none. Existing public inputs and existing imported components are reused, so no import, type, provider or route change is required. Grid columns/ListVM, filters/query contracts, backend, AutoMapper and domain calculations are unchanged and outside the presentation correction. No migration is required.

Discovery/freeze and PHASE-02 presentation work are complete, with scoped source reconciliation complete. Backend, editor, domain-action and runtime-wiring implementation phases were skipped because this change does not affect them. Visual alignment remains unverified at runtime. No builds, tests, lint, browser/runtime verification, database commands, migrations, commits, pushes or deployments were run. Owner visual verification: compare both lists at desktop width, enter an invalid date and restore a valid range, choose a long customer label, toggle advanced filters, then check narrow widths in Arabic/English and light/dark themes.

No subagents: this small correction reuses one shared capability and does not meet the delegation gate. No new shared extraction or reusable rule is needed; UI4/UI19 and the screen skill already document the capabilities. Suggested frontend commit: `fix(workshop): align job and estimate filter controls`.
