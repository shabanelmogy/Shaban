<!-- Part of UI block 24: see ../24-colors-icons-buttons.md. Same status and authority as the block. -->

### PrimeNG21 theme and component hooks
**Complete vendor presentation retirement.** The owner then
authorized deletion of all old components and migration of every dependent
screen. This supersedes earlier staged instructions below to retain vendor
Sass/Popper/KT. Live shell/theme/domain helpers move to their native shared
owners (UI1); unused demos/plugins/Builder are deleted. The theme entry uses
only Sigma base/status/native-control/utility modules. No Bootstrap/Metronic
CSS, Sass, scripts or compatibility re-export tree remains. Preserve existing
shared component selectors, events, native form controls and business contracts.
Native migrated fields and ordinary secondary/danger buttons use PrimeNG
InputText/Button directives from the actual standalone owner or its shared
imports constant. Primary actions compose the existing PrimaryActionButton
owner, preserving submit/click, disabled/loading and native ID contracts; delete
temporary independent primary paint rules once these consumers migrate.
Existing actions retain the Sigma geometry/tokens; no second palette is
introduced. Existing native card/table surfaces and layout utilities
are centrally Sigma-owned, not copied vendor component CSS. Exact class tokens,
SCSS selectors, conditional class bindings, DOM queries and retained tests must
migrate together; semantic HTML tags and domain property names must not change.
Keep independent Bootstrap Icons and Font Awesome glyphs while used; the
`data-bs-theme` selector remains the established application theme contract.
`ThemeModeService` owns Sigma image/transition attributes and the Sigma theme
change event, preserving the stored preference keys. Source conformance and
rendered interaction/geometry evidence remain distinct from visual acceptance.

**Shared vendor independence.** Keep Sigma shared components
and replace their vendor internals in place. Dynamic ButtonsComponent composes
PrimaryActionButton for solid primary intent, and PrimeNG native buttons for
secondary/danger/link intents; it retains ButtonModel IDs, labels/tooltips,
supplied classes and emitted action IDs. A non-navigating link intent uses a
native button with disabled semantics. Do not copy a second primary palette.
PrimaryActionButton's optional buttonId/buttonTitle/buttonClass inputs forward
to its real native button for this compatibility composition; defaults remain
unchanged and custom classes are not a license for new feature palette forks.

Sigma semantic status tokens live in assets/sass/_sigma-status-tokens.scss,
independent of vendor imports: success/info/warning/danger plus text-emphasis,
bg-subtle/border-subtle and danger-strong. Preserve the existing light/dark solid
palette and light-base tint/shade feedback values while migrating shared
SummaryCards/error/state/CSV/quantity/alert consumers from --bs-* variables.
Keep data-bs-theme as the application selector and Bootstrap Icons as the
canonical independent icon font. Shared hidden text uses sigma-visually-hidden,
with the same accessible clipping behavior, rather than a vendor utility.

Shared row command menus and compact CSV command Popovers use bounded global
sigma-row-action-menu/sigma-command-popover hooks because they append to body;
Sigma tokens own their surface/text/primary,170px minimum width,34px command
height and8px radius. Keep the compact action trigger's existing sizing and
publisher layering above legacy nested dialogs, plus explicit print hiding.
Remove the old DropdownPortalDirective/portal CSS only after both shared
consumers migrate. Global vendor CSS/JS/Ngb remain until their other direct
consumers are proven retired; this slice does not authorize package removal.

**Interactive runtime retirement.**
After live Settings dropdowns move to the shared command owner and remaining
Ngb imports/selectors, test providers and isolated dead modal roots are retired,
remove the global Bootstrap JS entry and bootstrap/ng-bootstrap/types packages
together through the package manager. Keep the repository-owned Bootstrap Sass,
independent bootstrap-icons and data-bs-theme selector until their separate
style migration. Popper remains while legacy KT source/spec roots import it;
absence from the active shell is not proof of complete package retirement.

Configure the Lara preset through `providePrimeNG` and `@primeuix/themes` in
the root config/shared theme owner. Consume existing Sigma primary/radius tokens
and the actual `[data-bs-theme="dark"]` selector. Removed `primeng/resources`
styles must not be restored. Shared SCSS retains field sizing, logical layout
and body-overlay ownership; feature styles do not fork the publisher theme.

PrimeNG21 Select and DatePicker put their root classes on the host itself.
Do not target a second nested `.p-select`/`.p-datepicker` root. Root styles own
Select's full-height flex label track for every consumer; compact field/filter
owners retain their padding and height tokens. DatePicker uses the direct
`.p-datepicker-input-icon-container` and `.p-datepicker-clear-icon`; detect their
presence with `:has`, reserve logical-end space for the actual controls, and do
not restore removed clearable/input-icon-wrapper modifiers. Keep text/clear/icon
alignment in both directions and themes. The Company's selected/placeholder
branch text and the shared date controls are regression consumers, not opt-ins.

MultiSelect's host also keeps its publisher inline-flex root. Its direct
`.p-multiselect-label-container` is a stretching flex track and the direct
`.p-multiselect-label` grows/stretches and centers its content vertically.
Without that intermediate flex track, filter-owned zero vertical label padding
leaves placeholder/selected text at the top of the34px control. Apply this in
the existing global control owner for every consumer; retain publisher chip/gap,
ellipsis, logical padding, clear/dropdown tracks, disabled state, RTL/theme and
filter/editor height ownership. Do not add feature offsets or fixed text heights.
Evidence: installed PrimeNG21/PrimeUIX MultiSelect template/style and the owner
ServiceBookings Status report2026-10-26. Source-only; placeholder, one/many/chip
selections, narrow/theme/RTL and runtime acceptance remain pending.

The shared numeric InputNumber root and Sigma quantity classes are on the same
host too; UI27's2026-10-23 owner expansion adopts this existing producer for all
editable numeric roles without a second visual component.
Use `.sigma-quantity-input-host.sigma-quantity-input.p-inputnumber`, not an old
descendant-root selector. Keep that host inline-flex and the22px stacked button
rail in normal flex flow (`position:static`); publisher absolute positioning
otherwise overlays the right-aligned number and intercepts clicks intended for
the input. Invalid border states also target that same host. Verify actual input
width, step-rail non-overlap and input hit-testing in a bounded editable table,
in addition to CVA values/events. A synthetic key event can update a hidden or
covered input and does not prove a user can see or click it. Retain existing
34px geometry, theme tokens, numeric direction and feature min/max/precision.

Stable list/report filters must retain those host displays. Do not override
`p-select`/`p-datepicker` with display:block: Select's publisher label starts at
width1% and needs its flex parent to grow, while the dropdown/clear remain in the
same control track. Shared FilterPanel/report stability rules own field alignment
and validation slots, not a second widget-root layout. Cover both stable and
ordinary consumers, including readable label width and trigger/clear bounds.

DatePicker disables the actual native input rather than adding p-disabled to its
host. Shared disabled colors target `:has(> .p-datepicker-input:disabled)` and the
input, using existing theme tokens; normal hover rules exclude that native state.
Do not rely only on the host class or let normal input colors override disabled.

The global native clear service must preserve publisher-owned IconField children:
PrimeNG21 anchors its search icon with first/last-child selectors. Put the extra
clear button in the containing position host, outside `.p-iconfield`; measure
visible logical-end adornments and reserve separate clear/text space in LTR/RTL.
Restore any service-owned padding override when unbinding. A hidden appended
button still changes structural selectors. Select/MultiSelect filter search uses
the actual header `.p-inputicon`, not obsolete filter-icon classes. Cover opening,
typing and clearing in both themes/directions without changing the selected value.

Use publisher hooks: Select overlay/option-selected, MultiSelect
overlay/list/option-selected, DatePicker panel/day-selected/day-selected-range/
month-selected, paginator page-selected and Toast close-button/close-icon.
Checkbox/radio checked and disabled states are on their component root; visible
keyboard focus follows the native input's `:focus-visible`. Do not put old
`p-highlight`, `p-focus` or disabled classes on inner boxes. A clearable Select
is detected through its clear icon, not an obsolete root class. Verify the
installed publisher source before migrating selectors; a compiling stylesheet
does not prove it still reaches the rendered DOM. Both themes/directions,
keyboard, overlays and responsive behavior need owner visual acceptance.


### Appbar presentation across framework migrations
Replacing a template's interaction engine does not approve replacing its
established visual hierarchy with plain publisher defaults. The owner preferred
the former Sigma Appbar after the PrimeNG shell migration. Current shared owner
`app/layout/ShellHeaderComponent` uses PrimeNG Select selectedItem/item/header
slots and Popover templates to retain the Navbar/UserInner visual vocabulary:
42px branch/language cards,30px leading tile/two-line branch copy,40px icon
buttons with11px corners, token-based surface wash/shadow, and a structured
account identity/actions menu. These shell-specific values do not replace the
34px feature-form controls. Existing AppbarShortcuts keeps its shared styling.
The owner's later alignment amendment gives only the desktop navigation
boundary toggle32px/9px corners; it remains40px on mobile. UI1 owns the shared
brand/aside width, boundary placement and nested-menu spacing.

Read flags from language metadata through flagCountryCode; use a language icon
when none exists. At header width<480px the language control is48x42px and
shows the flag/icon while its full applied-language name remains in ariaLabel
and title; its popup keeps readable full names. The branch name remains visible.
Account initials derive only from the current Login name; no invented presence
or notifications. Selected theme shows a check and the trigger follows the
resolved light/dark mode. Header styling applies to all existing route consumers.

Keep typed confirmed-state selectors, async rollback, disabled guards, focus,
responsive/RTL/theme and print behavior while editing these templates. Target
actual publisher host/overlay hooks; body-appended surfaces and directional
arrows use the shared marked overlay boundary. Source comparison and rendered
geometry/interaction tests do not establish subjective visual acceptance.
Evidence: the owner visual amendment in the PrimeNG shell maintenance plan.

### Sass module ownership
The global theme uses Sass `@use` and namespaced built-ins. The former licensed
Bootstrap5.3.2 compatibility source and its configuration bridges were retired
after their consumers migrated under the owner's complete-removal instruction.
Do not restore vendor theme imports, patch node_modules, suppress deprecations
or downgrade Sass for a feature stylesheet. Sigma base owns root typography
(13px desktop,12px below992px), reset and native theme tokens; shared native
controls and the `sigma-u-*` utility module own migrated presentation. Utilities
use logical spacing and insets so one rule serves both directions. Existing
spacing scale is .25rem per step and responsive boundaries remain576/768/992/
1200/1400px where used; feature-specific layouts retain their own ownership.

Sass modules scope `@extend`; preserve existing heading/small/button-group/container
aliases explicitly when moving rules between modules. Preserve cascade positions
when a previously repeated partial intentionally emitted rules twice. For a theme
dependency upgrade, compare complete parsed CSS selectors, declaration values and
rule order against the pre-change output, then run only authorized builds. A clean
compile proves neither visual equivalence nor responsive acceptance (UI29).
