# Email Templates — domain/API/UI contract freeze

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-17 |

User instruction: "راجع : src\\app\\modules\\Administration\\emailTemplates وطبق التعديلات طبقا للوثائق" with 21 screenshot attachments. Canonical authority: F:/My Work/Sigma/AGENTS.md; Master2/4/5/7; UI1/3/10/16/19/22–29; BE3/4/8/16. Recipe -Check succeeded for all eight packets on 2026-10-17 before use.

## Scope and selected shapes
Frontend settings workspace (screen06 / UI1 routed-settings exception), single selected logical key at a time; no business tabs or list invented. Approved composition: Accounts/Link Accounts/LinkAccounts/components/details, shared FeatureTitle, FormSection, FieldError, PrimaryActionButton, StateMessage, ConfirmationDialogService and freezeFormState. Backend pattern4 several rows keyed by TemplateType, existing IServiceHelper.UpsertByKeyAsync and one SaveChangesAsync. No financial effect, delete, send/test-email, rendering engine or workflow integration is introduced. Current email-template symbol search finds only this settings writer/reader; actual delivery/token replacement is outside the existing feature.

## Frozen read/save/options contract
- GET EmailTemplates/Options returns Result<EmailTemplateOptionsVM>: entity { templateTypes: EmailTemplateOptionVM[] }; each option { id: number, key: string, dataFields: string[] }. key is the stable enum name; dataFields are complete braced literal tokens, including exact case.
- GET EmailTemplates/{templateType} retains its raw-object transport, now a lean EmailTemplateDetailVM: { templateType: number, subject: string|null, cc: string|null, bcc: string|null, emailBody: string }. Undefined enum => BadRequest Result with InvalidRequest; never an invented default type.
- POST EmailTemplates retains keyed upsert and Result response; lean EmailTemplateAddVM contains ONLY { templateType: enum?, subject: string?, cc: string?, bcc: string?, emailBody: string? }. Remove AddBaseVm inheritance (no id/subscription/audit).
- TemplateType required and defined; subject required/non-whitespace, max500, single line (no CR/LF); body required with actual text or image (HTML-only empty paragraphs/whitespace rejected); CC/BCC optional, max2000 each, comma/semicolon/newline separated plain email addresses. No display-name address syntax. UI and server reject empty delimiter-only lists; empty/whitespace optional values become null.
- Backend does not validate literal token allowlists or rewrite body. Screenshot bodies contain tokens absent from their displayed lists: preserving saved HTML/text avoids destructive normalization and permits user-authored placeholders.
- DataFields metadata documents available reference tokens; it does not promise sending or substitution.
- Add nullable Subject nvarchar(500), Cc/Bcc nvarchar(2000) so historical rows retain null; no guessed subject/backfill, body untouched. Filtered unique index (SubscriptionId, TemplateType) WHERE IsDeleted=0. Owner must inspect/reconcile duplicates before applying migration; do not delete duplicates in code.
- Keep all existing enum IDs0..12 EXPLICIT, append IDs13..18 below; option ordering is screenshot ordering, not enum numeric ordering. New nullable fields and index require owner-run Add-Migration AddEmailTemplateHeadersAndUniqueType after checking name is unused. Do not create/run migrations or edit snapshots.
- Mapping is directional: write VM->entity and entity->detail; remove unnecessary ReverseMap. Preserve tenant ownership through canonical helper/filter.
- GET missing row returns requested type, null headers, empty body without inserting.
- New options/entity/validation DTO classes each get their own file.

## Catalog (Frozen; screenshot data, not invented runtime values)
- 13 ServiceAlert: {AGREEMENT_NUMBER} {VEHICLE_LICENSE_PLATE} {CUSTOMER_NAME}
- 14 RentalAgreementOpening: {AGREEMENT_NUMBER} {VEHICLE_LICENSE_PLATE} {CUSTOMER_NAME} {SALESPERSON_NAME} {SALESPERSON_EMAIL} {AGREEMENT_LINK}
- 15 RentalAgreementClosing: {AGREEMENT_NUMBER} {VEHICLE_LICENSE_PLATE} {CUSTOMER_NAME} {SALESPERSON_NAME} {SALESPERSON_EMAIL} {AGREEMENT_LINK}
- 16 LeaseAgreementOpening: {AGREEMENT_NUMBER} {VEHICLE_LICENSE_PLATE} {CUSTOMER_NAME} {SALESPERSON_NAME} {SALESPERSON_EMAIL} {AGREEMENT_LINK}
- 17 LeaseAgreementClosing: {AGREEMENT_NUMBER} {VEHICLE_LICENSE_PLATE} {CUSTOMER_NAME} {SALESPERSON_NAME} {SALESPERSON_EMAIL} {AGREEMENT_LINK}
- 0 TrafficFineCustomerDetail: {CUSTOMER_NAME} {CUSTOMER_EMAIL} {AGREEMENT_NUMBER} {CUSTOMER_REMARKS} {CUSTOMER_FINES_DETAIL_TABLE}
- 1 TrafficFineEmployeeDetail: {EMPLOYEE_NAME} {EMPLOYEE_EMAIL} {EMPLOYEE_CODE} {EMPLOYEE_FINES_DETAIL_TABLE}
- 2 JobEstimationCreation: {CUSTOMER_NAME} {JOB_ESTIMATION_NUMBER} {JOB_ESTIMATION_LINK}
- 3 VehicleCheckCard: {CUSTOMER_NAME} {CHECK_CARD_LINK}
- 4 NewCreditNote: {CUSTOMER_NAME} {CREDIT_NOTE_NUMBER} {CREDIT_NOTE_LINK}
- 18 UnInvoicedExcessDamage: {UNINVOICED_EXCESS_DAMAGE_LIST}
- 5 RentalBooking: {BOOKING_DETAIL} {BOOKING_NO} {VEHICLE_TYPE} {CURRENCY_CODE} {DAILY_RATE} {CUSTOMER_NAME} {TOTAL_CHARGES} {BOOKING_DAYS} {NOTES} {VEHICLE_CATEGORY} {PICKUP_LOCATION} {DROPOFF_LOCATION} {START_DATETIME} {END_DATETIME} {EMAIL_ADDRESS} {FIRST_NAME} {LAST_NAME} {PHONE_NUMBER} {ADDRESS_LINE1} {ZIP_CODE} {CUSTOMER_CITY} {BOOKING_CREATION_TIME} {CUSTOMER_COUNTRY} {PERIOD_OF_RENTAL}
- 6 CreditCardPayment: {Customer_Name} {Amount} {Ref_Type} {Ref_No} {Add_Card_Notes} {Add_Card_Link} {One_Time_Payment_Notes} {One_Time_Payment_Link} {Payment_and_Add_Card_Notes} {Invoice_Report_Link} {Additional_Note}
- 7 RentalBookingCancellation: {ADDRESS_LINE1} {ADDRESS_LINE2} {CURRENT_DATE} {BOOKING_NO} {CUSTOMER_NAME} {BOOKING_DATE} {PERIOD_OF_RENTAL}
- 8 RentalBookingConfirmation: {BOOKING_DETAIL} {BOOKING_NO} {NOTES} {CUSTOMER_NAME} {VEHICLE_CATEGORY} {PICKUP_LOCATION} {DROPOFF_LOCATION} {START_DATETIME} {END_DATETIME} {EMAIL_ADDRESS} {PERIOD_OF_RENTAL}
- 9 RentalBookingConfirmationWithPaymentLink: {BOOKING_DETAIL} {BOOKING_DAYS} {DAILY_RATE} {TOTAL_CHARGES} {CURRENCY_CODE} {BOOKING_NO} {CUSTOMER_NAME} {PAYMENT_LINK} {VEHICLE_CATEGORY} {PICKUP_LOCATION} {DROPOFF_LOCATION} {START_DATETIME} {END_DATETIME} {FIRST_NAME} {LAST_NAME} {PHONE_NUMBER} {NOTES} {ADDRESS_LINE1} {ZIP_CODE} {CUSTOMER_CITY} {BOOKING_CREATION_TIME} {CUSTOMER_COUNTRY} {PERIOD_OF_RENTAL}
- 10 PaymentConfirmationEmailAfterRentalBooking: {BOOKING_NO} {CUSTOMER_NAME} {PICKUP_DATETIME} {PICKUP_LOCATION} {DROPOFF_DATETIME} {DROPOFF_LOCATION} {VEHICLE_INFO} {ADVANCE_CHARGES}
- 11 ServiceBookingCreation: {CUSTOMER_NAME} {BOOKING_NO} {PLATE_NO} {DATE_TIME} {CONTACT_NO} {KMS} {NOTES} {SERVICE_ITEMS}
- 12 PaymentReminderBeforePromisedDate: {CUSTOMER_NAME} {PROMISED_DATE} {BALANCE} {TENANT}

The duplicated NOTES entry in RentalBooking image12 is displayed once (same token). Preserve CreditCardPayment casing. Sample subjects (asd/Test/cancel/xxxxxx), greeting, person name and branded body are historical/user-authored values, never seeded or used as defaults.

## UI/control contract
Typed FormControl<number|null> selector, nonNullable strings for subject/cc/bcc/body. Selector uses server options; translate keys enums.EmailTemplateTypeEnum.<key>, IDs retained as numbers. GET bootstrap options then first type ServiceAlert13; no local enum ordinals.
Shared title + manual Save fixed outside one internally scrolling content viewport; selector fixed above content. Shared FormSections for headers, data fields and body; existing ngx-editor retained with existing toolbar capability. Screenshot geometry/legacy editor toolbar implementation is not copied. Responsive form grid collapses through shared classes; feature owns only workspace/third-party editor integration.
Successful load resets/pristines form; identity checked. Reads cancel through Subject+switchMap and destruction. Failed load blocks editing/Save and offers Retry; no failed read interpreted as an empty saved row. Save freezes controls, retains snapshot on either failure, resets dirty only after success. Global loader start/finalize pair; one success toast owner global interceptor; errors inline with both suppression headers and apiErrorMessage.
Changing type or route/back with dirty data invokes one deferred shared discard confirmation, freezes both selector and fields via freezeFormState, restores exact values on Cancel, and switches/loads only on acceptance. While load/save/confirmation pending no duplicate Save/switch/exit. Native beforeunload protects a dirty or in-flight save draft.
Subject/body validation uses FieldError, accessible control IDs and focusField. Tokens are selectable literal LTR code text; no insertion behavior inferred from screenshots.
Route remains /EmailTemplates (AuthGuard inherited parent), adds CanDeactivate; no new authorization restrictions. Include route in existing toolbar title-exclusion owner. Existing Administration menu entry reused. Add EN/AR email-template topic to existing /UserGuide/administration, keeping all current guide changes.

## Required decisions (Master4)
Grid/ListVM/filter/paging/export, record routes, child reconciliation, domain transitions, FK/delete, accounting/calculations: Not Applicable (keyed scalar settings).
Confirmation: dirty discard only; Save needs no confirmation.
Read/write field ownership: exact five fields above; options server-owned metadata.
Authorization candidate: POST EmailTemplates changes tenant configuration; retain existing authentication only.
Validation lengths/addresses, nullable old-row defaults, append enum numbering, metadata ownership, and the selected single-pane settings layout are Reviewer decisions (owner standing rule Master2.6), chosen as minimal extension of current owners; rejected alternatives: fabricate subjects, renumber enums, duplicate client/server catalog, add a mail sender or delete rows.
No unresolved blocking requirement. Delivery/substitution integration and non-ngx-editor screenshot toolbar plugins are outside this settings request; runtime/visual and migration checks pending owner.

## 2026-10-17 reconciliation addendum — preserving authored HTML
Installed ngx-editor public schema/parser evidence shows unsupported table nodes and inline markup can be lost on a body edit. This refines the already Frozen preservation invariant without authorizing data loss: use the same typed body control with shared EditorTabs for Visual/HTML source editing modes. Compare inert canonical original HTML with public toHTML(toDoc(html)); unsupported/nonidentical round trips default to source and reject a switch to visual until compatible. No conversion/discard of markup is offered. Header-only saves retain exact body. Recreate/destroy Editor per loaded key and editor mode to isolate history/plugins. The screenshot code/source button also supplies content evidence, while shared UI13 owns tab semantics. Reviewer decision under Master2 standing rule; no new API/schema/business action. In-app bilingual guide covers both modes. Shared focusField now supports the actual contenteditable ID rather than a toolbar button (UI27).

Final validation reconciliation: plain-address lists use the installed Angular Validators.email grammar on both boundaries (254 total/64 local, ASCII mailbox form, no display-name/quoted-address syntax); the server feature attribute mirrors that bounded grammar. This resolves a source-observed broader MailAddress acceptance difference without introducing a new email delivery policy. Ordinary API text normalization handles CC/BCC blanks; only Subject requires post-validation service trim. Removed unused frontend ordinal enum and unused backend ListVM/UpdateVM after no-consumer symbol searches; no persisted field was removed.

