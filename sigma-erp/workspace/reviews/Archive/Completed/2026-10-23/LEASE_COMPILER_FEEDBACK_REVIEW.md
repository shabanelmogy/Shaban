# Lease compiler feedback repair — 2026-10-06

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Scope: the owner's pasted compilation diagnostics after the Lease frontend review, plus the explicit instruction to address their cause in documentation. Frontend repository: `F:/My Work/Sigma/SiGmaAngularFrontEnd`; documentation repository: `F:/My Work/Shaban Documents/Shaban`. Preserve the existing review implementation and unrelated documentation changes. Existing frozen Lease API/business contracts remain unchanged.

## Evidence and cause

The attached compiler output is functional failure evidence. The previous syntax/path/template-name checks did not validate TypeScript exports, Angular standalone registration, input unions, remaining TypeScript class members or installed framework APIs. No fresh successful compilation is claimed.

| Diagnostic / target before repair | Owning book | Actual source/reference inspected | Confirmed repair |
|---|---|---|---|
| TS2305/NG1010 in CostParameter, SMS, Tariff lists | UI1/4 | FilterPanelComponent is exported by filter-panel.component.ts; FilterActionsDirective and FilterAdvancedDirective are exported by filter-panel.directives.ts. Workshop Job list imports these separately. | Import the real directive from its existing owner, preserving standalone registration. No shared re-export, schema or tsconfig change. |
| Agreement list unknown app-field-error/control | UI1/19 | FieldErrorComponent is standalone with the control input; Job list registers it in @Component.imports. | Add the TS import and Angular metadata registration. |
| Agreement tariff state warning rejected | UI1/22 | StateMessageKind is loading / empty / error. | Failed tariff lookup uses error. No shared input contract expansion. |
| Agreement list this.messageService missing | UI1/22 | BaseComponentService does not supply MessageService; the remaining email-unavailable action emits info and performs no API mutation. | Restore the explicit MessageService injection for this informational notice; ordinary mutation success remains interceptor-owned. |
| Quotation/Master DestroyRef.destroyed missing | UI1/28 | package.json uses Angular17; installed @angular/core is17.3.12. Its index.d.ts DestroyRef exposes onDestroy only. | Deferred print uses timer(0) with takeUntilDestroyed and existing loaded-detail print guards. No Angular upgrade/new lifetime framework. |

The cause is incorrect consumer wiring and incomplete compatibility checking. The books named the shared controls but did not spell out exact directive export paths, allowed state literals, preservation of non-API informational injections, or cancellation of deferred UI work against installed Angular17. The owner-approved documentation repair makes these source checks explicit without changing feature behavior or using documentation to retroactively approve a different contract.

## Source changes

Seven existing files:

- `src/app/modules/Lease/LeaseCostParameter/components/list/list.component.ts`
- `src/app/modules/Lease/LeaseCustomerSms/components/list/list.component.ts`
- `src/app/modules/Lease/LeaseTariff/components/list/list.component.ts`
- `src/app/modules/Lease/LeaseAgreement/components/list/list.component.ts`
- `src/app/modules/Lease/LeaseAgreement/components/details/details.component.html`
- `src/app/modules/Lease/LeaseMasterAgreement/components/details/details.component.ts`
- `src/app/modules/Lease/LeaseQuotation/components/details/details.component.ts`

Frontend-only Phase5 wiring and Phase6 reconciliation; phases0/1 reuse the existing Lease discovery/freeze with compiler evidence above. Backend, models, API/payload, AutoMapper, financial calculations, schema and migration work are not applicable; no Add-Migration is needed. No screenshot/business requirement is Missing or invented.

## Documentation promotion

- UI1: exact exports, standalone template registration/input/member checks, dependency removal and syntax-only limits.
- UI4: exact FilterPanel/directives imports with actual Job reference and TS2305→NG1010 cause.
- UI22: supported StateMessageKind values and preservation of existing non-API informational notices.
- UI28: installed Angular17 DestroyRef contract and cancellable deferred print.
- Required skill: corresponding §1/3.4/6 rules and §11 revision row.
- UI preamble/changelog: version1.88; all earlier changes preserved.

Recipe -Check reports all packets except Phase1 stale, as in the prior review. Canonical blocks govern; generated files are not edited. Owner regeneration through the existing generator and semantic review remain pending.

## Reconciliation and verification

The complete repair delta and documentation additions were reviewed. Source-only inspection parsed all90 Lease runtime TypeScript files and36 templates, checked named local imports against actual file exports, checked relevant standalone FieldError/StateMessage/filter registrations and StateMessage kind literals, and found no source findings. Installed DestroyRef declarations, explicit MessageService injection/base members and both deferred print subscriptions were inspected. Frontend and scoped documentation git diff --check passed. The obsolete import paths/state literal/framework property no longer occur in Lease. These checks are not a TypeScript/Angular application type compilation.

The supplied errors must be rechecked by the owner's next compilation. No build, test, lint, application/browser, database, migration, commit, push or deployment command is run. No subagents are used because this is one small, related compiler-wiring repair with shared documentation ownership. No shared component/API contract was changed; seven consumers and documentation/digest only.

Owner acceptance: compile; verify filter actions/date validation, tariff failure message, the informational email notice, and Quotation/Master auto-print. Navigate away before deferred print to confirm cancellation. Source-only evidence does not certify type compilation or runtime print/layout behavior.

Suggested frontend commit: `fix(lease): correct standalone imports and Angular 17 print cancellation`. Suggested documentation commit for this repair's additions only: `docs(sigma): require verified standalone consumer contracts`. Suggestions only.
