# Individual frontend — bounded shared validation corrections

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-02 |
| Scope | Existing Individual UI plus its shared card factory and file field |
| Tier | L for the two directly related shared corrections; remaining feature review follows its frozen handoff |

## Outcome and current state

Prevent locally accepted input that the existing API rejects, show the actual file-path validation error, and preserve a stable submitted snapshot. No new business capability, payment-data policy, API/schema, accounting calculation or permission is introduced. User authorization: review `Customers/Individual` and fix errors; continued with “كمل”.

| Concern | Owner / evidence | Current result | Decision |
|---|---|---|---|
| Required customer text | Individual Details.form; IndividualPartner Add/Update [Required], payload trims | Whitespace passes local required then becomes an invalid API payload | Extend existing validators with nonblank pattern, like Company/Driver/Document forms |
| Required card text | shared createCardRow/cardPayload; CreditCardInfoAddVM [Required] | Whitespace passes factory validators then mapper trims it empty | Extend the existing shared factory, no screen-local card variant |
| File path error | FileFieldComponent owns app-field-error; Individual document/profile maxLength(400/500) | File field only passes upload rejection message, hiding control errors | Extend shared field by passing its bound control to the existing FieldErrorComponent |
| Numeric values | Individual form and PartnerBillingInfoAddVM | Number inputs can return null; nonNullable does not prevent it; CreditPeriod is an API int | Refactor form nullability to API: optional four rental/lease surcharges allow null; nonnullable credit/discount/Darb fields require a value; CreditPeriod nonnegative integer <= int.MaxValue |
| In-flight form | Individual save/buildPayload | Enabled controls can change after payload captured, then success marks different state pristine | Disable form for save, restore on failure; hide collection mutations during save/cleanup; guard validation navigation |
| Date conversion | local apiDate duplicates partnerApiDate | Duplicate transport owner | Reuse existing shared helper |
| Lookup failures | Existing selects already offer skipErrorInterceptor | Global error dialog plus inline warning | Keep inline owner, retry guarded by local loading; no global lookup spinner |

## Logic ambiguity and impact

All above rules are Confirmed by existing VMs, shared factories, UI 12/18/19/22/28. Nonblank pattern is Derived from trim-before-write and API [Required]. Nullable surcharge controls follow the existing nullable API fields, retaining their zero defaults. No destructive or accounting choice is required. Card storage policy remains the separately documented owner decision and is unchanged.

Producer `createCardRow` is consumed by Individual Details and CompanyPartner credit-cards/company-form; all keep the same typed rows and payloads. FileField is consumed by Individual profile/documents and Company documents plus other existing file controls; one added control binding exposes existing touched/dirty validation with no upload lifecycle change. No new API or repository layer is affected. Read-only symbol consumer checks are required before edit. Old roots are audited separately without creating new capabilities.

## Options and decision review

| Option | Business correctness / compatibility | Decision |
|---|---|---|
| Validate only Individual card rows or add local file error markup | Duplicates shared ownership, leaves equal controls inconsistent | Rejected by UI 14/18/19 and Master 5 |
| Correct existing shared factory/field | Same API rules, same types, no migration; fixes all direct consumers through their existing owner | Selected |
| Redesign card/file APIs | New unsupported semantics and larger data risk | Out of scope |

The changes enforce existing constraints, so no owner business-policy decision is missing. No new persisted defaults/backfill. Existing invalid card strings will display validation on edit and must be corrected before Save; View remains read-only. Source rollback is the normal reversal of this bounded diff; no data rewrite is performed.

## Target contracts and implementation slices

1. Phase 1 consume current VMs and preserve frozen endpoints, child snapshots and file timing.
2. Phase 3 fix shared card validators and file error binding, then Individual form/date/save consumers.
3. Phases 2/4/5 apply frozen list-state, group-action busy, and one lookup-feedback owner.
4. Phase 6 compare exact fields/actions to contracts, inspect whole scoped repository diff, verify translations/whitespace/merge markers and record conformance in the review.

UI 18 owns shared partner rows/file control; UI 19 owns error presentation; UI 12/28 own save/navigation protection. Reuse built-in Angular validators, partnerApiDate and existing FileField/FieldError rather than creating abstractions. Document the bounded shared correction in the owning book/skill/changelog, regenerate derivative packets only through the generator and check references after documentation edits.

Verification: source comparison of VMs/forms/payloads, shared factory consumers and both save failure channels. Owner must run Angular build and manually check blank text/card input, cleared numeric input, fractional credit days, long file paths, delayed/failed save, retry lookups, return filters/paging, Arabic/English, RTL/themes and narrow scrolling. Builds/tests/lint/browser/database/commits remain unauthorized and pending. No schema/EF changes; no migration or deployment order needed.

## Frozen source amendment — legacy roots and existing lookup owner

Current-source discovery confirms three dormant roots: `PersonBase`, `Partner` and `PartnerAddress`, 13 tracked files each. Their route exports, service/DTO symbols and selectors have no external consumers; pages/routing, Layout, menu and compilation configuration do not reference them. Lists contain copied product/category actions and wrong inventory URLs; details contain obsolete audit/tenant controls and discount-field enabling. These roots have no working-tree changes. **Remove** their 39 tracked source/template/style/spec/route/model/service files under the requested folder, following Master 5 G12; do not rebuild them or change backend entities/APIs. Existing translation keys belong to shared `mangeDetails` and other active consumers, so retain them. No consumer or configuration migration is necessary. The only live customer owner remains IndividualPartner. Restore from Git is the reversible source rollback; no stored data is deleted.

During reconciliation another authorized screen review supplied the canonical `mergeSelectOptions` utility (UI 16). **Reuse** it for Individual saved options and fetched lookup merging, preserving fetched labels, selected IDs and request shapes. Gate collection Add/Remove through the existing complete editor busy signal during uploads as well as save/cleanup, in conformance with UI 18. Root owns these integration changes; no parallel source ownership is introduced. This amendment is Frozen on 2026-10-02 under the user's existing confirmed-fix authorization.
