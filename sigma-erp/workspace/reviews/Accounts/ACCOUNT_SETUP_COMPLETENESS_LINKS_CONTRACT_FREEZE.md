# Complete account setup — supported links

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-23 |

Owner explicitly requests a complete seeding service for Chart of Accounts,
Link Accounts and Financial Statements. This handoff freezes the source-proven
link/setup workstream only. Cash-flow expansion/default prepayment pair choices
are a separate pending owner question; do not invent those mappings here.

## Existing owners and supported contract

Retain SeedDataService.SeedAccountSetupAsync and existing authenticated endpoint.
Outer ExecuteUniqueWriteAsync<Account> owns the full multistage setup transaction;
failure rolls back all stages. Reuse existing LinkAccountsAutoLinkService,
default contact provider, AccountService and typed catalogs instead of another
independent account/link writer.

Required logical slots: General except Test; all eight charge enum domains
including Miscellaneous/ChargeTypes; existing ContactGroups (ensure existing
Customer/Supplier default provider); existing PaymentMethods and Banks;
nine required Workshop Default ItemTypes; twenty editable Hrm catalog roles.
No fictitious bank/person/payment masters or bank numbers/currencies.
Optional Workshop dimension rows and arbitrary prepaid pairs are not enumerated
required slots; preserve them. Current source explicitly treats missing-code
charge slots as Revenue. Use existing autolink's named posting-child fallback
for the ten blank charge slots and Miscellaneous; do not guess a shared GL code
or cast numeric values between distinct enum domains.

Introduce ILinkAccountsAutoLinkService.EnsureSetupLinksAsync(ct) returning
Result<LinkAccountsAutoLinkPlanVM>, combining the two existing General/Hrm
planners/apply cores. Existing public Apply/ApplyHrm behavior stays compatible.
Seed path fills missing/null links only, preserving every nonnull selected
account, including invalid/stale selections. Invalid retained selections must
surface as actionable manual/readiness diagnostics rather than overwritten.
Reuse existing logical key normalization, source references and validation.
Run within an already-current transaction; transaction-owning wrappers begin/
commit/rollback only when they own it. Never commit the outer seed transaction.
Keep standalone general/hrm Apply atomic and their existing isolation intent.

Root creates missing approved chart containers for Hrm provision rules:
Staff Provisions under CurrentLiabilities (default code2-02-003) and Staff
Provisions under LongTermLiabilities (2-05-003). Existing equivalent matching
category/subgroup/name groups are reused. Defaults use same AccountTypeClassifier
and exact valid placement; do not change any account's existing report snapshot,
posting/grouping flag, name, type or parent. Conflicting code/parent is a
readiness diagnostic. New chart grouping-only containers gain posting leaves
through existing AccountService/autolink; keep them expandable.

Root orchestration: ensure branch/numbering for new and existing chart; create
new chart only if there is no account history, preserve deleted-history guard;
initialize taxonomy; ensure these supported links; ensure financial settings;
readiness summary propagates errors/manual items, never claims complete while
required slots remain unresolved. Every stage observes authenticated tenant and
same cancellation/rollback. No migration, DB action, build/test/browser or commit.

## Delegation

Link worker owns LinkAccountsAutoLinkService + ILinkAccountsAutoLinkService only,
and new helper files within that service's existing folder if necessary. Root
owns SeedDataService and default-chart/setup helper files, docs and UI guide.
Settings worker will own a separately frozen cash default handoff only after
owner answer. Preserve all previous financial-statement work and peer edits.

## Owner feedback: incompatible retained selections — 2026-10-23

Owner reports automatic linking leaves five General slots unresolved. Supplied
messages identify existing retained selections with missing/unsuitable types:
3-03 Current Year Profit/Loss (reported for both earnings slots), Tolls Prepaid,
Prepaid Interest and Prepaid Coupon Liability. These are not empty slots.
Preserving nonnull selections remains authoritative: no automatic reassignment
of Retained Earnings or bypass of posting/type eligibility is authorized.

Extend the ordinary preview and Apply to reuse the existing stored-selection
guard, showing invalid retained selections even though read rows carry nonnull
AccountId. Recount terminal actions after guarding, and recheck preservation in
the writer. Explain actual account/required type and a shared current/retained
account as distinct diagnostics. Existing explicit classification initializer
continues to refine generic system types and preserve custom/conflicting uses.
User must resolve an actual shared earnings mapping before classification can
resolve its contradictory roles. No new API, plan action, schema or read-time
seeding; no database execution. Guide gives the exact type-repair sequence.
