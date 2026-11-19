# Logout delay while dashboard remains visible

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-24 |
| Scope | Initial source-only diagnosis, then owner-authorized confirmed fixes; account sign-out |

Tier S integration diagnosis. No screenshot, network waterfall, elapsed time or
runtime trace supplied. No application source/config/instruction edits, runtime,
build, test, browser, database or migration operations authorized or performed.
Applied Master1/5, UI1/22/28 and PHASE-05 integration; all eight recipe checks
passed. Existing auth/shell/session owners are the references; this is not CRUD.
Backend changes, grids and document lifecycle phases are not applicable.

## Findings and evidence

1. Confirmed synchronous work on logout; duration unmeasured. AuthService.logout
   removes stored credential/user, synchronously publishes undefined, then calls
   Router.navigate to /auth/login. LayoutComponent's currentUser subscription
   calls TranslationService.endSession during that publication. endSession deep
   copies every registered original language dictionary with JSON stringify/parse,
   republishes every dictionary and reapplies language while the dashboard is
   still mounted. AppComponent registers seven built-in languages. Layout
   ngOnDestroy then calls endSession again; the method has no no-op guard and
   repeats the complete reset. This is a concrete performance candidate, not a
   measured assertion that it accounts for the reported duration.
2. Confirmed conditional failure handling gap. The shell's leaveShellGuard can
   refuse navigation during a transport write, branch save or pending discard.
   AuthService.logout clears the session before that decision and ignores the
   navigate promise. A false/rejected transition can leave the old page visible
   after its session has been cleared. Source does not establish that a write
   or discard decision was active in the owner's dashboard reproduction.
3. Conditional 401 interference. errorInterceptor calls logout then immediately
   document.location.reload without awaiting routing. A late unauthorized API
   response can reload the current hash/page during sign-out; this branch is
   not evidence that a 401 actually occurred in this reproduction.
4. No logout HTTP wait in AuthService. Dashboard session observation sends null
   to its switchMap on token removal, unsubscribing its active snapshot read;
   requestSnapshot refuses a missing token. SignalR stop is not awaited. There
   is no source-supported claim that logout waits for Dashboard/Snapshot or
   loads every dashboard card again. Auth route lazy-loading latency remains
   unmeasured.

## Recommended correction / reconciliation

### Authorized implementation amendment — Frozen, 2026-10-24

Owner requests fixing the recorded notes. Integration shape: existing AuthService,
LoginComponent, authenticated shell, errorInterceptor and TranslationService;
no backend/API/schema change. Root owns auth/navigation/401 integration, feedback,
guide/docs and final review. Translation worker owns only TranslationService and
its isolated regression source. Both preserve peer/user edits; no runtime checks.

Frozen behavior: one shared in-flight logout promise/pending signal. Ordinary
logout navigates through the existing shell/feature guards before ending the
session; cancellation/rejection leaves credentials and draft intact with shared
translated feedback. Login must not auto-open the workspace or accept credentials
during that transition. Successful logout clears token/user/subscription and
publishes the ended session. A 401 matching the credential sent by that request
invalidates the session immediately and uses this same transition; stale 401s
from a replaced session do not terminate the new one. Remove unconditional page
reload. If guards reject an expired-session departure, show actionable shared
feedback and retain ordinary guard protections; retry sign-out is available even
without an account popover. Do not retry uncertain writes or bypass guards.

Translation endSession is idempotent. Cancel its request and restore/reset only
runtime-overridden language dictionaries; built-in originals are immutable and
unaffected languages are not republished. Preserve fallback language, RTL,
default labels/options and next-tenant isolation. Authenticated shell destruction
and session publication can both call cleanup safely. Runtime latency remains
unmeasured; no speed claim is implied by implementation.

Conformance: UI1/22/28 root service/interceptor/session lifetime; existing
NavigationPolicy guard and feature guards remain the navigation authority;
UI22/23 translated shared MessageService feedback and existing PrimeNG button;
Master7 existing bilingual administration UserGuide reader; UI29 source-only.
No new route, permission, backend, provider owner or parallel session wrapper.

Make session cleanup idempotent, restore only dictionaries changed by the ended
runtime session, and preserve tenant dictionary isolation. Handle the single
logout transition and cancelled/rejected navigation explicitly, retaining write
and draft protection; do not simply bypass guards. Reconcile 401 session teardown
and routing under the same owner rather than racing a document reload. Exact
timing attribution needs separately authorized runtime measurements around
logout publication, navigation and any 401; do not log tokens or credentials.

No new reusable rule was promoted from unmeasured hypotheses. Canonical books,
skill and generated packets are unchanged. The existing login-performance and
navigation-policy records were consulted; their prior auth fixes and frozen
write protections remain intact. Source review complete for this diagnosis;
cause magnitude, navigation outcome and browser acceptance remain pending.

## Implementation and final reconciliation

The owner-authorized amendment above is implemented. The preceding read-only
statements describe the initial diagnosis; this section records the later edits.

| Concern | Final source / contract match |
|---|---|
| One logout owner | AuthService.logout returns one shared Promise<boolean> and readonly signingOut/logoutError state. Ordinary credentials survive false/rejected navigation; success removes token/user/subscription. Older transitions cannot clear replacement credentials |
| Existing guards | No guard, policy registration, write counter or feature CanDeactivate rule was bypassed/changed. Root shell uses signingOut to pause new navigation, not to change guard decisions. Guard refusal releases the pending state and exposes Retry |
| Session expiration | errorInterceptor sends the original Authorization header to AuthService.handleUnauthorized and retains throwError. Matching expired credentials are cleared immediately; absent/replaced request credentials are ignored. No document reload or automatic write retry |
| Login handoff | LoginComponent does not auto-enter workspace or submit while signingOut. Controls and translated status reflect that state; sessionReady is reset during sign-out. Expected superseded workspace navigation does not display an unrelated opening error during the transition |
| Recovery owners | Existing LayoutComponent StateMessage and button show translated reason/Retry outside the account popover. After expired-session refusal, content explains the ended session instead of remaining at branch loading. The explicit LogoutComponent route now uses shared StateMessage/PrimaryActionButton instead of its scaffold text |
| Translation lifetime | TranslationService.endSession is idempotent, cancels current runtime read, restores only runtime-overridden built-ins, removes tenant-only languages and retains fallback/RTL/options/original isolation. No unrelated dictionary republishing |
| Shared presentation | Existing header/shell state owners and control sizes/tokens retained. Navigation-status row wraps for narrow widths. No separate palette, popup, session provider or wrapper |
| User guide | Existing bilingual administration topic describes guard/cancel/session semantics and Retry. Existing /UserGuide/administration reader/menu retained |
| Backend/contracts/schema | No backend endpoints, DTOs, accounting effects, packages, providers, database schema or migrations changed. Angular service promise/state contract updated with all direct consumers and source test doubles |

Frontend files changed: auth/services/auth.service.ts; auth/components/login
TS/HTML and its spec; auth/components/logout TS/HTML; i18n/translation.service.ts;
shared/interceptores/error.interceptor.ts; LayoutComponent TS/HTML/SCSS/spec;
shell-header HTML/spec; app-bootstrap-compatibility.spec.ts; English/Arabic
profileMenu keys; UserGuide/content/administration-guide.ts. Added regression
source: auth/services/logout-session.spec.ts, i18n/translation-session.spec.ts,
shared/interceptores/logout-unauthorized.spec.ts. Existing dirty sidebar/cache/
header/translation/document-guide work was preserved and is not claimed as this
task's implementation.

Added 13 regression cases across service, interceptor, translation, login and
shell: coalesced clicks, guarded success/refusal/retry, rejected routing, matching
401 immediate invalidation, stale 401 isolation, replacement-session retention,
original request credential/error handoff, single-language/idempotent cleanup,
runtime request cancellation, tenant-only language removal, next-tenant isolation,
login non-reentry during logout and ended-session recovery. Cases were added and
source-reviewed, not executed. Existing auth test doubles gained required signal
members; no spec is added to application runtime file inputs.

Root reviewed the integrated scoped source diff, actual shared component inputs,
standalone imports, consumer signatures, template access, translation keys and
guard call paths. Worker owned only translation service/spec; root owned all
integration/docs and final review. No namespace/project reference change exists.
Scoped git diff --check passes. No build/test/lint/browser/runtime/DB/migration,
commit or push was run. Source findings do not prove a latency reduction.

UI22 plus the execution skill/revision row now define this shared session rule.
All eight generated packets were refreshed through the generator; PHASE-05 UI22
provenance and unchanged root client/route reference roles semantically reviewed.
Final generator -Check passes all eight. No generated packet was edited directly.
Phases applied: discovery/frozen integration contract, frontend state transition,
integration and source reconciliation. Backend/list/domain-document phases skipped
because no such contract changes. Authorization candidates: no new restricted
business action; existing authentication-only boundary retained.

Owner verification pending: compile Angular and run the regression cases; exercise
normal dashboard logout, double click, dirty-document Cancel/Discard, active write
refusal then Retry, route rejection, concurrent 401, old 401 after re-login, custom
tenant language cleanup, failed navigation after expiration, browser Back, phone/
RTL/themes/keyboard and actual elapsed time/network trace. No migration required.
No required scoped source change remains. Suggested frontend commit:
`fix(auth): coordinate logout and avoid repeated translation cleanup`.
Suggested documentation commit:
`docs(ui): define guarded session teardown and logout recovery`.
