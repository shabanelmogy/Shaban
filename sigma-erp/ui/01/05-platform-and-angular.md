<!-- Part of UI block 1: see ../01-feature-folders-and-wiring.md. Same status and authority as the block. -->

### Supported platform and root composition
The supported platform baseline is Angular21 with PrimeNG21. The root is a
standalone `AppComponent`, bootstrapped by `bootstrapApplication` in `main.ts`;
`app.config.ts` owns providers and `app.routes.ts` owns root routes. Existing
lazy feature NgModules remain supported interoperability boundaries. New
features use standalone components and route files; do not recreate AppModule
or duplicate the root client. Preserve `withHashLocation`, token/error
interceptor order, the auth startup completion, Zone-based change detection
and service-worker registration while modernizing wiring. Zoneless adoption
needs a separate change-detection audit; Angular21's new-app default alone
does not establish compatibility for existing imperative third-party consumers.

#### Angular21 adoption review gate
For every new or reviewed screen, record Angular adoption against each actual
routed list, editor and dialog consumer. Separate the version declared by
`package.json`/the lock file, the exact installed package version, and runtime
evidence such as Angular's `VERSION.full` from an authorized running deployment;
none substitutes for the others. A matching major version or the presence of
one modern API does not prove that a consumer is fully modern. Start at the
active route import and trace the real component before classifying it.

Angular21 components are standalone by default, so absence of
`standalone: true` is not evidence of NgModule ownership. Establish ownership
from `standalone: false`, declarations/imports and the actual lazy route graph;
retained lazy NgModules remain valid compatibility boundaries. For each consumer,
record source evidence for built-in control flow, typed `signal`/`computed`
state and `inject` where they improve the existing design. Treat compatible
constructor injection, observable state and existing control-flow syntax as
valid exceptions rather than reasons for cosmetic rewrites.

Audit subscription and request lifetime separately: finite completion prevents
an indefinitely retained subscription, but does not establish safe cancellation
on route departure or prevent a late callback from changing a destroyed view.
Apply UI28's actual HTTP/callback cancellation contract to finite reads too.
Retained subscriptions should use `takeUntilDestroyed` or an equally explicit
existing owner; source-driven reads
whose newer value supersedes an older request should use `switchMap` or the
screen's established equivalent cancellation. Do not infer correct cancellation
from an import alone. Signal queries such as `viewChild` are stable and preferred
for new code, while decorator queries remain fully supported; migrate an
existing `@ViewChild` only when the consumer benefits and preserve the required
`read` token and timing contract.

Typed reactive forms remain a supported Angular21 choice. Signal Forms are a
separate experimental v21 API and are not a default migration target. Likewise,
`httpResource`, zoneless change detection and blanket `OnPush` conversion are
not screen-modernity requirements. Audit `OnPush` only as a measured migration
with input identity, imperative callbacks, overlays and third-party controls in
scope. Preserve Sigma's explicit `provideZoneChangeDetection` setting unless a
separately authorized change-detection audit proves the replacement safe.

Finally, confirm one root provider composition and one interceptor-equipped
`HttpClient`; a feature must not create a parallel client/provider chain. Record
per-consumer conformance, supported compatibility exceptions and pending runtime
evidence. Use the Angular21 documentation for v21 behavior and status; the
unversioned current documentation may supplement stable API semantics but must
not silently replace the supported-version contract:

- [Angular21 components and standalone default](https://v21.angular.dev/guide/components)
- [Angular21 standalone bootstrap](https://v21.angular.dev/api/platform-browser/bootstrapApplication)
- [Angular21 built-in control flow](https://v21.angular.dev/api/core/%40if)
- [Angular21 signals and computed state](https://v21.angular.dev/essentials/signals)
- [Angular21 inject API](https://v21.angular.dev/api/core/inject)
- [Angular21 RxJS interop API index](https://v21.angular.dev/reference)
- [Current stable takeUntilDestroyed API](https://angular.dev/api/core/rxjs-interop/takeUntilDestroyed)
- [Angular21 queries and supported decorator queries](https://v21.angular.dev/guide/components/queries)
- [Angular21 reactive forms overview](https://v21.angular.dev/guide/forms)
- [Angular21 experimental Signal Forms](https://v21.angular.dev/tutorials/signal-forms)
- [Angular21 root HttpClient provider](https://v21.angular.dev/api/common/http/provideHttpClient)
- [Angular21 change-detection performance guidance](https://v21.angular.dev/best-practices/performance)
- [Angular21 runtime Version API](https://v21.angular.dev/api/core/Version)

The application builder preserves the existing flat `dist/sigma` deployment
through `outputPath: { base: 'dist/sigma', browser: '' }`, assets/web.config,
service-worker configuration and production budgets. Runtime entries remain
explicit in `tsconfig.app.json`; Jasmine specs belong to `tsconfig.spec.json`.
For official schematics that incorrectly resolve project paths relative to an
explicit source `rootDir`, use a temporary workspace-root setting, run the
schematic, then restore the exact original setting. Never patch library code
or weaken compilation to hide a migration failure. Build authorization and
manual runtime acceptance remain governed by AGENTS/Master7. Historical
Angular17/18 references elsewhere record earlier compatibility evidence;
current Angular21 declarations own new API choices. The recurring render hook
is `afterEveryRender({ read: ... })`; preserve deferred/coalesced publication
in CurrentBranchService instead of reintroducing mutable DOM template reads.
Angular21 effects already permit signal writes; remove the deprecated inert
allowSignalWrites option without changing callbacks or scheduling. Do not copy
the old flag into a new effect or use its removal to justify changing business state.

### Standalone migration dependency gate

After converting a declaration to standalone, remove an import of its former
owning NgModule when the template no longer needs it. A component importing that
module while the module imports/exports the component creates a runtime metadata
cycle, even when application compilation succeeds. Also remove unused parent
component imports introduced by a schematic. Audit components **and** NgModule
imports/exports/declarations, then exercise real lazy login/root and shell metadata
through the authorized test/runtime workflow. The Angular21 Header/Layout,
Notifications/Extras, Card1/Cards, ChatInner and DropdownMenus cases are verified
examples. No schema/diagnostic suppression or speculative provider change.

A template reference on a custom component host (including form[appMockData])
returns that component, not its DOM element. When a focus/scroll owner needs the
native element, query with explicit read:ElementRef; a TypeScript ElementRef type
annotation does not change Angular's runtime query result. Preserve component
queries where the consumer needs the component API. LeaseAgreement's invalid-save
form focus is a verified native-query example; do not add a fake nativeElement
alias to the shared form component to accommodate a mismatched query.

### One `HttpClient`

> **Status: Canonical** (2026-09-30, backlog 17 resolved)

`app.config.ts` provides the only application `HttpClient`:

```ts
providers: [
  provideHttpClient(withInterceptors([tokenInterceptor, errorInterceptor, navigationActivityInterceptor])),
  …
],
```

Every service resolves it, so `providedIn: 'root'` is enough; a feature service no longer needs
an entry in `LayoutModule.providers` (that list is legacy and is removed gradually, not
extended). Both interceptors act only on Sigma API requests (`isSigmaApiRequest`: the URL
starts with `environment.baseUrl`). The login server, assets and third-party URLs pass
through untouched. For an API request:

- `tokenInterceptor` adds `Authorization: Bearer …` when a token is stored, and
  `Accept-Language` from the UI language (`ar` → `ar-SA`, else `en-US`), so backend
  messages follow the UI;
- `errorInterceptor` presents every failure and the standard success toast (block 22).
- `navigationActivityInterceptor` owns subscribed Sigma write activity and page-read
  cancellation through the shared navigation policy (blocks 10, 22 and 28).

Do not add a feature-level `provideHttpClient(...)`, import `HttpClientModule` in a feature
module, or set a manual `Authorization` header. The lazy `AuthModule` also resolves the root
client; Sigma-only interceptors bypass login-server URLs. When one request alone gets `401`, check the token and that its URL is built
from `environment.baseUrl`.

**Check:** routes file exists · route count matches the editor shape · `models/`
has the files its shape needs · lazy route registered · services are `providedIn: 'root'` and API URLs start with `environment.baseUrl` · no
feature `provideHttpClient` chain or `HttpClientModule` import · no
manual Bearer header workaround · menu entry.

**Do not copy from** `Companies/Company`, `Companies/CompanyContactPerson`,
`Companies/CompanyDriver`. Dead scaffolding: `/menu/products` columns, empty
action bodies, `console.log("Delete2")`, 0-byte SCSS.
