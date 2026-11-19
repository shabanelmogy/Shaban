<!-- Part of UI block 13: see ../13-modal-with-tabs.md. Same status and authority as the block. -->

### Shared mock-data form assistance
FormSection heading grouping (2026-10-17): non-collapsible icon and title/description
share one nonwrapping flex group; the copy can shrink/wrap within it while the
actions wrap as a separate group. Reuse existing12px/compact9px gaps and icon
sizes; never let a narrow card wrap its icon onto a separate row. Shared
showMockDataAction defaults true; a read-only reference card may explicitly set
false without changing projected actions, registration, tenant preferences or
other sections. Email Templates Data Fields is the scoped consumer. Preserve
RTL/theme/collapsible behavior; owner visual/keyboard acceptance pending.

Owner follow-up adds tenant Settings flags ShowButton/ShowPreview, both default
true. FormSection's existing header actions area now composes the shared
MockDataActionComponent from the nearest mock form context, generating only
supported rendered controls inside that section. Section registration suppresses
the repeated form toolbar; fields outside visible shared sections retain one
Test data heading action scoped only to those remaining fields. A form without
shared sections uses that fallback for its editable fields. Existing projected
Add/other header actions remain. Headings
and action groups wrap within the existing section at narrow sizes, with logical
spacing/theme owned by shared components. No per-screen markup copy is needed.

The root shared service loads preferences once for the current auth-token
session, hides actions until loaded, offers inline Retry on failure, cancels
stale preference reads after successful Save and resets for a changed session.
Monotonic cache revisions also reject older independently subscribed settings
reads that finish after a successful preferences Save; cancellation alone covers
only the cache-owned request.
Settings stores the flags through the same tenant settings owner; key input may
be blank while saving preferences. After a failed settings read, a replacement
key omits unknown flags and reloads status, preserving existing preferences.
Generate captures the preview preference: true keeps Review/Apply; false applies
valid candidates to the draft after generation without mounting a loading or
preview dialog. The section action shows loading
and a shared secondary Cancel action. Candidate readiness is independent of dialog
visibility. Frozen controls and root capture gates block click/submit handlers
during pending work, except the mock Cancel control; teardown removes listeners.
Both flows retain the independently configured overwrite confirmation, Cancel,
stale checks and manual business Save. Turning both preview and confirmation off
opens no mock-data modal.

**Compact heading choices.** When a section consists
only of a title and a small choice group, project that group through the existing
`form-section-actions` slot instead of adding a second content row. Use the
existing group controls/labels and flex wrapping utilities. FormSection's shared
heading wraps whenever its available width runs out, and its actions are bounded
to100% width at every breakpoint. If the shared content region is empty,
`:empty`/`:has` styling hides that empty region and removes only the heading's
bottom divider/padding/margin. Normal populated sections retain their styling;
no new feature input or deep selector is needed. Purchase Requests type radios
adopt this to keep choices beside the title while space permits. Preserve
keyboard/label semantics, read-only/busy gates, full card edges and printing.
Verify long EN/AR choices and intermediate widths as well as narrow screens;
source-only evidence retains owner visual/runtime acceptance.

The third default-true tenant option ShowConfirmation controls only the mock
generator's existing-value overwrite confirmation. Capture it with preview at
Generate start: disabled bypasses that confirmation, preserving the selected
preview flow, pending cancellation/stale checks and manual Save. Settings and
screen discard/domain confirmations retain their owners. This explicit owner
option supersedes the earlier always-confirm mock-data statement; it is not a
general switch for other confirmations. Old reads missing the flag default true;
omitted/null writes preserve it and failed-read key recovery sends no unknown flags.

The owner requested one DeepSeek mock-data capability across editable screens,
with preview and manual Save. `shared/components/mock-data/MockDataFormComponent`
(`appMockData`) and `MockDataFieldDirective`, exported by `MockDataFormsModule`,
own this assistance. Keep existing native form roots, controls, validators,
handlers, child-row Add actions, Save payloads and editor shells. New supported
reactive editors import the shared module and mark their root `[formGroup]`
container with `appMockData`; nested fields use the nearest root. Search/filter,
report, authentication, secret-settings and View/disabled forms are excluded.

Generate captures the form and control identities, freezes the prior editable
state with UI10's helper, confirms replacement through the shared confirmation
service when configured, and opens the padded shared dialog during generation
and preview only when the preview option is enabled.
Cancel/teardown cancels the request and restores the prior disabled state;
Apply rejects stale form/control/value snapshots, rechecks current options and
validators, uses public control events, and marks applied inputs dirty/touched.
It never submits or persists business records. Existing dependent lookups and
backend calculations remain authoritative. Explain skipped candidates and leave
unsupported/grouped/range/custom widgets with their existing screen owner.

**Current-year mock dates.** The shared field
adapter constrains generated `date`, `dateTime` and `month` candidates to the
device's current local calendar year, intersecting the real field's existing
minimum/maximum. It sends these effective bounds through the existing metadata;
the backend's strict candidate validation enforces them. Do not hardcode a year
or alter actual control bounds, validators, manual input or Save. Exclude a field
whose allowed range has no intersection with that year, preserving its value.
Time-only candidates retain their existing time bounds. Backend example dates
must use effective bounds first and a dynamic current year for unbounded callers.
Keep ordinary cross-field/domain validation and manual review authoritative.

An editable field derived from other generated inputs may opt out through
`[mockDataIgnore]="true"` on its existing shared field adapter. Its ordinary
manual editing, validation and persistence remain with the feature. For example,
Rental Agreement's day-count shortcut is derived from dates and also changes the
return date when committed; generate the source dates rather than an independent
random count that could overwrite them outside their allowed year.

Only field structure, constraints, route patterns and opaque choice tokens go
to the provider. Current values, record identifiers, secrets and lookup labels
stay local. Owner explicitly requests synthetic Card Number/CVV candidates:
typed `mockDataPaymentField="cardNumber"|"cvv"` marks only native card inputs,
with matching named controls or explicit direct FormControls. This narrow opt-in
permits a masked password input only for cvv; ordinary passwords/secrets/API keys/
tokens and unmarked payment inputs remain excluded. Shared adapter supplies
canonical text names, mock lengths16/3 and validates ASCII digit strings while
retaining leading zeros. Individual/Company card templates mark both inputs;
manual validators/input types/payloads remain. These are generation constraints,
not payment eligibility/type/issuer or new business validation. Server schema/
example/prompt/strict digits validation follow BE18. Current card values never
leave the client; cancellation/stale checks/Add-first/manual Save remain.
Native legacy date/time controls retain string values; PrimeNG
calendars receive local `Date` values without UTC conversion (UI17). Do not add
new native temporal controls as a result of this compatibility adapter.

Settings follow-up2026-11-01: the reviewed24-page Administration Settings unit
now uses UI1's shared parent/child bounded composition. Its previous API-Key-only
parent exception below is superseded for this unit; Google/DeepSeek save/guard
and mock-data contracts remain. Common, Document Number and Fields adopt the
existing vertical EditorTabs without introducing another tab implementation.

The current adoption inventory is `reviews/AI_MOCK_DATA_ADOPTION.json` (254
editor roots, including two inline dialogs). Preview reuses EditorDialog's
public 780px width/540px height and viewport bounds, DataTable's local unpaged
fill layout, and existing button/state owners; feature SCSS owns toolbar placement
only. The existing Settings/API Key route retains independent DeepSeek and Google
sections with one internal content scroll and a fixed action footer. After the
2026-11-01 Settings review, its parent and the other23 children use UI1's shared
settings allocation. The former API-Key-only parent bound remains historical
evidence in its feature freeze, not the current settings-shell contract.
