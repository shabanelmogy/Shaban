| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-18 |
| Plan | CURRENT_BRANCH_DEFAULTS_MAINTENANCE_EVOLUTION_PLAN.md |

# Current branch defaults — implementation handoff

Existing GET/PUT `CurrentBranch/Mine` retain the historical API contract. Add authenticated `GET CurrentBranch/Options` returning `Results<CurrentBranchOptionVM>` (`id:int,name:string,branchCode:string?,branchCode2:string?`), active/nondeleted tenant branches ordered Name/Id. Read-only select projection; no map/entity/schema change, no role/branch restrictions. One class per file.

Frontend root service at `modules/shared/service/current-branch.service.ts` owns load/session isolation/options/preference/save. Public API: `defaultBranchId():number|null`; `applyDefault(control:AbstractControl|null):void` fills only empty enabled pristine controls without marking dirty. Consumers invoke it only for eligible Create defaults; initial filters may initialize from defaultBranchId directly. Numeric/string/array contracts remain explicit. Parent/record/route/manual values win; stock-transfer source and destination stay distinct. Content mounts after initial load settles. Later switches do not silently rewrite existing screens.

State: `branch` signal of `{branchId:number,branchName:string}|null`; `options` signal of `{id:number,name:string,branchCode:string|null,branchCode2:string|null}[]`; initialized/loading/saving/loadError state. `load():Observable<boolean>`, `change(option):Observable<boolean>`. Options+Mine resolve once per authenticated session, with inline retry for load failures. Fallback to a matching login branch only; never first branch. Commit only successful matching-session server responses. Same branch is a no-op; serialize saves; failures retain previous state and release busy.

Source ownership for consumers is assigned by the root before delegation. No consumer edits root service, navbar, layout, guides, vocabularies, canonical books or backend. Each worker returns actual files, mode/role inventory, excluded controls and evidence; no builds/tests/lint/browser/database/migrations/commits. Root reviews all changes.

Owner explicitly deferred permissions and requested a default in every screen with a branch choice. No implicit request filter, forced branch on writes, role/allowed-branch enforcement, identity changes or new financial effects. Changing branch is blocked until an open editor is saved/closed. Existing guides and UI26 still describe authentication/configuration only until the separate authorization work ships.

## Dated consumer reconciliation — 2026-10-18

`filterBranchId(ParamMap,key='branchId')` is the shared numeric filter hydration owner: explicit positive ID wins; explicit empty/invalid means null; absent branch plus pageNo is restored-cleared; a fresh URL uses defaultBranchId. Existing full-state markers stay with their screens. The eight legacy voucher branch-name selectors use names and backend-supported `branch.name` string predicates, not numbers in a name filter. CreditNote editor remains numeric (actual options/DTO), correcting the legacy placeholder inference during review. Visible editor checks use canonical rendered boundaries; LinkAccounts adds a data-branch-editor marker. These clarifications preserve the frozen default-only semantics; no new permission or persisted-data contract is introduced.

### Final exact-filter correction (2026-10-18)

Source reconciliation supersedes the intermediate eight-voucher name-filter choice above: generic string predicates use Contains, so similar branch names can match more than the selected branch. All eight existing entities/APIs already support numeric BranchId equality. Their branch dropdowns therefore use form/template/advanced-control key `branchId`, numeric option ids and `defaultBranchId()`, with the initialized form sent on the first query. This is a deterministic identity/predicate correction using the existing API contract, not a new business policy or authorization scope. Historical initial findings remain visible above; final source/report use the exact-id contract.

### Compiler feedback — actual Booking parent shape (2026-10-18)

Owner compilation proves BookingListDTO has no branchId. The Booking deposit therefore receives the working default without reading or inventing a parent branch field. Parent precedence applies only where that field exists in the real contract (Rental/Lease agreement deposits). Individual uses its existing mode() signal, and four voucher branch option declarations/controls are explicitly numeric. No shared API, schema or permission contract changes; see the feature-review compiler amendment.

### Owner runtime feedback — stable topbar editor guard (2026-10-20)

Owner Console reports NG0100 in NavbarComponent disabled false↔true when opening Bill. Source confirms branchChangeBlocked and aria/title/reason template bindings call hasOpenEditor(), whose DOM query changes as the outlet/dialogs mount/unmount during the same render. Freeze a root-owned readonly editorOpen signal for presentation, refreshed from the existing rendered-boundary predicate only after rendering via installed Angular17 afterRender(Read) plus one coalesced deferred microtask. Re-read before publishing, publish in NgZone only on change, and suppress pending callbacks after DestroyRef cleanup. No template directly queries the editor DOM. Keep hasOpenEditor() synchronous and unchanged in change()/Retry action guards, so no interim display snapshot can permit a switch over an actual open editor. No weakening of save/dirty/session/default/authorization or API contracts.

The same Console reports missing media/patterns/header-bg.jpg. ThemeModeService generates light/dark URLs absent from the asset tree. Remove these failed image assignments and clear only the body's inline background-image when applying a theme; existing shared CSS owns the already-visible theme surfaces. Do not create/copy decorative assets or change saved theme preferences. Bilingual shared guide and existing owner UI1/skill guidance will record stable rendered editor blocking; runtime acceptance remains owner-pending. No migration/backend change.
