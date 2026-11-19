# Email Templates — Feature Review

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-17 |

## Manifest
Requested outcome: review emailTemplates and apply documented corrections with supplied functional screenshots. Source: SiGmaAngularFrontEnd/src/app/modules/Administration/emailTemplates and directly related backend EmailTemplate files. Selected shapes: UI screen06 keyed settings workspace; BE16 several rows, one key per Save. Frozen plan and contract prepared before source edits. Applicable packets PLAN00, PHASE00/01/03/05/06; initial -Check all eight OK. Phases2/4 N/A (no list or domain action). Exclusions: unrelated settings, mail delivery and token substitution, existing dirty tree changes, migrations/snapshots/builds/tests/lint/DB/browser/commits/push/deployment.

Both repositories contain many pre-existing unrelated changes, including i18n EN/AR, Administration guide and toolbar (frontend), backend localization, other services and an existing migration/snapshot. Preserve all. Email-template target files initially clean. Shared edited owners will receive only minimal relevant additions; compare task-start snapshots on handoff.

## Pre-implementation conformance
| Concern | Book | Reference actual symbol | Shared owner / target match |
|---|---|---|---|
| Workspace bounds | UI1/3 | LinkAccounts DetailsComponent host and sigma-list-panel--workspace; card__scroll | sigma-route-host/list shell; target one content viewport, fixed title/Save/selector |
| Title/actions | UI3/24 | LinkAccounts FeatureTitle + PrimaryActionButton | Same public owners; manual Save, no Save All since one template |
| Logical sections | UI1/13 | FormSectionComponent title/description/icon/content | Headers, token list and rich text only; no business tabs exist |
| Typed options | UI16 | LinkAccounts getOptions | Server metadata id/key/dataFields, number IDs; no EnumToArrayPipe |
| Errors/loading | UI22/28 | LinkAccounts getAccounts/saveAll Result guards/finalize | StateMessage/apiErrorMessage; canceled stale reads; one global loading owner |
| Discard | UI10 | LinkAccounts canDeactivate; freezeFormState and confirmDiscard current shared API | Deferred guard plus selector decision, snapshot controls |
| Validation | UI19/27 | FieldError + focusField | Typed required/length/header-list/body checks; first invalid field |
| Settings persistence | BE16 | EmailTemplateService UpdateEmailTemplateAsync | UpsertByKeyAsync and one save; retained key scope, no deletion |
| Mapping | BE3/4 | Existing profile/VM audit | Remove AddBaseVm and ReverseMap; explicit lean read |
| Reports/grid/print/domain actions | Master4 | None in target | N/A; do not add speculative actions |

## Functional screenshot evidence
Common metadata: screen Email Templates/settings edit; locale English/LTR, desktop approx1690–1713px wide; role/capture date/version unknown. Supplied on2026-10-17, functional/content evidence, not visual acceptance. All images show a selector, Data Fields, Subject (required marker), optional CC/BCC, rich-text body and Save except image0 whose open selector covers the left fields. Static screenshots do not prove validation limits, send behavior or permissions.


### E0 — 0.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E0: All19Types | Explicit | 19 template labels/options and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Strong inference | Selection loads selected key | 1 | Preserve saved values; never seed samples or infer permission |

### E1 — 1.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E1: ServiceAlert | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E2 — 1.PNG
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E2: ServiceAlert | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E3 — 2.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E3: RentalAgreementOpening | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E4 — 3.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E4: RentalAgreementClosing | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E5 — 4.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E5: LeaseAgreementOpening | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E6 — 5.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E6: LeaseAgreementClosing | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E7 — 6.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E7: TrafficFineCustomerDetail | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E8 — 7.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E8: TrafficFineEmployeeDetail | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E9 — 8.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E9: JobEstimationCreation | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E10 — 9.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E10: VehicleCheckCard | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E11 — 10.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E11: NewCreditNote | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E12 — 11.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E12: UnInvoicedExcessDamage | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E13 — 12.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E13: RentalBooking | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E14 — 13.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E14: CreditCardPayment | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E15 — 14.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E15: RentalBookingCancellation | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E16 — 15.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E16: RentalBookingConfirmation | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E17 — 16.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E17: RentalBookingConfirmationWithPaymentLink | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E18 — 17.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E18: PaymentConfirmationEmailAfterRentalBooking | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E19 — 18.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E19: ServiceBookingCreation | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

### E20 — 19.jpg
| Evidence | Classification | Required behavior | Phase | Guide implementation |
|---|---|---|---|---|
| E20: PaymentReminderBeforePromisedDate | Explicit | Type-specific literal tokens, Subject/CC/BCC, HTML body and manual Save | 0/1/3 | Frozen server catalog + typed settings form/shared controls |
| Samples/state | Uncertain | Sample subjects/bodies are existing content; disabled Save does not prove access restrictions | 1 | Preserve saved values; never seed samples or infer permission |

## Findings before implementation
Missing headers and token metadata; six missing types; enum ordinal fragility; unvalidated blind Save; no failure recovery/readiness/dirty guard; legacy wrappers/no inner title/unbounded body. Confirmed findings implemented; final reconciliation follows.

## Final reconciliation — 2026-10-17

Outcome: Implemented — source-only. No required unresolved Missing/Conflicting/Uncertain contract remains. Visual/runtime/database acceptance is pending. The plan and handoff remain historical Frozen records; a dated contract addendum records the HTML preservation repair.

### Decisions and final source evidence
| Concern | Producer / consumer and compared rule | Result |
|---|---|---|
| Canonical shape | LinkAccounts DetailsComponent -> EmailTemplatesComponent: sigma-route-host, sigma-list-page/panel--workspace/header, FeatureTitle/PrimaryActionButton; title/Save/selector outside single sigma-editor-scroll | Source conformance; no invented CRUD/grid/business tabs |
| Regions and fields | Shared FormSection/EditorTabs/FieldError -> target template; data tokens + subject/CC/BCC + body; source/visual modes use workspace tabs, matched panel ids/labels | Match; conditional editor mounted only for its loaded key/mode |
| Options | EmailTemplateCatalog.CreateOptions -> GET Options Result.entity.templateTypes -> EmailTemplateOption id/key/dataFields -> numeric selector | 19 ordered types / 141 exact braced literals; no client duplicate catalog |
| Enum identity | EmailTemplateTypes.cs explicit0..12 unchanged, new13..18; obsolete ordinal-based frontend enum removed after zero-consumer search | Match; no renumber/backfill |
| Detail/write | GET raw lean detail and POST lean write -> TS details/create and typed form | Exactly templateType, subject, cc, bcc, emailBody on both sides |
| Grid columns / ListVM | No grid in keyed settings; no displayed list properties | Both N/A; unused ListVM/UpdateVM removed after whole-backend symbol search found only their declarations |
| Validation | Required defined enum, required single-line subject500, optional lists2000, body text/image -> API attributes and FieldError validators | Match; backend plain-address regex mirrors installed Angular Validators.email (ASCII mailbox grammar, max254 total/64 local, no display names). Entity header lengths match write limits |
| Body content | Both remove comments/script/style/tags, decode entities, reject whitespace (including U0085) and zero-width-only text; image must have nonblank decoded src | Source compared; no input HTML rewritten by validators |
| Existing HTML | Exact EmailTemplateAddVM.EmailBody resolver exclusion; source round-trip guard via installed public toDoc/toHTML; same body control in source mode | Unsupported tables/styles stay in HTML source; switching to visual rejected if canonical round trip differs. Header-only Save preserves original body |
| Editor lifecycle | New Editor per successful key load / visual entry, old editor destroyed on load/source exit/destruction | History/plugins cannot be shared between template keys |
| Subject normalization | Exact Subject resolver exclusion -> raw CR/LF validator -> service-owned trim; ordinary CC/BCC use existing API resolver + frontend trim | No broad resolver exception or private normalization framework |
| Load/error/readiness | options/detail reads -> switchMap/defer/takeUntilDestroyed/identity check; readyfalse blocks Save; Retry repeats failed load | Both Result/HTTP failures retained inline; not converted to empty persisted state |
| Save/failure | frozen typed snapshot -> canonical UpsertByKeyAsync -> one SaveChangesAsync -> Result | Selected key only, no delete by omission, no explicit transaction needed; failed Save retains values/dirty state |
| Feedback ownership | requests suppress error interceptor; apiErrorMessage + StateMessage inline; standard POST retains global mutation success toast | One owner per channel; global loading start/finalize pairs, no duplicate visible local loading message |
| Discard | deferred confirmDiscard + freezeFormStates -> selector/back CanDeactivate | Cancel retains key/values/dirty; acceptance restores temporary snapshot before subscriber starts new load, idempotent finalizer cannot enable next session; load/save/mock/decision gate duplicates |
| Focus/accessibility | shared focusField -> actual stable contenteditable id or source textarea; translated labels/required/error links; native beforeunload | Shared actual-scroll reveal/preventScroll reused; no local toolbar focus workaround |
| Routing/providers | pages/routing.ts /EmailTemplates -> child route CanDeactivate; existing menu; root BaseService HttpClient/AppModule token+error interceptors; backend scoped assembly scan + mapper assembly scan | Existing authentication retained; no new feature HttpClient, manual token or permission API |
| Authorization candidate | POST EmailTemplates changes tenant settings; controller Authorize inherited existing policy | Candidate recorded; no new access restrictions or security claims |
| Mapper/overrides | EmailTemplateProfile AddVM->entity and entity->DetailVM; helper generic TVm:class accepts lean classes | No ReverseMap, no inappropriate ignores, no service/controller override to justify |
| Financial/domain calculation | Plain settings content only | N/A; no balances, posting, tax, pricing or financial effects |
| Source evidence vs screenshots | E0..E20 fields/types/tokens + rich editing/manual Save present; no sample subjects/branded text seeded | Screenshot design not copied. Legacy font/table/fullscreen/help toolbar implementation not recreated; arbitrary preserved markup editable through HTML source |
| User guide | EMAIL_TEMPLATES_TOPIC -> ADMINISTRATION_GUIDE -> existing UserGuide reader and module menu | EN/AR content matches route, type selection, tokens, header limits/lists, modes, validation, errors, dirty/mock gates and manual Save/no-send boundary |

### Files changed
Frontend repository root: F:/My Work/Sigma/SiGmaAngularFrontEnd (16 scoped files including one deletion).
- src/app/modules/Administration/emailTemplates/components/list/list.component.ts
- src/app/modules/Administration/emailTemplates/components/list/list.component.html
- src/app/modules/Administration/emailTemplates/components/list/list.component.scss
- src/app/modules/Administration/emailTemplates/emailTemplates.routes.ts
- src/app/modules/Administration/emailTemplates/models/create.ts
- src/app/modules/Administration/emailTemplates/models/details.ts (new)
- src/app/modules/Administration/emailTemplates/models/options.ts (new)
- src/app/modules/Administration/emailTemplates/models/validators.ts (new)
- src/app/modules/Administration/emailTemplates/services/emailTemplates.service.ts
- src/app/_metronic/shared/enums/emailTemplateTypeEnum.ts (removed; server catalog replaces ordinal assumptions)
- src/app/_metronic/layout/components/toolbar/toolbar.component.ts (only target title exclusion)
- src/app/modules/shared/utils/focus-field.ts (actual contenteditable support)
- src/app/modules/i18n/vocabs/en.ts
- src/app/modules/i18n/vocabs/ar.ts
- src/app/modules/UserGuide/content/email-templates-topic.ts (new)
- src/app/modules/UserGuide/content/administration-guide.ts (topic registration only)

Backend repository root: F:/My Work/Sigma/SigmaBackend (18 scoped files including two deletions).
- SiGma.Helpers/Models/EmailTemplate.cs
- SiGma.Helpers/Enum/EmailTemplateTypes.cs
- SiGma.DataAccess/Configuration/EmailTemplateConfig.cs
- SiGma.ViewModels/ViewModels/EmailTemplates/EmailTemplateAddVM.cs
- SiGma.ViewModels/ViewModels/EmailTemplates/EmailTemplateDetailVM.cs
- SiGma.ViewModels/ViewModels/EmailTemplates/EmailTemplateOptionVM.cs (new)
- SiGma.ViewModels/ViewModels/EmailTemplates/EmailTemplateOptionsVM.cs (new)
- SiGma.ViewModels/ViewModels/EmailTemplates/EmailTemplateAddressListAttribute.cs (new)
- SiGma.ViewModels/ViewModels/EmailTemplates/EmailTemplateBodyAttribute.cs (new)
- SiGma.ViewModels/ViewModels/EmailTemplates/EmailTemplateSingleLineAttribute.cs (new)
- SiGma.ViewModels/ViewModels/EmailTemplates/EmailTemplateListVM.cs (removed; no list)
- SiGma.ViewModels/ViewModels/EmailTemplates/EmailTemplateUpdateVM.cs (removed; no id-based Update)
- SiGma.Business/Services/EmailTemplateCatalog.cs (new)
- SiGma.Business/Services/EmailTemplateService.cs
- SiGma.Business/IServices/IEmailTemplateService.cs
- SiGma.Business/MapperConfig/EmailTemplateProfile.cs
- SiGma.ServerAPI/Controller/EmailTemplatesController.cs
- SiGma.ServerAPI/Extensions/TrimIncomingStrings.cs (only exact template exceptions)

Documentation: owning UI27/BE3 blocks, CHANGELOG and sigma-screen-refactor skill synchronized for reusable shared focus/exact-text guidance. Generator refreshed all eight packet IDs PLAN00, PHASE00..06 (current invocation generates all); semantic review confirmed unchanged approved reference roles, phase ownership, source-only boundary and target fields, with current UI27/BE3 source fingerprints. Repeated -Check all8 OK. Review/plan/freeze artifacts are under F:/My Work/Sigma/reviews.

### Schema and compatibility
Owner must run `Add-Migration AddEmailTemplateHeadersAndUniqueType` (name checked unused). Schema delta: nullable Subject nvarchar500, Cc/Bcc nvarchar2000, filtered unique (SubscriptionId, TemplateType) on live rows. No removed persisted column, tightened historical nullability or old body change. Historical headers stay null without fabricated defaults. Before applying the index, owner inventories and decides how to reconcile duplicate live keys; this task never deletes/rewrites duplicates. Review generated migration against the already dirty migration/snapshot state before applying. Roll out backend with schema first, then matching frontend; subject is now required on Save and Options is a new dependency.

### Responsive/source-style matrix
| Range / boundary | Expected arrangement and source inspected | Acceptance |
|---|---|---|
| Available form width >900, including supplied desktop1690–1713 viewport after shell insets/sidebar | Feature grid min250 + remaining3fr, 10px gap; min-inline-size0; title/control/section owners traced | Source conformance; visual pending |
| Available form899/900/901; intermediate1024/1100 viewports with sidebar variants | Named container on form switches to single column at900, not a page viewport guess | Pending owner resize/keyboard check |
| Shared650 title-action boundary,700 control-grid,720 shell,1024 grid boundary; narrow320/360/390/700/800 widths and short heights | Shared actions wrap; subject/list fields full-span one column; form overflow stays sigma-editor-scroll; rich menu vendor wrap/public theme variables | Source cascade inspected; visual/runtime pending |
| EN/LTR + AR/RTL, light/dark, long token/key/subject/list and validation/read/save error states | Logical layout, token/source directionLTR, shared tokens/labels/errors/actions; body min320 inside content region | Owner acceptance pending; native text-area editing scroll is a control behavior |

### Verification evidence and limitations
- Complete scoped diffs reviewed separately in both Git repositories, including new files and deleted unused declarations. Shared dirty EN/AR/guide/toolbar/TrimIncomingStrings compared against task-start copies in %TEMP%/sigma-email-templates-20261017: only described additions; pre-existing edits preserved.
- Source parsing (not type checking): 13 TypeScript sources + Angular template, zero syntax/target-block duplicate-key issues.
- Translation parity: touched emailTemplate and enums.EmailTemplateTypeEnum blocks, 45 English /45 Arabic keys, zero missing or case-only differences.
- Scoped diff --check: no whitespace errors. Source scans: no conflict markers, any, EnumToArrayPipe, viewport calc, silent error handler, inappropriate ReverseMap or stale removed-symbol consumers.
- Backend net10 source/declarations, installed Angular17/ngx-editor/PrimeNG public contracts and ES2018 library compatibility inspected. No broad compiler-root change; no new component root required.
- Existing target spec is a misplaced unrelated widgets ListsComponent smoke test; left unchanged. It provides no acceptance evidence for this feature.
- Existing helper GetSingleAsync has no CancellationToken parameter: frontend cancels stale HTTP and service checks token before/after the read; underlying query remains noncancelable without separate shared-helper scope.
- No builds, tests, lint, runtime/browser automation, DB commands, migrations, snapshot changes, Graphify, Sigma MCP, commits, pushes or deployment were performed. Compilation, persistence, API/network, keyboard, visual, RTL/theme and responsive acceptance remain owner work.

### Owner verification
1. Inspect duplicate live tenant/type keys; generate/review/apply the migration with existing pending schema work; verify old bodies and enum0..12 remain intact and headers null.
2. Build frontend/backend and exercise all19 options. Save subject/CC/BCC/body, reload, switch away/back and verify other types are unchanged.
3. Exercise empty/whitespace-only subject/body, CR/LF subject, address separators and invalid/oversize input. Check inline errors and first-invalid focus.
4. Fail Options/detail/POST with HTTP and Result failures; Retry reads and retry manual Save; verify draft retention and one error/success feedback owner.
5. Cancel/accept dirty selector and router/back discard; attempt double Save and actions during load/save/mock/confirmation. Verify no late template response or Undo from another key appears.
6. Load existing table/inline-styled HTML: source fallback preserves it and blocks unsafe visual conversion; header-only and source edits round-trip exactly. Exercise source/visual mode switches on supported content.
7. Open /UserGuide/administration from its existing module guide menu, follow Email Templates screen link, and check bilingual topics. Resize through matrix in both directions/themes and keyboard-only mode.

Suggested commits (suggestions only, stage only scoped files above):
- SiGmaAngularFrontEnd: `feat(email-templates): complete keyed template editor and guide`
- SigmaBackend: `feat(email-templates): add headers and typed template catalog`
- Documentation layer (owner-managed): `docs(email-templates): record contracts and source reconciliation`

### Agent utilization

### Presentation follow-up — 2026-10-17
Owner request: narrower dropdown, higher Email Body, Data Fields icon/title on one
row, no Mock Data action there. Decision: move existing standalone selector into
FeatureTitle's action slot before Save, use clamp180px/24vw/340px with max100%
inside the shared responsive action group, so the body starts directly below
the title without a separate selector row. Keep selector outside mock-form scope
and retain all load/save/discard behavior. Shared FormSection groups icon/copy
using the existing heading gap and icon sizes; actions remain separate and
wrapping. Its default-true showMockDataAction is false only on Data Fields.
Guide EN/AR updated. No backend/API/schema changes or migration required by this
follow-up. Applicable UI1/3/13/24/25/29, phases3/5/6; no list/domain action work.
No subagents: small sequential presentation change. Source check covers actual
shared public inputs/template registration, header bounds at650 and neighboring
widths, the900 content-container boundary, read-only card and preserved mock
actions elsewhere. Visual/keyboard/RTL/theme acceptance remains pending owner;
no builds/tests/lint/browser/database/commits were run.

Suggested follow-up commit: fix(email-templates): compact picker and section headings

Owner alignment clarification: template label now sits inline beside the dropdown
in max-content/minmax(0,1fr) columns with8px gap, zero label margin and center
alignment. Total selector width is clamp240px/24vw/340px (superseding180px minimum
above); the shared34px control line aligns to the Save action's center instead
of including an above-control label row. No absolute positioning, negative
margins or shared button overrides. Existing <=650 action wrapping remains.
Final follow-up checks: parsed14 TypeScript sources and2 Angular templates
(including shared FormSection), zero syntax issues; scoped diff --check clean.
Regenerated all8 packets after UI13 change and final -Check all8 OK; semantic
review retains same references/contracts. Empty section actions are hidden so
Data Fields cannot retain an empty wrapped action row. Pre-existing collapsible
FormSection behavior preserved. No runtime/visual claim or backend change.

Latest owner clarification (2026-10-17): remove Mock Data throughout Email
Templates. Removed appMockData from the form, its module/component imports,
ViewChild and obsolete mock-pending gates; the screen has no mock context or
generation action. Shared components/preferences and other screens unchanged.
EN/AR guide now states generation unavailable. Ordinary load/save/confirmation
and dirty protection retained. Source parsing and scoped whitespace review only;
no build/test/browser/database commands or schema change required.

Equal card-height follow-up (2026-10-17): owner requests Data Fields height
equal to Email Body. Feature grid places both in the same first auto-sized row,
with shared FormSection fill=true stretching both card surfaces; Message details
occupies second row/start column. Existing neutral settings wrapper uses
display:contents to expose its cards to that layout. At the existing900px
container breakpoint all placement resets to natural stacked order. No fixed
height, measurements, shared internals override or extra page/region scrollbar.
UI1/13 shared fill contract reused; no shared capability or book change needed.
Guide EN/AR updated; frontend-only phases3/6, no migration/backend/API change.
No agents for this small layout change. Source parsing/whitespace/diff review
only; owner visual acceptance pending for short/long token sets, both modes,
900px neighbors, RTL/theme and textarea resizing. Suggested commit:
fix(email-templates): align data fields and body card heights

Owner correction: the combined Data Fields + Message Details column, rather
than Data Fields alone, must equal Email Body. Supersedes the previous placement:
restore the actual left wrapper as a flex column with10px gap; shared grid stretch
matches that whole column to the body card. Data Fields grows into remaining
space, Message Details retains content height, both retain the shared section
owners. Remove explicit grid areas/display:contents and their breakpoint resets;
existing900px single-column fallback remains. EN/AR guide corrected. Source-only
parsing and scoped diff review; visual acceptance pending, no backend/migration.

Latest picker-width request: increase selector group from clamp240px/24vw/340px
to clamp300px/32vw/460px, retaining max-inline-size100%, inline label, shared
control geometry and title-action alignment/wrapping. Presentation-only;
guide workflow unchanged, no API/backend/migration change. Scoped diff reviewed
and whitespace check clean; visual/responsive acceptance remains pending owner.

One sol_worker role, using the inherited session model (no model override), owned only the backend template files after root froze Phase1. Root owned discovery/decisions/frontend/guide/shared exceptions/docs/integration/full final reconciliation. Backend and frontend paths were nonoverlapping and ran concurrently to reduce wall-clock time without duplicated discovery; no additional agents were needed. The same agent then performed a focused read-only audit and identified editor-history reuse and unsupported HTML loss; root corrected both and reconciled the contract. Root further aligned address grammar and exact text focus/normalization with current public owners. No agent declared overall completion.


