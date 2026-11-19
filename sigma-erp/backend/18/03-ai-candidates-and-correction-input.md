<!-- Part of backend block 18: see ../18-edge-cases.md. Same status and authority as the block. -->

### Correction-record input policy (source-only, 2026-10-14)

The two Data Entry Correction services reuse the internal static
`Services/HelperServices/CorrectionInputPolicy` for their common write-VM
DataAnnotations, distinct positive SLA IDs, complete current eligibility checks
and tenant/folder/GUID/extension stored-path checks. Unchanged historical ID sets
and saved paths remain compatible; changed selections must be wholly eligible.
This is a domain-family validator, not a new service interface or DI data carrier.
Each service still owns tracked writes and request metadata. Their batch writers
validate every item before mutation and save once, preserving the same invariants
as single writes; inherited generic batches must not bypass domain validation.
The 10,000-character request cap leaves historical unconstrained storage intact
instead of shrinking a column without data evidence. That compatibility choice
belongs to the correction feature contract. Owner migration/build/runtime and
shared abandoned-upload expiry verification remain pending.


### Metadata-only AI candidate contracts (2026-10-13)

JSON output mode ensures JSON syntax, not adherence to a form's field contract.
For shared mock-data assistance, construct the prompt schema and example from
the actual requested field keys and primitive types. Opaque choice tokens remain
strings even when numeric-looking; all keys are required in the output object,
while optional field values may be null. Generic unrelated example keys/tokens
create avoidable ambiguity. Server validation still owns exact key completeness,
types, bounds and allowed choices; a prompt schema is guidance, not enforcement.

`MockDataService` is the verified source consumer after owner reports HTTP400
InvalidProviderResponse in IndividualPartner and Companies. The exact rejected
provider response was not supplied, so the original field-level cause is not
proven. One repair request is allowed after invalid JSON/envelope/candidates,
using fixed rejection codes and requested keys only. Both attempts share the
original45-second deadline/cancellation and response cap. HTTP/auth failures
are not retried; no partial output or local deterministic fallback is applied.
Diagnostics may expose bounded sanitized requested field identifiers, never
provider bodies, generated values or API credentials. Source-only conformance;
actual replay remains owner acceptance. Storage/privacy/Save contracts stay
with their existing owners and frozen feature amendments.

Owner explicitly extends synthetic generation to Card Number/CVV (2026-10-13).
Frontend marks native card inputs and sends canonical text names/lengths16/3,
never current card values. For these exact text names, MockDataService schema
adds ASCII digit pattern, example uses digit-only strings, and prompt preserves
string serialization/leading zeros. Strict ValidValue checks digits plus the
supplied bounds; invalid text follows the existing one bounded repair/all-or-
nothing rejection. No new DTO/endpoint/EF field or business input validator.
Treat these as synthetic form values, not verification of payment eligibility.

| Case | Expected |
|---|---|
| Required string `null`, `""`, or `"   "` | Rejected. `[Required]` alone does not reject whitespace — trim in the service |
| String at and over max length | Accepted at the limit, rejected above it, and the limit matches `HasMaxLength` |
| Number at min, at max, out of range | Boundaries accepted, outside rejected |
| Decimal with more scale than the column | Explicit input policy rejects excess precision or domain calculation rounds deliberately; never implicit storage rounding |
| Negative amount or quantity | Rejected unless the business allows it |
| Enum sent as an undefined number | Rejected via `Enum.IsDefined`; never silently mapped to the default member |
| Nullable enum omitted | Distinct from an invalid value |
| Date `0001-01-01` or `DateTime.MinValue` | Rejected when a real date is required |
| Reversed range, `from > to` | Rejected |
| Equal boundaries, `from == to` | Explicitly allowed or rejected, documented |
| Date-only value near midnight | Calendar date preserved; no UTC conversion. See UI block 17 |
| Leap day, month end | Accepted |
| Duplicate value differing only by case or spacing | Matches the documented normalization rule |
