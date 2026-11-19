# Sigma foundation — Maintenance / Evolution Plan

| | |
|---|---|
| Status | Implemented — source-only (F1–F5, 2026-09-30) · F6 Deferred by the owner (2026-10-01) → `reviews/Deferred/AUTHORIZATION_MAINTENANCE_EVOLUTION_PLAN.md` |
| Owner verification pending | yes |
| Date | 2026-09-30 |
| Requested as | "ابدأ أول خطوة" — step 1 (foundation) of `SIGMA_DOCUMENTATION_SYSTEM_AUDIT.md` A4.3 / A4.5 |
| Packet | `PLAN-00-maintenance-evolution.md` (drift check 8×OK, 2026-09-30) |
| Guides | Master 1, 3, 4, 5, 7 · Backend 5, 7, 8, 9, 10, 12, 18, 19 · UI 1, 2, 7, 22, 26, 28, 30 |
| Method | Read-only source inspection of the base classes and shared infrastructure. No build, test, migration, database, browser or commit |
| Findings covered | A4-01…A4-10, A4-47, A4-51, A4-52, A4-53 |

## 1. Outcome and non-goals

**Outcome.** The shared base classes and shared infrastructure behave correctly by
default. A screen review then no longer re-solves the same defects, and the books drop the
work-arounds they teach today.

**Non-goals.**
- Screen refactors.
- Migrations.
- Document numbering (it keeps its own deferred plan).
- Changing any business rule.
- Authorization design (owner decision D4-1).

## 2. Existing-State Inventory — what the source really does (corrects Audit 4)

| Concern | Owner | Current behaviour | Audit 4 said | Evidence |
|---|---|---|---|---|
| List paging order | `Repository.FindByAsync`/`FindAllByAsync` | With paging, order is `Id desc` (or `orderBy` then `Id`), which is **stable** | A4-01 "no stable order" — **stale** | `Repository.cs` 294–327 |
| List total | `Service.GetManyAsync`/`GetManyWithNavigationsAsync` | `TotalCount`/`TotalPages` are **never set**, and page size is unbounded | A4-01 — confirmed | `Service.cs` 557–568, 793–804 |
| Generic filter builder | `Service` | About 230 identical lines, copied in both list methods. Property names resolve **case-insensitively** | — | `Service.cs` 336–805 |
| Filter keys in overrides | 44 `GetManyAsync` overrides + `FilterHelper` | `ListSmBase.Filters` uses the default (case-sensitive) comparer | A4-51 — confirmed for overrides | `ListSmBase.cs` |
| `QueryReport` | `Repository` | **Fails closed** when the subscription is missing | A4-02 "fails open" — **already fixed** | `Repository.cs` 54–70 |
| Dropdown base | `Service.SelectAsync` | An empty list is **already a success**. Inactive rows are included. `GetDropdownAsync` loads full entities, then projects in memory | A4-52 — first half **stale** | `Service.cs` 865–878, `Repository.cs` 606 |
| Activate | `Service.HandleActiveAsync` | Not virtual, no null guard, partial success reported as success, English literal messages. Two services work around it with explicit interface implementations | A4-53 — confirmed | `Service.cs` 827–838; `JournalVoucherService`, `OpeningBalanceServiceBase` |
| Failure helper | 70 private `Fail` + 18 `Fail<T>` copies | 1,234 `Fail("…")` English literals; 284 localized calls | A4-05/A4-47 — confirmed | grep `SiGma.Business` |
| Request language | `UseRequestLocalization` (en-US default, ar-SA) | Angular sends **no** `Accept-Language`. The browser header decides, and a neutral `ar` never matches `ar-SA`, so the backend answers in English even in the Arabic UI | new | `DependencyResolver.cs` 36–52, interceptors |
| Update base VM | `UpdateBaseVm` | Still has `SubscriptionId` and `No`; one consumer reads `No` (`LimoQuotationService` 77) | A4-03 — confirmed | `UpdateBaseVm.cs` |
| Cancellation | `IService` | Only `AddAsync` takes a token; 50 `CancellationToken.None` | A4-04 — confirmed | `IService.cs` |
| HTTP clients | `AppModule` `HttpClientModule` (no interceptors) + `LayoutModule` `provideHttpClient(withInterceptors)` | 332 `providedIn: 'root'` services get the **root** client (no token, no error handling) unless they are also listed in `LayoutModule.providers` | A4-07 — confirmed | `app.module.ts` 40, `layout.module.ts` 918 |
| Error presentation | `errorInterceptor` + `ApiErrorDialogService` | **Already shows a dialog for every failure**: `isSuccess: false` and HTTP errors, unless `X-Skip-Error-Interceptor` (35 uses). It also calls `endLoading()` and handles 401 | UI 22 tells features to show their own error toast — **book wrong**; 60 feature error toasts (48 files) are duplicates | `error.interceptor.ts` |
| Global loader | `LoadingService` | One boolean, 2,315 start/end calls | A4-09 — confirmed | `loading.service.ts` |
| Shared types | `Result<T>.id: any`, `Results<T> extends Result<any>`, `ActionList` `any` | — | A4-08 — confirmed | `shared/models` |
| Authorization | — | None | A4-10 | UI 26 |

## 3. Logic Ambiguity Register

| Rule/question | Status | Decision / required source |
|---|---|---|
| Who presents API errors? | Confirmed (source) | The interceptor. A feature restores its own state only, and presents an error itself only with `X-Skip-Error-Interceptor` (inline report or filter errors) |
| Default page size and bounds | Confirmed (BE 9, owner 2026-09-28) | Default 10, clamped to 1–100 |
| Should dropdowns exclude inactive rows by default? | Derived | **No**, keep the current behaviour. An edited record whose selected value became inactive must still show its label. Exclusion stays a per-lookup override (BE 10) |
| Deactivating a referenced row | Derived | Allowed by default. An entity that must block overrides the hook. No business change |
| Which language do backend messages use? | Confirmed (resx has 282 keys in en and ar) | The UI language, sent as `Accept-Language` (`ar` → `ar-SA`, else `en-US`) |
| Authorization model | **Missing** | Owner decision D4-1 → slice F6 Blocked |

## 4. Gap Decision Table

| Area | Decision | Target responsibility |
|---|---|---|
| Base list methods | **Refactor** | One private filter-predicate builder; both methods set `TotalCount`/`TotalPages` from `CountAsync` with the same predicate; page number ≥ 1 and size clamped to 1–100 (default 10) |
| `ListSmBase.Filters` | **Refactor** | The setter copies into an `OrdinalIgnoreCase` dictionary (last value wins on case duplicates) |
| `HandleActiveAsync` | **Refactor** | `virtual`; null/empty guard; distinct ids; every id found or nothing changes; localized messages. The two explicit interface implementations keep working and move to `override` when their screens are next touched |
| Failure helper | **Create** | Base `protected Result Failure(string messageOrKey, int? statusCode = null)` and `Failure<T>`: localizes when the key exists in `GeneralMessage`, otherwise returns the text. It is named `Failure` so the 88 existing private `Fail` copies do not clash; they migrate per feature when touched |
| Request language | **Extend** | The token interceptor adds `Accept-Language` from the stored UI language |
| HTTP client | **Replace** | One interceptor-equipped client at the root: `AppModule` gets `provideHttpClient(withInterceptors([tokenInterceptor, errorInterceptor]))`; `HttpClientModule` and the `LayoutModule` duplicate are removed. The lazy `AuthModule` keeps its own client (login stays uninterceptored). The `LayoutModule.providers` service list becomes unnecessary; it is removed later, not in this slice |
| `LoadingService` | **Refactor** | Reference counter floored at 0, `reset()`, and a reset on router `NavigationEnd`/`NavigationCancel`/`NavigationError` so a missing `endLoading()` cannot freeze the page |
| Shared types | **Extend (non-breaking)** | `ActionList<T = any>`, `Results<T>` over `Omit<Result<unknown>, 'entity'>`. `id` stays `any` until a compile pass can be run by the owner |
| `UpdateBaseVm.SubscriptionId`/`No` | **Remove** (slice F5) | Adapt `LimoQuotationService` and any profile that maps `No` from the VM. Unknown JSON members are ignored, so clients are unaffected |
| Cancellation tokens | **Keep for now** | High churn (every override signature) for low user value; its own later slice |
| Document numbering | **Keep deferred** | `reviews/Deferred/DOCUMENT_NUMBERING_MAINTENANCE_EVOLUTION_PLAN.md` |
| `QueryReport`, paging order, empty dropdown | **Keep** (already correct) | Only the books are corrected |

## 5. Option / Decision Matrix (material choices)

| Choice | Options | Decision | Why |
|---|---|---|---|
| Error presentation | (a) features toast + interceptor dialog (today); (b) interceptor only | **(b)** | One message per failure, less code per screen. The interceptor already exists and is complete |
| Loader | (a) boolean; (b) counter; (c) counter + navigation reset | **(c)** | A plain counter risks a stuck spinner with 2,315 hand-paired calls. The navigation reset bounds that risk |
| Localized failures | (a) rewrite all 1,234 literals now; (b) infrastructure now, migrate per feature | **(b)** | No big-bang change without a build. New and touched code uses keys |
| Single HTTP client | (a) keep listing services in `LayoutModule`; (b) root client with interceptors | **(b)** | Removes the class of "request without token" defects |

## 6. Impact Map

| Area | Consumers | Compatibility risk | Phase |
|---|---|---|---|
| `Service` list methods | Every entity without a `GetManyAsync` override (≈240 of 284 services) | Low: the response gains `TotalCount`; a request for more than 100 rows now gets 100 (exports page through all pages) | 1 |
| `ListSmBase` | Every list endpoint | Very low | 1 |
| `HandleActiveAsync` | Every activate endpoint | Low: a request with unknown ids now fails instead of partially succeeding | 4 |
| `Failure` helper | New code only | None | 1 |
| `Accept-Language` | Every API message | Visible: success/failure messages become Arabic in the Arabic UI. Messages that are English literals stay English | 5 |
| Root HTTP client | 332 root services | Medium: root services that used the bare client now get the token, the error dialog and the success toast. A screen that shows its own toast on those calls will show two | 5 |
| `LoadingService` | 2,315 calls | Medium: see Verification | 5 |
| Shared types | All TS consumers | None (defaults) | 2 |
| Books | BE 5, 9, 10, 12, 19; UI 2, 7, 22, 28, 30; Master 5 | — | docs |

## 7. Target Contract

| Contract | Rule |
|---|---|
| API/response | Every paged list returns `pageNo`, `pageSize` (clamped), `totalCount`, `totalPages` |
| Failure behaviour (backend) | New failures use `Failure(key)`; the message follows the request culture |
| Failure behaviour (frontend) | The interceptor presents every failure. A feature handles `isSuccess: false` and `error` by restoring its own state (busy flags, form kept). It shows its own message only for inline UI with `X-Skip-Error-Interceptor`. `error: () => undefined` is still invalid (state must be restored) |
| Bulk activate | All ids exist or the call fails; nothing is partially flipped |
| Tenancy | Unchanged (repository scoping) |
| Authorization | Unchanged — Blocked on D4-1 |

## 8. Migration and Compatibility Plan

- No schema change, so no migration.
- Rollout order: F1 → F2 → F3 → F4, then F5 in its own change.
- Rollback: each slice is an isolated diff and is reverted by its own commit.

## 9. Dependency-Ordered Implementation Plan

| Slice | Outcome | Files | Depends on |
|---|---|---|---|
| **F1 Backend base** | Deduplicated filter builder; `TotalCount`/`TotalPages`; clamped paging; case-insensitive `Filters`; virtual validated `HandleActiveAsync`; `Failure`/`Failure<T>`; new resx keys (en and ar) for the activate messages | `Service.cs`, `IService.cs` (unchanged signatures), `ListSmBase.cs`, `GeneralMessage.resx`, `GeneralMessage.ar-SA.resx` (+ the generated designer if the project uses one) | — |
| **F2 Frontend infrastructure** | One root HTTP client; `Accept-Language`; counter loader with navigation reset; non-breaking shared types | `app.module.ts`, `layout.module.ts` (the `provideHttpClient` line only), `token.interceptor.ts`, `loading.service.ts`, `app.component.ts` or the router hook, `shared/models/*` | — |
| **F3 Books** | BE 5 (`Failure`), 9 (trap removed), 10 (Canonical; empty = success), 12 (base fixed), 17/19 (`QueryReport` fixed), UI 22 (interceptor owns errors), 28 (loader), 30 backlog 17/22/27 updated; Master 5 gate; CHANGELOG; skill rows; packets regenerated + `-Check` | docs | F1, F2 |
| **F4 Audit sync** | Audit 4 rows A4-01, 02 and 52 marked stale/fixed; A4.3 order updated | audit | F3 |
| **F5 Server-owned fields** | Remove `SubscriptionId`/`No` from `UpdateBaseVm`; adapt consumers | `UpdateBaseVm.cs` + consumers found by a symbol search (BE 18 procedure) | F1 |
| **F6 Authorization** | — | — | **Blocked: D4-1** |

Removing the 60 duplicate feature error toasts is **not** in this plan. Each one goes when its
screen is reviewed, guided by the updated UI 22 and the screen playbook.

## 10. Verification Matrix (owner-run unless stated)

| Risk | Source check (agent) | Owner check |
|---|---|---|
| List totals and paging | Diff review; every override untouched | Open 3 base-driven lists: correct total and last page; `pageSize=500` returns 100 |
| Activate | Diff review | Activate/deactivate a row; send an unknown id → failure and nothing flipped; Journal Voucher opening-balance guard still works |
| Arabic messages | Resx keys exist in both files | Arabic UI: save a record → Arabic success toast |
| Root HTTP client | Interceptor chain declared once | Network: `Authorization` header on a lookup service that is not in `LayoutModule`; login still works; no double success toast on 3 common saves |
| Loader | Counter floored; reset on navigation | Open a list with lookups: spinner stays until the grid loads; navigate mid-request: spinner clears; a failed save clears the spinner |
| Types | No consumer narrowed | `ng build` compiles |
| Backend | — | `dotnet build` compiles |

## 11. Owner decisions

| # | Decision | State |
|---|---|---|
| D4-1 | Authorization model | Open — blocks F6 only |
| — | Technical choices in §4–§5 | Decided by the reviewer under the standing "decide, record it" instruction; each is reversible and changes no business rule |

## 12. Implementation record — F1–F4 (2026-09-30)

Owner instruction: "أبدأ في F1 لحد F4".

### Files changed

| Repository | File | Change |
|---|---|---|
| `SigmaBackend` | `SiGma.Business/Services/Bases/Service.cs` | The two copies of the filter builder merged into `BuildFilterPredicate`; `NormalizePaging`; `ListResult` sets `TotalCount`/`TotalPages`; `HandleActiveAsync` is `virtual` and validated; `LocalizeMessage`, `BusinessFailure`, `BusinessFailure<T>` |
| `SigmaBackend` | `SiGma.Helpers/Request/ListSmBase.cs` | `Filters` setter copies into an `OrdinalIgnoreCase` dictionary |
| `SigmaBackend` | `SiGma.Helpers/Localization/Shared/GeneralMessage.resx`, `.ar-SA.resx` | `ActivationNoRecords`, `ActivationRecordsNotFound`, `ActivationSucceeded`, `ActivationFailed` |
| `SiGmaAngularFrontEnd` | `src/app/app.module.ts` | `HttpClientModule` → `provideHttpClient(withInterceptors([tokenInterceptor, errorInterceptor]))` |
| `SiGmaAngularFrontEnd` | `src/app/_metronic/layout/layout.module.ts` | Duplicate `provideHttpClient` and its imports removed (the provider list is untouched) |
| `SiGmaAngularFrontEnd` | `src/app/modules/shared/interceptores/api-request.ts` (new) | `isSigmaApiRequest`, `apiCulture` |
| `SiGmaAngularFrontEnd` | `token.interceptor.ts`, `error.interceptor.ts` | Act only on `environment.baseUrl` requests; the token interceptor sends `Accept-Language` |
| `SiGmaAngularFrontEnd` | `src/app/modules/shared/service/loading.service.ts` | Reference counter floored at 0; reset on `NavigationStart` |
| `SiGmaAngularFrontEnd` | `src/app/modules/shared/models/action-list.ts` | `ActionList<TRow = any>` |
| Docs | BE 0, 5, 7, 8, 9, 10, 12, 17, 18, 19; UI 0, 1, 7, 22, 28, 29, 30; Master 0, 4, 5; `CHANGELOG.md`; skill §6 and §10 plus a revision row; packets regenerated, `-Check` 8×OK | Book and skill in the same change (learning protocol) |

### Decisions taken during implementation (deviations from §4)

| Planned | Implemented | Reason |
|---|---|---|
| `Failure(...)` | `BusinessFailure(...)` and `LocalizeMessage(...)` | 9 services already declare private `Failure`/`Localize` members with the same signatures; new names avoid hiding them (CS0108) |
| Paging default 10 always | Clamped **only when the request carries paging**; no paging keeps the unpaged result | Existing "load all" callers (`get()` without paging) would silently lose rows |
| `Results<T>` over `Omit<Result<unknown>, 'entity'>` | Not changed | It could break consumers that read `.entity`, and no compile pass is allowed. Stays in UI backlog 22 |
| Interceptors apply to every request of the root client | Only to `environment.baseUrl` requests | The root client also serves `AuthService` (the separate login server): no stale Bearer or CORS preflight, no error dialog, no `401` reload on the login page |
| Navigation reset on `NavigationEnd` | `NavigationStart` | New components start their loads before `NavigationEnd`; a reset there would hide their spinner |
| `HandleActiveAsync` not-found returns 404 | 400 (default) | Business failure of the request; consistent with the other base failures |

### Source-only verification

- **Backend diff reviewed** (`git -C SigmaBackend diff`):
  - the builder body moved unchanged, minus one unused local;
  - both list methods use the same predicate for rows and count;
  - `GetManyAsync` counts with `IsDeleted == false`, matching `FindByAsync`;
  - explicit-interface `HandleActiveAsync` implementations (`JournalVoucherService`, `OpeningBalanceServiceBase`) still compile against a virtual base;
  - no `ModelSnapshot` or migration touched.
- **Frontend diff reviewed:**
  - every interceptor dependency is root-provided (`LoadingService`, `ApiErrorDialogService`, `MessageService` via `GLOBAL_MESSAGE_SERVICE_PROVIDER`, `DialogService`, `AuthService`, `TranslateService`);
  - `ActionList<Row>[]` is assignable to the table's `ActionList[]`.
- **Line endings** preserved per file.

### Owner verification (still pending)

- **Builds:** `dotnet build` and `ng build`.
- **The checks in §10**, especially:
  - a login with a wrong password (no reload, the login message only);
  - a save in Arabic (Arabic toast);
  - a list reached from a service that is not in `LayoutModule.providers` (the request carries `Authorization`);
  - screens with overlapping loads (the spinner stays until the last load ends);
  - no stuck spinner after navigation.

### Suggested commit messages (not committed)

- `SigmaBackend`: `Foundation: shared list filter builder, real totals and clamped paging, case-insensitive filters, validated HandleActiveAsync, BusinessFailure localization`
- `SiGmaAngularFrontEnd`: `Foundation: single interceptor-equipped HttpClient scoped to the API, Accept-Language, counting LoadingService, generic ActionList`

No migration is required.

## 13. Implementation record — F5 (2026-09-30)

Owner instruction: "ابدأ في F5".

### Consumer search (backend block 18)

A script resolved every type deriving from `UpdateBaseVm`, 885 in total, then checked for:
- any redeclaration of `No` or `SubscriptionId`;
- any AutoMapper chain that reads either member from an Update VM, or writes it to one, including after `ReverseMap`;
- any code that reads either member through a variable typed as an Update VM.

A targeted grep over `Update*`, `RuleFor` and VM-named receivers backed up the script.

| Hit | Action |
|---|---|
| `LimoQuotationService.UpdateAsync` patched `updateVm.No` from the entity | Removed. The mapping can no longer touch `entity.No` |
| `JobCategoryProfiler`, `LabourActivitiesProfile` comment "still exist on UpdateBaseVm" | Comment updated. The ignores stay as a harmless guard |
| `CashDepositDetailUpdateVM`, `CardTransactionBankTransferDetailUpdateVM` redeclare `No` (a user-entered voucher reference) | Kept. They are now their own members instead of hiding the base |
| `PurchaseReturnDetailUpdateVM` relied on the base `No` for a user-entered reference (Add VM declares it; the Angular row binds `formControlName="no"`) | `No` declared explicitly, so editing keeps working |
| Other projects (`CustomerMVC`, `SubscriptionAPI`, `PlatformAdminDashboard`) | No hits |

### Behaviour change

- **Update requests never write a tenant or document number any more.** Before, a profile that forgot the ignore let `Mapper.Map(vm, entity)` null the `No` or zero the tenant. The tenant case produced "SubscriptionId cannot be changed".
- **Document numbering is unchanged.** It only runs on Add (`Repository.AddAsync`/`AddRangeAsync`).
- **Older Angular payloads keep working.** They still send `subscriptionId`/`no`, and the default System.Text.Json settings ignore unknown members.

### Files

| File | Change |
|---|---|
| `SiGma.Helpers/ViewModelsBases/Update/UpdateBaseVm.cs` | `Id` only |
| `SiGma.Business/Services/LimousinesServices/LimoQuotationService.cs` | `No` patch removed |
| `SiGma.Business/MapperConfig/JobCategoryProfiler.cs`, `LabourActivitiesProfile.cs` | Comment |
| `SiGma.ViewModels/ViewModels/PurchaseReturnDetail/PurchaseReturnDetailUpdateVm.cs` | Explicit user-entered `No` |
| Docs | BE 0 (0.38), 3, 4, 19 (backlog 2 resolved); UI 30 backlog 8 note; `CHANGELOG.md`; skill §8.2, §10 + revision row; packets regenerated, `-Check` 8×OK |

### Owner verification (still pending)

1. **Build:** `dotnet build`. Any Update VM member access the scripted search missed shows up here as `CS1061`. Fix it the same way: remove the patch, or declare the member explicitly if it is a real user input.
2. **Edit and save:** Limousine Quotation, Job Category, Labour Activities, one Purchase Return with detail rows (change a row's No), and one ordinary master-detail document. Numbers stay unchanged, and there is no "SubscriptionId cannot be changed" error.

- **Suggested commit:** `SigmaBackend`: `Foundation F5: UpdateBaseVm carries Id only; keep user-entered reference No explicit on Purchase Return detail`
- **Migration:** not required.

## 14. Owner decision — frontend server-owned fields (2026-10-01)

| Question | Decision | Evidence |
|---|---|---|
| Strip `subscriptionId` centrally in the token interceptor now? | **No.** Remove it screen by screen during review, with a build | Owner: "نسيبها مع مراجعة كل شاشة". The API already ignores the fields: no write VM declares a tenant, `UpdateBaseVm` carries `Id` only, and unknown JSON members are ignored. There is no functional risk while they remain |
| Scope at decision | ≈860 `subscriptionId` references in ≈465 files; ≈130 `no:` payload entries | grep, 2026-10-01 |
| Recorded in | UI 0.88 block 2 *Write payloads carry client inputs only*; block 1 cross-reference; backlog 8 and 19; skill §10 checklist item and revision row; `CHANGELOG.md`; packets `-Check` 8×OK | — |

## 15. F6 deferred (2026-10-01)

- **Owner decision:** "خلى الصلاحيات مع المؤجلات حاليا".
- **Where F6 went:** it moved to `reviews/Deferred/AUTHORIZATION_MAINTENANCE_EVOLUTION_PLAN.md`, which holds the current state, the options and the open decisions.
- **Status:** the foundation step is complete except for this deferral.
- **Rule until the plan resumes:** each screen review records restricted actions under "Authorization candidates".
