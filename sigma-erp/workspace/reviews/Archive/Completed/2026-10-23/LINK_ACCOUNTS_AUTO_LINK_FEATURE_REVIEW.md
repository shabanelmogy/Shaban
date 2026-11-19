# Link Accounts — Complete Missing Links

| | |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-09-29 |
| Request | "Based on Link Accounts, add accounts to the chart of accounts and link them so every account is linked and invoices do not fail while building journals" |
| Rule approval | Owner replied "ok" to the placement rule (2026-09-29) |
| Guides | Master Guide; backend block 15 (new *Link Accounts completeness and account placement*), 16 (Pattern 4), 14 (explicit transaction); UI blocks 13, 15, 19, 22; packets regenerated, `-Check` 8 × OK |

## Shapes

- Backend: a Pattern 4 settings action (plan + apply) beside the existing `LinkAccountsService`; account creation reuses `AccountService.AddAsync`.
- UI: a header action on the existing Link Accounts settings screen, opening an `app-editor-dialog` preview (type 15 dialog) with a confirmation before apply.

## Placement rule (frozen)

| Step | Rule | Evidence |
|---|---|---|
| 1 | Seed default code (`LinkAccountsDefaultCatalog`, now shared by the seed) exists as a posting, active account with the category of its first digit → link it | `SeedDataService` dictionaries (moved, unchanged) |
| 2a | Seed code missing, or it is a group → create a posting account named after the slot under that group or under the seed parent code | seed chart |
| 2b | No seed default → create under the group matched by **name** then category + sub-group level 2: charges → Operating Revenues; customers → Customer Receivable / Accounts Receivable; suppliers → Accounts Payable (Current); staff/drivers → Staff Payables (Current); payment methods → Cash & Bank; banks → Banks / Bank Accounts / Cash & Bank; workshop items → Inventory | seed chart names; codes differ between the seed and `AccountService` hard-coded codes, so codes are not used |
| 2c | A same-name posting child already under the parent is reused; a same-name group → Manual | avoid duplicates |
| 3 | Nothing fits → Manual with the reason | never invent |
| — | Parent must allow children, be active, sit on level 2–4 and have no journal lines (validator rules; level 1 needs a SubGroup) | `AccountValidator.ValidateForAddAsync` |
| — | Existing links and accounts are never changed; PrepaidExpense is excluded (user-added list, not slots) | `LinkAccountsService.BuildPrepaidItemsAsync` |

Note: some seed defaults map charges to expense accounts; step 1 keeps them (seed first), so "revenue" applies only to charges without a usable seed default — this covers the new workshop `ChargeTypes` 41–44 (Miscellaneous module) used by Close Job.

## API contract

| Endpoint | Returns |
|---|---|
| `GET LinkAccounts/auto-link/plan` | `Result<LinkAccountsAutoLinkPlanVM>` — items (slot dims, `slotLabel`, `action` 1 LinkExisting / 2 CreateAccount / 3 Manual, account, parent, reason) + counts |
| `POST LinkAccounts/auto-link/apply` | Same shape after apply, with the new account codes; the plan is rebuilt on the server (client sends nothing) |

Apply: explicit transaction (several saves: one per created account through `AccountService.AddAsync`, then one for the links); rollback and failure `Result` naming the slot on the first failed account. Link rows are matched by the read keys (Contacts/PaymentMethods by `Value`; banks by `SubType` with `Value` null; Workshop exact `SubType`/`JobType`; others `?? 0`) and relinked, or added.

## Files changed

Backend (`SigmaBackend`):
- `SiGma.Business/Services/AccountServices/LinkAccountsDefaultCatalog.cs` (new; seed default dictionaries + `GetDefaultCode`)
- `SiGma.Business/Services/SeedDataService.cs` (dictionaries replaced by the catalog)
- `SiGma.Business/IServices/ILinkAccountsAutoLinkService.cs` (new)
- `SiGma.Business/Services/AccountServices/LinkAccountsAutoLinkService.cs` (new; registered by the assembly scan)
- `SiGma.ViewModels/ViewModels/LinkAccounts/LinkAccountsAutoLinkAction.cs`, `LinkAccountsAutoLinkItemVM.cs`, `LinkAccountsAutoLinkPlanVM.cs` (new)
- `SiGma.ServerAPI/Controller/LinkAccountsController.cs` (two endpoints)

Frontend (`SiGmaAngularFrontEnd/src/app/modules`):
- `Accounts/Link Accounts/LinkAccounts/models/list.ts`, `services/linkaccounts.service.ts`
- `Accounts/Link Accounts/LinkAccounts/components/auto-link/*` (new dialog)
- `Accounts/Link Accounts/LinkAccounts/components/details/details.component.{ts,html}` (header button, dirty check, tab reload key, account list reload)
- `i18n/vocabs/en.ts`, `ar.ts` (`linkAccounts.autoLink.*`)

Docs: backend block 15 + preamble 0.22, `CHANGELOG.md`, skill §8.1 + revision row, packets regenerated.

## Decisions

- No migration (no entity change).
- No AutoMapper change.
- Frontend never computes the plan; Apply sends no payload.
- Tabs are recreated after apply (`@for` over `[tabsReloadKey()]`) because projected children do not re-run `ngOnInit`.

## Risks and owner verification

- Build pending (no build run). Watch: tuple/switch target typing in `SlotNature`.
- Run on a tenant with the seed chart: Plan should show workshop charge types 41–44 as *Create account* under Operating Revenues; Apply, then save a Miscellaneous Invoice / Close Job with an invoice and confirm the journal posts.
- Run Apply twice: the second plan must show only Manual rows (idempotent).
- A tenant whose chart renamed the target groups gets the level-2 category fallback or Manual rows — check the preview before applying.
- Existing issue out of scope: `details.component.scss` still sizes the page with a page-height `calc(100dvh - …)` (UI block 1 legacy).

Prohibited commands (build, test, lint, migrations, database, browser, commit) were not run.

## Change 2026-09-29 — reuse an unlinked existing account

Owner asked whether an existing, unlinked account is proposed. Before *Create account*, the plan now also looks for a posting account with the slot's name **anywhere in the same category** (not only directly under the target group): exactly one → *Link existing*; two or more → *Manual* (ambiguous). Differently named accounts are still not guessed. Book: backend block 15 (0.25).
