<!-- Part of UI block 13: see ../13-modal-with-tabs.md. Same status and authority as the block. -->

### Shared document-journal read dialog
When a document's Journal action must open a read-only dialog, use the neutral
shared `DocumentJournalComponent` rather than routing the action to View or
copying Bill journal markup. Its public contract is `recordId:number`,
`title:string` (translation key), `subtitle:string` (display text), optional
`typeLabel(value:string|null):string`, required
`loadJournal(id):Observable<Result<VoucherJournalLine[]>>`, and a closed
output. The shared shell is `app-editor-dialog` at the approved 1250px ×
700px size, with no Save action; the table owns Date, Account, Contact, Type,
Voucher No, Description, Debit and Credit, and `SummaryCards` owns the
Debit/Credit totals.

The feature supplies the endpoint, type formatting and eligibility. The shared
component owns only read presentation and lifecycle: one local
`StateMessage` inside the body-appended dialog, no duplicate table progress indicator,
finite direct uncached loading, Result and HTTP error/Retry handling,
loaded-identity/version cancellation fences, reset on `OnChanges`, close
abort plus closed emission, and shared Close focus. It contains no financial
rules, allocation policy or source-document inference. Keep View and Print
owned by their existing feature actions; reading a journal does not mutate or
approve the document.
