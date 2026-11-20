<!-- Part of backend block 18: see ../18-edge-cases.md. Same status and authority as the block. -->

### Outbound message outcomes
An operational message log is an append-only event, not a mutable CRUD entity.
Keep its read controller authenticated and its query on the existing
`Repository.QueryReport` tenant boundary. Use a lean row contract, filter before
count/page, stable Id ties and an event-ID cutoff for applied paging/full outputs.
The cutoff excludes ordinary later inserts; it is not database snapshot isolation.
An explicitly frozen strict operational read may reject malformed supplied
date/enum/sort/paging values instead of widening the query. Use FilterHelper for
optional raw values; the feature owns exact date grammar and strict validation.

When two real email producers share the same SMTP helper, reuse the shared
`IMessageDeliveryService`/`MessageDeliveryService` transport/outcome owner.
Its typed internal request carries actual message/SMTP inputs and is never a
public client-write payload. Validate normalized actual From/To and subject
against the event's storage bounds before sending. Record those same values;
do not truncate the address or subject actually sent. An optional contact-name
snapshot may be bounded explicitly; missing context/CC stays empty. Never persist
message bodies, credentials, provider exception text or fabricated recipient names.

Check cancellation before starting a new attempt. Once transport completes,
append its accepted/failed result independently of request cancellation in an
isolated scope, so event recording cannot save another caller's tracked changes.
Derive tenant only from authenticated server context and validate the isolated
scope's tenant. Persist a stable safe translation key for failure text, so display
and export follow the reader's current language. Internally log append failure
without emitting provider/credential diagnostics to the user.

SMTP acceptance is authoritative for the transport outcome, not proof of final
inbox receipt. A later event-write failure must not reclassify an accepted send,
retry it, or imply that no email went out. Report accepted-but-log-unavailable
separately from rejected-and-log-unavailable. In a partial batch, retain each
outcome and disclose earlier accepted count; no automatic resend. A simulation
is not delivery evidence and creates no Delivered log. New history begins with
future recorded attempts; deploy the owner-generated migration first.

Source consumers: SMTP test and Fleet service reminders. CC is nullable for the
existing grid but current transport has no CC input; no CC delivery is claimed.
Source-only conformance leaves build, real SMTP, cancellation/partial outcomes,
tenant isolation, log-failure recovery and print/Excel acceptance with the owner.


### Automatic HTTP error history
When the owner requests automatic HTTP error history, keep its append-only
operational entity separate from mutable CRUD and successful-save audit events.
Capture only authenticated requests with the existing positive subscription
claim, and scope reads with `QueryReport<T>()`. A middleware owner may capture
unexpected exceptions and returned5xx once; known business/conflict exceptions
retain their existing response owner, aborted requests and the log reader's
own endpoints are excluded. Background/global work and pre-deployment history
are outside this boundary; do not claim universal capture.

Never save the failed request's tracked business graph. Use a fresh DI scope
and context, suppress ambient business-transaction enlistment, apply a bounded
timeout and perform one append save using EF's implicit transaction. Persistence
failure must preserve the original response/error; fallback logging contains
type-only metadata, without the exception object. Suppression creates no new
business transaction and does not change the caller's commit/rollback owner.

Store bounded actor/controller/action/connection/browser metadata, UTC time
and backend Stopwatch duration. No trusted client-name source means null.
Request context contains method, route **template**, status and trace reference,
never actual route/query/body values, credentials or cookies. Diagnostic text
may include exception type and method identities, excluding raw Message,
ToString, source paths and SQL. Numeric SQL provider Number/State/Class may be
included to identify the failure category without provider text. A composed read
may stamp a server-owned enum stage on a rethrown exception; the diagnostic owner
validates the exact enum type and defined value before rendering its name. Never
append arbitrary Exception.Data values or feature/request strings. Preserve the
original exception/stack and cancellation; markers must not suppress an error or
replace failure with empty data. Dashboard's24 sequential read stages are the
first consumer after a500 report whose safe30-frame stack omitted the service
and provider category. Source-only; the next owner reproduction must establish
the actual failing SQL code/stage before any root-cause claim.
An unexpected exception returns a safe localized
500 Result when the response has not started; otherwise preserve propagation.
Use explicit authenticated read-only controller/service contracts, lean
grid/detail projections and stable count-before-page/Id-tie/cutoff export.

Evidence: frozen `reviews/Archive/Completed/2026-10-23/ERROR_LOGS_FULL_STACK_CONTRACT_FREEZE.md`,
`ErrorLogsMiddleware`, `ErrorLogWriter`, `ErrorLogEntry` and `ErrorLogsService`.
New tables require owner-generated migrations before activation. Source-only;
owner build/tenant/exception/cancellation/store-failure acceptance remains pending.
