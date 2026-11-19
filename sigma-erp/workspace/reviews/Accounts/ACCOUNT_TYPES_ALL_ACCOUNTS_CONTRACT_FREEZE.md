# Account types for every account — root coverage amendment

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Date2026-10-23. During explainable-result implementation, owner explicitly says
group accounts can later become posting accounts after children are removed, then
requests types for all accounts. This supersedes only the former fixed-root
exemption in the hierarchy and initialization-result handoffs. Preserve existing
amounts, tree identities, Category/SubGroup snapshots, posting restrictions and
all unresolved conflict diagnostics. No type is guessed across a genuine financial
classification conflict. The existing result work remains in scope and is reused.

Creation guard: the owner-approved next-step requirement for a type on every new
account applies at the existing AccountValidator Add boundary as well as the
already-required frontend field. Reject a null AccountTypeId with a localized
message. Keep Update's documented preservation of omitted legacy type IDs; no
silent erasure. Root setup creates the fixed root graph directly and assigns its
group types through initialization; both normal AddVM auto-link producers already
send AccountTypeId. No root edit permission or historical posting guard changes.

## Root types without inventing report placement

Append, without renumbering1–19, response/domain classification roles in the
existing AccountTypeKind enum and its TS mirror:
AssetGroup=20, LiabilityGroup=21, EquityGroup=22, RevenueGroup=23, ExpenseGroup=24.
These are broad grouping-only roles matching the five existing categories.
Seed one named system definition for each, with AccountSubGroupId null; do not
create a fake report subgroup or change any existing reporting key. They use the
existing nullable FK and enum string conversion, so no new entity/schema/migration.
OffBalanceSheet retains its separate meaning and is never inferred for a root.

Storage evidence clarification: AccountTypeDefinitionConfig actually stores Kind
through HasConversion<string>() with length50. Enum numbers remain the stable API
contract; the new names fit the existing stored column. No storage-conversion
change is part of this handoff.

AccountTypeClassifier owns IsGroupKind/GetGroupKind and category mapping.
Group roles are not detailed financial placements: IsPlacementCompatible and
TryGetPlacement reject them as operational/detailed mappings. Definition Add/Edit
may maintain group-role names with no subgroup; a supplied subgroup is rejected.
System/referenced Kind locks stay intact. Existing initialization's system-type
validation accepts these intentional unplaced grouping definitions.

For a fixed root, retain an already-valid matching type. Otherwise assign/reuse
its category's matching active grouping definition, keep its original Category,
SubGroup and every journal/tree/reference value, and emit Updated/AlreadyClassified
with a localized root-specific explanation. Never leave a root untyped solely
because ParentId is null. Legacy ExcludedRoot numeric outcome/count remains in
the response for compatibility but new normal root processing uses Updated or
AlreadyClassified. Hide its summary card when zero. Genuine missing/incompatible
category evidence is NeedsReview with a reason, never a fabricated assignment.

All eligible nonroot parents and posting accounts continue through the existing
placement-preserving classifier. A grouping account's normal detailed type stays
when children are removed. Existing AllowChildren/cost-center/transaction
transitions remain explicit; metadata does not enable posting on a grouping node.

## Lookup and editor boundary

Extend the existing Options query with optional includeGroupTypes=false. Preserve
existing .NET callers by appending the bool after CancellationToken in the service
signature: GetOptionsAsync(AccountCategory? category, CancellationToken token=default,
bool includeGroupTypes=false). Controller passes its optional query bool explicitly.
Default false retains all existing operational consumers' selection meaning.
With true, return normal placed types plus compatible active grouping types;
their existing option fields carry Category, bilingual system GroupName when
available, null subgroup/report key and their own bilingual names.

Angular getOptions(category?, includeGroupTypes=false) sends that flag only when
needed. The Account details consumer requests true only when viewing a fixed root;
creating a child under a root continues to request normal detailed types. Root
edit restrictions remain unchanged; the existing disabled type selector can now
display the real assigned name. Type-definition editor recognizes grouping roles,
keeps subgroup null/disabled with a brief translated explanation, and permits
name maintenance through its existing shared modal. No second editor/lookup API.

Generic posting selectors must not admit a grouping-only role on a malformed
posting row. Keep specific usage role sets unchanged and exclude grouping roles
from generic posting predicates as needed. Reports retain raw own balances plus
one bottom-up child accumulation. Inspect root classification-label fallbacks so
the presence of an unplaced grouping type cannot suppress a valid stored subgroup
label. Do not change amount inclusion or propagate a parent's type to descendants.

## Ownership and conformance

Backend worker: AccountTypeKind, AccountTypeClassifier, initializer service,
IAccountTypeDefinitionService/controller Options wiring, AccountSelectionPolicy,
its own relevant AccountTypeDefinitionProfile if needed, and scoped reason/error
resources. No schema/snapshot/migration edits. Frontend worker: Account kind model,
AccountSetting service, Account details TS, AccountSetting type editor TS/HTML,
shared initialization-result component if needed and account-types vocabulary.
Root: reports/deletion/conversion source audit, any justified report helper label
correction, guide, canonical lessons/packets, all contracts/review and integration.
Preserve peer/user changes. BE3/8/10/13; UI13/16 and existing screen04/06 contracts
own this amendment. No build/test/lint/browser/database/commit execution.
