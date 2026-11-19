# Languages Angular implementation notes — 2026-10-17

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

## Scope and authority

Applied F:/My Work/Sigma/AGENTS.md, sigma-screen-refactor skill, canonical UI shape01 (Job list), UI1/3–10/13/16/19/22–29, and phase02/03/04 packets after root's passing recipe drift check. Source comparisons read Workshop/Job/components/list/list.component.ts and shared EditorDialog TS/HTML/SCSS before editing. Frozen contract LANGUAGES_DATABASE_CONTRACT_FREEZE.md supersedes historical plan API proposals; D1–D8 remain approved. Root owns phase05/06 integration, shared documentation promotion and final overall reconciliation.

## Actual conformance

| Concern | Reference/shared owner | Target source and result |
|---|---|---|
| List shell and title | UI1/3/6, Job list, FeatureTitle/DataTable | Both lists use sigma-route-host → sigma-list-page/panel/header/table; fill=true; no feature stylesheet. Actions use shared menu before data columns. |
| Read requests and pager | UI4/6/22/28, Job bindListQueries | Typed Subject/switchMap/defer, applied snapshots, resolveListPaging before signals, 15 initial size and10/15/20/50/100. Lazy changes replace an active read; mutation/editor sessions remain locked. Global list loader ends in finalize. |
| Filters/options | UI4/16/19, FilterPanel/FieldError | stableLayout, mandatory Reset, searchable body dropdowns for base/target/source, confirmed composite LanguageOptions; null missing choices; max256 Search with validation and invalid-field focus. |
| Export | UI8, fetchAllPages/dataTableExportRows | Full applied language list; click-time translated headers plus all possible status labels; dateTime formatter. No local code inference; cultureCode is authoritative. |
| Controlled definition dialog | UI10/13/19, EditorDialog | Existing create/view/edit dialog retained; cultureCode required/max32; languageName required/max250; searchable name/flag controls; built-in virtual IDs supported for View and locked for mutations. |
| Text dialog | UI10/13/19/22/28, EditorDialog/FieldError/Confirmation | Fixed key session≤50000 from Keys; one detail read per position, key subtitle, source/base/target context,4000 character textarea, full placeholder hints; source remains plain interpolation. Previous discards only after confirmation; Save&Next saves then refreshes then reads next key; Save&Close closes only after refresh success. |
| Confirmation and mutation | UI7/9/10, ConfirmationDialogService | Delete releases its own pending flag before mutation; default obtains current settingsVersion before confirmation; Reset releases confirmation freeze then acquires separate mutation freeze. Server enforces authoritative usage/default/built-in rules. |
| Failure recovery | UI22/28 | Declared + transport failures handled inline.409 preserves text draft and disables write until Reload with dirty confirmation. Committed Save/Reset state permits only runtime retry, never repeating the write. Saved next-detail failure offers read Retry. All subscriptions lifetime bounded. |
| Shared footer extension | UI13/24/25, existing shared shell | Optional readonly EditorDialogFooterAction[] {id,label,icon?,disabled?}, default[]; footerActionRequested:string. Uses existing secondary-button styles, preserving prior footer/default actions. Shared actions wrap with min-width0/justify-end and existing8px gap; shared RTL chevrons mirrored. No feature footer/CSS copy. |
| Guide | Master7, existing Administration reader | UserGuide/content/languages-topic.ts now covers definitions/default/locks/text filters/direct empty vs fallback/navigation/conflict/reset/retry/owner setup in EN/AR. Existing /UserGuide/administration route/menu retained; texts reachable /Language/texts. |

## Grid / DTO parity

Language columns: Actions, flag, languageName, cultureCode, isBuiltIn, isDefault, createdBy, isActive, createdAt (date/time). DTO fields exactly these data fields plus id for actions; null built-in audit values remain empty. No fabricated creator/time. Text columns: Actions, key, baseValue, targetValue; version/hasOverride/needsReview exist only as action/detail state. No tenant metadata sent by browser. Language Add only languageName/flag/cultureCode; Update adds id. Text write only targetLanguageCode/source/key/value/expectedVersion.

## Source review and integration

Inspected full scoped tracked diff and new model/text component files; checked actual shared named exports, public input types and standalone imports. No new permissions, authorization claims, browser storage or manual token wiring. New texts route declares canDeactivate; list's existing route retains it. New languageManagementEn/Ar vocab objects require root integration at locale.data.languageManagement in en.ts/ar.ts. Runtime consumes shared LanguageService.getOptions and models/options.ts; all mutations consume TranslationService.refreshRuntime(): Observable<boolean>. Root regenerates the extraction catalog after dictionaries integrate. Explicit tsconfig roots unchanged under UI29 G17; no compiler diagnostic authorizes adding roots.

Shared documentation promotion wording: UI13/24 should describe optional typed footer actions with stable id, translated label, optional icon and disabled state, emitted id only; consumer owns business actions/pending guards. Existing defaults unchanged. Shared action group uses flex-wrap/min-width0/justify-end with existing8px gap; previous/next chevrons mirror in RTL. Add matching skill digest/history row and regenerate affected packets through generator; root owns this promotion.

## Pending owner verification

Build/runtime/browser/database acceptance has not run. Owner must verify built-in views/locks; code uniqueness/use rules; applied paging during a pending read; full Excel statuses/date/time; sources and direct-empty filtering; Previous/Save&Next across a page boundary and emptied results;409 Reload; reset confirmation; saved-but-refresh-failed retry without duplicate writes; next-detail failure retry; narrow/RTL/dark/footer wrapping/keyboard/focus; tenant/logout/runtime behavior after owner migration and catalog import. Root reports migration name and end-to-end deployment boundaries.

No builds, tests, lint, browser automation, database commands, migrations, commits or pushes were run by this workstream.

Root integration corrections: runtime/languageManagement vocab imports registered in EN/AR; flag input max100 matches write boundary; editable shared name dropdown permits valid cultures absent from historical catalog; RTL chevron mirroring moved from host-context to the global body-overlay owner. Full reconciliation is LANGUAGES_FULL_STACK_REVIEW.md.

