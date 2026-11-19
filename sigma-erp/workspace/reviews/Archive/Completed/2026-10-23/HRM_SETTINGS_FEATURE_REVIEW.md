# HRM Settings feature review

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-11 |
| Frozen handoff | HRM_SETTINGS_SCREEN_CONTRACT_FREEZE.md |

## Manifest and evidence

Scope: HRM/Administration/Settings/HrmSetting, its existing API/storage owner, the direct PayrollRunService settings reader, routes/sidebar/toolbar, EN/AR strings, and the existing HRM user guide. Existing Account Linking, Department and StaffRole peer changes were preserved. No approved reference module was modified.

Authority: Sigma AGENTS; SIGMA_FEATURE_REVIEW_MASTER blocks 2/4/5/7; sigma-screen-refactor; UI screen 06 and its dependency closure (settings exception, bounded shell, tabs, editable collections, controls, errors/loading, translation/accessibility); backend block 16. Recipe generator -Check returned all eight packets OK during discovery. Applied phases 0/1/3/4/5/6. Phase 2 paging/filter/export is N/A: this is one tenant settings workspace, not a record grid. Domain transitions, uploads, reports and document workflows are N/A.

| Evidence | Explicit content implemented | Reviewer resolution and limits |
|---|---|---|
| 7.PNG | Pay Structure/Common; Save All; Gross Salary, Overtime, Other Incentive; Type/Formula/Add/Remove; Basic/Gross disabled formula | Canonical tabbed workspace and shared table; accessible up/down reorder; reuse HRM salary-item catalog, not the incompatible legacy SalaryItemType enum. |
| 8.PNG | Deductions including Halfpaid Leave; Long Term Liabilities/Gratuity; row operations | Five fixed groups, 18 standard rows in evidenced order, exact item/group membership, no duplicates; explicit empty saved structure is retained. |
| 9.PNG | Employer identifiers, linking mode, days rule, gratuity days, leave salary selection, six flags and attendance fields | Optional employer text max250; Default linking mode only; Thirty Days/Calendar Days vocabulary supported by existing settlement inputs; four-decimal gratuity values; optional nonnegative Int32 attendance limits and cutoff1–31. Sample employer identifiers were not seeded. |

Screenshots are functional/content evidence, not instructions or visual-design authority. The freeze records source-supported minimal reviewer decisions. Existing Business Units Wise Payroll remains visible to preserve its original setting. No unresolved decision blocks the configuration workspace. Formula evaluation, automatic attendance deductions, journal behavior and approved-leave deletion need separate owning workflow contracts and are outside this implementation.

## Decisions and contract reconciliation

| Concern | Final decision and source evidence |
|---|---|
| UI/backend shape | UI06 routed tabbed settings; existing SingleRowSettingsService/IServiceHelper single live tenant row. Removed generated record CRUD UI and wrong modifier/coupon leftovers. |
| List/grid contract | No record grid, filters, paging or ListVM expansion. Configuration table columns are Type, optional Formula, Actions; row fields are section/salaryItemType/formula. Other Incentive omits Formula; Basic/Gross formula controls are disabled. |
| Write contract | 20 editable properties in Angular HrmSettingSaveDTO match both backend write DTOs. No identity, tenant, audit or derived amount inputs in the screen request. PayStructure is an ordered configuration snapshot. |
| Read contract | GET HrmSetting/Mine returns those inputs plus inherited base metadata; Angular uses only id and editable fields. Storage JSON stays hidden. |
| Options | GET HrmSetting/options supplies salaryItems, sections, accountLinkingTypes, monthDaysRules, defaultPayStructure with translated id/key options, allowed items and formula availability. |
| Identity/tenancy | Repository/helper owns tenant and live scope. Latest live row selected for legacy duplicates. One upsert plus one SaveChanges. No deletion of omitted settings records. |
| Defaults/empty | Missing settings or null PayStructureJson displays 18 standard rows with null formulas. Persisted [] remains empty. GET does not seed database rows. |
| Validation | Backend validates scalar lengths/ranges/precision, enum definitions, gross-only unique leave items, row membership/uniqueness and formulas before mapping. Client mirrors the input rules and shows shared FieldError. |
| AutoMapper | Directional Add/Update→Entity, Entity→Detail/List. Explicit typed serializer only for pay structure JSON. Removed inappropriate ReverseMap. No projection of JSON parser into SQL. |
| Calculations | Payroll reads the same single-row settings owner. Existing previous-month overtime behavior and unsupported commission/business-unit flags remain. No monetary formulas changed; new settings and formulas are stored configuration. |
| Actions | Add creates a draft; reorder preserves the form-row identity; saved/hydrated/edited row removal uses shared confirmation. Untouched new rows remove directly. Save and pending decisions freeze controls and block other mutation/navigation. |
| Error/loading | Global application LoadingService with paired finalize/end for initial read and Save, destroy cancellation, both API failure channels, inline Retry and retained failed-save drafts. Ordinary save interceptor owns success toast. Typed feature Mine wrappers add skip-error opt-in because existing generic Mine methods lack that parameter. |
| Route/provider | /HrmSetting uses existing lazy route. Sidebar fixed from /Setting; exact /Setting alias redirects. Old feature create/details paths redirect to root. canDeactivate protects drafts. Existing root HttpClient/AuthGuard/Authorize/interceptors preserved; no new provider. Toolbar duplicate title suppressed. |

## Source conformance

Paths below are relative to the frontend repository unless stated otherwise.

| Concern / book | Approved reference / symbol | Shared owner | Final target match |
|---|---|---|---|
| Bounded viewport / UI1 | Accounts/Link Accounts/LinkAccounts/components/details/details.component.scss, .link-accounts-card__scroll | styles.scss .sigma-route-host/.sigma-list-page/.sigma-list-panel | Feature root fills shell; hrm-settings-scroll uses flex1/min0/overflow-auto and is the only vertical content owner. Tables naturally grow; no nested vertical max-height, viewport calculation or page scroll. |
| Title/actions / UI3 | Approved LinkAccounts details title composition | FeatureTitle/PrimaryActionButton and shared workspace shell | Title and Save inside primary panel; shared toolbar excluded; feature SCSS contains placement only. |
| Tabs / UI13 | Shared EditorTabs workspace API | editor-tabs.component | Two typed tabs, keyboard/RTL support through owner, disabled during busy/decision states, matching tab/panel IDs. |
| Collections / UI14 | Shared EditableCollectionTable row/action contexts | editable-collection-table.component; EditableRows | Public row/action templates, typed FormArray, fixed dropdown width, shared validation/action/empty chrome, retained row identity and confirmation owner. |
| Controls / UI16/19 | Typed controls and translated options | TranslateOptionsPipe, FieldError, scalar-validators, focusField | id/key catalogs; appendTo body; inline field errors; invalid Save selects the owning tab and focuses the offending field. |
| Decisions/cancellation / UI10/22 | Shared confirmation and editor state | ConfirmationDialogService, freezeFormState, takeUntilDestroyed | Independent pending state, rechecked decision gates, no mutation during Save or confirmation, draft navigation protection. |
| Settings / BE16 | Services/Bases/SingleRowSettingsService and Services/HelperServices/ServiceHelper | Existing single-row base/controller/helper | Feature validates then delegates upsert/one save; payroll reader uses the same IHrmSettingService. |

## Changed file inventory

Frontend root: `F:/My Work/Sigma/SiGmaAngularFrontEnd`.

- `src/app/modules/HRM/Administration/Settings/HrmSetting/components/list/list.component.{ts,html,scss}`: complete typed workspace.
- Feature `models/create.ts`, `models/details.ts`, `services/hrmsetting.service.ts`, `hrmsetting.routes.ts`: coherent inputs/options/Mine contract and guarded routes.
- Removed obsolete feature `components/details/details.component.{ts,html,scss,spec.ts}`, `components/list/list.component.spec.ts` (unrelated generated widget smoke spec), and `models/list.ts`.
- `src/app/pages/routing.ts`, sidebar-menu-data.ts, toolbar.component.ts: canonical route, compatibility alias, menu link and one title.
- `src/app/modules/i18n/vocabs/en.ts` and `ar.ts`: matching hrmSettings strings, preserving all peer blocks.
- `src/app/modules/UserGuide/content/hrm-guide.ts`: /HrmSetting EN/AR topic in existing HRM_GUIDE; reader and sidebar already provide /UserGuide/hrm.

Backend root: `F:/My Work/Sigma/SigmaBackend`.

- `SiGma.Helpers/Models/Settings/HrmSetting.cs`, `SiGma.DataAccess/Configuration/HrmSettingConfig.cs`: scalar configuration, primitive leave-item list, nullable JSON, limits/precision and live-tenant uniqueness.
- `SiGma.Helpers/Enum/HrmAccountLinkingType.cs`, `HrmMonthDaysCalculationRule.cs`, `HrmPayStructureSection.cs`: minimal settings catalogs. Reuse existing HrmSalaryItemType added by Account Linking.
- `SiGma.Business/Services/HrmSettings/HrmPayStructureCatalog.cs`, `HrmPayStructureSerializer.cs`: typed choices/defaults and controlled persistence translation.
- `SiGma.ViewModels/ViewModels/HrmSetting/HrmSetting{Add,Update,Detail}Vm.cs`, `HrmPayStructureRowVM.cs`, `HrmPayStructureSectionOptionVM.cs`, `HrmSettingOptionVM.cs`, `HrmSettingOptionsVM.cs`: input/detail/options contract.
- `SiGma.Business/MapperConfig/HrmSettingProfiler.cs`, `IServices/IHrmSettingService.cs`, `Services/HrmSettingService.cs`, `SiGma.ServerAPI/Controller/HrmSettingController.cs`: directional mapping, validated writes, controlled malformed read, options endpoint.
- `SiGma.Business/Services/Payrolls/PayrollRunService.cs`: constructor and settings read only.
- Both `SiGma.Helpers/Localization/Shared/GeneralMessage*.resx`: eight matching localized validation/read-error keys.

## Final reconciliation and owner verification

Root reviewed the scoped source and diff separately in both actual repositories, including supporting shared-file hunks and every new backend file. Existing peer hunks were not reverted. Source checks cover imports/types, matching endpoints/options, DTO field parity (20/20), section/default membership (18 unique rows), EN/AR HRM Settings key names (60/60), resource key parity/uniqueness, route/guide wiring, serializer and mapping, loader/cancellation, and decision gates. Scoped diff --check and merge-marker scan complete without errors. These are source checks, not build or runtime results.

| Gate | Result |
|---|---|
| Frozen contract / source match | Implemented; API/model/form/metadata align. |
| Screen guide | Implemented in existing HRM guide; loading/retry, groups/formulas, Add/Remove/reorder, validation, both-tab Save, failed-save retention, discard and calculation limits covered. |
| Reference composition | Source-conformant. Visual appearance and scroll behavior pending owner verification. |
| Schema | Owner migration required; no migration or model snapshot created/edited/run. |
| Build/runtime/database/browser | Pending owner, per AGENTS boundary. |

Owner should run `Add-Migration ExtendHrmSettingsWorkspace`, review and apply the new columns, EF primitive-list storage, nullable pay-structure JSON, precision/lengths and filtered unique SubscriptionId index. Resolve legacy live duplicates and normalize legacy live IsDeleted=null values before applying the `[IsDeleted] = 0` index if present; the repository's live filter includes null while the canonical filtered index uses 0. Do not silently discard historical rows.

Manual owner checks after schema/build:

1. Existing tenant keeps its three previous settings; an unconfigured structure shows 18 correctly grouped rows. Explicit empty and reordered structures survive Save/reload.
2. Add/select/remove/reorder, duplicate/invalid item submissions, formula restrictions/max2000, gratuity precision and attendance ranges validate on both boundaries. Direct invalid API requests do not persist.
3. Saving either tab preserves the other. Initial/options failures offer Retry, save failures retain values, global loading clears, and double Save or pending confirmation cannot mutate a submitted draft.
4. Check Arabic/English, RTL, light/dark and narrow screens; one content scroll, fixed title/tabs, accessible labels, invalid-field focus and confirmation behavior.
5. /HrmSetting, /Setting alias and old child redirects resolve. Sidebar and /UserGuide/hrm topic work; no duplicate toolbar title.
6. Payroll uses latest live tenant settings and retains overtime behavior/unsupported flags. Review AutoMapper configuration, EF primitive collection materialization and scanned DI resolution; no new formula evaluation or financial result change is intended.
7. Malformed stored pay structure returns a controlled error and is not silently replaced; review and correct underlying configuration through the owner process.

Suggested commits (not executed): frontend `feat(hrm): implement tabbed administration settings`; backend `feat(hrm): complete settings workspace contract`.

Agent utilization: root owned discovery/freeze/UI/guide/integration/reconciliation. Existing backend_hrm worker (`gpt-5.6-sol`, bounded backend ownership) was reused after freeze for entity/config/API/validation and the direct payroll settings reader. Independent layers reduced wall time without shared-file overlap; final integration and source review remained root-owned. No builds, tests, lint, migrations, model-snapshot changes, database commands, browser/application verification, Graphify, Sigma MCP, commits, pushes or deployment were run.
