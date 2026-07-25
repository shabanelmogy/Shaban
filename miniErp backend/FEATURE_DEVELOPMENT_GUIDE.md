# MiniErp Feature Development Guide

Use this guide whenever adding or changing a feature. The goal is to keep the
Domain, Application, Infrastructure, and API layers consistent and to prevent a
change in one feature from silently breaking another feature.

## MiniErp project baseline

Every feature should use the existing project conventions unless an
architectural decision explicitly changes them:

- Controllers inherit `ApiControllerBase`, which supplies the versioned route
  `/api/v{version}/[controller]` and the default `[Authorize]` policy.
- Use `[Authorize(Roles = "...")]` for restricted operations and
  `[AllowAnonymous]` only for intentionally public authentication endpoints.
- Use direct application services with `ApplicationDbContext`; do not add
  CQRS, MediatR, or repository classes for this small application.
- Every tenant-owned entity inherits `AuditableEntity`, declares its own
  integer `Id`, and contains `CompanyId`. The selected company comes from the
  authenticated access token, never from a tenant CRUD request DTO.
- Access tokens contain exactly one valid `company_id`. Authentication rejects
  a missing, malformed, or repeated company claim before a controller or
  tenant service runs.
- Tenant services inject the scoped `ICurrentCompanyContext`, capture its
  validated `CompanyId` once, and keep explicit company filters in all queries.
- Implement service interfaces with `IScopedService`; Scrutor discovers and
  registers them automatically.
- Use `Result`/`Result<T>` for expected business failures and the global
  exception handler for unexpected request exceptions.
- `AuditableEntityInterceptor` populates audit information and converts
  `Remove` operations for `AuditableEntity` records into soft deletes.
- Normal queries use the global `IsDeleted` filter. Use `IgnoreQueryFilters()`
  only when historical or administrative records must be included.
- Use Mapster for command mapping and server-side projection for reads. Use the
  shared pagination service for growing list endpoints.
- Startup can apply pending migrations and run idempotent seed data according
  to `Database:ApplyMigrationsOnStartup` and `Seed:Enabled`. Keep passwords,
  connection strings, and JWT secrets in deployment configuration or a secret
  store.
- Swagger is configuration-controlled and the root URL redirects to the
  Swagger UI when Swagger is enabled.
- For every feature exposed in the React application, add a matching sidebar
  item and CRUD configuration in the separate client project. Backend Git
  operations do not include the client repository automatically.

### Current simplified document policy

For the current MiniErp scope, transaction documents are editable CRUD
aggregates. This policy overrides lifecycle and movement guidance elsewhere in
this guide unless the user separately approves a new requirement:

- Do not add `DocumentStatus`, draft/posted/cancelled states, post or cancel
  endpoints, reversal workflows, or posting/cancellation audit fields.
- Use explicit transactions for aggregate create, update, and soft delete so
  header and line changes are atomic.
- Use a row-version token only on aggregate headers. Require the token returned
  when the document was loaded and assign that client token as EF Core's
  original value; never replace it with the latest database token before
  saving. Update a header field such as `LastModifiedAt` for every aggregate
  update, including line-only changes, so every successful update advances the
  token. Catch `DbUpdateConcurrencyException` and return a clear conflict that
  tells the user to reload the document and try again. Do not add row-version
  tokens to child rows while children have no independent update workflow.
- Keep audit population solely in `AuditableEntityInterceptor`.
- Product-document `StoreId` values must reference an active store in the
  selected company with `IsContainerStore = false`.
- Do not generate movement or driver-trip records from document CRUD unless a
  later, separately approved requirement explicitly introduces that behavior.
- Paginated aggregate list responses include the complete deterministically
  ordered child collections required by the frontend, not header-only rows.
  Keep count fields when useful, but do not use a count as a replacement for
  line or allocation details.

## 1. Define the feature before coding

Write down the following:

- Feature name and business purpose.
- API operations: list, select, get, create, update, and delete.
- Users or roles allowed to use each operation.
- Entities and tables that will be read or changed.
- Whether each entity is global or company-owned, including every query and
  foreign key that must be restricted to the selected company.
- Existing services, response models, or endpoints that may be affected.
- Validation, uniqueness, and active/inactive rules.
- Whether deletion is physical or soft deletion.
- Which operations are intentionally public, authenticated, or role-restricted.
- List sorting, pagination, selection behavior, and the exact response shape.
- Audit, seed, migration, and deployment configuration impact.

Do not start implementation until the affected entities and relationships are
known. Record `N/A` with a reason when an operation or concern does not apply.

## 2. Mandatory impact confirmation

Before changing a feature, answer every question in this table. A `Yes` answer
must include the affected component and the verification that will be run.

| Question | Yes/No | Affected component | Required verification |
|---|---|---|---|
| Does this change another application service? | | | Service and integration tests |
| Does it change a shared request or response model? | | | All API consumers and Swagger |
| Does it change entity mapping or database schema? | | | Migration and pending-model check |
| Does another table reference this entity? | | | Foreign-key and delete checks |
| Does this entity reference another table? | | | Validate the referenced record |
| Does it affect authentication, roles, or claims? | | | Authorized and unauthorized requests |
| Does it affect company ownership or tenant isolation? | | | Cross-company read/write and foreign-key tests |
| Does it affect seed data? | | | Fresh and existing database startup |
| Does it affect audit fields or the current user? | | | Create/update/delete audit values |
| Does it change filtering, selection, or active-state behavior? | | | List and select endpoints |
| Does it require a client page or sidebar item? | | | Client navigation, CRUD flow, and production build |

Search the repository before deciding that a change is isolated:

```powershell
rg -n "EntityName|EntityId|IEntityService|EntityResponse" src
```

Check controllers, services, mappings, validators, configurations, migrations,
seeders, and navigation properties. Do not confirm "no impact" from the service
file alone.

## 3. Place code in the correct layer

```text
MiniErp.Domain
  Entities and business rules

MiniErp.Application
  Requests, responses, validators, service interfaces, and mappings

MiniErp.Infrastructure
  EF Core configurations, service implementations, Identity, and persistence

MiniErp.Api
  Controllers, HTTP responses, authorization, and Swagger documentation
```

Recommended feature layout:

```text
src/MiniErp.Application/Features/FeatureName/
  IFeatureNameService.cs
  FeatureNameRequest.cs
  FeatureNameRequestValidator.cs
  FeatureNameResponse.cs
  FeatureNameMappingRegister.cs

src/MiniErp.Infrastructure/Services/FeatureName/
  FeatureNameService.cs

src/MiniErp.Api/Controllers/
  FeatureNameController.cs

src/MiniErp.Api/Swagger/
  FeatureNameSwaggerDocumentation.cs

G:/test/miniErp/client/src/components/
  ErpShell.tsx (sidebar item and feature configuration)
  EntityPage.tsx (shared CRUD behavior and reusable field types)
```

Application services should return `Result<T>` for expected business failures.
Use the matching error type:

- `Error.Validation` for invalid input or identifiers.
- `Error.NotFound` when a requested or referenced record does not exist.
- `Error.Conflict` for duplicate values, dependent records, or invalid state.
- `Error.Unauthorized` and `Error.Forbidden` for access failures.

Unexpected database or infrastructure failures should remain exceptions and be
handled by the global exception handler.

Entity requiredness and input normalization follow these rules:

- Every future entity declares its integer `Id` inside the entity class. Do not
  move entity IDs into `AuditableEntity`.
- Every company-owned entity declares `int CompanyId` and a `Company`
  navigation property. Global entities must be explicitly identified as such.
- Do not use the C# `required` keyword on entity or Identity properties.
- Place each reference navigation property immediately below its foreign-key
  property in Domain and Identity entity classes. Keep collection navigation
  properties after the scalar and foreign-key/navigation pairs.
- Initialize non-nullable entity strings with `string.Empty` when needed for
  CLR safety only.
- Configure database requiredness in the EF Core configuration with
  `.IsRequired()`.
- Validate API request required fields with FluentValidation (`NotEmpty`,
  length, and other business rules).
- Put string normalization such as `Trim()` in the feature's Mapster mapping
  file. Services must use the mapped value and must not trim the same request
  fields again.
- Put bounded business values in a named Domain enum with explicit stable
  numeric values, such as `CurrencyCode`. Confirm API serialization and EF
  storage intentionally; never reorder or reuse a persisted enum value.
- When only an entity design is requested for review, stop after the Domain
  entity and related Domain enum. Do not add a `DbSet`, EF configuration,
  service, endpoint, seed, or migration until the design is approved.

Current master-data decision: `BusinessPartner` is shared by customers and
suppliers. A sales or purchase invoice determines the partner's role; do not
add duplicate Customer/Supplier entities or a type flag unless the business
rule changes. Current balance is derived from opening entries, invoices,
returns, and payments rather than stored as a mutable master-data value.

For create and update commands, check duplicate normalized values with
`AnyAsync` before calling `Add` or `SaveChangesAsync`. Keep the database unique
index as the final protection, but do not wrap normal CRUD add, update, or
delete operations in local `try/catch` blocks. Unexpected exceptions flow to
the global exception handler.

## 4. Foreign-key checks are required

Before implementing create, update, or delete, inspect both directions of every
relationship.

### Outgoing foreign keys

If the new or updated entity contains a foreign key, verify that the referenced
record exists before saving. Also verify active state when inactive parent
records must not be selected.

For a company-owned entity, the foreign-key lookup must also use the selected
`companyId`. An ID belonging to another company must behave as unavailable.

```csharp
var parentExists = await dbContext.Parents.AnyAsync(
    parent => parent.Id == request.ParentId && parent.IsActive,
    cancellationToken);

if (!parentExists)
{
    return Result<FeatureResponse>.Failure(
        Error.NotFound(
            "Parents.NotFound",
            $"Active parent with ID {request.ParentId} was not found."));
}
```

### Incoming foreign keys

Before deleting an entity, find every table that references it. Check:

- Entity navigation properties.
- `IEntityTypeConfiguration<T>` classes.
- `HasForeignKey`, `OnDelete`, and `DeleteBehavior` calls.
- Existing migrations and the model snapshot.
- Services that query the entity ID without a navigation property.

Useful searches:

```powershell
rg -n "HasForeignKey|OnDelete|DeleteBehavior" src/MiniErp.Infrastructure
rg -n "EntityNameId|EntityName" src -g "*.cs"
```

Never assume that the database will safely choose the intended delete behavior.

Global query filters also affect dependency checks. Explicitly decide whether
soft-deleted dependents still count. Use a normal query when only current
records should block deletion, or `IgnoreQueryFilters()` when current and
historical records must both block deletion.

If the entity has no incoming foreign keys, record that the repository search
found none and still document the selected soft-delete or physical-delete
behavior.

## 5. Choose delete behavior explicitly

Choose one of these behaviors for every relationship:

| Behavior | Use when | Service behavior |
|---|---|---|
| Restrict | Dependent data must prevent deletion | Check dependents and return `409 Conflict` |
| Cascade | Dependents have no meaning without the parent | Document and test all rows that will be deleted |
| Set null | The relationship is optional after deletion | Confirm the foreign key is nullable |
| Soft delete | Records must remain for history or auditing | Mark inactive/deleted and filter normal queries |

Prefer `DeleteBehavior.Restrict` for ERP master data unless the business rule
explicitly requires cascading deletion.

```csharp
builder.HasOne(entity => entity.Parent)
    .WithMany(parent => parent.Children)
    .HasForeignKey(entity => entity.ParentId)
    .OnDelete(DeleteBehavior.Restrict);
```

For restricted deletion, check dependencies in the service before calling
`Remove`:

```csharp
var hasDependencies = await dbContext.Children.AnyAsync(
    child => child.ParentId == id,
    cancellationToken);

if (hasDependencies)
{
    return Result.Failure(
        Error.Conflict(
            "Parents.HasDependencies",
            "The parent cannot be deleted because dependent records exist."));
}
```

Do not rely on a `DbUpdateException` as normal delete validation. The service
should return a clear business error before the database rejects the operation.

### Delete confirmation gate

Do not complete a delete feature until all statements are true:

- [ ] All incoming foreign keys have been identified.
- [ ] Query-filter behavior for current and historical dependents is confirmed.
- [ ] The EF Core delete behavior is explicitly configured.
- [ ] The business owner has chosen restrict, cascade, set-null, or soft delete.
- [ ] Restricted deletes return `409 Conflict` with a clear error code.
- [ ] Cascade deletes have tests proving exactly which records are removed.
- [ ] Soft-deleted records are excluded from normal list and select queries.
- [ ] Delete behavior is tested with and without dependent records.

## 6. Create and update checks

For create and update operations, confirm:

- IDs are greater than zero when applicable.
- Required strings are trimmed in Mapster mapping and validated with
  FluentValidation.
- Unique codes or names are checked with `AnyAsync` before saving, excluding
  the current entity on update.
- CRUD services do not use local `try/catch` around add, update, or delete;
  unexpected failures are handled by the global exception handler.
- Every foreign-key record exists.
- Required parent records are active.
- Mapping does not overwrite IDs or creation audit fields during update.
- The returned response contains the saved relationship details expected by the
  frontend.
- The duplicate check uses the same normalized value produced by Mapster and
  the update check excludes the current ID.

### Global FluentValidation message configuration

The API uses one global Arabic FluentValidation configuration. `Program.cs`
must call the configuration once during startup, before request validation is
executed:

```csharp
ArabicValidationConfiguration.Configure();
```

`AddValidatorsFromAssemblyContaining<ApplicationAssemblyMarker>()` discovers
the feature validators, and SharpGrip automatic validation resolves and runs
the matching `AbstractValidator<TRequest>` before the controller action. When
a rule fails, FluentValidation reads `ValidatorOptions.Global` configured by
`ArabicValidationConfiguration`:

- `LanguageManager` maps the internal rule key, such as
  `NotEmptyValidator` or `MaximumLengthValidator`, to the Arabic message
  template.
- `DisplayNameResolver` maps the request property name, such as `Name`, to its
  Arabic display name from the shared `DisplayNames` dictionary.
- FluentValidation replaces placeholders such as `{PropertyName}`,
  `{MaxLength}`, `{ComparisonValue}`, `{From}`, and `{To}` at runtime.
- A rule-level `.WithMessage(...)` overrides the global template and should be
  used only for a clearer feature-specific or conditional business message.
- `ArabicValidationResultFactory` controls the HTTP `400` ProblemDetails title
  and detail; it is separate from the rule-message configuration.

Example:

```csharp
RuleFor(request => request.Name)
    .NotEmpty()
    .MaximumLength(200);
```

With `DisplayNames["Name"] = "الاسم"`, the resulting messages include
`حقل الاسم مطلوب.` and
`يجب ألا يتجاوز طول الاسم عدد 200 حرفًا.`

Whenever a new request property is introduced, add its Arabic display name to
`ArabicValidationConfiguration.DisplayNames`. If it is omitted, validation
still works, but the property name inside the message falls back to its CLR
name in English. JSON property names and stable error codes remain unchanged;
only the user-facing text is localized.

Use the exact case-sensitive CLR property name as the dictionary key because
the dictionary uses `StringComparer.Ordinal`:

```csharp
private static readonly IReadOnlyDictionary<string, string> DisplayNames =
    new Dictionary<string, string>(StringComparer.Ordinal)
    {
        // Existing shared fields...
        ["InvoiceNumber"] = "رقم الفاتورة",
        ["InvoiceDate"] = "تاريخ الفاتورة",
        ["StoreId"] = "المخزن",
        ["DriverId"] = "السائق"
    };
```

Do not add the JSON camel-case name, such as `invoiceNumber`, when the CLR
property is `InvoiceNumber`. Reuse a shared translation when the property has
the same meaning across features. If the same CLR property name needs a
different meaning in one feature, keep the shared translation general or use
`.WithName("...")` on that feature's rule instead of changing every feature.

The global configuration runs only in hosts that call `Configure()`. Validator
unit tests or other executables that instantiate validators without starting
the API must call `ArabicValidationConfiguration.Configure()` once in their
test or host setup. Verify at least one automatic API validation response, not
only a direct validator call, so the rule text and Arabic ProblemDetails result
factory are both covered.

## 7. Invoice and movement rules

MiniErp does not use journal vouchers or a general ledger. Operational
movements are the source of truth for partner balances and store stock. Do not
store mutable current-balance columns on `BusinessPartner`, `Item`, or `Store`.

### Shared business partner and invoice direction

`BusinessPartner` represents both customers and suppliers. Do not add a
customer/supplier discriminator to the partner. The document or movement type
determines how the partner is being used:

| Invoice type | Partner role | Store effect | Partner movement |
|---|---|---|---|
| Sales invoice | Customer | Quantity out | Debit |
| Sales return | Customer | Quantity in | Credit |
| Purchase invoice | Supplier | Quantity in | Credit |
| Purchase return | Supplier | Quantity out | Debit |

Other partner movements follow the same debit/credit convention:

| Movement | Debit | Credit |
|---|---:|---:|
| Customer receipt | 0 | Amount |
| Supplier payment | Amount | 0 |
| Receivable opening balance | Amount | 0 |
| Payable opening balance | 0 | Amount |

The overall partner balance is:

```text
Partner balance = SUM(Debit - Credit)
```

Sales/customer reports may filter sales-related movement types and
purchase/supplier reports may filter purchase-related movement types. The
partner master record remains shared.

### Currency rules

- The invoice currency defaults to `BusinessPartner.Currency`.
- While the application supports one default currency per partner, require the
  invoice and partner currencies to match unless an explicit multi-currency
  workflow is approved.
- Calculate partner balances per `CompanyId`, `BusinessPartnerId`, and
  `CurrencyCode`. Never add balances from different currencies directly.
- If exchange rates are introduced later, store the document currency,
  exchange rate, base-currency amounts, precision, and rounding rule on the
  posted document or movement. Do not derive historical values using today's
  exchange rate.
- Use `decimal`, never `float` or `double`, for quantities, prices, discounts,
  exchange rates, and amounts. Configure precision explicitly in EF Core.

### Stock movement and balance

Store stock is calculated only from item movements:

```text
Available quantity = SUM(QuantityIn - QuantityOut)
```

The calculation must filter by all of:

```text
CompanyId + StoreId + ItemId
```

An item uses its single configured `ItemUnit`; invoice and movement DTOs must
not silently convert to another unit. Opening stock is an inbound movement, not
a mutable opening-balance column on the item.

A stock movement should retain enough immutable source information to audit
the calculation, including:

```text
Id
CompanyId
StoreId
ItemId
MovementType
ReferenceId
ReferenceNumber
MovementDate
QuantityIn
QuantityOut
Description
Auditable fields
```

Exactly one of `QuantityIn` or `QuantityOut` should be positive for a normal
movement; both must never be positive on the same row. Quantities must be
greater than zero after grouping and normalization.

### Required invoice transaction workflow

Creating or posting an invoice and its movements is one atomic operation:

1. Resolve the validated `companyId` from `ICurrentCompanyContext`; never bind
   it from the request.
2. Validate the active business partner, store, items, and item units in the
   same company.
3. Validate positive quantities, allowed prices and discounts, currency, date,
   and invoice type.
4. Group repeated invoice lines by `ItemId` before calculating required stock.
5. Calculate line totals, discounts, taxes if supported, and document totals on
   the server. Never trust client-supplied calculated totals.
6. For every outbound effect, calculate current store balance and reject the
   operation when the requested grouped quantity exceeds availability.
7. Save the invoice header, details, item movements, and partner movement in
   one database transaction.
8. Commit only after every row succeeds; any failure must roll back the entire
   document and all movements.

Do not issue one balance query per invoice line. Load or group balances for the
bounded item-ID set in one database query to avoid N+1 round trips.

### Insufficient stock and concurrency

The stock check and outbound movement insert must execute inside the same SQL
Server transaction using `IsolationLevel.Serializable`. A check performed
before the transaction is unsafe because two concurrent sales can both observe
the same available quantity and oversell it.

Return a business conflict when stock is insufficient:

```csharp
return Result.Failure(
    Error.Conflict(
        "Inventory.InsufficientStock",
        $"Available quantity is {availableQuantity}, but {requestedQuantity} was requested."));
```

The default rule is that stock cannot become negative. A future setting that
allows negative stock must be an explicit company-level business decision and
must not silently weaken the default check.

A store transfer is also one serializable transaction:

- Check available stock in the source store.
- Add an outbound movement for the source store.
- Add an inbound movement for the destination store.
- Roll back both movements when either side fails.

### Posted documents, corrections, and deletion

- If drafts are supported, drafts do not affect partner or stock balances.
- Once an invoice creates movements, treat the posted document and movements as
  immutable business history.
- Do not physically delete a posted movement and do not edit its quantities or
  amounts to correct history.
- Cancel or correct a posted invoice by creating linked opposite movements in
  one transaction. These are operational reversal movements, not journal
  vouchers.
- A return must validate its allowed relationship and quantities. When it
  references an original invoice, it must not return more than the remaining
  unreturned quantity unless the business explicitly allows unlinked returns.
- Soft deletion alone is not a financial reversal. Balance queries must include
  every effective posted movement and its reversal according to the documented
  status rule.

### Invoice numbering and indexes

- Generate invoice numbers on the server with concurrency protection; do not
  use an unprotected `MAX(Number) + 1` sequence.
- Define company-scoped uniqueness, normally using `CompanyId`, invoice type,
  fiscal year or period, and document number.
- Add an item-movement index beginning with
  `(CompanyId, StoreId, ItemId)` so balance checks and serializable range locks
  use the intended key range.
- Add a partner-movement index beginning with
  `(CompanyId, BusinessPartnerId, CurrencyCode)` for balance queries.
- Add indexes for invoice references used by returns, reversals, and duplicate
  request protection.

### Mandatory invoice verification

- [ ] Every referenced partner, store, item, and unit belongs to the selected
      company and is active where required.
- [ ] Server totals match line quantities, prices, discounts, and rounding.
- [ ] Sales and purchase directions create the correct partner and stock
      movement signs.
- [ ] Empty stock, exact available stock, and insufficient stock were tested.
- [ ] Repeated item lines are grouped before the stock check.
- [ ] Two concurrent outbound requests cannot produce unintended negative
      stock.
- [ ] A failure after the header insert rolls back details and all movements.
- [ ] Store transfer either writes both sides or writes neither side.
- [ ] Posted correction creates opposite movements and preserves history.
- [ ] Partner and stock balances are reproduced entirely from movements.
- [ ] Currency filtering prevents totals from combining different currencies.
- [ ] Tenant filters remain present even when `IgnoreQueryFilters()` is used.

## 8. Database migration workflow

Create a migration for every model change:

```powershell
dotnet ef migrations add MigrationName `
  --project src/MiniErp.Infrastructure `
  --startup-project src/MiniErp.Api
```

Inspect the generated migration before applying it. Confirm:

- Column types, nullability, and maximum lengths.
- Unique and lookup indexes.
- Foreign-key names and delete behavior.
- No unrelated table or column changes.
- The `Down` method safely reverses the migration.

Then verify the model and build:

```powershell
dotnet ef migrations has-pending-model-changes `
  --project src/MiniErp.Infrastructure `
  --startup-project src/MiniErp.Api

dotnet build MiniErp.slnx
```

Do not manually edit the model snapshot unless a generated migration is being
carefully repaired.

### Migration deployment gate

Do not deploy a migration until every item is confirmed:

- [ ] The entity design and relationship behavior were approved before the
      migration was generated.
- [ ] Existing data was checked for nulls, duplicates, invalid foreign keys,
      and values that exceed new column limits.
- [ ] `Up`, `Down`, and the model snapshot contain only the intended changes.
- [ ] Unique indexes use the intended case, whitespace, active, and soft-delete
      rules.
- [ ] The migration succeeds on both an empty database and a recent copy of an
      existing database.
- [ ] A backup and rollback plan exists for production data.
- [ ] `has-pending-model-changes` reports no remaining model differences.
- [ ] Startup migration behavior is understood before deployment.

### Startup migration and seed behavior

- `Database:ApplyMigrationsOnStartup=true` applies pending migrations before
  the application starts serving requests.
- Never deploy an unreviewed migration while startup migration is enabled; it
  will be applied automatically during application startup.
- `Seed:Enabled=true` runs the idempotent identity, catalog, and feature seed.
- When seeding is enabled, `Seed:Password` must be present and must come from
  deployment configuration rather than a committed secret.
- Use deployment environment variables such as
  `ConnectionStrings__DefaultConnection`, `Seed__Password`, and
  `Jwt__SigningKey`; do not commit production secret values.
- Seed logic must not delete non-seed users or existing business data by
  default. A destructive reset/synchronization mode requires a separate,
  explicit setting that is disabled in production.
- Company-owned feature seed data must be generated inside the loop for every
  intended seeded company. Set `CompanyId` explicitly, include it in every
  idempotency lookup, and use deterministic company-scoped codes. Use visibly
  company-labelled names when demo data should make tenant isolation easy to
  verify after switching companies. Query with `IgnoreQueryFilters()` when a
  soft-deleted seed record must remain deleted instead of being recreated on
  the next startup. The Driver seed follows this rule by creating three
  labelled drivers for each seeded company while allowing the same driver codes
  to exist independently in different companies.
- Verify both a fresh database and an existing database with data. Confirm
  repeated startup does not duplicate or delete unintended records.
- Migration and seed failures happen before the HTTP request pipeline, so the
  global exception handler cannot handle them. Verify host startup logs and
  fail with a clear configuration or migration error.

## 9. API and authorization checks

For each endpoint:

- Use the versioned API controller base.
- Add correct `ProducesResponseType` declarations.
- Apply the required authorization or role policy.
- Keep only intentionally public endpoints marked `AllowAnonymous`.
- Update Swagger summaries and descriptions.
- Verify `400`, `401`, `403`, `404`, and `409` responses where applicable.
- Verify that authenticated requests work with `Authorization: Bearer {token}`.
- Verify inherited authorization from `ApiControllerBase`, role restrictions,
  and `[AllowAnonymous]` exceptions explicitly.
- Verify the global exception handler returns `ProblemDetails` with a trace ID
  for unexpected request exceptions and does not expose internal details in
  production.
- Verify Swagger documents security requirements, anonymous operations,
  pagination parameters, and all declared response types.
- Request enums are serialized as JSON names and documented automatically by
  `EnumSchemaDocumentationFilter` as `Name = numeric value`. Clients must send
  the name because numeric JSON enum values are rejected. Do not repeat enum
  value lists in individual service Swagger documentation files.
- `EnumRequestOperationDocumentationFilter` also adds the enum list directly
  to the endpoint description so it is visible without expanding nested schema
  controls. It recursively documents enum properties in nested request models
  and collections.

### Mandatory Swagger operation documentation

Every operation in the feature-specific
`FeatureNameSwaggerDocumentation.cs` file must document all of the following:

- **Required fields:** Name required route, query, and request-body fields. State
  required authorization or tenant context, but never document `CompanyId` as
  a client request field when it comes from `ICurrentCompanyContext`.
- **Validation:** Document numeric ranges, string lengths, formats, enum rules,
  nullability, defaults, normalization, foreign-key state requirements, and
  company ownership that the endpoint actually validates.
- **Edge cases:** Document applicable empty-result, invalid-ID, not-found,
  inactive, cross-company, duplicate, dependency, concurrency, token, and
  repeated-operation behavior, including the expected `400`, `401`, `403`,
  `404`, or `409` response.

Use `SwaggerOperationDescription.Create` so the overview, required fields,
validation, and edge cases have the same visible structure in Swagger UI.
Documentation must match the request DTO, FluentValidation validator, service
logic, authorization attributes, and declared response types. Do not document
a planned rule as implemented. Update the Swagger text in the same change when
any of those behaviors changes, and inspect the generated Swagger UI or JSON
rather than relying on a successful build alone.

### Mandatory Swagger re-review after every change

Re-review Swagger whenever a change affects an API route, HTTP method, request
or response model, enum, validation rule, authorization requirement, status
code, `ProblemDetails` error, pagination rule, filter, default value, or field
requiredness/nullability. This gate applies even when the feature previously
had complete Swagger documentation.

Before marking the change complete, confirm all of the following against the
running API's generated Swagger UI or OpenAPI JSON:

- Request and response schemas match the actual serialized JSON contract.
- Required and optional fields, validation limits, defaults, and enum values
  are current.
- Examples and operation descriptions describe implemented behavior only.
- Bearer security, anonymous access, and role restrictions match the endpoint.
- Success and applicable `400`, `401`, `403`, `404`, and `409` responses are
  declared and accurately described.
- Pagination and filtering parameters match the controller and validator.
- The changed contract has been delivered to every affected frontend or
  external API consumer.

A successful format, build, or test run does not replace this Swagger review.
Record the Swagger UI or OpenAPI verification in the feature completion report.

### Client sidebar and CRUD integration

For every API feature that users manage from the React client, update
`G:/test/miniErp/client/src/components/ErpShell.tsx`:

- Add one entry to `navItems`. Its `key` must match the feature configuration
  key so selecting the sidebar item renders the correct page.
- Add a matching `EntityConfig` with the API `endpoint`, page title, singular
  name, description, visible table columns, and create/update fields.
- Include every response value users must see in the table. Adding a field to
  the form does not display it automatically; for example, a driver's
  `nationalId` requires both a form field and a column definition.
- Match client requiredness and nullability to the request DTO and
  FluentValidation. Optional text and date fields should use `nullable: true`
  so an empty input is sent as `null`, and must not use `required: true`.
- Reuse a supported `EntityPage` field kind. Extend the `FieldDefinition.kind`
  union in `EntityPage.tsx` only when a new HTML input or custom control is
  required.
- Load foreign-key dropdowns from the feature's small `/select` endpoint and
  use the correct numeric or string option type.
- Never add `CompanyId` to a tenant CRUD form. The selected company continues
  to come from the access-token `company_id` claim.
- Keep sidebar visibility and `canManage` behavior aligned with the API
  authorization matrix. Hiding a button is only a user-interface convenience;
  the API role policy remains the security boundary.
- If the feature is intentionally API-only, record client integration as
  `N/A` with the reason instead of silently omitting it.

Verify the client after every sidebar or CRUD configuration change:

```powershell
Set-Location G:/test/miniErp/client
npm.cmd run build
```

Manually confirm that the sidebar item opens the intended page, the first list
request uses the selected company and pagination parameters, every required
response field is visible, optional values render safely, and authorized CRUD
operations refresh the table. Switch companies and confirm the page shows only
the newly selected company's records. The client is a separate Git repository;
do not assume a backend commit or push contains these changes.

### Company context and tenant isolation

The selected company is a request security boundary:

- A user may be assigned to multiple companies, but each final access token
  contains exactly one `company_id` selected during login.
- `CompanyClaimResolver` validates that the authenticated principal has exactly
  one positive integer company claim. JWT validation rejects invalid access
  tokens before controller activation.
- `ICurrentCompanyContext` is scoped to the HTTP request and exposes the
  validated `CompanyId`. Do not parse claims separately in feature services.
- Do not use a static or singleton company value. Do not resolve a tenant
  service outside an authenticated request; background processing must receive
  an explicit, independently validated company scope.
- Keep company filters explicit. The current architecture does not use a base
  tenant service or an EF global company filter.

Inject and capture the company once per tenant service:

```csharp
public sealed class FeatureService(
    ApplicationDbContext dbContext,
    ICurrentCompanyContext currentCompanyContext)
    : IFeatureService, IScopedService
{
    private readonly int companyId = currentCompanyContext.CompanyId;
}
```

Apply `companyId` consistently:

- List, select, get-by-ID, update, and delete queries must filter by it.
- Create operations assign it to the new entity; request DTOs must not contain
  a client-controlled `CompanyId`.
- Duplicate checks are company-scoped unless uniqueness is intentionally
  global.
- Foreign-key checks require both the referenced ID and the same company.
- Dependency checks that use `IgnoreQueryFilters()` must still retain the
  explicit company condition.
- Return `NotFound` for an entity or related ID from another company; do not
  reveal that the record exists in another tenant.

Do not repeat the former `GetCompanyId()`/`Result<int>` block in every method.
Expected authentication failures are handled at the JWT boundary; business
validation inside the service continues to use `Result<T>`.

### Identity users and multiple roles

- User create and update requests use a non-empty, duplicate-free `roles`
  collection rather than a single role string.
- User responses and login responses return all assigned roles.
- Final access tokens contain one `role` claim for every assigned Identity role;
  role authorization succeeds when any required role is present.
- Role updates require the affected user to log in again to receive new claims.
- Never allow deletion of the last Admin or removal of the Admin role from the
  last Admin account.

### Authorization matrix

Complete this table for every feature before implementing its controller. The
following access levels are the recommended defaults for ERP master data; any
difference must be documented as a business decision.

| Operation | Recommended access | Attribute source |
|---|---|---|
| List, select, get by ID | Authenticated | Inherited `[Authorize]` from `ApiControllerBase` |
| Create, update, delete | `Admin` role | `[Authorize(Roles = "Admin")]` on the action or controller |
| Login and refresh | Anonymous | Explicit `[AllowAnonymous]` |

Verify anonymous, authenticated-without-role, and authorized-role requests.
An action with no explicit authorization attribute is still authenticated
because authorization is inherited from `ApiControllerBase`.

### API contract examples

Swagger and tests should confirm the actual JSON contract. A paginated response
uses this shape:

```json
{
  "items": [],
  "pageNumber": 1,
  "pageSize": 20,
  "totalCount": 0,
  "totalPages": 0
}
```

Expected business failures use `ProblemDetails`, for example:

```json
{
  "title": "Entities.CodeExists",
  "status": 409,
  "detail": "An entity with the same code already exists.",
  "errorType": "Conflict"
}
```

Unexpected request exceptions return a generic production response with a
trace ID:

```json
{
  "title": "An unexpected error occurred.",
  "status": 500,
  "detail": "An unexpected error occurred while processing the request.",
  "instance": "/api/v1/Entities",
  "traceId": "request-trace-id"
}
```

Changing a response model requires confirming all frontend or external API
consumers before merging.

## 10. Required verification scenarios

At minimum, verify:

### Read

- Empty and populated lists.
- First page, later page, empty page, maximum page size, and invalid pagination.
- Existing and missing IDs.
- Select endpoints return only allowed active records.
- List ordering is deterministic and paged responses contain complete metadata.

### Create

- Valid request.
- Duplicate code or name.
- Whitespace-padded values are normalized by mapping before the duplicate check.
- Missing or inactive foreign-key record.
- Validation errors.

### Update

- Valid request.
- Missing entity.
- Duplicate value belonging to another entity.
- Updating an entity with its own unchanged unique value succeeds.
- Missing or inactive foreign-key record.

### Delete

- Missing entity.
- Entity without dependents.
- Entity with dependents.
- Confirmed soft-delete filtering or cascade results.
- Historical dependents are included or excluded according to the documented
  `IgnoreQueryFilters()` decision.

### Cross-feature impact

- Every service identified in the impact table still builds and behaves as
  expected.
- Shared response and selection models remain compatible.
- Seed startup works on both an existing and a fresh database.

### Tenant isolation

- Missing, malformed, zero, negative, and multiple `company_id` claims are
  rejected during JWT authentication.
- A company A token cannot list, select, read, update, or delete company B data.
- Create assigns company A even if a client attempts to send another company.
- Duplicate checks permit or reject equal values according to the documented
  company-scoped uniqueness rule.
- A company A request cannot reference a company B parent record.
- `IgnoreQueryFilters()` checks still cannot cross company boundaries.

### Automated verification requirements

Add or update automated tests for every applicable behavior:

- Validator tests for required, whitespace-only, minimum, maximum, and invalid
  values.
- Mapping tests proving normalization and update mapping do not overwrite IDs
  or creation audit information.
- Service/integration tests for success, not-found, duplicate, foreign-key,
  inactive-parent, and dependency-conflict results.
- API tests for routing, pagination metadata, validation `400`, authentication
  `401`, authorization `403`, not-found `404`, conflict `409`, and create `201`.
- Persistence tests for unique indexes, global query filters, soft deletion,
  audit values, and configured delete behavior.
- Migration and seed tests on empty and existing databases, including repeated
  seed execution.
- Concurrency tests for duplicate creates and any row-version or one-time-token
  behavior used by the feature.

Use a relational provider for tests that verify SQL Server constraints or
transactions; EF Core's in-memory provider does not reproduce those behaviors.

```powershell
dotnet test MiniErp.slnx --configuration Release --no-restore
```

If automated coverage is not yet available, record the missing test project as
technical debt and attach repeatable manual API and database verification. Do
not treat a build-only check as proof of business behavior.

## 11. Mandatory edge-case review

Every feature must record which edge cases apply and how each applicable case
was verified. Do not mark a case as not applicable without a reason.

### Input boundaries

- Zero and negative route or foreign-key IDs.
- Empty, whitespace-only, trimmed, minimum-length, and maximum-length strings.
- Values exactly at and one character beyond configured database limits.
- Null optional values and omitted optional JSON properties.
- Case-only differences in unique codes, names, usernames, and emails.
- Boolean state combinations such as active, inactive, and deleted.

Validation limits must match EF Core column limits. Normalized values used for
duplicate checks must be the same values saved to the database.

### Data relationships and state

- Referenced record is missing, soft-deleted, or inactive.
- Referenced record changes or is deleted between validation and save.
- Parent becomes inactive after a child has already been created.
- Dependency checks include or exclude historical records intentionally.
- Soft-deleted values interact correctly with filtered unique indexes.
- Create and update responses still contain required navigation details.
- Restoring data, if supported, does not violate a unique index or reference an
  unavailable parent.

### Concurrent requests

- Two requests attempt to create the same unique value simultaneously.
- Two requests update or delete the same record simultaneously.
- A dependent record is created while its parent is being deleted.
- Token or one-time-value rotation is attempted concurrently.

An application-level `AnyAsync` check does not replace a database unique index.
Use database constraints as the final protection. The normal CRUD policy in
this project is to return a clear `Error.Conflict` from the pre-check and let
unexpected or concurrent database exceptions flow to the global exception
handler; add a targeted translation only when a feature explicitly requires a
different concurrency contract.

This policy has an explicit tradeoff: two simultaneous duplicate requests can
both pass the pre-check, after which the unique index accepts one request and
rejects the other. Without a targeted constraint translation, the rejected
request is handled as an unexpected `500` response instead of `409 Conflict`.
Record whether the feature owner accepts that response contract. If not, add
and test a narrow translation for the relevant database constraint only.

Use a row-version concurrency token when lost updates would be harmful.

### Duplicate data

For every field that should be unique, confirm all of the following:

- Existing data is checked for duplicates before adding a unique index.
- The service checks the normalized value that will actually be saved.
- Case-only and whitespace-only differences follow the intended business rule.
- The database has a unique index as the final concurrency-safe protection.
- Update checks exclude the current record by ID.
- Soft-deleted records are intentionally included or excluded from uniqueness.
- Seeder reruns cannot create duplicate users, roles, codes, names, or lookup
  records.
- A clear cleanup or merge decision exists if historical duplicates are found.

Example SQL for reviewing an existing table before a unique migration:

```sql
SELECT Code, COUNT(*) AS DuplicateCount
FROM Items
WHERE IsDeleted = 0
GROUP BY Code
HAVING COUNT(*) > 1;
```

Repeat the check using the same normalization and filter used by the intended
unique index. Never add a unique constraint to existing data without first
checking whether the migration will fail.

### Query and response behavior

- Empty result sets and large result sets.
- Sorting is deterministic when multiple records have the same display value.
- Select endpoints exclude inactive or unavailable relationships.
- Global query filters behave correctly for normal and administrative queries.
- Projection and mapping handle optional or unavailable navigation properties.
- API response status and body match the declared Swagger contract.

Add pagination before an unbounded list can reasonably become large.

Use the shared `IPaginationService` with `PaginationRequest` and
`PagedResponse<T>` for paginated endpoints. Feature services should supply a
deterministically ordered `IOrderedQueryable<TEntity>` and must not duplicate
count, offset, projection, or total-page calculations.

```csharp
var query = dbContext.Entities
    .AsNoTracking()
    .OrderBy(entity => entity.Name)
    .ThenBy(entity => entity.Id);

return await paginationService.PaginateAsync<Entity, EntityResponse>(
    query,
    pagination,
    cancellationToken);
```

For a standard paginated `GetAll` endpoint:

- Accept `[FromQuery] PaginationRequest pagination` in the controller.
- Return `PagedResponse<T>` with `Items`, `PageNumber`, `PageSize`, `TotalCount`, and `TotalPages`.
- Document the `pageNumber` and `pageSize` query parameters and the `400 Bad Request` response in Swagger.
- Keep `select` or dropdown endpoints small and unpaginated when they return only `Id` and `Name`.
- Verify the default page, an empty page, the maximum page size, and invalid page values.

### Query performance and projection

Read endpoints should select only the columns required by their response. Use
server-side projection such as `ProjectToType<TResponse>()` or `Select(...)` so
EF Core does not materialize complete entities and navigation graphs.

```csharp
var response = await dbContext.Items
    .AsNoTracking()
    .Where(item => item.IsActive)
    .OrderBy(item => item.Name)
    .ProjectToType<ItemResponse>()
    .ToListAsync(cancellationToken);
```

Avoid O(n) database round trips and N+1 queries:

- Never call `FirstAsync`, `AnyAsync`, or another database query inside a loop
  over records.
- Load required IDs or related values in one query using joins, projection, or
  `Contains` with a bounded ID set.
- Use `AnyAsync` instead of loading a collection only to check whether it has
  rows.
- Use `AsNoTracking` for read-only queries.
- Keep filtering, sorting, projection, and pagination in the database query.
- Do not call `ToListAsync` before filters or projection that SQL can perform.
- Avoid `Include` when projection can return the required related fields.
- Inspect generated SQL when a query contains multiple relationships or an
  unexpected number of round trips.

Returning n records naturally requires O(n) result processing. The requirement
is to avoid O(n) separate database calls, repeated full-table scans, and
unbounded entity materialization.

### Authorization and security

- Missing, malformed, expired, and valid access tokens.
- Access tokens contain exactly one valid `company_id`; malformed tenant claims
  fail before tenant services are created.
- Authenticated user with the wrong role receives `403 Forbidden`.
- Multi-role users receive all roles in login responses and JWT claims, and
  every role-based endpoint follows the expected authorization decision.
- Anonymous endpoints do not accidentally expose protected data.
- User-supplied IDs cannot access or modify data outside the permitted scope.
- Error messages do not expose passwords, token hashes, connection strings, or
  internal exception details.
- The current allow-any-origin CORS policy is not combined with credentialed
  browser requests. Restrict allowed origins before enabling credentials or
  cookie-based authentication.

### Audit, time, and transactions

- Create, update, and delete operations set the correct actor and UTC timestamp.
- Failed operations do not leave partial data or misleading audit values.
- Multi-step writes use a transaction when partial completion is invalid.
- Cancellation before save does not create partial records.
- Time comparisons use UTC consistently, especially for expiration behavior.

### Seed and migration behavior

- Seeder can run repeatedly without duplicates or unexpected data loss.
- Destructive seed behavior is explicit and disabled when no longer required.
- Production seed reruns preserve non-seed users and existing business data.
- Migration works for both an empty database and a database containing data.
- New required columns have a safe value or backfill for existing rows.
- Migration rollback behavior is understood before deployment.

### Edge-case confirmation gate

- [ ] Applicable boundary values were tested.
- [ ] Existing and concurrently-created duplicate data was checked.
- [ ] Missing, inactive, and soft-deleted relationship cases were tested.
- [ ] Unique-index and concurrent-request behavior was considered.
- [ ] Query-filter behavior was verified.
- [ ] Paginated list endpoints use `IPaginationService` and return paging metadata.
- [ ] Read queries use projection and avoid N+1/O(n) database round trips.
- [ ] Authentication and wrong-role behavior were tested.
- [ ] Tenant claim validation and cross-company isolation were tested for every
      company-owned entity and foreign key.
- [ ] Audit and partial-failure behavior were verified.
- [ ] Existing-data migration and repeated-seed behavior were checked.
- [ ] Every untested or non-applicable case has a recorded reason.

## 12. Definition of done

A feature is complete only when:

- [ ] The mandatory impact table has been answered.
- [ ] The mandatory edge-case confirmation gate has been answered.
- [ ] A repository search confirmed affected services and consumers.
- [ ] Requests, validators, responses, mappings, service, controller, and Swagger
      documentation are complete where applicable.
- [ ] Foreign-key existence checks are implemented.
- [ ] Delete relationships and dependency behavior are explicitly confirmed.
- [ ] The migration was reviewed and has no unrelated changes.
- [ ] Growing list endpoints use `PaginationRequest`, `PagedResponse<T>`, and deterministic ordering.
- [ ] Authorization, anonymous access, Swagger security, and declared status
      codes were verified for every endpoint.
- [ ] A client sidebar item and matching CRUD configuration were added and
      `npm.cmd run build` passed, or client integration was recorded as `N/A`
      with a reason.
- [ ] Every company-owned query, duplicate check, create assignment,
      foreign-key lookup, and dependency check uses the validated company
      context.
- [ ] Startup migration, repeated seed, and production configuration behavior
      were verified.
- [ ] Automated tests were added or missing coverage was recorded with
      repeatable manual evidence and a technical-debt item.
- [ ] The solution builds without errors or warnings.
- [ ] Formatting checks pass.
- [ ] Authorized, unauthorized, success, validation, not-found, and conflict
      scenarios have been verified.
- [ ] Documentation and seed data are updated when behavior changes.

When reporting completion, explicitly state:

1. Which other services or features were checked.
2. Whether the change affects any shared contract.
3. Which foreign keys were found.
4. The chosen delete behavior and how it was tested.
5. Which edge cases were tested and which were not applicable.

### Completion report template

Use this template when handing off a completed feature:

```text
Feature:
Business purpose:
Files and layers changed:
Routes and operations:
Authorization matrix:
Entities and tables:
Incoming and outgoing foreign keys:
Delete behavior and historical-data decision:
Validation and Mapster normalization:
Unique fields and duplicate checks:
Pagination, filtering, and deterministic ordering:
Audit and soft-delete behavior:
Seed impact and repeated-startup result:
Migration name, review result, and rollback plan:
Shared contracts and cross-feature impact:
Client/sidebar integration and client build result:
Automated tests executed:
Manual verification executed:
Untested or not-applicable cases with reasons:
Known risks or follow-up technical debt:
Build, format, and test command results:
```
