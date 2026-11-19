| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Shared loading appearance — 2026-10-23

## Frozen amendment — render-safe publication, 2026-10-26

Owner evidence: opening Amortization reports NG0100 in LayoutComponent's
aria-busy binding, false to true. Discovery: Layout reads the shared
BehaviorSubject before its routed child subscribes in ngOnInit; startLoading
then publishes synchronously into an already checked ancestor. The existing
counter owns every visual consumer, so fix that owner rather than hiding the
attribute, forcing detectChanges or adding screen timers.

Target Frozen: retain synchronous pending-count start/end/reset and expose an
immediate isLoading getter for imperative guards. Coalesce visual publication
into one microtask, reading the latest count when it executes within NgZone;
retain a synchronous false BehaviorSubject seed for requireSync consumers.
No minimum display duration or request delay. Same-stack start/end emits no
stale true; overlapping operations stay busy until all releases; reset and
new starts are resolved by the current count. Cancel publication on owner
destruction. Preserve query-only navigation, path-departure reset, one visible
host, operational/tenant/cache policies and independent write navigation guards.

Impact/classification: Extend LoadingService publication/getter; Refactor the
shared report tree's sole imperative isLoading$.value guard to the immediate
getter; Keep Layout, table, button and dialog public bindings. API/backend,
accounting, database/index/migration contracts remain unchanged. No new loader,
per-screen opt-in or palette. Existing source-only boundary remains active.
Alternative shell-only scheduling would leave other shared consumers exposed;
feature delay/detectChanges/production-mode suppression would mask ownership.

Verification: source trace and full scoped diff; add unexecuted regression
coverage for first-render parent/child loading, same-stack completion, overlap,
queued reset/new start, outside-zone call and same-path navigation versus
departure. Owner runs tests/build and opens the affected routes in development,
then checks success/failure/cancel, actual overlap and visible progress. No
performance measurement or runtime pass is implied. UI22 and Master5 own the
reusable guidance; update the skill, regenerate and review affected packets.

## Frozen amendment — query-only navigation lifetime, 2026-10-25

The owner reports missing shared progress in JVs/Salary Vouchers and authorizes
fixing implementation plus conflicting/ambiguous documentation. This is a
bounded extension of the existing owner, not another loader. Evidence:
writeListRoute schedules query-param navigation and list reads subscribe before
its NavigationStart; LoadingService currently resets on every NavigationStart,
so a same-screen filter/paging URL update can remove active progress. Keep the
existing ref count/start/finalize API. Reset only when navigation changes the
parsed route path (including outlet/matrix paths); query/fragment-only changes
preserve pending reads and progress. Actual route departure retains reset.
No write/navigation permission derives from this counter. Other global consumers
inherit this lifecycle fix; no backend/API/schema/timeout/business changes.
UI22/28 and Master5 own the rule. Update skill and packets in the same task.
Alternatives rejected: per-feature delayed start or URL timers race request
cancellation and duplicate lifecycle ownership; a new overlay/cache is unnecessary.
Owner runtime checks: slow paging/search, rapid query changes, actual route
departure, cancellation, errors and overlapping requests. Source-only here.

## Scope and authority

Owner request: «حسن شكل Loading». Implementation is authorized. Tier L is used
because the existing shared presentation serves multiple screens. This plan
freezes the bounded visual slice; implementation continues in the same task.
Master1/5/7/8 and UI22/24/25/29 own the work. Backend shape: not applicable.
UI shape: existing shared StateMessage loading state and authenticated shell
content overlay; no list/editor/business contract is introduced.

## Existing-state inventory, impact map and gap decisions

| Area / owner | Current behavior and consumers | Decision / target | Risk / phase |
|---|---|---|---|
| LoadingService | Reference-counted global boolean; shell and shared busy controls consume it | Keep starts, ends, reset, navigation and disabled semantics | No data impact / 0,5 |
| StateMessageComponent | Shared translated loading/empty/error; loading is a small inline spinner | Extend only loading presentation with a larger blue ring and stacked label; existing panel/dialog/branch consumers inherit it | Increased loading-state height / presentation |
| LayoutComponent | One translucent content overlay with shared loading message | Extend existing overlay with a compact centered card and subtle backdrop blur | Check short/narrow content boxes / 5 |
| DataTable / PrimaryActionButton / EditorDialog | Suppress local progress while global loader is active | Keep existing one-visible-progress policy | No consumer changes / 5 |
| Shared guide overview | Existing bilingual guidance in every module guide | Extend with loading explanation | Reader route/menu stays as is / 6 |
| Canonical UI22 + skill | Earlier owner decision retained appearance | Record this owner's subsequent visual change without weakening progress ownership | Regenerate derivative packets / 6 |
| Backend / persistence / calculations / API / authorization / reports | No contract involved | Keep; outside this visual slice | No migration or rollout ordering |

## Logic ambiguity register and decision review

| Decision | Status | Evidence / resolution |
|---|---|---|
| Improve appearance generally in existing owner | Confirmed | Current request plus standing shared-presentation instruction |
| Exact appearance | Derived | Existing Sigma primary/surface/border/text/shadow tokens; larger ring, clear label and compact shell card are reversible implementation choices |
| Motion accessibility | Derived | UI27/29 accessibility; stop decorative rotation under reduced motion, retain text and ring |
| Business / API changes | Confirmed | None needed; service and public component inputs remain intact |
| Material open decisions | Confirmed | None; no screenshot supplied and no workflow inferred |

## Options

| Option | Compatibility / complexity | Decision |
|---|---|---|
| Improve the existing shared loading owner and its shell container | Existing consumers inherit; token-based themes; no new API or dependency | Selected |
| Add a new global loading component or per-screen overrides | Duplicates existing ownership and introduces consumer migration | Rejected |

## Frozen target and conformance before editing

All source paths below are under `SiGmaAngularFrontEnd/src/app/`.

| Concern | Book | Reference symbol / shared owner | Frozen target |
|---|---|---|---|
| Progress lifecycle | UI22 | `modules/shared/service/loading.service.ts: LoadingService` | Counter/reset/finalize contracts unchanged |
| State presentation | UI22 | `modules/shared/components/state-message/state-message.component.*: StateMessageComponent` | Loading-only modifier and own decorative spinner; kind/message/icon and translated label preserved; empty/error retain existing geometry |
| Shell overlay | UI1/22 | `layout/layout.component.html/.scss: .sigma-shell__loading` | Existing single content host, inset overlay, bounded 240px card, no navigation mask |
| Palette / theme | UI24/25 | `_sigma-base.scss`, Sigma tokens, existing native spinner | Consume primary/surface/border/text/shadow; logical sizes; no separate dark palette |
| Motion / access | UI27/29 | Shared status role and aria-busy | Decorative ring hidden from accessibility tree; reduced motion stops; forced colors preserve contrast |
| Guide | Master7 | `modules/UserGuide/content/shared-screen-guidance.ts`, existing reader overview | Bilingual loading guidance, no new page/menu |

## Compatibility, slices and verification

No DTO, route, provider, HTTP, domain, mapper, calculation or schema change.
Existing callers require no opt-in. No migration, backfill or data correction.
Recovery is reverting this bounded visual patch.

Sequence: discovery/freeze → shared state and shell styles → source conformance
review → bilingual guide and canonical rule/skill update → regenerate/check
packets → complete scoped diff review. Phases 1–4 have no domain, grid, write or
transition work. Phase5 consumes unchanged loading wiring; Phase6 reconciles.

Source verification covers selectors, direct template bindings, translations,
loading ownership, reduced motion, theme tokens, logical sizing, print hiding
and whitespace. Owner checks: light/dark; Arabic/English; phone/tablet/desktop;
narrow and short panels; reduced motion; loading completion/failure/navigation;
single visible global indicator. Build/tests/browser/runtime are pending under
workspace restrictions. No subagents: the small visual slice and its documentation
are sequential, with no useful independent implementation stream.
## Follow-up: compact local dialog loading — 2026-11-01

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

Owner requested small loading in small screens while refining Item Return. Source gap: existing 160px/56px compact rules apply only to the loading-card overlay; ordinary local dialog StateMessage still uses the large vertical 36px/padded layout. Reuse the current critical CSS owner in src/index.html. **Extend** local dialog loading to a compact horizontal 28px ring/label with 8px gap, 8px12px padding, 12px text and no minimum height. Apply generally to existing local dialog StateMessages without per-screen opt-in; exclude sigma-loading-card so the global/save overlay keeps its existing region-size policy. **Keep** loading request/visibility ownership, counters, busy/disabled/error/Retry, accessible status/text/title, theme, reduced motion and forced colors. **Keep** empty/error appearance. No new loader, cache, API, timed workaround or feature CSS.

Alternative local spinner markup duplicates the owner; adding a fixed dialog height reintroduces unused space; size containment on intrinsically sized dialogs risks collapsing their body. Shared descendant CSS targets the real local status inside PrimeNG dialogs, lets long text wrap and needs no new containment. This is a presentation-only frozen choice under the owner's general shared-presentation instruction. Implementation and canonical UI22/skill/guide reconciliation follow in the existing shared loading review. Historical plan below is retained.

