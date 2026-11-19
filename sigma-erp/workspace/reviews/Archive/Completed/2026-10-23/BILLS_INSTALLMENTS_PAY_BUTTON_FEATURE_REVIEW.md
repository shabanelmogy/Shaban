# Bill installments — direct Pay button

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-21 |

## Scope and frozen contract

Owner requests a Pay button beside installments and supplies a Pay Installment dialog showing saved EMI, interest and principal. Screenshot is functional/content evidence, not a replacement for shared presentation or payment rules. Existing approved `BILLS_INSTALLMENT_PAYMENTS_CONTRACT_FREEZE.md` owns accounting and sequential eligibility. No new business/API/schema decision is required.

Source discovery: the saved viewer already supplies Pay through a typed Actions dropdown and mounts BillInstallmentPaymentComponent. The existing nested form shows the three saved amounts and requires an explicit payment date. Its POST sends only requestId/date, revalidates under backend locks and refreshes viewer/parent on success. Only the next eligible unpaid installment has server canPay=true. Preserve that rule; do not expose executable payment for every future or already paid row.

Replace the single dropdown item with one visible direct Pay button in a trailing schedule column. Reuse shared DataTable's native cell-link button to open the existing form, keyed by actual installment identity and gated by canPay. This is navigation to a typed payment form, not an immediate mutation. Remove the redundant dropdown/import. Reuse existing translations and title/subtitle; no new CSS, state, DTO, endpoint or posting behavior.

| Concern | Owner/reference | Target |
|---|---|---|
| Financial document and action | UI screen08, UI7, BE15; existing frozen source-owned payment slice | Preserve existing PayInstallmentAsync/controller/typed service/form; presentation-only change |
| Inline button | UI5; DataTableColumn.link / DataTableComponent cellLinkActivate and native button in data-table.component.html | Existing shared renderer, enabled by exact server canPay; aria label identifies bill/installment |
| Typed form | UI13; existing BillInstallmentPaymentComponent + shared EditorDialog | Keep saved values/date, busy/error/idempotent request/close guards and authoritative refresh |
| State/recovery | UI7; existing openPayment/load/paymentSaved | Existing handler rejects reading/closing/duplicate/ineligible targets, parent inert while child open |

Grid fields remain ordinal, date, emi, interest, principal, status, paymentNo, plus a displayed canPay action cell. BillInstallmentRow already carries all these fields and id; no payload addition. Main Bills grid/filter/export are unchanged. Explicit user request owns the direct-row presentation exception to the usual Actions dropdown.

Phases0/1: bounded discovery/freeze, existing accounting contract reused. Phase2: local schedule column. Phase3: existing form preserved. Phase4: action wiring retained. Phase5: existing parent refresh. Phase6: source reconciliation. No broad editor/backend refactor. No delegation: one small frontend change with sequential source verification.

Initial all-eight recipe checks pass. Source verification only; no build/test/lint/browser/database/migration/snapshot/commit/push/deploy. No new migration needed for this presentation change; earlier payment-link owner migration remains independent.

## Final reconciliation

Changed files, frontend repository `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

- `src/app/modules/Vouchers/Bills/Bill/components/installments/installments.component.ts`: replace single ActionList menu with trailing typed canPay column, shared native button, existing openPayment handler and translated bill/installment accessible label; remove stale ActionList import.
- `src/app/modules/Vouchers/Bills/Bill/components/installments/installments.component.html`: remove redundant `[actions]` binding. Shared table keeps the schedule's remaining columns and scroll/pagination owner unchanged.
- `src/app/modules/UserGuide/content/bills-topic.ts`: EN/AR explain the direct Pay button beside the next eligible row. Existing Vouchers reader `/UserGuide/invoice` and feature `/Bill`; no new guide/menu/route.

Before: `[actions]="actions"` renders Pay inside the first Actions dropdown. After: trailing `field:'canPay'`, translated Pay value and shared `link.activate: row => openPayment(row)` render a native button directly beside the row. An ineligible row has empty text and no button. The original handler checks reading, closing, current child, current plan, server canPay and actual saved id. Child opening makes parent body inert; loading clears the plan and removes stale rows. Existing payment form still owns duplicate execution prevention, retained requestId on retries, both failure channels, cancellation guards and saved-value POST. Source review confirms success reloads plan/summary and preserves existing parent refresh contract.

Existing keys `bill.installments.payAction`, `payTitle`, `payRecord` exist in EN/AR. No backend/DTO/AutoMapper/calculation/persistence changes. No new migration. Earlier independent payment-link migration is not changed or executed by this slice. No reusable rule was introduced, so canonical books/skill/packets require no modification. Initial and final all-eight recipe Check pass.

Source verification: syntax-only parse of the changed component/guide TypeScript and schedule Angular template gives zero errors. Scoped frontend Git diff/check was inspected; the three files already belong to untracked prior feature work, so their final source and the exact scoped before/after edits above were additionally reviewed directly. No trailing whitespace/merge markers. This is not compilation, runtime or visual acceptance. No prohibited commands or subagents used.

Owner checks: open saved Installments for an eligible approved loan bill; verify direct Pay beside next unpaid row and no Actions dropdown; keyboard activation opens saved EMI/interest/principal and payment date; Cancel preserves status; successful payment shows real PV/Paid and next eligible button; failure keeps form/error; confirm EN/AR, narrow layouts and dark theme. Existing strict canPay may hide all Pay buttons when approval/source accounts/history/principal capacity are ineligible; do not bypass those rules for presentation.

Suggested frontend commit: `fix(bills): show installment pay button directly in schedule` (suggestion only).
