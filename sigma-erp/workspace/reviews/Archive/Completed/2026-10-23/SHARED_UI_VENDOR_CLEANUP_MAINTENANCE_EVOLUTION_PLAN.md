| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-22 |
| Authorization | Owner says start implementation after shared dependency review |

# Shared UI vendor cleanup

## Scope and decisions

Implement confirmed slices A/B/C from SHARED_UI_METRONIC_DEPENDENCIES_FEATURE_REVIEW in place. Retain public shared components, selectors, events, option IDs, forms, row/action contracts and current visual hierarchy. PrimeNG owns menu/overlay interaction; Sigma owns reusable presentation. No feature business logic, backend, route/provider/auth/session, DTO, schema, permission, global theme-selector or package-removal changes. Initial frontend worktree is clean at c879ea63.

- A: ActionButton uses one PrimeNG popup Menu per shared component, outside its exported row template. Build translated MenuItem commands from the current row actions at open; recheck current visible/disabled/action membership before execution. Preserve SendActionTemplate/moreActions and DataTable integration. Support trigger switching without stale row capture, native keyboard activation, popup keyboard navigation, Escape/outside dismissal, body append, publisher scroll/resize cleanup and focus return that does not steal a newly opened dialog.
- A: compact ImportCsv uses PrimeNG Popover because it also contains explanatory column content; preserve hidden file input, file-picker click, parsing/download/outputs and noncompact layout. Retain arrow navigation and Escape on actual enabled commands; close after choosing a command. Reuse existing overlay-focus helpers. Root owns shared overlay appearance, theme and print scope; no fake dialog/menu roles.
- B: keep ButtonsComponent/startButtons/endButtons/ButtonModel/buttonsClick. Replace Bootstrap base markup/utilities with native shared layout and PrimeNG button directive; preserve ID, translated labels, tooltips, disabled state, supplied class and semantic primary/secondary/danger/link intent. Links with no navigation remain actions with native disabled semantics. Existing PrimaryActionButton remains unchanged.
- C: introduce Sigma semantic status tokens in both root and dark scopes, preserving current source-supported vendor values. Migrate directly audited shared accent/feedback/error/invalid-number consumers. Keep data-bs-theme as the application theme contract. Keep Bootstrap Icons. Provide a bounded shared accessible visually-hidden utility for the shared components relying on the vendor utility. Do not change global ul reset or feature consumers.
- Retirement: remove DropdownPortalDirective and obsolete portal CSS only after targeted imports and selectors have no remaining consumers. Keep Bootstrap script/CSS/Ngb/packages because wider feature reachability is outside this slice. Legacy ListButtons and report convergence remain deferred until their own contract/reachability reviews; no deletion on assumption.

## Conformance references

| Concern | Book | Actual reference | Shared target / acceptance |
|---|---|---|---|
| Row action pipeline | UI6/7 | DataTable actions → ActionButton export; ActionList<Row> | Same row callbacks/filter/disabled and Actions column; change only menu internals |
| Publisher behavior | UI24/27 | Installed PrimeNG21 Menu/Popover public declarations/implementation; existing ShellHeader/AppbarShortcuts | Use actual model/toggle/show/hide/onShow/onHide/appendTo API; preserve keyboard/focus, dismiss and nested overlay safety |
| Menu geometry/theme | UI24/25 | Existing action toggle25px/min94px; menu min170px, item min34px, existing Sigma tokens | Keep compact geometry, readable labels and actual body-overlay hooks; replace old color forks with Sigma tokens |
| Button groups | UI24 | Buttons current ButtonModel/events; PrimaryActionButton shared contract | Preserve all public IDs/events/tooltips and both groups; no per-screen opt-in |
| Controls and status colors | UI16/19/24/25 | Current root theme/Sass variables, SummaryCards/FieldError/StateMessage/CSV and invalid quantity | Own semantic colors in Sigma root+dark; no data/value/validation changes |
| User guide | Master7 | Existing shared-screen-guidance and data-import topics | EN/AR keyboard/menu behavior through existing reader, no implementation details for users |

## Impact and gates

Shared producers affect existing DataTable lists, CSV workspaces, dynamic button groups, shared summary/errors and quantity appearance. No API or financial impact. Frozen public contracts allow two independent bounded implementation streams: compact CSV owner and button-group owner; root owns ActionButton, global styles/tokens, retirement, guides, canonical learning and final reconciliation. No agents edit the same files.

Verification: source/type/template/API comparison first; exercise rendered row actions (visibility, disabled, correct row after switching, single execution, keyboard/Escape/focus/scroll/body cleanup), compact CSV menu/file-picker/parsing and button semantics. Prior owner authorization to build/test/browser during this development migration remains applicable; no database/commit/push/deploy. Keep actual visual acceptance distinct from source/rendered test evidence. Recipe check all8 OK before work; synchronize owning canonical blocks and skill for new reusable guidance, regenerate/check packets in task.

## Final reconciliation

Implementation completed; verification below applies before the later navigation-policy extension.

| Closure field | Value |
|---|---|
| Status | Closed |
| Owner verification pending | yes |
| Boundary | Scoped shared vendor cleanup; global vendor retirement and subjective visual/print acceptance remain outside this closure |

- Final full suite517/517 passed in67.282s; .angular/shared-vendor-cleanup/full-suite.log. Scoped37/37 also passed. Final production143.300s,2026-10-22T18:55:34.941Z, initial5.74MB; same six existing budget categories, no compilation errors. DataTable emitted CSS16.74kB, lower than prior16.83kB. Scoped final ESLint exit0 and whitespace checks passed.
- Kept shared public selector/event/action/form contracts. Prime Menu and Popover replace both Bootstrap shared dropdown consumers; portal/directive/global portal CSS retired after consumer search. Dynamic Buttons composes existing PrimaryActionButton for primary intent and PrimeNG buttons for other intents; optional native ID/title/class pass-through preserves compatibility. Status tokens and shared accessible-hidden text are independent of vendor imports; rendered comparisons match all four status palettes and feedback shades in both themes.
- Source conformance reviewed across all changed shared owners, root styles, same guide reader and shell focus/drawer cleanup. No feature business/API/route catalog/provider registry/package changes. The global Bootstrap script/styles/Ngb and deferred report/ListButtons reachability remain explicitly outside completed removal.
- UI1/7/24/27/29 and skill synchronized; all8 generated packets regenerated semantically against unchanged phase ownership and final -Check all8 OK. EN/AR common guide plus data-import topics updated in existing guides. Browser inventory has only empty MCP Apps, so direct localhost visual/print acceptance was unavailable; rendered tests are distinct evidence.
- Two gpt-5.6-sol workers owned isolated CSV and Buttons files after contract freeze; root integrated/reviewed and ran checks. No commit/push/deploy/DB/EF migration, vendor patch, diagnostic suppression or budget changes. Suggested frontend commit: refactor: remove Bootstrap runtime from shared command controls. Owner subjective visual acceptance remains pending.

### Publisher API refinement before implementation

Installed Menu.show(event) positions only on overlay entry and reads event.currentTarget synchronously; reusing an already-visible instance for another row cannot safely realign through the public show API. Use one local popup instance in each rendered row template instead of the initially proposed single instance. This retains direct row context, current predicate evaluation and publisher dismissal/keyboard behavior, without custom positioning, synthetic event targets or delayed callbacks. The component's public exported template and table contract stay unchanged. This is a source-supported implementation refinement, not a business/API change.

UI24 primary ownership refinement: ButtonsComponent must compose existing PrimaryActionButton for solid primary intent rather than duplicate its primary CSS. Add only optional buttonId/buttonTitle/buttonClass pass-through inputs to PrimaryActionButton so the original Buttons native ID/title/custom-class contract remains intact. Other intents use PrimeNG buttons. Existing PrimaryActionButton consumers keep their defaults and behavior.

Rendered regression finding: Popover onHide fires before its focused descendant is detached. The existing helper skipped that still-connected descendant, so focus later fell to body. Extend the shared conditional-return helper with an optional closingContainer and restore if focus remains inside it; never restore over a newly chosen external field/dialog. Update its existing header/shortcut Popover consumers together with CSV, preserving their workflows. Menu's publisher keyboard behavior remains its owner. Also retain publisher-managed baseZIndex2000 for command overlays so they clear existing legacy nested-dialog layers instead of reintroducing a fixed manual portal.

Full-suite integration finding: the shell test closes its mobile Drawer then immediately switches desktop, destroying the Drawer during leave. Installed PrimeNG21 Drawer.onDestroy only calls destroyModal while visible is true, so its body mask can remain and block the next screen. Extend scoped shell integration with a small directive that invokes the installed publisher's exported idempotent destroyModal when its own mask still exists on destruction. No global DOM sweep or node_modules patch. Strengthen the actual resize test to assert mask removal; retain Drawer focus/position/dismiss contracts. This is a confirmed runtime cleanup defect discovered during reconciliation.
