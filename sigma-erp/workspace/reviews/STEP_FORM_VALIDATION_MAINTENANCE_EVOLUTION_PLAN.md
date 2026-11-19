# Shared step-form validation evolution

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-03 |
| Authorization | Owner: apply the agreed early duplicate validation to every step form |

## Existing state and impact map

Discovery of real step navigation (`app-step-form`, `p-steps`, `currentStepIndex`, `activeTabIndex`) under Angular modules identifies IndividualPartner, CompanyPartner, Staff and closedLeaseAgreements. The first three use shared navigation, parent reactive forms, declared field specs and inline FieldError. Lease retains legacy steps/tab panels. There is no existing async uniqueness validator or preflight API. Base Service.UniqueColumns owns persisted duplicate checks; Staff also compares normalized email case-insensitively. Lease child validators establish value/range rules, not duplicate prohibitions.

| Owner | Classification | Change |
|---|---|---|
| Shared reactive-form utilities | Create | Cached blur async uniqueness validator and shared pending-validation gate |
| Shared BaseService / Result contract | Extend | Typed authenticated CheckUnique request and entity response |
| Base IService/Service/controller | Extend | Read-only whitelist preflight using the same duplicate predicate as writes |
| Individual, Company, Staff | Extend | Blur unique controls; gate all forward navigation and Save; exclude edit identity |
| Lease | Extend | Current-step/whole-form pending gates and visible existing validation; retain compatibility layout |
| FieldError / dictionaries | Extend | Shared checking and failed-check feedback |
| Save guards, locks, mappings, calculations, routing, child snapshots | Keep | Authoritative final checks and persistence stay in place |
| Entity, EF, schema, migrations | Keep | No schema changes |

Selected UI shape: canonical routed composite step form (UI12), reference Individual Details and shared StepForm/FormValidationSummary/FieldError. Backend: existing Pattern2 parent/children for customer/staff identity validation, generic shared service/controller extension. Lease remains a stateful aggregate compatibility consumer; no new uniqueness rule is inferred.

Rejected alternatives: re-query unchanged fields at every Next (redundant); client-only checking (cannot enforce persisted uniqueness); arbitrary property lookup in a generic endpoint (would expose unsupported fields); changing all forms' update strategy (would alter unrelated validation); a full Lease screen rewrite (outside this request).

## Reference conformance before implementation

| Concern | Book | Actual reference / symbol | Shared owner | Target |
|---|---|---|---|---|
| Header and Next forward validation | UI12 | Individual Details.goToStep/validateStep | step-form-validation utility, feature step selection | Extend with await, cache reuse; Back/View skip |
| Summary and field focus | UI12,19,27 | Individual fieldSpecs/invalidStepFields/focusField | existing shared summary and FieldError | Keep existing specs; validation failure focuses current invalid field |
| Duplicate scope and exclusion | BE8 | Service.UniqueColumns/InvalidInputAsync; Staff email guard | shared service predicate | Whitelist, tenant live rows, exclude edited identity, matching normalization |
| Cancellation | UI28 | takeUntilDestroyed / Angular async validators | shared uniqueness validator | Cancel stale subscriptions; no result applied after destruction |
| Error ownership | UI19,22 | FieldError and BaseService skip-interceptor headers | FieldError | Inline duplicate/failure/checking; no preflight toast |
| Legacy Lease navigation | UI12 | Lease inline Next and tab activeIndex | shared validation gate | Explicit compatibility deviation: retain legacy layout; remove forward bypass |

## Frozen target and execution slices

See STEP_FORM_VALIDATION_DOMAIN_API_CONTRACT_FREEZE.md. Root owns shared frontend/model/service/feedback/translations, documentation and reconciliation. One backend agent owns generic API/service/DTOs plus Staff predicate; one frontend consumer agent owns the four Details components and Company form factory. Ownership is disjoint; preserve all dirty user/peer work. No source implementation starts before this freeze.

Source-only verification: scoped full diffs in each owning repository, TypeScript/template parsing without application compilation, endpoint/result/field normalization comparisons, translation parity, XML parsing, merge-marker/whitespace checks and recipe regeneration/drift check. Owner runtime cases: blur duplicate, unchanged Next reuse, pending Next, changed value/stale response, edit self, retry failure, focused Enter Save, Back/View, Lease current-step invalid fields, concurrent final-save rejection. Builds/tests/lint/browser/database/migrations/commits/deployment are not authorized.

No open business decisions block this scoped change. This task adds advisory early checks only for already-established keys. Runtime/visual acceptance remains pending.
