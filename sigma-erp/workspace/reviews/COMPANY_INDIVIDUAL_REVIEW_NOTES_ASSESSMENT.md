# Company / Individual review-note assessment

| Field | Value |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| Request | Opinion on five proposed backend improvements; source-read-only |
| Shape | Existing Pattern 2 customer aggregates and their shared persistence |
| Implementation authorization | none; this report changes no source, configuration or skill |

## Assessment and priority

| Item | Verdict | Priority |
|---|---|---|
| Serializable deadlock risk | Real possibility; actual lock escalation/deadlock frequency requires runtime evidence | Concurrency design: high; replacement not approved yet |
| 1205 currently becomes an unhandled 500 | Incorrect for current source: middleware catches direct SQL 1205 and DbUpdateException wrapping 1205; responds localized 409 | Already covered |
| Individual uniqueness race | Confirmed: base checks mobile/email but no encompassing check/save isolation; examined Individual/PersonBase/Partner configs have no matching unique constraints | High |
| sp_getapplock cannot deadlock | Incorrect as an absolute guarantee: its documented return codes include -3 (deadlock victim) | Qualify the proposal |
| Customer group type / duplicated resolution | Confirmed: Company checks Customer type in Add/Update/group action; Individual does not; Individual import accepts groups of all types | Medium correctness issue |
| New-row numbering | Confirmed inconsistency: Company explicitly numbers new Drivers only; new Contacts and base Update children bypass Add numbering | Medium; review the shared numbering boundary |
| Individual date checks | Confirmed duplicate expiry rule for validated API VMs; BirthDate lacks the NotFutureDate used by Driver | Future BirthDate: medium; duplicated check: low |
| Update readability helpers | Appropriate when they preserve existing ownership/delete/save behavior | Lower priority, after correctness fixes |

## 1. Concurrency

Current evidence: CompanyService.AddAsync/UpdateAsync and SaveCompanyChunkAsync use
Serializable. IndividualPartnerService delegates writes to the unprotected base.
AccountingConfigurationExceptionMiddleware.cs lines 46–57 handles concurrency/1205,
and Program.cs line 101 registers it before the controllers. Import's existing custom
chunk catch localizes 1205 too. A reported 500 needs the actual stack trace/deployed
version; it cannot be inferred from the present source. Table-wide locking is a possible
execution-plan/lock-escalation result, not a proven current observation.

An Exclusive application lock per trusted tenant and uniqueness domain, inside a
ReadCommitted transaction, is a reasonable candidate to serialize participating writes
before duplicate reads. It must use the same connection/transaction, acquire before relevant
reads/mutations, use bounded wait/cancellation, check negative return codes, and commit or
roll back/dispose correctly. It avoids the specific two-writer read-to-write conversion
pattern when every writer participates; it does not eliminate unrelated deadlocks or make
ordinary SQL row locks tenant-local. Direct/bypass SQL writers remain outside the protocol.

Putting code solely in base.AddAsync/base.UpdateAsync does not automatically cover Company:
its Update overrides the whole method. Both customer imports also bypass those base methods.
Adoption requires a common persistence hook/entry point (with explicit override/import
coverage), without introducing nested transactions or retaining obsolete Serializable scopes.
The lock's tenant must come from authenticated server context, never the request VM.
Acquire multiple resources in a consistent order. Do not introduce automatic aggregate retries.

This is a concurrency replacement, not a small readability helper: approve a bounded design
before implementation. Retain current protection until the complete replacement is ready.

## 2. Customer group resolution

A single method on the existing IContactGroupAccountService is a sensible owner for choosing
the default and checking a supplied live, same-tenant Customer group. Resolve it before
tracked aggregate mutation because default-group creation can save the shared context.
Add/Update/group action for both customer services account for six callers; import is an
additional caller that must preserve chunk semantics. A static method with an explicit
repository is not inherently wrong; the stronger reason for this move is one business owner.

A null return for an invalid selection must be handled as a failure, never fed back into
default-group fallback. A Task<int?> alone does not eliminate the caller's failure handling;
preserve meaningful not-found/type errors and do not silently replace invalid user input.

## 3. Numbering

New Contacts, documents/cards/references attached during Update do not pass Repository.AddAsync.
UnitOfWork.SaveChangesAsync is an existing shared persistence point and already receives
ICodeCreateService through its constructor. A shared Added-row preparation is a better
candidate than additional feature calls, but must explicitly preserve numbering policy.

Enumerate EF Added entries (with change detection), select the actual eligible entity types
and empty server-owned numbers, preserve all saved/manual/reference numbers, and avoid walking
saved navigation graphs. Runtime/EF concrete type matters: calling the generic generator as
EntityBase loses the type-specific rule. Include sync/async persistence consumers deliberately;
base-only save helpers do not cover imports and override services. Do not leave Add's existing
graph walk and new save-time numbering as competing owners without reviewing manual-number
behavior. The existing CountAsync + 1 generator can also repeat numbers for several new rows
before one save and under concurrency: centralized coverage alone does not repair that defect.
The separate deferred numbering plan remains the owner of a counter/sequence redesign.

## 4. Dates

CustomerDocumentAddVM/UpdateVM both use DateAfter; the attribute and PartnerRules compare
calendar days with the same strict later-than rule. The API controllers inherit ApiController,
so removing Individual's repeated API service check is reasonable. The helper currently has
only those two callers. Check any direct service/import callers because attributes are not
automatically executed just by calling a service. Add NotFutureDate to both Individual write
VM BirthDate properties; preserve their existing requiredness and the established date policy.

## 5. Readability

- OwnsEveryRow(vm, company): a private Company method can name the existing complete ownership
  check; keep it before any mutation. It need not become a generic base abstraction.
- RemoveDroppedAsync: reuse the existing MarkRemovedAsync/InUseAsync and owned-row metadata;
  return the first failure, perform no save, preserve soft delete, descendant handling and FKs.
  Do not blindly remove collections or duplicate ReconcileOwned's responsibilities.
- SaveUpdateAsync: a small base helper can standardize save/result creation; preserve existing
  messages, Id, failure/status behavior and exactly one save. The outer workflow still owns
  transaction commit/disposal.

Recommended sequence: fix Individual group type and BirthDate boundaries; centralize new-row
numbering with its policy reviewed; extract the small readability helpers; independently
review/adopt one concurrency protocol across Company, Individual and imports. The confirmed
Individual uniqueness race is high priority even if the replacement implementation is gated.

## Evidence and limits

Followed the existing skill and Master Guide, backend blocks 3/5/8/11/14. All eight generated
packets are stale; canonical blocks used. No generated packet edited. Phases 0/1 and relevant
3/5/6 source review applied; no frozen implementation contract or source changes. No UI/grid,
mapper, accounting, schema or permission change proposed here. No migration or commit performed;
no commit message is needed for application source in this read-only review.
Root-only bounded review. No build, test, application, browser or database commands executed.
Database plans, actual indexes and concurrent behavior remain owner verification.

Microsoft references:

- [sp_getapplock requirements and return codes](https://learn.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/sp-getapplock-transact-sql).
- [SQL Server locking, key-range locks and escalation](https://learn.microsoft.com/en-us/sql/relational-databases/sql-server-transaction-locking-and-row-versioning-guide).
