## 1. Feature folders and wiring

**Topic files of this block** (read only the one the task needs; they are part of this block):

- [Authenticated shell, sidebar disclosure and desktop navigation](01/01-authenticated-shell.md)
- [Global viewport, list/editor page shells and one scroll owner](01/02-viewport-and-scroll.md)
- [Hierarchy tree workspace](01/03-hierarchy-tree.md)
- [Working-branch bootstrap and switch safety](01/04-branch-switch.md)
- [Supported platform, Angular adoption gates and one HttpClient](01/05-platform-and-angular.md)

> **Status: Canonical** — route/model shape; the interceptor wiring inside is Transitional

For a conventional routed CRUD/list-detail feature, use this folder shape.
Special shapes such as reports, hierarchy workspaces, routed financial editors,
tabbed settings workspaces, and other explicitly documented exceptions follow
their owning blocks instead of being forced into this baseline.

```
<Feature>/
  <feature>.routes.ts          # see route table below
  components/
    list/    list.component.{ts,html,scss}
    details/ details.component.{ts,html,scss}
    detailsForm/<section>/     # step sections; see naming note
  models/
    list.ts      # grid row + filters + query
    create.ts    # write payload
    details.ts   # detail read
  services/
    <feature>.service.ts
```

**Naming, two corrections to what you will see in source.**

`CompanyPartner` spells the sections folder `detalisForm` — a typo. Paths in this
book quote it verbatim so you can find the real files, but **new features use
`detailsForm`.** Do not propagate the typo.

Company's CSS classes are `individuals-*` / `individual-*` because it imports
IndividualPartner's stylesheet (block 6). **New features prefix classes with
their own feature name**, as Fleet does with `fleet-*`. A new Warehouse screen
uses `warehouse-page`, `warehouse-filters`, `warehouse-add-button` — never
another feature's prefix.

Routes carry the mode, so one component serves all three states:

```ts
export const CompanyPartner_Routes: Routes = [
  { path: '', component: CompanyPartnersComponent },
  { path: 'create',   component: DetailsComponent, data: { mode: 'create' } },
  { path: 'view/:id', component: DetailsComponent, data: { mode: 'view' } },
  { path: 'edit/:id', component: DetailsComponent, data: { mode: 'edit' } },
];
```

**Route shape depends on the editor shape.** Use four routes only when the
editor is a routed page, as Company does. A dialog-based editor needs just the
list route, because the editor never owns a URL. `Sales/Fleet` currently
declares both — routes *and* an inline `<app-equipment-details>` in the list —
so treat that as a dual-mode outlier, not the target.

| Editor shape | Routes needed |
|---|---|
| Routed page editor | `''`, `create`, `view/:id`, `edit/:id`, each with `data.mode` |
| Dialog editor | `''` only; the list drives visibility and mode via inputs |

Three wiring steps, all required:

1. Lazy route in `pages/routing.ts`:

```ts
{
  path: 'CompanyPartner',
  loadChildren: () =>
    import('./../modules/Customers/Companies/CompanyPartner/companypartner.routes')
      .then((m) => m.CompanyPartner_Routes),
},
```

2. Service `@Injectable({ providedIn: 'root' })` — see *One `HttpClient`* below.

3. Menu entry, or the page is reachable only by typing the URL.

### Standalone dialog registration and built-in control flow

**Standalone consumer contract — mandatory source check.** Before adding or
moving shared controls, inspect the exact imported file's exports and the
current owning component/directive declaration. A sibling `.directives.ts`
file is not automatically re-exported by `.component.ts`. Every component,
directive and pipe used by a standalone template must also be present in that
consumer's `@Component.imports` (or supplied by an actually imported NgModule);
a TypeScript import alone does not register it. For example, a filter using
`app-field-error` needs `FieldErrorComponent` in both places. Check bound input
names and literal values against the current public types (block22 states).
Do not add `CUSTOM_ELEMENTS_SCHEMA`/`NO_ERRORS_SCHEMA`, casts, export aliases or
new compiler roots to conceal an incorrect import or unsupported input.

When removing an injected dependency, inspect remaining `this.<member>`
uses and the actual base-class members. Removing duplicate API success toasts
does not remove an existing non-API informational action (block22); preserve
its declared service injection. Inspect the installed framework declarations
before using a version-sensitive API (block28). TypeScript/Angular parsing,
path-existence checks and template-name scans establish only their respective
source facts; they do not validate exports, Angular registration, input types,
class members or application compilation. The Lease compiler-feedback repair
is the source-backed example; owner compilation remains pending.

**TypeScript library compatibility — mandatory source check.** Inspect the
effective `compilerOptions.lib` before introducing standard JavaScript APIs.
The Angular21 CLI migration removes the old explicit `es2018`/`dom` override;
the current `es2022` target selects TypeScript's default ES2022 browser libraries.
If another config supplies an explicit lib, it still overrides that default.
Neither target nor declarations supply runtime polyfills. ES2019 through
ES2022 APIs are now available under the application contract; do not retain
the former blanket ban on flat/flatMap/fromEntries/replaceAll/at. Typed
`for...of`/`push` export accumulation and typed form construction remain valid.
Preserve source order, null handling, headers and values. Do not widen lib or
add a polyfill to silence a local feature error; such a project compatibility
change requires its own explicit scope and runtime support review. Template/TS
parser success proves syntax only, not library/type compatibility. CashFlow
export and Budget form construction are the source-backed repair examples.

This application currently has an explicit `files` boundary in
`SiGmaAngularFrontEnd/tsconfig.app.json`. When a new standalone dialog or
feature component produces Angular's “missing from the TypeScript compilation”
diagnostic, add its exact `.component.ts` path to that `files` array, following
the existing LeaseAgreement dialog entries. Do not replace the project boundary
with a broad include glob, and do not add models, HTML, or SCSS files there;
their component imports own their compilation. A missing component root can
also make a valid standalone import appear “not statically analyzable” in the
parent component's `imports` array.

Use built-in control flow consistently. An `as` alias is allowed
only on the primary `@if` of a control-flow block; it is invalid on an
`@else if`. When loading and error states precede an optional response, make
the response alias the primary condition of a nested `@if` inside the final
`@else`:

```html
@if (loading()) {
  <app-loading-state />
} @else if (errorMessage()) {
  <app-error-state [message]="errorMessage()" />
} @else {
  @if (summary(); as summary) {
    <app-summary [total]="summary.total" />
  } @else {
    <app-empty-state />
  }
}
```

Never write `@else if (summary(); as summary)`: Angular rejects it and the
alias is then out of scope for the response markup. Keep aliases scoped to the
smallest response block and reference the aliased value only inside that block.

**Check:** new standalone dialog components are present in the current
`tsconfig.app.json` `files` boundary when required · no `as` alias appears on
an `@else if` · the fallback state remains reachable when the response is null.

---
