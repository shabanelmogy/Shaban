| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |

# Sass deprecation repair — 2026-10-22

Authorized continuation of Angular21 platform upgrade from the owner's pasted Sass warnings. Preserve all prior uncommitted upgrade work. Scope: loaded theme Sass, its Bootstrap5.3.2 source dependency, global entrypoint and shared style dependencies only. No business/backend/API/permissions/schema change, no screen redesign. Existing frontend build authorization applies; no tests/lint/browser/database/commit/push/deploy.

Canonical shape: shared theme/platform maintenance (UI24/25/29 and Master5/7); Phase5 integration and Phase6 reconciliation after frozen contract. PLAN00 existing supported-platform plan owns the upgrade; this is its warning repair extension. Recipe Check: all8 OK before packet use. sigma-screen-refactor digest already read/applied in this conversation.

## Frozen compatibility and implementation decision

Baseline Sass1.97.3 compile of src/styles.scss:1873141 CSS characters,277 loaded files (190 local). Captured actual current source texts and CSS under ignored .angular/sass-modernization before changes, including prior owner/upgrade modifications. Current deprecation groups: import, global-builtin, color-functions, if-function. Preserve rendered selectors/declarations/order/colors/spacing/RTL and configured theme variables. Compare complete emitted CSS before/after, ignoring only non-semantic formatting/comments if the official migrator requires it; report any semantic differences before acceptance.

Official Sass migrator2.6.1 module dry-run cannot migrate this graph while Bootstrap is an excluded load-path dependency: it must rename a private Bootstrap function. Do not patch node_modules, suppress warnings or downgrade Sass. Create one repository-owned compatibility copy of the exact currently installed Bootstrap5.3.2 Sass source under src/assets/sass/vendor/bootstrap, with original MIT license/provenance. Redirect only the existing theme's Bootstrap Sass imports to that source; JavaScript/bootstrap package behavior remains unchanged. Run official module/color/if-function migrations on the complete owned loaded graph, repair only source-supported configuration/order issues and compare output. This is a compatibility source extraction, not a second CSS import or new theme. Revisit with a future Bootstrap source upgrade; no new UI/library version decision.

## Conformance / verification

| Concern | Canonical owner | Actual reference | Acceptance |
|---|---|---|---|
| Theme values/layout | UI24/25 | Current source + captured before.css | Same CSS semantics |
| Sass dependencies/configuration | UI24, official Sass migrator | _init.scss, core/components/components.scss, publisher5.3.2 source | All configured values retained; no node_modules patch |
| Global CSS/fonts/assets | UI24/29 | styles.scss + style.angular.scss + angular.json | Same order/resolved URLs and output hosting |
| Diagnostics | UI29/Master7 | Standard authorized Angular dev/prod builds | No Sass deprecation suppression, no Sass deprecation warnings |
| Guide handoff | Master7 | Existing module/shared guide | No user workflow/text change; no guide content edit necessary |

Primary sources: https://sass-lang.com/documentation/cli/migrator/ ; https://sass-lang.com/documentation/breaking-changes/import/ ; https://sass-lang.com/documentation/breaking-changes/if-function/ ; actual installed Bootstrap5.3.2 LICENSE/SCSS.

Root owns this tightly coupled graph; parallel writable work would overlap module configuration, so no new subagent implementation. Complete final diff review includes this change separately from earlier1148-file upgrade diff.

## Implementation and evidence — 2026-10-22

Official module/color/if migrations completed. Repaired configuration cycles with explicit theme-variable/dark/map bridges and independent function defaults. Preserved custom gutter map, integer RGB channels, cross-module heading/small/button-group/container aliases and both floating-label cascade positions. Kept CSS font imports as CSS imports. Removed unused alternate entrypoints from the new compatibility copy, retained MIT license and documented source/version/maintenance in its README.

Complete PostCSS comparison: before1873141 characters; after1873133; selector sets, every declaration/value and rule order equivalent; zero differences and zero Sass warnings. Only formatting/comments differ. Evidence `.angular/sass-modernization/css-equivalence.json`, before/after CSS and source snapshot. Angular development build passed2026-10-22 at11:29:55UTC in121.872s, with zero warnings/errors, using standard build options (no deprecation suppression). The preceding build failed on an @use ordering error; that error was corrected before the successful run. Production build will be rerun after the owner's additional architecture modernization so final evidence covers the integrated result.

Promoted reusable guidance to canonical UI24 and the skill with revision row. Regenerated all8 packets through generator, checked all8 OK and semantically reviewed source dependencies and reference roles: this changes no screen shape or approved reference; UI24 is a shared theme rule, existing phase contracts stay intact. Visual/manual/runtime acceptance is still pending. Application user-guide workflows are unchanged.

Final production reconciliation, 2026-10-22: the final Angular21 source including
shared control repairs builds successfully. Evidence is
SiGmaAngularFrontEnd/.angular/sass-modernization/production-handoff.log
(exit0;148.421s;2026-10-22T13:40:51.665Z). No Sass deprecation warnings or
suppression. Seven existing bounded size warnings remain. The earlier complete
CSS golden comparison validates the Sass migration itself; subsequent intentional
shared-control DOM/style corrections are covered separately by460 passing full
suite tests and the architecture feature review. Do not misrepresent that earlier
CSS comparison as PrimeNG17-to21 screen visual acceptance; owner-session visual
acceptance is still pending.
