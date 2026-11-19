# Shared step-form validation contract

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Frozen | 2026-10-03 |

Owner agreement: check duplicates after entry (blur); Next reuses the result when unchanged, awaits pending/unchecked fields, and final Save keeps authoritative backend validation. This is applied to every real step form identified in the plan.

## API

Authenticated `POST /{generic-controller}/CheckUnique` using existing root HttpClient/auth interceptors. Body: `{ fieldName: string, value: string | null, excludeId?: number | null }`. Response: existing `Result<UniqueValueCheckDto>` with `entity: { isAvailable: boolean }`, `isSuccess: true` for both available/taken. Taken may include its existing localized duplicate message. Unsupported field or nonpositive supplied excludeId fails with localized `UniqueFieldNotSupported` / `InvalidId`; never reflect arbitrary fields. Whitelist uses the service's declared `UniqueColumns` member names, case-insensitive field-name matching. Empty optional values are available; validate field whitelist first. ExcludeId denotes the current edit identity; tenant/live scope is supplied by Repository.ExistsAsync. No raw context, mutation, lock, numbering or schema change in preflight. Existing writes retain their locks/index guards and final rejection. Share predicate implementation between InvalidInputAsync and preflight, with a Staff email override preserving lower-case comparison. Other equality uses the existing database collation.

| Consumer | Form paths | Endpoint / server fields | Normalization |
|---|---|---|---|
| Individual | email, mobileNo | IndividualPartner / Email, MobileNo | Existing payload trimming |
| Company | details.companyName, details.vat | Company / CompanyName, VAT | Existing payload trimming |
| Staff | email, mobileNo | Staff / Email, MobileNo | Trim/lower email; trim/remove internal whitespace phone (match Staff save) |
| Closed Lease | none | none | No source-supported unique key to invent |

## Shared frontend APIs

`shared/models/unique-value-check.ts`: typed request and response (`UniqueValueCheckRequest`, `UniqueValueCheck`). `BaseService.checkUnique(request): Observable<Result<UniqueValueCheck>>`, skip success and error interceptors because feedback belongs inline.

`shared/utils/unique-field-validation.ts` exports `uniqueFieldValidator(options): AsyncValidatorFn`. Options: `fieldName`, `check(request)`, `excludeId(): number|null`, `destroyRef: DestroyRef`, optional `enabled():boolean`, optional `normalize(value:string):string` (default trim). Cache by normalized field/value/edit identity; share pending request, cancel stale subscriptions, bound request wait, do not cache transport/logical failures. Errors are `unique` or `uniqueCheckFailed`. Synchronously invalid/empty fields do not make remote calls. Field-specific controls use `updateOn: 'blur'`; View does not attach/start checks. Reattach after form replacement in Company; attach after route identity/mode is known.

`shared/utils/step-form-validation.ts` exports `settleStepValidation(controls: readonly AbstractControl[], destroyRef: DestroyRef): Promise<boolean>`. Commit the focused blur edit before inspection and again after awaited checks; recursively refresh async validators using their cache and await pending controls. Return false on destruction or any invalid/pending control. This also works for forms without uniqueness rules. Feature gate owns its validating/busy state and final step/focus selection; no additional query for an unchanged successful/duplicate check. Failures are retryable at Next/Save; Back/View skips gate. Save awaits all controls before payload creation and existing disable/save behavior.

All forward entry points (Next/header/tab event) share the gate. Multiple concurrent navigation/save actions are blocked while settling; gate releases before existing invalid-field navigation so focus works. Form mutations/actions obey this busy state. Pending feedback uses shared FieldError; it is status feedback, not an error alert. Failed preflight blocks progression and Save until a successful retry. Final write remains authoritative because another user can claim a value after preflight.

No Add/Update/detail/route/schema/permission/calculation/AutoMapper contract changes. Lease compatibility adaptation uses its existing control validators only; unrelated legacy tenant/financial/layout issues remain out of scope.

### Source reconciliation correction — 2026-10-03

Backend implementer verified `StaffService.NormalizePhone` (lines293-294 at discovery): whitespace-only becomes null, otherwise `Trim()` only. The earlier mobile normalization row's internal-whitespace removal is superseded by **trim only**, matching the actual save. No new phone policy is introduced. Staff email remains Trim + lower invariant. Shared async validators must not begin silent-patch pending checks during initial hydration; consumers attach after hydration or use `enabled` with ready/edit mode. Cached successful results allow silent form re-enable after Save failure to settle synchronously.
