# MiniErp Invoice Implementation Plan

Apply `FEATURE_DEVELOPMENT_GUIDE.md` completely to every step below. Complete
and hand off one step to the frontend before starting the next step.

## 0. Reference data and existing-feature preparation

- Confirm the existing Store changes for product and container stores.
- Implement Countries.
- Implement Containers.
- Implement Store-to-container assignments.
- Reuse existing Item, Store, BusinessPartner, and Driver select endpoints.
- Send all changed fields and new endpoint contracts to the frontend.

## 1. Stock opening balances

- Implement draft CRUD.
- Implement post and cancel.
- Generate inbound and reversal item movements.
- Hand off the opening-stock page contract to the frontend.

## 2. Partner opening balances

- Implement draft CRUD.
- Implement receivable and payable types.
- Implement post and cancel.
- Generate partner movements.
- Hand off the partner-opening page contract to the frontend.

## 3. Invoices

- Finalize invoice, line, container-line, and driver fields.
- Implement paginated list, details, draft create, draft update, and draft delete.
- Implement sales, sales return, purchase, and purchase return.
- Save an external driver name only on the invoice.
- Implement atomic posting and stock validation.
- Generate item, partner, container, and internal-driver-trip movements.
- Implement return limits and original-invoice validation.
- Implement cancellation through opposite movements.
- Hand off draft APIs first, then post, return, and cancellation APIs.

## 4. Stock adjustments

- Implement increase and decrease documents.
- Implement draft CRUD, post, and cancel.
- Validate stock before posting a decrease.
- Generate item movements.

## 5. Receipt and payment vouchers

- Implement draft CRUD, post, and cancel.
- Return unpaid and partially paid invoices.
- Validate invoice allocations.
- Preserve voucher amounts that remain unallocated.
- Generate partner movements.

## 6. Balance reports

- Implement stock balance queries.
- Implement partner balances by currency.
- Implement customer container balances.
- Keep movement tables read-only; do not add movement CRUD endpoints.

## 7. Driver trips

- List and get internal driver trips.
- Update the nullable trip price.
- Do not add manual create or delete endpoints.

## Completion requirements for every step

- Apply company isolation and foreign-key validation.
- Add request records, response records, validators, and Mapster mappings.
- Use direct services without repositories or CQRS.
- Keep controllers small.
- Add separate Swagger operation documentation.
- Add Arabic validation and business messages.
- Review the entity and EF design before creating a migration.
- Add idempotent seed data for multiple companies when applicable.
- Verify tenant isolation, expected failures, and atomic transactions.
- Run tests, the Release build, the pending-model check, and formatting checks.
- Give the frontend exact requests, responses, enums, validation, and examples.
