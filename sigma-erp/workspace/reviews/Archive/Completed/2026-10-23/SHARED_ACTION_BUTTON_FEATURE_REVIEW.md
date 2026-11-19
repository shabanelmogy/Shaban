# Shared action menu: first pointer click investigation

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-23 |
| Scope | Source-only diagnosis of the reported second-click requirement; CompanyPartner is the traced consumer |

## Evidence and boundary

The owner reports that action execution requires a second click in approximately all screens, including Companies. No screenshot, runtime trace, or browser reproduction was supplied. Whether the lost click is on the menu trigger or on a command remains uncertain. Application source was not changed.

Selected shape: shared row-action popup Menu (UI7/27), composed by DataTable. CompanyPartner uses the shared table with a stable feature-owned `actions` array. Backend shape and API changes are not applicable to this bounded event-dispatch diagnosis. No domain transition or permission contract is changed.

| Concern | Authority | Actual producer / consumer | Finding |
|---|---|---|---|
| Shared command ownership | UI7 | shared/components/action-button; shared/components/data-table; CompanyPartner/components/list | Company callbacks receive the actual row |
| Menu item lifecycle | UI7/27 | action-button.component.ts:36; action-button.component.html:11 | `menuItems(row)` allocates a new array, item objects and command closures on every template check |
| Publisher rendering | Installed node_modules/primeng/fesm2022/primeng-menu.mjs | Menu uses `NgForOf` over model without a custom trackBy | New item identities cause item views to be replaced |
| Pointer event boundary | UI27/29 | Menu list focus/blur listeners; native item link; itemClick | A native pointer press can move focus before click. Focus/blur change detection can replace the pressed item before the click reaches its command. This is a strong causal explanation, not a runtime-confirmed reproduction |
| Existing verification | UI29 | action-button.component.spec.ts | Tests use programmatic `.click()`; this omits the native pointer-down/focus/pointer-up sequence and cannot rule out this failure |

## Findings and recommended correction

The confirmed defect is unstable menu-item identity across unrelated change-detection passes. It is a strong candidate for the reported lost first command click. The installed publisher's `itemClick` invokes `item.command` on its first enabled click; it contains no intentional first-click-only focus gate.

Keep each rendered row's menu model and item references stable until the row, action membership, translated labels, visibility or disabled state actually changes. Preserve current row identity, language updates, predicate refresh and execution-time membership/visible/disabled guards. Apply the correction in the shared component so all existing consumers inherit it. Do not switch execution to mousedown, duplicate feature handlers, or modify the vendor package.

Runtime confirmation must distinguish trigger opening from command execution and exercise an actual pointer click, row switching, keyboard execution, dynamic predicates and language changes. No browser, build, test, lint or database command was run.

## Packet maintenance and reconciliation

Initial recipe check found stale PHASE-02/03/04/05 packets. Compared their normalized procedure bodies to current templates (unchanged), retained existing manifest reference roles, regenerated these four IDs only through Generate-SigmaRecipes.ps1, and reran the full check successfully. Existing documentation changes predated this investigation; no template, manifest or canonical book was edited. Canonical UI7/27 still own shared popup dispatch and focus behavior; no packet rule was used to invent an API/domain change. PHASE-00 discovery is applicable; implementation phases remain out of scope for this question.

Scoped application repository: SiGmaAngularFrontEnd. Complete diffs for action-button, data-table and CompanyPartner/components/list were empty; scoped diff whitespace check passed. Numerous unrelated working-tree changes were preserved. No backend source, migration, snapshot, translation or user-guide source was edited. No reusable correction has yet been implemented or runtime-verified, so book/skill learning promotion is not applicable.

Subagents were not used: this is one small, sequential shared-component trace. Final runtime cause remains pending owner reproduction; this review does not claim a fix or overall screen completion.

## Authorized correction and frozen handoff — 2026-10-23

The owner subsequently requested “حل المشكلة”, authorizing the bounded shared correction. The diagnosis above is retained as historical evidence. This is a small deterministic lifecycle defect, not a new cross-cutting architecture or domain feature requiring a maintenance plan.

| Decision | Frozen contract and evidence |
|---|---|
| Scope | Existing ActionButton TS/template/spec, the existing shared user-guide topic, UI7 and skill learning entry, generated dependent packets, this review |
| Model lifetime | Cache by actual row popup Menu instance in a WeakMap, so independent row views cannot overwrite each other and destroyed views are collectible |
| Stable render | Reuse array/item identities while row/action/label/icon/disabled values match; regenerate changed entries only; recompute visibility and disabled predicates on each check to preserve mutable-row and signal behavior |
| Dispatch | Keep native click/keyboard publisher dispatch and current actual-row membership/visibility/disabled guards; no timers or pointer-down execution |
| Public compatibility | Preserve exported actionTemplate, optional direct row, ActionList and DataTable contracts; no feature opt-in or Company-specific edits |
| Verification | Add source regression coverage for focus between pointer-down and click, live predicates, translation and stale commands. Do not run builds/tests/browser under the standing source-only boundary |
| Guide | Update existing bilingual shared-screen guidance used by module guides; no second reader or new module entry |

The conformance table above is the pre-edit reference comparison. Its shared lifecycle finding is the only approved behavior correction; popup layout, keyboard/focus ownership, action set and backend contracts retain their existing owners. Handoff: **Frozen**. No material business/API decision is missing. No delegation: one tightly coupled shared lifecycle change.

## Implementation and final reconciliation — 2026-10-23

Implemented the frozen correction in the existing shared component. `menuItems(row, menu)` evaluates the current visible actions and presentation on every check but returns the cached model and items when unchanged. A WeakMap keyed by the actual rendered Menu isolates all exported row templates and direct-row consumers and permits collection when their views disappear. Actual row identity, action identity, translated label, icon and disabled state participate in reuse; command closures retain the original execution-time membership/visibility/disabled checks.

| Final comparison | Source result |
|---|---|
| Focus updates ↔ popup item identity | Match: unchanged models return the exact same array and MenuItem objects; the publisher no longer receives fresh item identities for unrelated checks |
| Current state ↔ displayed availability | Match: no snapshot-only cache; visible/disabled predicates still run on checks, including mutable row changes and signal-driven busy changes |
| Translation ↔ menu labels | Match: current `TranslateService.instant` value participates in equality; both translation replacement and language switching are covered in regression sources |
| Command ↔ row/action ownership | Match: row popup instances have separate weak cache keys; changed row/action identity replaces the captured command; original guard remains |
| Keyboard/focus/style ↔ UI7/27 | Match: publisher toggle/show/click/keyboard and shared focus return unchanged; no CSS, layout, responsive or theme values changed |
| DataTable/direct embedding ↔ public contracts | Match: same template export, optional row and typed feature ActionList; only internal template method receives its own Menu reference |
| User guide ↔ final interaction | Match: shared bilingual overview explains opening the menu then choosing a command once, arrows/Enter/Escape and existing confirmation/unavailable behavior |

### Files changed by this correction

- `SiGmaAngularFrontEnd/src/app/modules/shared/components/action-button/action-button.component.ts`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/action-button/action-button.component.html`
- `SiGmaAngularFrontEnd/src/app/modules/shared/components/action-button/action-button.component.spec.ts`
- `SiGmaAngularFrontEnd/src/app/modules/UserGuide/content/shared-screen-guidance.ts` — only the new Actions paragraph; pre-existing numeric/cache paragraphs preserved.
- Canonical `sigma-erp/ui/07-action-button-cycle.md`, workspace `.agents/skills/sigma-screen-refactor/SKILL.md` rule/revision row, generator-owned PHASE-02 and PHASE-04 packets, and this review.

The guide uses the existing `GuideReaderComponent.sharedScreenGuidance` overview loop. Customers remains registered by `content/customers-guide.ts` at `/UserGuide/customers`, linked from `app/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts`; the same shared overview appears in the existing other module guides. No new reader, route or menu entry was needed.

### Verification and handoff

Reviewed the complete scoped frontend diff, including preserving the pre-existing guide edits; checked template method/signature and imports against the existing Menu API, absence of merge markers and scoped whitespace. Added regression sources for first pressed-link survival through focus, exactly-once command, stale enabled-command rejection, live disabled state, translation/language changes and action replacement; strengthened the existing direct-row test with link identity after focus. Existing tests retain row switching, disabled/hidden actions, keyboard/Escape, external focus and popup destruction coverage. These tests were **not run**.

Canonical UI7/skill learning and existing bilingual guide are synchronized. Regenerated only PHASE-02-read-grid and PHASE-04-domain-actions after the UI7 change, reviewed their derivative source/reference roles (no new domain rule), and the full recipe check passed. Documentation scoped diff whitespace check passed. Existing unrelated documentation/application changes were preserved.

Phases: discovery and frozen bounded handoff; Phase 2 shared row-menu lifecycle; Phase 6 scoped reconciliation. Backend/DTO/EF, editor writes, domain transitions and runtime wiring phases are not applicable: their contracts were unchanged. No schema, mapping, calculation, permission or API changes; no migration required. No build, test, lint, browser, database, commit, push or deployment command was run. No subagents: the change is small and shares one lifecycle owner.

Owner verification pending: build and run the action-menu specs; in Companies use an actual mouse to open Actions and choose View/Edit on the first command click, switch rows, use keyboard and check confirmations still appear for destructive commands. Confirm light/dark and RTL/LTR presentation remains intact. Synthetic regression sources and source inspection do not establish runtime success or prove that this was the only cause of the original report.

Suggested frontend commit (only this correction's four frontend files): `fix(action-menu): preserve items across focus changes`.
Suggested documentation commit (owning UI7 and two regenerated packets only): `docs(ui-book): document stable action menu models`.

### Follow-up editor diagnostic — 2026-10-23

Owner supplied ngtsc2554 at action-button.component.html:11, reporting one expected argument against the two-argument `menuItems(row, menu)` call. Re-read the exact saved TS/template and direct DataTable import: saved `ActionButtonComponent.menuItems(row: unknown, menu: Menu)` at TS:43 and HTML:11 already agree. No additional source correction is justified by the current files. An older unsaved TS editor buffer or stale Angular language-service state is a plausible explanation, not a confirmed compiler finding. Save both files and reload the editor before reassessing. No build/test/browser was run; packet check remains successful. Original owner runtime verification remains pending.

### Test-type diagnostic correction — frozen bounded decision, 2026-10-23

The owner supplied TS2593/2503/2304 for describe, it, beforeEach, afterEach, expect and jasmine, all in the action-button spec. These are distinct from the earlier template-arity diagnostic. The actual tsconfig.spec.json already includes src/**/*.spec.ts with types:[jasmine]; @types/jasmine is declared and installed. No Jest/Mocha package or application-global test types are needed. Frozen correction: add a Jasmine type-reference directive to this specific spec so its existing runner globals resolve even when the editor checks it outside the intended test project. Preserve the application compile boundary and existing runner/configuration. The exact editor project-association cause remains unconfirmed; this is a source-level type dependency correction, not evidence that tests pass. Authority: UI1/29 test/application separation; no user-guide interaction or canonical pattern changes are introduced.

Implemented the explicit `/// <reference types="jasmine" />` at the top of the affected spec. Read-only TypeScript configuration parsing returned zero config errors, included this spec, retained types:[jasmine], and resolved Jasmine to the installed node_modules/@types/jasmine/index.d.ts. This dependency-resolution check does not compile the app or execute/type-check tests. Reviewed the added directive against the existing scoped spec diff; scoped diff whitespace passed. No config, dependency, runtime component, user-guide, book or generated packet changed for this follow-up; the initial recipe check passed. No build/test/lint/browser was run. Suggested frontend commit for this follow-up: `fix(action-menu): reference jasmine types in regression spec`. Editor diagnostic refresh and actual test execution remain pending owner verification.
