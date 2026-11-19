# Lists — default page size 20 and gap above the footer — Feature Review

| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-01 |
| Scope | Shared list paging defaults, every list screen that hard-coded 5 or 10 rows, shared list/editor shell padding |
| Repository / branch | `SiGmaAngularFrontEnd`, applied to `review-movements` working tree (uncommitted) |
| Guides | UI blocks 1 (shell, no page scroll), 2, 6 (grid paging); `sigma-screen-refactor` skill |

## Owner decisions (2026-10-01)

| # | Decision | Answer |
|---|---|---|
| D1 | Default rows per page | 20 on every list screen ("especially now that the filters collapse") |
| D2 | Gap between the list card and the app footer | 12px |

## Changes

- `shared/utils/list-query.ts`: new `DEFAULT_PAGE_SIZE = 20`, the single owner of the default.
- `shared/components/data-table`: the default `rows` is `DEFAULT_PAGE_SIZE`. A missing value falls back to it, and 10 stays the minimum (consistent with the token interceptor, which still lifts GET `pageSize` < 10 to 10).
- `shared/utils/list-route-state.ts`: `paging()` defaults to `DEFAULT_PAGE_SIZE`.
- 58 list components: `pageSize = signal(5|10)`, `pageSize = 5`, initial-query `pageSize: 5|10`, and `rows || 10` fallbacks now use `DEFAULT_PAGE_SIZE` (import added). `Workshop/Job` route restore defaults to it too.
- `src/styles.scss`: `.sigma-list-page, .sigma-editor-page` padding `6px 10px` → `6px 10px 12px`. This applies to every screen on the shared shell. Legacy screens that still compute their own height (backlog 35) are unchanged.

### Follow-up — gap made equal to the top gap (2026-10-01)

The owner asked for the card-to-footer gap to match the card-to-header gap. The shell padding is now
`padding: var(--sigma-page-gap-block) 10px` with `--sigma-page-gap-block: 6px`, so both edges
always share one value. Above the card there is only the page's 6px top padding: the toolbar is not
rendered (`LayoutComponent.showToolbar()` returns `false`) and `.app-content` has no vertical padding.
The earlier 12px bottom inset is superseded.

**Superseded again, same day:** on screen the top gap looked larger than the source predicts, and
the 6px/6px result read as too tight. The owner chose a 16px bottom gap and then settled on **20px**:
`padding: 6px 10px 20px` (final). Why the visible top gap exceeds 6px is still unexplained in source; a
browser measurement is pending.

### Follow-up — one gap on all four edges (2026-10-01)

The owner asked for the same outer gap on all four edges of the card, and for a check on whether
the top bar adds space.

- **Cause of the uneven edges (source):**
  - Sides: Metronic's `.app-container` padding is 30px (20px under 992px), plus the page's 10px, which made 40px.
  - End side: `.app-content` adds a reserved scrollbar gutter (`scrollbar-gutter: stable`).
  - Top and bottom: only the page padding (6px and 20px).
- **Top bar (source check):** nothing adds space. The header is fixed at 74px, `.app-wrapper` is offset by exactly `--bs-app-header-height` (74px, unchanged in the minimize state), the toolbar is not rendered (`showToolbar()` → `false`), and `.app-content` has no vertical padding. Any remaining visual difference needs a browser measurement.
- **Change:**
  - `--sigma-page-gap` is 20px (12px under 992px), and `.sigma-list-page, .sigma-editor-page { padding: var(--sigma-page-gap) }`.
  - For routes on the shared shell only (`.app-container:has(> .sigma-route-host)`), the container inline padding and the `.app-content` scrollbar gutter are removed, so the page owns the whole inset.
  - All 11 screens that use the shell classes carry the `sigma-route-host` host class. Legacy routes keep the Metronic insets.
- **Browser support:** `:has()` is required (Chromium 105+, Safari 15.4+, Firefox 121+).

### Root cause of the extra top gap (2026-10-01)

Metronic's base `.app-content` padding is `$app-content-padding-y`: 30px on desktop and 20px under
992px. The layout clears the top padding only under `body[data-kt-app-toolbar-enabled="true"]`.
Only `ToolbarComponent.updateProps()` sets that attribute, and `LayoutComponent.showToolbar()`
always returns `false`, so the toolbar is never created and the top stayed padded. That is the
extra space under the header.

The bottom is cleared on desktop by `_main.scss` (footer not fixed), but on mobile it keeps 20px.

**Fix:** `body.sigma-app-viewport .app-content:has(.sigma-route-host) { padding-top: 0 !important;
padding-bottom: 0 !important; }`. With it, `--sigma-page-gap` is the only inset on all four edges.
Legacy routes are untouched; they still receive the 30px top padding they were tuned against.

**Documentation drift (report to owner):** UI block 1 *Shell vertical insets* states that
`.app-content` carries no vertical padding because the toolbar rules match. That is not true while
`showToolbar()` returns `false`. The block needs correcting at the end-of-task documentation update.

## Not changed (and why)

| Item | Reason |
|---|---|
| `Customers/**` lists (CompanyContactPerson, CompanyDriver, CompanyPartner, IndividualPartner) | Being edited by another session. They restore paging through `readListRoute().paging()`, so they already open at 20 through the shared default; only their initial `signal(10)` literal remains |
| `Fleet/Vehicle` list (`signal(10)` line 106, `pageSize: 10` line 173) | Uncommitted edits by another session in the main checkout; apply the same two-line change when that work lands |
| Lookup/export page sizes (100, 200, 10000), report `p-table` `[rows]="5"`, agreement-history dialog `[rows]="10"` | Not paged list screens |

## Risks

- Each list request now returns twice as many rows. This is negligible for the paged APIs, but worth a glance on heavy lists (Job, Vehicle, agreements).
- `LeaseAgreement` list had a fixed 5-row page with `rowsPerPageOptions = [pageSize]`; it now offers only 20.

## Doc-worthy rules for the owner

UI block 6: the default page size is `DEFAULT_PAGE_SIZE` (20) from `list-query.ts`, and a list never writes its own literal. UI block 1: the shared page shell keeps a 12px bottom inset above the footer.

## Verification

Source-only. Build, tests, lint and browser verification were not run and remain pending for the owner.
