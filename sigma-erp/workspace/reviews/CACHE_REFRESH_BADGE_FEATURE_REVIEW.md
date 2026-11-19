# Shared cache refresh badge

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Owner reports the proposed badge is absent; this follow-up authorizes adding it.
Earlier Common Settings cache review remains historical: it accurately records
that only a proposal existed then. Owner also requests a complete reusable cache
adoption procedure for every reviewed/new screen, documented under UI2, UI22,
skill routing and generated recipe references. No blanket operational caching.

Tier S: one shared shell status element, tightly coupled to existing cache
activity. No separate agent. Shape: existing ShellHeader/PrimeNG shell (UI1),
existing cache activity owner (UI2/22). Backend/API/data/action phases unchanged.
Initial recipe drift Check all8 passed. No screenshot supplied.

| Concern | Canonical/shared owner | Frozen decision |
|---|---|---|
| Activity | UI2, ReferenceLookupCacheService | Aggregate actual loading entries with an existing successful snapshot; no counts/URLs/credentials exposed |
| Presentation | UI1/22/24, ShellHeaderComponent | Noninteractive small status badge after500ms continuous background work, hide on last completion/cancellation/error/reset; no page loading |
| Layout/accessibility | UI25/27, existing header/container rules and sigma-visually-hidden | Reserved slot prevents appearance-induced movement; icon-only compact state with translated live text/title, reduced-motion support |
| Failure | UI22, existing ReferenceLookupBindings/Status | Badge reports activity only; existing screen owns retained-data error/Retry, no false success toast |
| Adoption | UI2 checklist, existing source/Base/Bindings/Realtime owners | Standard new-screen checklist; extend source services, preserve finite bootstrap and drafts; do not copy cache/viewer/socket or cache availability data |

No new component wrapper is warranted for one shell element; shared activity
belongs to the existing cache. Existing refresh state remains accurate, initial
loads/cache hits/writes do not trigger this badge. No refresh initiated merely
to display it. No persistence, calculation, permissions or migration change.

## Reconciliation

Implemented source state and UI: ReferenceLookupCacheService exposes readonly
backgroundRefreshing, updated on publish, final consumer cancellation, removal
and clear. Its aggregate stays active until the last concurrent retained-data
request ends. First loads and synchronous cache hits remain excluded.

ShellHeaderComponent injects that existing root owner and delays its real badge
by500ms. Pending timer clears when activity stops or the header is destroyed;
callback checks current activity and destruction. HTML always reserves the slot,
with a polite live region; visible content has translated title/accessibility
text and a decorative Bootstrap arrow icon. Existing Sigma theme/visually-hidden
owners reused, no standalone competing badge component. CSS reserves94px on wide
headers and22px at narrow container widths, with reduced-motion animation opt-out.

Changed source files:

- `shared/service/reference-lookup-cache.service.ts` and its existing spec;
- `layout/shell-header.component.{ts,html,scss}` and its existing spec;
- `i18n/vocabs/en.ts` and `ar.ts` (two badge strings each);
- `UserGuide/content/administration-guide.ts` and shared-screen-guidance.ts.

Source regression cases cover excluding first loads, concurrent refreshes,
last cancellation, HTTP failure and context clear; header cases cover delayed
appearance, stable reserved width, hide on finish and no quick-request flash.
Header fixture now provides a typed activity-signal fake rather than constructing
the real cache. Specs were written and reviewed, not executed.

Owner's documentation request implemented as UI2's ten-step "Cache adoption
checklist for every reviewed or new screen": eligibility/source inventory,
source services and singleton envelopes, context/expiry/clones, every writer/
import outcome and indirect producer, tenant post-commit topics, finite bootstrap,
one active binding with selected IDs/current options, draft/financial ownership,
shared quiet refresh/badge/error/Retry, and final source/owner acceptance. Includes
real binding/status examples and names current shared owners. UI22 owns badge
semantics. Skill essential rule/revision points to these canonical owners.

Phase02/03/05 templates now require that checklist at their lookup/editor/runtime
steps. Regenerated all eight packets through the generator, reviewed generated
checklist pointers and UI2/UI22 provenance while preserving current shape/reference
roles, then recipe Check all8 passed. Generated files were not edited directly.

Guide: existing Administration shell topic (`shell.guide`) through
`/UserGuide/administration`, plus shared guidance in current module readers.
EN/AR text explains the500ms condition, compact accessible icon and excluded
quick/initial/cache-hit cases. No route/menu, API/backend/DTO/mapper, financial
calculation, package or schema change. No migration required.

Reviewed complete scoped source additions and diffs independently in frontend
and documentation repositories, with local unversioned skill/review updates;
checked activity lifecycle/translation keys/template access/shared owners and
whitespace. Unrelated existing cache/Topbar/template changes preserved. New
public member is additive and source-only. No unresolved business contract.

Owner verification pending: compile frontend; hold a retained-data refresh over
500ms (for example under network throttling), verify badge appearance and hide
after success/failure/cancel/context switch, multiple concurrent sources, fast
requests, compact RTL/light/dark header and reduced motion. Read first loads and
cache hits without expecting the badge. Review the guide in its existing reader.
Builds/tests/lint/browser/runtime/database/migration/commit/push/deploy commands
were not run. Source review does not establish visual/runtime success.

Suggested commits only: frontend `feat: show delayed shared cache refresh badge`;
documentation `docs: standardize cache adoption across screen workflows`.
