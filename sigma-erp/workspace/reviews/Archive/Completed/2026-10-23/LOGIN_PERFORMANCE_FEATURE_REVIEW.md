# Login performance source review

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-23 |
| Authorization | Initial source-read-only review; owner authorized confirmed fixes in the amendment below |

## Manifest and evidence

Owner reports a noticeable delay **after pressing Sign in**. No elapsed time, network waterfall, deployed server trace or screen recording supplied. Prior bundle output reports initial3.81MB and Auth component CSS15.89kB; this does not measure the authentication request or establish login latency.

UI shape: authentication form plus authenticated-shell bootstrap, an explicit integration exception rather than CRUD. Backend shape: external identity/login endpoint and session-owned branch/localization reads, not normal/master-detail CRUD. Approved wiring references: current main.ts/app.config.ts/app.routes.ts, UI1/2/22/26/28/29; actual owners are LoginComponent/AuthService, LayoutComponent and CurrentBranchService. Master1/4/5/7 govern evidence, source-read-only scope and final reconciliation. Apply the sigma-screen-refactor digest within this bounded integration scope. Initial generator -Check passed for all packets; PHASE-00 discovery, PHASE-01 boundary review, PHASE-05 integration and PHASE-06 reconciliation apply. List/editor-write/domain-transition implementation phases are not applicable.

Sources: frontend auth/components/login, auth/services/auth.service.ts, root config/routes, layout shell/bootstrap and direct branch/localization dependencies; backend directly corresponding login/session owners where present. Preserve all existing working-tree edits. No application source is edited by this review. No screenshots or functional evidence tables apply. Auth routing/provider/error behavior is reviewed as factual behavior, not authorization redesign.

| Observed boundary | Evidence status |
|---|---|
| Submit | Valid form directly subscribes to AuthService.login; loading flag set immediately; no delay/debounce/retry in this path |
| Login request | POST environment.baseLoginUrl + auth/consolelogin, subscriptionCode/email/password, expecting Result<Login> |
| Login response | Persists subscriptionId, builds user/auth objects, publishes user, persists token/user then navigates to returnUrl/default '/' |
| Auth API source | Missing exact local route mapping: searched related auth/security/subscription controller owners; local api/Authenticate/Console_login is a different endpoint/response and cannot be assumed to implement the deployed auth/consolelogin route |
| Shell entry | Root auth guard then lazy LayoutModule; shell outlet gated on CurrentBranch.initialized() |
| Branch bootstrap | Options and Mine read in parallel; initialized becomes true in finalize after both complete |
| Runtime timings | Missing: requires owner-authorized runtime/network/server evidence |

Scope exclusions: credential/token exposure, live login attempts, server/database changes, permission/tenant redesign, migrations, builds/tests/lint/browser, unrelated feature scans and implementation. Historical authorization configuration contract explicitly defers identity integration; this performance review does not reopen it. No new permissions are invented.

## Authorized implementation amendment — Frozen, 2026-10-23

Owner requested “طبق التعديلات”. Apply confirmed F5/F6/F7 in existing LoginComponent/AuthService: validate successful envelope/token/identity/expiry before accessing/storing it; persist token, user and subscription before publishing user; handle partial storage failure without publishing a partial new session. Preserve existing login POST/payload, hash/return routes, validators, session invalidation and API-origin interceptor rules. One typed form and submit pending signal own request through navigation completion, with translated authenticating/opening status; failure releases the guard. Navigation false/rejection offers opening Retry without repeating login. Regression sources cover ordering, malformed/failed responses, storage rollback, duplicate submits, navigation completion/failure and retry. User-guide content extends the existing bilingual shared reader. No build/test/browser execution authorized.

Conformance before edits: UI1/26/28 owns session/provider contracts, compared against AuthService/CurrentBranchService/token interceptor; UI2 owns Result success-before-data; UI19/22/23 owns typed validation, busy/recovery and translations, compared against current LoginComponent/form/alert; Master7 owns the existing shared-screen-guidance overview. Layout/CSS/RTL/theme and backend contracts retain current source values. Handoff: Frozen; no material API or business decision blocks F5–F7.

F1–F4 are optimization candidates that require measurement/architecture decisions rather than confirmed broken business contracts. Branch gate protects current defaults; connected refresh and sequential DbContext queries are Frozen contracts; broad provider removal lacks build/consumer evidence. Preserve these owners in this bounded correction, without claiming measured speed. Any later broad optimization requires its own Frozen Maintenance/Evolution Plan. The deployed external auth endpoint source/timings remain unavailable. No schema or permissions/identity redesign is authorized or needed.

One helper may edit only EN/AR LOGIN_UI keys and the shared guide paragraph; root owns logic/tests/integration/final review. Pre-existing scoped source changes were absent at implementation entry; preserve changes arriving from user/peers.

## Work allocation

Root owns discovery, evidence/contract boundaries, login request/session/branch analysis and final reconciliation. One luna_explorer (gpt-5.6-luna) performs a bounded read-only audit of post-login shell static dependencies and startup imports; no source/artifact edits delegated. Independent read-only work reduces duplicate scanning without merge risk; no implementation delegation or shared contract change is involved.

## Findings and latency attribution

### F1 — Whole routed content waits for branch bootstrap (confirmed critical-path dependency, P2)

`layout/layout.component.html:18` does not instantiate its router outlet until `currentBranch.initialized()`. `shared/service/current-branch.service.ts:118` joins Options and Mine in parallel, and only sets ready in finalize at143. Consequently the default dashboard component cannot begin its own initial HTTP request until the slower branch read completes. This adds a serial dependency **after authentication**, not a proven delay in the login POST itself. Branch preference is required for default filters/new records; do not simply remove the gate and allow incorrect defaults. Recommendation: measure both branch reads, then consider one server-owned bootstrap read for options/preference, or distinguish routes that require branch readiness under an explicit contract. No endpoint or readiness change is approved/implemented here.

### F2 — Dashboard load is repeated after initial realtime join (confirmed extra-read path, P2 optimization candidate)

`pages/dashboard/dashboard.component.ts:129–136` requests an initial foreground snapshot after token observation. The independent watch at124–125 calls requestSnapshot(false) for both connected and changed notifications after auditTime400. `shared/service/realtime.service.ts:165–170` emits connected after successful Subscribe. If a snapshot is in flight, requestSnapshot sets pendingBackground at159; finalize107–113 schedules another read. On a successful first result, tap has already set snapshot, so the queued follow-up is normally background, **not a second foreground block**. If the first result fails/remains empty, the queued read becomes foreground through `foreground || !snapshot()` at170. Exact scheduling/request counts remain runtime-dependent.

The existing Frozen `DASHBOARD_REALTIME_API_CONTRACT_FREEZE.md:30–32` deliberately requires a fresh read after topic join/rejoin to recover missed events. This is not an unapproved duplicate-handler defect. Optimize only with an equivalent freshness handshake/version or revised bootstrap sequencing; do not discard the initial connected event and create a gap in update coverage.

### F3 — Default dashboard waits for a complete multi-section server snapshot (confirmed sequential work; duration unknown)

`SigmaBackend/SiGma.Business/Services/DashboardService.cs:20` performs many awaited aggregate sections before returning one Result at357. Examples include vehicle status69, idle branch105, fleet128, bookings141, rentals160, leases171, jobs290 and approval counts312–354. `ReadSnapshotSectionAsync:384` adds section diagnostics but no cache or concurrent scheduler. The frontend initial snapshot read enables the global loader (`dashboard.component.ts:92–108`). Thus successful login can be followed by a visible dashboard wait. The existing Frozen dashboard contract intentionally specifies sequential queries on the scoped DbContext; **Task.WhenAll on that context is not a valid optimization**. Recommendation: profile existing section diagnostics/query plans, consolidate compatible aggregates, or explicitly plan a partial/dashboard response or safe freshness-aware cache. No SQL duration/index defect is established from source alone.

### F4 — Authenticated shell statically retains broad feature service dependencies (confirmed coupling; cost unmeasured)

The root lazy route loads LayoutModule only after successful login (`app.routes.ts:20–24`). `layout/layout.module.ts` has220 static import declarations and284 active provider entries comprising215 unique symbols (AST source inventory). Repeated entries are provider metadata, **not proof of multiple service instances per token**. This breadth can retain code needed at shell load and is a first-login transfer/parse candidate. Most feature routes retain dynamic lazy imports, so this does not mean all screens are downloaded or constructed on login. Root providers and source/static coupling must be reconciled before removing old entries; compare emitted chunks under separately authorized build/runtime analysis. UI backlog item17 already records gradual removal of legacy LayoutModule providers; this review does not present that known debt as new. The user's initial3.81MB warning alone neither quantifies this lazy shell chunk nor proves that it causes the observed post-click delay.

### F5 — User is published before its credential is persisted (confirmed ordering risk, P2)

`auth/components/login/login.component.ts:120` calls setCurrentUserValue before setAuthFromLocalStorage at122. BehaviorSubject publication synchronously invokes existing listeners. If CurrentBranchService already exists (for example logout/login in the same SPA), its session subscription at66–78 immediately starts Options/Mine; `token.interceptor.ts` reads localStorage synchronously. Those requests can leave with the old/missing token, and the global error interceptor's401 branch logs out and reloads the document. This is conditional on the service being alive: **not a proven first-login event or timing measurement**. Shared observeAuthToken already defers an additional token read to cover user-before-storage ordering for its consumers, but CurrentBranchService does not use that helper. Recommendation: publish an authenticated user only after token/session persistence succeeds, preserving tenant/session invalidation and ownership. No identity redesign is required to record this finding; source edits remain unauthorized by the review request.

### F6 — Unsuccessful login envelope is dereferenced before checking success (confirmed correctness defect, P2)

`login.component.ts:94` reads user.entity.subscriptionId before checking user.isSuccess at96. A standard failed Result with null entity throws in the next handler and bypasses the intended hasError branch. The existing error callback handles observable failures, not reliable recovery from an exception thrown in a downstream next callback. This is a failed-login handling defect, **not evidence of a slow successful login**. Recommendation: validate isSuccess, entity and required session fields before storage/publication; retain actionable inline declared/transport failure feedback without exposing credential details. UI2 owns the success-before-data rule.

### F7 — Busy indication covers HTTP only, leaving shell-load time unexplained (confirmed UX gap, P3)

`auth/services/auth.service.ts:55–65` sets busy around the one POST and releases it in finalize. `login.component.ts:124` starts router.navigate without awaiting/handling its result. While the lazy shell is loading, the login form can remain visible after the HTTP spinner ends; no phase-specific progress distinguishes authentication, navigation and preparing the first page. `submit():79` checks only form validity; no in-method pending guard covers this transition interval. Button disabled state does guard ordinary clicks during the POST. Recommendation: keep one submit/navigation pending owner until successful transition or recoverable failure, guard repeated submit events in code, and present translated progress for the current phase. This improves feedback; it is not a measured network speed improvement.

## What the source rules out / leaves unknown

- The live submit path sends one POST immediately; no timeout, delay, debounce, auto-retry or second authentication request was found in LoginComponent/AuthService. `getUserByToken()` currently returns synchronous of(undefined); the application initializer is not a hidden token-validation HTTP wait here.
- The separate legacy AuthHTTPService/fake login service is not the live caller. Do not optimize it as though it handles auth/consolelogin.
- Development uses a local main API but retains the external login server; production also uses an external login server. Local main-API speed does not establish login-server speed. Cold start, DNS, connection latency, password verification/database time and load are plausible categories, not proven causes.
- Token/error/navigation interceptors return straight through for the external login origin; the main API's error dialogs/retry/cancellation behavior do not delay that login POST.
- Localization starts on shell initialization with Language/Options followed by Localization/Runtime. It runs independently of branch reads, not as an awaited gate on the shell outlet. The server Runtime path rereads language options and constructs/hashes the UI dictionary; this is startup workload, not a proven login blocker.
- An exact source implementation for the deployed auth/consolelogin route was not found in the directly related local identity/subscription controller owners. Local `SiGma.Security/Controllers/AuthenticateController.cs:88` exposes api/Authenticate/Console_login with a different raw response. Do not attribute its internal queries or password cost to the remote endpoint without deployment routing/source evidence. No credentials, stored tokens or connection secrets were read or printed.
- The owner has confirmed post-button delay but has not yet distinguished the login spinner interval from shell-content waiting. Root requested this optional distinction; the review proceeds with both stages explicitly separated, without treating silence as a measurement.

## Recommended measurement before optimization

Record durations only (never request bodies, passwords, authorization headers, token response bodies or credential-bearing HAR data): button click → login request start → login response → shell chunk/NavigationEnd → branch Options/Mine completion → dashboard Snapshot completion/first usable content. Compare first visit and warm visit, successful login after full reload and logout/login in the same tab. For the remote login request, separate connection/queue/server-wait/download timing and correlate a safe request ID with server logs. For branch/dashboard reads retain status codes and section timing only. If delay is entirely before login response, prioritize the external authentication deployment rather than CSS/provider changes. If it is after response, prioritize F1/F3 and shell load as supported by actual measurements. Runtime/browser/network/server inspection requires current-task authorization under AGENTS and was not performed.

## Final reconciliation

| Comparison | Result |
|---|---|
| User evidence ↔ scoped flow | Confirmed: delay after Sign in. Exact stage/duration remains Uncertain; no claimed root-cause timing |
| Login form ↔ request/response | Existing subscriptionCode/email/password → Result<Login>; F6 is a source-confirmed failure guard issue |
| User publication ↔ token/branch consumer | F5 ordering race identified with explicit existing-service condition |
| Root route ↔ actual shell/default route | Lazy LayoutModule, synchronous AuthGuard, '/' → dashboard; no fabricated route/API |
| Branch controller ↔ service ↔ outlet | Options/Mine are authorized session reads; same frontend/backend shape; F1 dependency preserved in review |
| Dashboard ↔ frozen realtime contract | F2 connected refresh is deliberate recovery behavior; F3 sequential scoped-context aggregates retained |
| Providers/interceptors ↔ live origin | One root HttpClient; external login excluded from Sigma interceptors; no manual token workaround |
| Translation/loading ↔ feedback | Existing translations unchanged; F7 phase feedback gap recorded; localization not labelled an awaited gate |
| Grid/ListVM/filters/editor/financial effects | Not applicable to authentication review; no domain data contract changed |
| Screenshot evidence | None supplied; no screenshot-derived decision |
| Authorization/identity | Existing guard and authorized backend reads traced; historical deferred identity work remains deferred; no permission mechanism invented |
| User-guide gate | Review is source-read-only; no guide source edit authorized. Any implemented login/progress behavior must update existing in-app authentication/shared usage guidance at implementation handoff |

No application, configuration, instruction, canonical-book or generated-packet files changed by this review. Only this local review artifact was created/updated. Frontend and backend scoped Git diffs were empty and whitespace checks passed; unrelated user changes elsewhere were preserved. No migration, mapping, domain calculation or commit required. No implementation commit message applies to this read-only review.

Source review is complete; this Frozen report is a review record, **not an implementation approval or a measured performance clearance**. Applicable discovery/boundary/integration/final-reconciliation phases were performed proportionally; list/editor/domain-action implementation phases skipped. Full recipe -Check passed initially and at final reconciliation; no refresh needed. The delegated read-only shell audit was integrated and independently checked (including provider AST inventory); root corrected its preliminary queued-refresh classification to background after successful first snapshot. No builds, tests, lint, browser automation, login attempts, database commands, migrations, commits/pushes or deployment steps were run. Owner runtime verification remains pending.

## Implemented correction and reconciliation — 2026-10-23

The authorized amendment is implemented for F5/F6/F7. This section supersedes the historical read-only handoff for those rows; the review's unmeasured optimization candidates F1–F4 remain explicitly separate.

| Frozen concern | Final source and result |
|---|---|
| F5 session ordering | AuthService.setAuthFromLocalStorage saves token/user/subscription first. LoginComponent.acceptLogin publishes user only after it returns true; synchronous branch subscribers therefore see the new persisted credential |
| Storage failure | Reads previous values before writing, returns false if storage is unavailable, restores prior values after a partial write where possible, best-effort removes failed rollback entries. New user is not published on failure; browser-storage feedback is translated. This is not an atomic cross-tab storage transaction |
| F6 result validation | acceptLogin checks response success/entity/token/identity and parseable expiration before access/storage. Failed envelopes use safe credential feedback; malformed successful session responses use incomplete-response feedback |
| F7 submit/request/navigation lifetime | Typed nonnullable form retains original validators. pending guards every submit through HTTP plus navigation promise; credential controls pause for the submitted snapshot, re-enable with values after pre-session failure, and remain disabled after authentication |
| F7 navigation recovery | false/rejected Router.navigate result releases pending and displays opening-specific feedback; submit becomes Open workspace again through the same session, without another login POST |
| Observable ownership | takeUntilDestroyed/finalize clean up component attempt; AuthService HTTP busy starts on subscription with defer and ends on HTTP completion. The one live login caller subscribes immediately; no other live AuthService.login consumer found |
| Payload/identity/domain compatibility | Same external auth/consolelogin route and subscriptionCode/email/password body; same Login/AuthModel and storage keys; existing returnUrl/default and root client retained. No branch/realtime/dashboard/permission/backend/EF/mapping/calculation changes |
| Appearance/translations | Existing auth shell/button/alert/SCSS geometry retained; dynamic checking/opening/error/retry labels use eight matching AUTH.LOGIN_UI keys in EN/AR. Source conformance checked; actual RTL/theme/wrapping and screen-reader behavior remain pending |
| User guide | Existing shared-screen-guidance.ts has bilingual one-submit/checking/opening/failure/storage/opening-only Retry guidance. GuideReaderComponent exposes it in the existing overview loop; current module entries including /UserGuide/customers (sidebar-menu-data.ts) are unchanged |

### Changed files and verification

Frontend repository `F:\My Work\Sigma\SiGmaAngularFrontEnd`:

- `src/app/modules/auth/components/login/login.component.ts`
- `src/app/modules/auth/components/login/login.component.html`
- `src/app/modules/auth/components/login/login.component.spec.ts` (new)
- `src/app/modules/auth/services/auth.service.ts`
- `src/app/modules/i18n/vocabs/en.ts`
- `src/app/modules/i18n/vocabs/ar.ts`
- `src/app/modules/UserGuide/content/shared-screen-guidance.ts`

Canonical learning: added sign-in completion/session publication guidance in owning `sigma-erp/ui/22-loading-empty-error-toast.md`, plus matching `.agents/skills/sigma-screen-refactor/SKILL.md` digest/revision row. Preserved pre-existing UI22 navigation/global-progress documentation changes. Only the added sign-in paragraph belongs to this implementation.

Regression sources cover synchronous publish-after-persist observation, duplicate submit during HTTP/navigation, failed null entity, incomplete token, partial storage rollback, rejected/false navigation, opening-only Retry, network/401 feedback, retained inputs/disabled state and teardown. These orchestration tests intentionally override markup; they do not prove rendered templates or interactive browser behavior. The spec explicitly references existing Jasmine definitions and remains under tsconfig.spec.json; no package/install or app compilation-root changes were required.

Verified from source only: complete scoped frontend diff and new spec reviewed; stale imports/getters removed; TypeScript parser reports zero syntax diagnostics in all six changed TS files; Angular template parser reports zero syntax errors; eight new EN/AR key pairs exist in the matching LOGIN_UI block; spec configuration parsing has zero errors and includes this spec with Jasmine types; scoped whitespace and merge-marker checks pass. These parsing/dependency checks are not compilation, type checking or test execution.

During final documentation refresh a concurrent update to UI1/UI30 changed additional packet fingerprints. Compared all normalized packet procedures with current templates (all matched), reviewed current UI1 runtime/single-client and backlog reference roles, preserved those canonical changes, and regenerated through the generator only. Final full -Check passed. Own UI22 dependency refresh affects PHASE-02/03/04/05; concurrent fingerprint refresh also included PLAN-00, PHASE-00 and PHASE-06 (PHASE-01 was rewritten deterministically without a new rule). No generated file was edited directly; no template/manifest changes were made by this task. All canonical/packet edits were reviewed with unrelated existing changes preserved.

Agent utilization: reused luna_explorer/gpt-5.6-luna for disjoint EN/AR/shared-guide editing and a bounded read-only logic audit. Root implemented logic/tests/docs, integrated outputs and reviewed the full diff. The audit's credential-edit concern was resolved by pausing controls during the attempt. Its subscription-time busy concern was reconciled against the single immediately subscribing live caller; its plain-object HTTP-error concern does not match the external HttpClient failure path, so the code retains HttpErrorResponse typing. No overlapping file edits were performed while the helper was active. This reduced documentation work time without a second agent repeating the source scan.

Phases applied: existing Phase0 discovery/Phase1 contract amendment, bounded Phase3 form/write lifecycle, Phase5 auth/session/navigation integration and Phase6 reconciliation. Grid/ListVM/editor CRUD/domain-transition phases and backend refactoring are not applicable to this auth exception. No schema change or migration needed. No build, tests, lint, browser/app verification, real login attempt, database command, migration, commit/push or deployment was run. No measured latency reduction is claimed; external authentication time remains unverified.

Owner checks: compile and run the new login spec; verify successful fresh login and logout/login in the same tab; first branch requests must carry the new session; network/invalid credentials/storage failure must preserve and re-enable inputs; repeated click/Enter during login/opening must not repeat the POST; failed navigation must offer opening Retry and not reauthenticate. Verify return target, branch defaults/dashboard recovery, Arabic/English, RTL/themes and narrow-width button labels. Measure login POST, branch bootstrap and snapshot separately before any F1–F4 optimization.

Suggested frontend commit (only the seven listed files): `fix(auth): persist sessions before opening workspace`.
Suggested documentation commit (own UI22 sign-in paragraph and its generated dependency fingerprints): `docs(ui-book): record sign-in completion lifecycle`.
