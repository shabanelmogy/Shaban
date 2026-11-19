# Company Primary Address checkbox

2026-10-01. Owner requested correct colour and position for Primary Address in
Companies Address. Scope frozen: presentation of company partner isPrimary only.

Cause: checkbox was nested inside an ordinary field label, bypassing the shared
checkbox rules that target direct inputs in sigma-field--check. It appeared on
the label line with the browser accent.

Fix: use sigma-field sigma-field--check, with direct input and associated label.
The global owner now supplies 15px checkbox, sigma-primary accent, 8px spacing
and alignment on the neighbouring controls' line. Country remains immediately
before the flag. Existing Driver address already uses this pattern. UI type 03;
UI block 1 owns the shared field rule. No local style or new shared rule needed.
Control, payload, View disabled state and translation key unchanged. No backend,
schema or migration work. Other working-tree changes preserved.

Source-only verification: scoped template diff/whitespace review; shared selector
and existing Driver comparison. Owner visual acceptance in light/dark, RTL and
narrow widths remains pending. No build, tests or browser run.

Suggested commit: `style(company): align primary address checkbox`.

Owner spacing follow-up: add a small margin above Company Details through the
existing shared `mt-2` spacing utility on its form section. Only this section
opts in; no local stylesheet or shared default change. Scoped source diff and
whitespace review passed; owner visual acceptance pending.

Owner step-width follow-up: CompanyPartner opts into shared StepForm `[fill]=true`
for equal-width steps across the available editor width, using the same canonical
UI 12 option as Individual. Step validation, navigation and narrow-screen scroll
remain shared. Scoped source diff/whitespace review passed; no build/browser run.

Owner card/date follow-up: Card Type uses the shared fixed column width at 180px.
Companies card Expiry/Active Date, document Issue/Expiry Date, and nested driver
Birth Date opt into shared appDatePicker dateNumericInput. The reused document
component also covers nested driver documents. Digit/slash manual editing and
picker selection remain available; arbitrary text/paste is blocked by the shared
directive. Existing formats, date validators, maxDate and payloads unchanged.
No new shared rule or backend change; UI 14/17 existing options reused. Source
diff/whitespace checks passed; owner browser acceptance pending, no build/tests.

Owner Other Detail follow-up: move the existing textarea after the Company
Details flags, on its own full-width row using shared sigma-field--full. It stays
inside the existing details form group with the same ID, inline error and field
summary target. Uses existing UI 1 grid utility, no shared rule or local CSS.
Scoped source diff/whitespace review passed; no build/browser run.

Owner flag-placement follow-up: keep Is Inactive and Is Broker together in a
full-width flex row immediately above Other Detail. Each retains its own shared
sigma-field--check and associated label. Existing gap/wrap utilities keep a small
space between flags and allow narrow-screen wrapping; pt-0 removes the label-line
offset on this standalone row. Controls and payload unchanged. Source diff and
whitespace review passed; owner visual acceptance pending, no build/browser run.

Latest owner clarification: flags belong in the third Company Details row.
Their shared flex group now occupies the fourth grid cell after Contact Group,
Debt Collector and Invoice Generation Methods (six text fields plus Branch and
Sales Person fill the preceding eight cells). Removed full-row span and pt-0,
restoring shared control-line alignment. Flags stay together; responsive grid
and wrapping remain shared. Other Detail still spans the following row.
Scoped source/whitespace checks passed; owner visual acceptance pending.

Owner dropdown-width follow-up: Company Contact Designation uses fixed 180px
through the existing shared column option. The owner requested a general rule:
closed dropdown width comes from field/column layout, never selected text.
Promoted to UI 1.24/blocks 14 and 16 and skill preflight/history: responsive
field widths for forms/filters, explicit column widths for editable dropdowns,
shared clipping and internal scrolling, per-field sizing. No bulk screen rewrite.
Generated recipes remain stale; canonical blocks used, regeneration/semantic
review pending. Scoped source diff/whitespace and book-reference checks passed;
owner visual acceptance pending, no build/tests/browser run.

Owner Document Type follow-up: Companies document column now declares fixed
240px through the existing shared table width option, matching Individual.
The same DocumentsComponent serves company and nested driver documents; both
receive stable dropdown width. Existing shared fixed layout/label clipping and
internal horizontal overflow apply; payloads/validation unchanged. Scoped source
and whitespace checks passed; owner visual acceptance pending, no build/browser.

Documents/date follow-up: numeric date fields were already opted in across
Companies cards, documents and driver Birth Date. Shared directive now also
blocks printable non-digit/non-slash keys; editing, navigation and clipboard
shortcuts remain. Existing beforeinput/paste guards and real-date validators stay.
For the earlier upward-moving Documents report, found an independent unsafe
focus path in EditableRows.add (native focus before guaranteed row rendering).
It now uses shared focusField with openOverlay=false: two-frame rendering wait,
bounded reveal, preventScroll focus, no automatic picker opening. This affects
all existing EditableRows consumers, retaining their configured field IDs.
User's exact reproduction point remains unconfirmed; this fixes the source-backed
Add path, not a runtime-verified diagnosis of every reported movement.
UI 1.25/14/17/27 and skill reconciled. Source checks passed; no build/browser.

Owner confirmed the blank Company Driver occurs on Add Driver inside Companies.
Draft form exists synchronously before render; country lookup errors have inline
display and do not gate rendering. Found the shared zero-basis editor flex chain
inside an auto-height/max-height-only dialog, which can collapse its content.
Shared EditorDialog now has optional height; DriverDraft opts into
min(720px, viewport minus 24px). No feature CSS or dialog-content override.
Header/footer remain fixed and inner editor scroll owns overflow. Existing
dialogs default to omitted height. Draft create/edit/view, isolated forms,
commit/dismiss/upload ownership and validations unchanged. UI 1.26/13 and skill
reconciled. Source/whitespace/reference checks passed; owner should re-open Add,
Edit/View, both tabs and small viewport. No runtime/build success claimed.

Owner Driver width follow-up: draft dialog width is 1440px through the existing
shared shell input, still capped by maxWidth and responsive breakpoints. First
Identity section uses shared sigma-editor-columns=6: First/Middle/Last Name,
Gender, Nationality and Birth Date occupy one desktop row. Existing shared
two/one-column breakpoints handle narrower screens. Other sections, height,
scroll, controls and payloads unchanged. Scoped source/whitespace checks passed;
owner visual acceptance pending, no build/browser run.

Owner Driver height follow-up: increase draft height from the 720px cap to 90dvh
through the existing shared height input. Shared maxHeight still caps very short
viewports; fixed header/footer and inner scroll remain. Scoped source/whitespace
check passed; visual acceptance pending, no build/browser run.

Latest Driver height decision: owner reported unused space with 90dvh fixed
height. Draft now uses content-sized auto height with maxHeight=90dvh. All three
projected editor links opt into existing flex-fill (1 1 auto), preserving
intrinsic content height and avoiding the previous zero-basis collapse; shared
min-height/overflow and shell max bounds retain internal scrolling on smaller
viewports. Width remains 1440px, first section six columns. This supersedes prior
fixed-height feature decisions, not the optional shared height API. UI 1.27/13
and skill reconciled. Source/whitespace/reference checks passed; owner checks
both tabs, validation expansion and small-screen scrolling. No build/browser.

Owner size adjustment: Designation is now 200px (supersedes 180px above).
Card Type remains 180px. Updated the canonical example in UI 14/16 to match;
the general rule is unchanged. Scoped source/whitespace and book-reference
checks passed; no build/browser run.

Billing Preferences follow-up: all three checkboxes were nested in their labels,
bypassing shared direct-input size/accent rules. Each now uses its own direct
input followed by associated label in sigma-field--check. Existing pt-0 spacing
utility removes unnecessary label-line offset in this checkbox-only section.
Shared grid owns responsive positioning; global 15px box, primary accent and
8px label gap apply. Same fields, translations, disabled behavior and payloads.
Scoped source/whitespace review passed; no build/browser run, visual acceptance
pending. Existing UI 1 rule applied; no new guide/skill rule required.

Credit and Pricing follow-up: its six fields now use the existing shared
sigma-editor-columns=6 grid option for one row at desktop widths. Credit Period,
Credit Limit, Customer Discount, TRN, Currency and Tariff Card retain their order;
shared two/one-column breakpoints handle smaller screens. No feature CSS, new
shared rule, control or payload change. Source/whitespace checks passed; owner
visual acceptance pending, no build/browser run.

Date entry follow-up: owner requires dates only or picker selection for every
date box. Shared appDatePicker now enables numeric filtering by default,
recognises configured numeric date separators and range/time separators,
and retains editing keys, shortcuts, picker selection and real-date validation.
All Companies/Driver date fields and Individual consume it; legacy calendar
adoption remains part of screen reviews. UI 1.28/17 and skill reconciled.
Scoped source/whitespace and book-reference checks passed. No build/browser;
owner runtime acceptance and stale generated-packet regeneration remain pending.

2026-10-02 document-date confirmation: owner reiterated date-only typing or
picker selection for Company Documents and Driver Documents. Both render the
same DocumentsComponent. Issue/Expiry Date already bind appDatePicker with
dateNumericInput=true; its import is present and the shared guard rejects text
typing/paste while permitting numeric date editing. DriverFields imports and
projects that component in its Documents tab. Real-date and expiry-after-issue
validators remain in createDocumentRow. No additional application source
change needed. Scoped whitespace/source review passed; no build/browser run.

Subsequent owner runtime feedback disproved that source-wiring confirmation
was enough: Company document dates still accepted letters. See
COMPANY_DOCUMENT_DATE_INPUT_FIX.md for the 2026-10-02 shared native-input
capture fallback, applied before PrimeNG model parsing. Runtime acceptance
remains pending after that source change.
