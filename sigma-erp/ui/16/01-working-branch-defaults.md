<!-- Part of UI block 16: see ../16-dropdowns-lookups-enums.md. Same status and authority as the block. -->

### Working-branch defaults
The topbar branch is a default for screens with a real branch selector, not an
authorization scope. Use the root `CurrentBranchService.defaultBranchId()` for
initial typed branch filters and `applyDefault(control)` for eligible empty,
enabled, pristine Create controls. The caller owns mode and value type. Preserve
route-restored/manual selections, deliberate clears, the branch of a saved
record and a parent-derived branch. Convert string/array contracts explicitly;
never place an id in a branch-name text filter or invent a filter an API lacks.
Transfer source and destination remain different roles. Do not use a subscription
that refills a cleared control or silently rewrites an already open screen.

For an actual branch dropdown, trace its option value and backend predicate
together. When the existing API/entity supports `BranchId`, use its numeric
equality filter; a branch-name `Contains` predicate can match more than the
selected branch. Correct a legacy mislabeled name-valued selector through its
form key, template, lookup value and initial query together, without adding an
API field. Eight voucher lists supply this source-backed correction. Numeric
URL hydration uses `filterBranchId(ParamMap)` to distinguish an explicit value,
a restored clear (saved pageNo), and a fresh screen's default. Existing special
full-state markers remain screen-owned.

The authenticated shell resolves active tenant choices and the saved preference
before mounting initial screen content (UI1). Preference, matching valid login
branch, then no branch is the fallback order; never choose the first option
arbitrarily. The selection remains user-changeable. No interceptor adds a hidden
branch filter and no save payload has its branch forced. Allowed-branch and
operation permissions remain deferred to the comprehensive authorization owner
(UI26). Evidence/consumer inventory: current-branch-defaults plan/review under
Sigma reviews; source-only, owner runtime acceptance pending.
