# MiniErp Feature Development Guide

- **Status:** canonical project-wide development and review guide
- **Backend repository:** `E:\MiniErp`
- **Frontend repository:** `E:\client\client`

Use this guide whenever reviewing, adding, or changing a MiniErp feature. It
describes the application as it exists now. Do not add hypothetical future
requirements.

## 1. Authority and scope

Apply requirements in this order:

1. The user's latest explicit approval for the current task.
2. A current feature specification or task section that reflects that latest
   approval and the implemented contract.
3. This project-wide guide.
4. Existing conventions in the affected feature.

If two sources conflict materially, stop and report the conflict before
changing behavior. Update the affected documentation in the same change after
the decision is confirmed.

For invoices, section 8 of this guide is the current canonical behavior. It
supersedes contradictory historical statements in
`INVOICE_FEATURE_SPECIFICATION.md`, `INVOICE_IMPLEMENTATION_PLAN.md`,
`INVOICE_SIDEBAR_TASKS.md`, and `FRONTEND_INTEGRATION_GUIDE.md`. Do not treat
unimplemented voucher/allocation steps or older no-movement text in those
documents as approved work.

A request to review is read-only. Do not edit code, generate a migration, or
change external state unless the user also asks for implementation.

### Review and build modes

Review mode:

- Inspect the service, its interface, callers, mappings, validators, entities,
  configurations, migrations, tests, Swagger, and frontend consumers.
- Report only confirmed issues with file/line evidence, behavior impact, and
  the smallest direct fix. Do not report hypothetical future problems.
- Do not edit files or broaden the requested scope.

Build mode:

- Implement only the approved behavior and preserve unrelated working-tree
  changes.
- Check tenant filters, foreign keys, active state, cancellation tokens,
  mapping, validation, error codes, query count, transaction need, soft-delete
  history, Swagger, frontend impact, and tests.
- Use a transaction only for required atomic multi-step writes. Obtain explicit
  approval before generating a migration.
- Run verification proportional to the affected layers and report any
  untested or accepted edge case.

### Current application boundaries

- MiniErp is a small application. Prefer direct, readable code.
- Do not add CQRS, MediatR, repositories, a unit-of-work wrapper, generic CRUD
  services, factories, builders, strategies, or domain-service layers.
- Do not add an abstraction for a hypothetical future need. Introduce one only
  when it simplifies at least two current, concrete use cases.
- Do not add raw SQL locking, `UPDLOCK`, `HOLDLOCK`, application locks, or
  custom pessimistic-lock helpers. Keep the existing transaction boundary and
  RowVersion behavior of the affected aggregate.
- Do not add invoice status, posting, cancellation, reversal, journal entries,
  vouchers, or allocations. They are not part of the current application.
- Do not create duplicate Customer and Supplier entities.
  `BusinessPartner` represents both roles.
- Do not store mutable current-balance columns on `BusinessPartner`, `Item`,
  `Store`, or `Container`.
- Do not redesign working code solely to follow a pattern in this guide.
  Change architecture only when the current requirement needs it.

## 2. Project architecture

| Layer | Responsibility |
|---|---|
| `MiniErp.Domain` | Entities, enums, and small business calculation rules |
| `MiniErp.Application` | Request/response contracts, validators, mappings, and service interfaces |
| `MiniErp.Infrastructure` | EF Core configuration, direct service implementations, Identity, and persistence |
| `MiniErp.Api` | Controllers, authorization, HTTP results, Swagger, and application startup |
| `E:\client\client` | React pages, navigation, forms, API integration, and production client build |

Project conventions:

- Controllers inherit `ApiControllerBase`, which supplies
  `/api/v{version}/[controller]` and the default `[Authorize]` policy.
- Use `[Authorize(Roles = "...")]` for restricted operations.
- Use `[AllowAnonymous]` only for intentionally public authentication
  operations.
- Services use `ApplicationDbContext` directly and implement their existing
  interface plus `IScopedService`.
- Scrutor discovers scoped services. Do not add manual DI registration when the
  existing convention already covers the service.
- Expected business failures use `Result` or `Result<T>`.
- Unexpected database or infrastructure failures flow to the global exception
  handler.
- `AuditableEntityInterceptor` owns audit fields and converts `Remove` on
  `AuditableEntity` records into soft deletion.
- Normal queries use the global `IsDeleted` filter.
- Use `IgnoreQueryFilters()` only when current and historical records must both
  be considered, and always retain the explicit tenant filter.
- Use Mapster for request mapping and server-side response projection where it
  keeps the code direct.
- Use `IPaginationService` for lists that can grow.
- Keep secrets and production connection settings outside the repository.

Large services may use one `partial` service class split into cohesive files.
This is file organization only; it must not introduce new services,
interfaces, registrations, or business layers.

## 3. Before changing a feature

Write a short scope note covering:

- Business purpose.
- Operations in scope: list, select, get, create, update, and delete.
- Roles allowed for each operation.
- Entities and tables read or changed.
- Global versus company-owned data.
- Incoming and outgoing foreign keys.
- Validation, uniqueness, active-state, and delete rules.
- Request and response contract impact.
- Migration, seed, Swagger, and frontend impact.
- Explicit non-goals.

Record `N/A` with a reason for concerns that do not apply.

### Mandatory impact check

Answer these questions before implementation:

| Question | If yes, verify |
|---|---|
| Does another service read or write the changed entity? | Its service and integration behavior |
| Does a shared request or response change? | Swagger and every frontend/API consumer |
| Does the EF model change? | Migration approval, migration diff, and pending-model check |
| Does another table reference this entity? | Foreign keys and delete behavior |
| Does this entity reference another table? | Existence, active state, and company ownership |
| Does tenant ownership change? | Cross-company read, write, and foreign-key cases |
| Do authorization or claims change? | `401`, `403`, and role behavior |
| Does filtering or active-state behavior change? | List and select endpoints |
| Does seed data change? | Fresh and repeated startup |
| Does the React contract change? | Page behavior and production client build |

Search the repository before concluding that a change is isolated:

```powershell
rg -n "EntityName|EntityNameId|IEntityNameService|EntityNameResponse" `
  E:\MiniErp\src E:\MiniErp\tests

rg -n "HasForeignKey|OnDelete|DeleteBehavior" `
  E:\MiniErp\src\MiniErp.Infrastructure
```

Inspect controllers, requests, validators, mappings, services, entity
configurations, migrations, the model snapshot, tests, Swagger, and frontend
consumers.

### Reverse dependency maintenance

A new entity or relationship also changes every existing entity that it
references. For every new foreign key:

- Identify the existing principal entity and all services that read, update, or
  delete it.
- Review the principal's tenant rules, active-state rules, update restrictions,
  delete dependency checks, Swagger, frontend consumers, and tests.
- Decide whether current rows, historical rows, or neither should block
  deletion. When they should block, update the existing principal's
  `DeleteAsync` dependency check in the same change.
- Add regression tests to the existing principal feature for the new current
  and historical dependency behavior.

Do not defer this work until the older entity is reviewed later. A new child
table, movement, document, opening balance, assignment, or other reference is
not complete until its effect on all current entities and workflows has been
reviewed and the affected existing code has been updated.

## 4. Domain and API contracts

### Entities and enums

- Each entity declares its own integer `Id`.
- Each company-owned entity declares `CompanyId` and its `Company` navigation.
- Tenant request DTOs never contain a client-controlled `CompanyId`.
- Do not use the C# `required` keyword on entities or Identity properties.
- Initialize non-nullable entity strings with `string.Empty` only for CLR
  safety.
- Configure requiredness, lengths, precision, indexes, and delete behavior in
  EF Core.
- Use named Domain enums with explicit stable numeric values.
- Never reorder, reuse, or silently change a persisted enum value.
- API enum requests use enum names. Numeric JSON enum values are rejected.

### Request DTOs

Prefer simple positional records:

```csharp
public sealed record FeatureRequest(
    string Code,
    string Name);

public sealed record FeatureUpdateRequest(
    string Code,
    string Name,
    byte[]? RowVersion);
```

Rules:

- Keep create and update request records separate.
- Some clear duplication is preferable to an unnecessary abstraction.
- Keep small nested request DTOs as positional records.
- Do not introduce request interfaces, base request classes, inheritance,
  generic request models, factories, or builders.
- Do not add a default parameter in the middle of a positional record.
- A frontend default does not remove a required backend request value.
- Use property-based request models only when a real framework or binding
  requirement makes positional records unsuitable.

### Mapping and validation

- FluentValidation handles request shape: required values, lengths, ranges,
  precision, enum validity, and conditional field rules.
- Service code handles database-backed business validation: duplicate values,
  foreign keys, active state, tenant ownership, dependencies, stock, and
  concurrency.
- Put reusable string normalization in the feature's Mapster configuration.
- Validate and save the same normalized value.
- Mapping must not overwrite IDs, `CompanyId`, server-derived fields,
  RowVersion, or creation/deletion audit fields.
- Explicit tracked-entity assignment is acceptable when it is clearer for an
  aggregate update.
- Add each new CLR request-property name to
  `ArabicValidationConfiguration.DisplayNames`.
- `Program.cs` configures the shared Arabic validation behavior once. Feature
  validators must not create a second global configuration.
- Use a rule-specific Arabic message only when it is clearer than the shared
  validator message.
- A child validator attached with `SetValidator` is skipped when the property
  is null. Put `NotNull()` on the parent property rule before `SetValidator`
  when a request collection or nested object is required.

## Mapster Mapping Guidelines

### Convention-based mapping

Mapster automatically maps compatible properties with the same name:

```csharp
var invoice = request.Adapt<Invoice>();
request.Adapt(existingInvoice);
```

Do not add an explicit `.Map(...)` for ordinary matching scalar properties
such as `InvoiceType`, `DriverId`, `ActualDriverId`, `DiscountAmount`, or
`PaidAmount`. If the source does not contain a matching member, Mapster cannot
copy a value into that destination member, so an `.Ignore(...)` is usually
unnecessary.

### When Ignore is required

Use `.Ignore(...)` when the source contains a matching member but that
destination value is controlled elsewhere:

- `Invoice.Lines` and `Invoice.ContainerLines` are synchronized explicitly by
  `InvoiceService`.
- An update request's `RowVersion` is used explicitly by EF Core optimistic
  concurrency and must not be copied as an ordinary entity value.
- A calculated value such as `Total` must be ignored only if a request
  actually exposes a compatible `Total` member. Prefer not to expose
  server-calculated values in request DTOs.

Do not keep defensive ignores for database IDs, `CompanyId`, navigation
properties, audit fields, or calculated fields when the source DTO has no
matching member.

### Custom mapping

Use `.Map(...)` for a confirmed difference:

- Different property names or nested navigation values.
- Calculated response fields.
- Normalized strings.
- Child collections that require deterministic ordering.

```csharp
.Map(
    response => response.BusinessPartnerName,
    invoice => invoice.BusinessPartner.Name)
.Map(
    response => response.RemainingAmount,
    invoice => invoice.Total - invoice.PaidAmount)
.Map(
    invoice => invoice.Notes,
    request => Normalize(request.Notes))
```

Do not add an explicit identity mapping when the source and destination
already contain compatible members with the same name.

### Entity update behavior

`request.Adapt<Invoice>()` creates a new destination object.
`request.Adapt(existingInvoice)` writes matching request values into the
existing tracked entity. Review update mappings more carefully because every
compatible source member can overwrite the entity's current value. Keep
concurrency tokens and explicitly synchronized child collections out of the
ordinary update mapping.

### Child collections

Mapster can map collections, but it must not synchronize invoice children.
Invoice updates require explicit behavior to add, change, and remove lines,
preserve EF Core tracking, recalculate quantities and totals, and run stock
and container validation. Therefore these ignores are intentional:

```csharp
.Ignore(invoice => invoice.Lines)
.Ignore(invoice => invoice.ContainerLines)
```

### Separate invoice response mappings

Use separate, strongly typed mappings for `InvoiceListResponse` and
`InvoiceResponse`. Do not hide these mappings behind a generic helper or
string destination-member names. The small amount of duplication provides
compile-time safety, makes each response contract visible in one place, and
keeps list and details behavior easy to change independently.

List mappings configure list-specific values such as line counts. Details
mappings configure the complete ordered child collections. When the list
contract also returns child collections, map and order them explicitly there
as required by that contract.

### Projection mappings

Mappings used by `ProjectToType<TResponse>()` must remain translatable by EF
Core. Keep nested navigation paths, calculations, and ordered collection
expressions directly in the Mapster configuration. Do not call arbitrary
helper methods that EF Core cannot translate inside projection expressions.
Compile the registered Mapster configuration in tests and execute relational
list/detail queries for mappings used by database projection.

### Practical rule

Use Mapster for ordinary same-name scalar properties. Write explicit mappings
only for differences, calculations, normalization, navigation names,
ordering, and protected members. Prefer clear response-specific mappings over
generic abstractions.

## 5. Tenant safety and relationships

`ICurrentCompanyContext` is the only tenant source inside feature services:

```csharp
public sealed class FeatureService(
    ApplicationDbContext dbContext,
    ICurrentCompanyContext currentCompanyContext)
    : IFeatureService, IScopedService
{
    private readonly int companyId = currentCompanyContext.CompanyId;
}
```

Every company-owned operation must:

- Filter list, select, get, update, and delete queries by `companyId`.
- Assign `companyId` during create.
- Scope duplicate checks by `companyId`.
- Validate both the ID and `companyId` of company-owned foreign keys.
- Return `NotFound` for another company's record.
- Retain `companyId` in every `IgnoreQueryFilters()` query.
- Avoid parsing JWT claims again inside the service.

### Outgoing foreign keys

Before saving, confirm that each referenced record:

- Exists.
- Belongs to the selected company when tenant-owned.
- Is active when inactive records are not allowed.
- Has the required classification, such as product store versus container
  store.

Load bounded related ID sets in one query. Do not query once per request line.

### Incoming foreign keys and deletion

Before deleting a record:

1. Find every incoming foreign key in entities, configurations, migrations, and
   services.
2. Decide whether current dependents, historical dependents, or both block
   deletion.
3. Keep `DeleteBehavior.Restrict` for ERP master data unless an approved
   business rule requires something else.
4. Return a clear `409 Conflict` before calling `Remove`.
5. Test deletion with and without dependents.

`AuditableEntityInterceptor` converts `Remove` into an update that sets
`IsDeleted = true`. Therefore, database `Restrict` foreign keys do not block
soft deletion of a referenced master record. Every approved current or
historical dependency must be checked explicitly in the principal service
before calling `Remove`.

Do not use another master record as an indirect substitute for checking a
direct incoming foreign key when that master relationship can be updated. A
later update can point the master to a new record while historical documents
and movements still reference the old one. Check those direct current and
historical reference tables explicitly.

This review is continuous. Whenever a later feature adds a foreign key to an
existing entity, return to that entity's delete flow immediately. If the new
reference is an approved blocker, add its direct dependency check, including
`IgnoreQueryFilters()` and the explicit `companyId` filter when historical
tenant data must be considered. Update the error documentation and deletion
tests in the same change.

Do not rely on `DbUpdateException` as normal delete validation.

### Current BusinessPartner rules

- `BusinessPartner` is shared by customers and suppliers.
- Name, code, and optional tax number are unique per company according to the
  current case-insensitive service rule; update excludes the current ID.
- The database unique indexes remain the final duplicate protection.
- Partner currency is the single current document currency.
- Currency cannot change after any current or historical invoice, partner
  opening balance, business-partner movement, container movement, or driver
  trip exists.
- Deletion is blocked by current or historical container stores and by all
  current or historical financial references listed above.
- Dependency checks using `IgnoreQueryFilters()` must still filter by
  `companyId`.
- Partner balance is derived per partner and currency. It is not stored on the
  partner master record.

## 6. Transactions and concurrency

Keep concurrency handling proportional to the current feature:

- Use one transaction when a multi-step write must succeed or fail as a unit.
- Do not wrap a single normal CRUD `SaveChangesAsync` in a transaction without
  a concrete atomicity requirement.
- A master-detail relationship alone is not a reason for an explicit
  transaction. Build the complete header and detail state and save it with one
  `SaveChangesAsync`; the relational EF Core provider makes that save atomic.
  Use an explicit transaction only when the workflow has multiple saves,
  contexts, or side-effect writes that must commit or roll back together.
- Do not add explicit SQL lock hints, raw SQL lock helpers, or application lock
  services.
- Do not change an existing isolation level without a reproduced problem and
  explicit approval.
- Use a RowVersion token when a lost update would be harmful.
- For aggregate documents, RowVersion belongs only to the header.
- An update must receive the token returned by the read response and assign
  that client token as EF Core's original value.
- Never replace the client's token with the latest database token before save.
- Touch a header field such as `LastModifiedAt` for line-only updates so the
  header RowVersion advances.
- Catch `DbUpdateConcurrencyException` only where the feature has an explicit
  concurrency result, then return a clear conflict telling the user to reload.
- Do not add RowVersion to child rows without an independent child update
  workflow.

For unique values:

- Pre-check the normalized value and return `Error.Conflict`.
- Keep a database unique index as final protection.
- Confirm that the production collation/index behavior matches the approved
  case-sensitivity rule.
- The normal CRUD policy lets an unexpected concurrent constraint failure flow
  to the global exception handler.
- Add targeted database-exception translation only when an approved API
  contract requires it.

### Complete-set child assignments

For an existing workflow such as StoreContainer where one screen owns the full
child set:

- Accept the complete desired ID set, not a delta.
- Reject null, invalid, unbounded, or duplicate IDs.
- Document whether an empty set clears all active assignments.
- Validate the tenant-owned parent and all children in bulk.
- Load the current assignments once and calculate changes in memory.
- An editable complete-set workspace must include inactive children that are
  still actively assigned. Mark them as unavailable for new selection, but
  keep them visible and removable so stale assignments are not hidden.
- Preserve soft-deleted history.
- Keep the existing transaction boundary so partial replacement cannot commit.
- Make repeated identical requests idempotent.
- Return the complete final ordered set.

Keep this logic in the current service. Do not build a generic assignment
framework.

## 7. Queries, projection, and pagination

- Use `AsNoTracking()` for read-only queries.
- Filter and order before materialization.
- Use Mapster `ProjectToType` or a direct `Select` for response projection.
- Avoid `Include` when projection can return the required shape.
- Never run a database query inside a loop over response or request rows.
- Use `AnyAsync` when only existence is needed.
- Use deterministic ordering with a stable final key such as `Id`.
- Use `IPaginationService` for growing lists.
- Keep small `Id`/`Name` select endpoints unpaginated.
- Aggregate list responses must include the complete ordered child collections
  required by the current frontend.

Avoid N+1 queries, repeated full-table scans, and unbounded entity
materialization. Do not introduce complex query abstractions for a single
query.

### Paginated `GetAll` filters

Every paginated `GetAll` endpoint exposes a typed, optional filter request,
following the Invoice pattern. Filters are applied with `AND` semantics after
tenant and soft-delete scoping, while deterministic ordering and the existing
pagination metadata are preserved.

Use the common `search` field for resource-wide text search wherever the
resource has searchable display values. Invoice filters include `search` and
apply it across invoice, partner, store, country, driver, vehicle, product,
and container display values.

Filter contracts contain only supported, resource-specific fields and have
FluentValidation validators for length, ID, enum, and date-range rules, using
Arabic validation messages. Controllers bind the filter contracts from the
query string, services apply them to the database query, and Swagger lists the
available query fields and their validation rules. Adding filters is a
service/contract documentation change and must not require a database
migration.

## 8. Canonical invoice behavior

This section describes the implemented invoice feature and overrides older
posting-oriented guidance.

### Scope

The invoice aggregate supports:

- Sales.
- Sales return.
- Purchase.
- Purchase return.
- Paginated list, get by ID, create, update, and soft delete.
- A required product-line collection and a required container-line collection;
  send `[]` when there are no container lines.
- Current operational item, container, partner, and internal-driver side
  effects.

It does not support:

- Document status or posting.
- Cancellation or reversal.
- Original-invoice allocation for returns.
- Journal entries or a general ledger.
- Receipt/payment vouchers.
- Voucher allocations.

Returns are independent invoices. A purchase return must pass the same stock
rules as any other outbound invoice.

### Aggregate and server-derived values

`Invoice`, `InvoiceLine`, and `InvoiceContainerLine` are one aggregate.

- `InvoiceNumber` is generated by the server.
- The current format is
  `INV-{CompanyId}-{UTC timestamp}-{8-character GUID suffix}`.
- Active invoice numbers are protected by the unique
  `(CompanyId, InvoiceNumber)` index.
- `CompanyId` comes from `ICurrentCompanyContext`.
- `Currency` comes from the selected business partner.
- `ItemUnitId` comes from the selected item.
- The partner, product store, items, item units, and internal driver must be
  active and available in the selected company.
- Optional `CountryId` must reference an active global Country.
- A supplied `ContainerStoreId` is validated even when `ContainerLines` is
  empty; it must be an active company container store owned by the selected
  partner.
- The client sends `Count`, `Weight`, and `Price`.
- The server calculates quantity, line total, subtotal, net total, payment
  status, and remaining amount.
- Use `decimal` and `InvoiceAmountRules`; never use `float` or `double`.
- Repeated item IDs and repeated container IDs are rejected.
- `Lines` contains 1–100 rows. `ContainerLines` contains 0–100 rows.
- Each product line requires `Count > 0`, `Weight > 0`, and `Price >= 0`
  within the configured precision and scale.
- `DueDate` is optional and cannot precede `InvoiceDate`.
- Update replaces the requested aggregate state while preserving identity and
  audit history.

Calculations:

```text
Quantity        = Count * Weight
LineTotal       = Round(Quantity * Price, 2, AwayFromZero)
Subtotal        = SUM(rounded LineTotal)
Total           = Round(Subtotal - DiscountAmount, 2, AwayFromZero)
RemainingAmount = Total - PaidAmount
```

`DiscountAmount` must be between zero and `Subtotal`. `PaidAmount` must be
between zero and `Total`. Quantity uses precision 18/scale 6; money uses
precision 18/scale 2.

### PaymentTerm

Use the strongly typed enum:

```text
Cash   = 1
Credit = 2
```

- The backend request receives `PaymentTerm` explicitly.
- The frontend create form defaults to `Cash`.
- The entity/database Cash default exists for persistence and existing-data
  safety; it is not a backend request default.
- A Cash invoice must be fully paid: `PaidAmount == Total`.
- Cash has `RemainingAmount == 0` and creates no
  `BusinessPartnerMovement`.
- A Credit invoice may be unpaid, partially paid, or fully paid.
- Credit creates one partner movement only when
  `RemainingAmount > 0`.
- The partner movement amount is exactly the remaining amount, not the total.
- A fully paid Credit invoice creates no outstanding partner movement.
- `PaymentStatus.Unpaid = 1` and `PaymentStatus.Paid = 2`.
- `RemainingAmount <= 0` is Paid; otherwise it is Unpaid.
- A partially paid Credit invoice remains Unpaid. There is no partially-paid
  status.
- A zero-total invoice is Paid and creates no partner movement.

Partner direction:

| Invoice type | Partner role | Partner movement |
|---|---|---|
| Sales | Customer | Debit |
| Sales return | Customer | Credit |
| Purchase | Supplier | Credit |
| Purchase return | Supplier | Debit |

Partner balances must be evaluated from active, non-deleted records per
`CompanyId`, `BusinessPartnerId`, and `Currency`. Active partner opening
balances remain separate records and contribute according to
receivable/payable direction; active outstanding
`BusinessPartnerMovement` rows contribute by debit/credit direction.

There is currently no receipt/payment voucher or partner-balance reporting
service. Do not describe one as implemented.

### Product stock

| Invoice type | Stock effect |
|---|---|
| Sales | Quantity out |
| Sales return | Quantity in |
| Purchase | Quantity in |
| Purchase return | Quantity out |

Current stock is derived from:

```text
SUM(active StockOpeningBalanceLine.Quantity)
+ SUM(active ItemMovement.QuantityIn - ItemMovement.QuantityOut)
```

Always filter by:

```text
CompanyId + StoreId + ItemId
```

The product store must be active, belong to the selected company, and have
`IsContainerStore = false`.

Every active, non-deleted `ItemMovement` contributes through its actual
`QuantityIn - QuantityOut` values. Do not hard-code a partial movement-type
list that omits adjustments or other existing movement rows.

Stock validation must preserve these implemented rules:

1. When timeline validation runs, validate the complete chronological balance,
   not only the final balance.
2. Opening balances are processed first on a date.
3. Inbound movements are processed before outbound movements on the same date.
4. The proposed invoice is ordered last among movements of the same direction
   and date.
5. When validation runs, reject any negative point in the resulting affected
   timeline.
6. On update, exclude the old invoice movements, add the proposed state, and
   validate the exact affected old/new `(StoreId, ItemId)` pairs.
7. Do not validate an unrelated Cartesian product of stores and items.
8. Store, date, type, line additions/removals, and reduced inbound quantities
   must all validate the resulting history.
9. Removing an inbound invoice during update or delete must be rejected when a
   later outbound movement would become unsupported.
10. A new inbound Purchase or Sales return skips timeline validation because
    it only adds stock; inbound updates and inbound deletes still validate the
    complete affected history.
11. Update reference ID and reference number must be both present or both
    absent. Existing invoice movements are excluded only when both
    `ReferenceId` and `ReferenceNumber` match.
12. The invoice validation and movement save remain inside the existing
    aggregate transaction.

Do not replace the timeline check with only a current-balance check.

### Containers

- Container lines are allowed only for Sales and Sales return.
- `ContainerStoreId` is required when container lines exist.
- The store must be the active container store for the selected partner and
  company.
- Every container must be active and assigned to that store.
- `OutgoingUnits` and `IncomingUnits` may both be positive.
- They cannot both be zero.
- Each container line creates the matching `ContainerMovement`.

Container balance is derived from:

```text
SUM(active ContainerMovement.OutgoingUnits - IncomingUnits)
```

### Drivers

| Case | UsesExternalDriver | DriverId | ExternalDriverName |
|---|---:|---:|---|
| No driver | `false` | `null` | `null` |
| Internal driver | `false` | required | `null` |
| External driver | `true` | `null` | required |

- An internal driver must be active and belong to the selected company.
- An internal driver creates one `DriverTrip`.
- The trip links the company, driver, invoice, and business partner and copies
  the invoice number, export code, and invoice date.
- External driver data remains only on the invoice.
- Never create a `Driver` or `DriverTrip` for an external driver.
- `VehicleNumber` remains an optional invoice value in all driver modes.

### Side-effect synchronization

Create saves the aggregate and current operational side effects in one
transaction:

- One `ItemMovement` per active product line.
- One `ContainerMovement` per active container line.
- One `BusinessPartnerMovement` for an outstanding Credit invoice.
- One `DriverTrip` when an internal driver is selected.

Update:

- Requires the current 8-byte header RowVersion.
- Updates `LastModifiedAt`.
- Replaces the active aggregate line state.
- Removes the invoice's old active side effects.
- Recreates side effects from the new saved state.
- Commits only when the full replacement succeeds.

Delete:

- Validates historical stock when removing an inbound effect could create a
  later shortage.
- Soft-deletes the invoice, lines, container lines, and active side effects.
- Does not create posting, cancellation, or reversal records.

## 9. API, errors, authorization, and Swagger

Use the shared result-to-HTTP path. Controllers must not create feature-specific
error response objects.

Use:

- `Error.Validation` for invalid input or IDs.
- `Error.NotFound` for unavailable requested or referenced records.
- `Error.Conflict` for persisted unique-value duplicates, dependencies, stale
  RowVersion, insufficient stock, or invalid state.
- `Error.Unauthorized` and `Error.Forbidden` for access failures.

Duplicate IDs inside one request collection are validation errors (`400`), not
persisted-data conflicts.

Every application error uses `application/problem+json` and the shared
`ApiErrorResponse` with these nine properties:

```text
type
title
status
detail
instance
errorCode
errorType
errors
traceId
```

Field-targeted errors pass `nameof(RequestType.Property)` to `Error` so the
message appears under the correct case-sensitive request-property key.
Non-field errors use `errors.General`; malformed JSON uses `$`.

Authorization defaults:

| Operation | Access |
|---|---|
| List, select, get | Authenticated |
| Create, update, delete | `Admin` |
| Login and refresh | Explicitly anonymous |

Access tokens carry the selected company, current roles, and the Identity
security stamp. Token validation rechecks the active `UserCompany` assignment
and security stamp on every request. Removing the selected company or changing
roles invalidates the old access token; refresh or login issues current claims.

Swagger must document:

- Required fields and tenant context.
- Validation limits and conditional rules.
- Enum names and values through the shared enum filters.
- Foreign-key, active-state, and company rules.
- Pagination parameters.
- Applicable `400`, `401`, `403`, `404`, and `409` responses.
- The shared `ApiErrorResponse` only for declared errors.

`UnifiedErrorResponseSwaggerFilter` remains the final operation filter.
Whenever a route, contract, enum, validation rule, authorization rule, default,
or response changes, inspect the generated OpenAPI document or Swagger UI.

## 10. Frontend integration

The frontend repository is:

```text
E:\client\client
```

General CRUD integration uses:

```text
E:\client\client\src\components\ErpShell.tsx
E:\client\client\src\components\EntityPage.tsx
```

Invoices use the specialized aggregate page:

```text
E:\client\client\src\components\InvoicePage.tsx
```

Frontend rules:

- Navigation keys must match the rendered feature configuration.
- Match request requiredness, nullability, enum names, and numeric precision.
- Never send `CompanyId`.
- Load foreign keys from existing select endpoints when their response is
  sufficient.
- Add a specialized selector only when the current page needs additional data.
- Show every response field required by the workflow.
- Send the current RowVersion when the aggregate update contract includes it.
- Send complete aggregate line collections, not line deltas.
- Invoice `PaymentTerm` is a required Cash/Credit select and defaults to Cash
  only in the frontend.
- Cash keeps `PaidAmount` equal to the calculated total.
- API authorization remains the security boundary; hidden buttons are only a
  UI convenience.

Verify:

```powershell
Set-Location E:\client\client
npm.cmd run build
```

Manually confirm navigation, list paging, create, edit, delete, error display,
company switching, optional values, and RowVersion refresh.

## 11. Migrations, seeds, and deployment

### Migration approval gate

- A model change requires a migration.
- Do not generate the migration until the entity/configuration design is
  reviewed and the user explicitly approves migration generation.
- Do not generate a migration for a service-only, validation-only, Swagger-only,
  test-only, or frontend-only change.

After approval:

```powershell
dotnet ef migrations add MigrationName `
  --project E:\MiniErp\src\MiniErp.Infrastructure `
  --startup-project E:\MiniErp\src\MiniErp.Api
```

Review:

- `Up`, `Down`, and the model snapshot.
- Column type, nullability, length, precision, and default values.
- Existing-data backfill.
- Index filters and case/soft-delete behavior.
- Foreign-key names and delete behavior.
- Absence of unrelated model changes.

Then run:

```powershell
dotnet ef migrations has-pending-model-changes `
  --project E:\MiniErp\src\MiniErp.Infrastructure `
  --startup-project E:\MiniErp\src\MiniErp.Api
```

Do not manually edit the snapshot unless a generated migration is being
carefully repaired.

Startup behavior:

- `Database:ApplyMigrationsOnStartup=true` applies pending migrations before
  serving requests.
- Never deploy an unreviewed migration while that option is enabled.
- `Seed:Enabled=true` runs idempotent seed logic.
- Seed passwords, JWT signing keys, and connection strings come from deployment
  configuration.
- Seed reruns must not delete or duplicate existing business data.
- Company-owned seed lookups include `CompanyId`.
- Verify fresh and existing databases when seed or migration behavior changes.

## 12. Verification and definition of done

Test only applicable behavior, but record why a case is not applicable.

### Minimum feature scenarios

Read:

- Empty and populated lists.
- Existing, missing, deleted, and other-company IDs.
- Deterministic ordering and pagination metadata.
- Select endpoints include only allowed active records.

Create:

- Valid request.
- Required and boundary validation.
- Normalized duplicate values, including case-only differences when relevant.
- Missing, inactive, deleted, and other-company foreign keys.
- Server-owned and calculated values cannot be overridden.

Update:

- Valid update.
- Missing entity.
- Duplicate belonging to another entity.
- Own unchanged unique value succeeds.
- Aggregate child addition, change, and removal.
- Valid and stale RowVersion when the feature uses it.

Delete:

- Missing entity.
- No dependents.
- Current dependents.
- Historical dependents according to the approved rule.
- Soft-delete filtering and audit behavior.

Cross-cutting:

- Tenant isolation remains explicit.
- Audit actor and UTC timestamps are correct.
- Failed multi-step writes leave no partial data.
- Swagger matches the serialized contract.
- Frontend production build passes when the contract or UI changes.
- No unrelated working-tree changes are overwritten.

### Additional invoice scenarios

- All four invoice directions.
- Cash fully paid and no partner movement.
- Credit unpaid, partially paid, and fully paid.
- Discount and paid-amount boundaries.
- Empty, exact, and insufficient stock.
- Historical stock conflict after changing store, date, type, or lines.
- Opening balance before same-date inbound and outbound movements.
- Exact affected store/item pairs only.
- Container-store ownership and assigned-container checks.
- Internal, external, and no-driver cases.
- Side-effect replacement on update.
- Side-effect soft deletion on delete.
- Stale header RowVersion.
- Transaction rollback after an intermediate failure.

Use a relational provider for database constraints, transactions, query
filters, and RowVersion behavior. EF Core's in-memory provider is not evidence
for those behaviors.

### Backend source-change commands

```powershell
Set-Location E:\MiniErp

dotnet build .\MiniErp.slnx `
  --configuration Release `
  --no-restore

dotnet test .\MiniErp.slnx `
  --configuration Release `
  --no-restore

dotnet format .\MiniErp.slnx `
  --verify-no-changes `
  --no-restore
```

These commands are required when backend source code changes. For a
documentation-only change, review the Markdown structure, links, terminology,
and `git diff --check`; do not run unrelated builds merely to produce activity.

Run the client build only when frontend code or an API contract changes. Run
the pending-model check only when the EF model or migration changes. Inspect
Swagger/OpenAPI only when an endpoint contract or Swagger documentation
changes.

### Completion gate

A change is complete only when:

- Scope and non-goals are explicit.
- A repository search identified affected producers and consumers.
- Tenant filters and foreign keys are correct.
- Every new foreign key was traced back to the existing principal lifecycle,
  and required update or delete checks were changed in the same work.
- Delete and historical-data behavior are documented and tested.
- Validation, Mapster mapping, service behavior, responses, and Swagger agree.
- Migration approval and review are complete when applicable.
- Frontend integration is complete or recorded as `N/A` with a reason.
- Applicable edge cases have automated coverage.
- Build, tests, formatting, and relevant client/migration/Swagger checks pass.
- No unrelated user changes were overwritten.

Completion reports state:

1. What changed.
2. Other services and consumers checked.
3. Shared-contract impact.
4. Incoming and outgoing foreign keys.
5. Delete and historical-data decision.
6. Migration and seed impact.
7. Backend, frontend, Swagger, and automated verification performed.
8. Untested cases, accepted tradeoffs, and known risks.
