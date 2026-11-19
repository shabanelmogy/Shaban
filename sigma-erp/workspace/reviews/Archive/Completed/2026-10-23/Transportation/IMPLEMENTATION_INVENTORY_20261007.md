# Transportation implementation inventory — 2026-10-07

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |

Exact Transportation/shared source delta: 74 files, 3657 added lines, 7382 removed lines. I18n owns targeted Transportation/shared pagination leaves and is listed separately because its working diff also contains previous Equipment Rental work. 6 whitespace-only spec edits were removed; no test implementation/execution.

| File (frontend-relative) | Added | Removed |
|---|---:|---:|
| src/app/modules/Transportation/Transaction/components/details/details.component.html | 52 | 65 |
| src/app/modules/Transportation/Transaction/components/details/details.component.ts | 136 | 215 |
| src/app/modules/Transportation/Transaction/components/list/list.component.html | 35 | 3 |
| src/app/modules/Transportation/Transaction/components/list/list.component.ts | 255 | 145 |
| src/app/modules/Transportation/Transaction/models/create.ts | 4 | 4 |
| src/app/modules/Transportation/Transaction/models/details.ts | 6 | 8 |
| src/app/modules/Transportation/Transaction/models/list.ts | 15 | 12 |
| src/app/modules/Transportation/Transaction/services/transaction.service.ts | 30 | 9 |
| src/app/modules/Transportation/Transaction/transaction.routes.ts | 9 | 16 |
| src/app/modules/Transportation/TransactionItem/components/details/details.component.html | 51 | 65 |
| src/app/modules/Transportation/TransactionItem/components/details/details.component.ts | 134 | 222 |
| src/app/modules/Transportation/TransactionItem/components/list/list.component.html | 34 | 3 |
| src/app/modules/Transportation/TransactionItem/components/list/list.component.ts | 253 | 144 |
| src/app/modules/Transportation/TransactionItem/models/create.ts | 5 | 4 |
| src/app/modules/Transportation/TransactionItem/models/details.ts | 6 | 8 |
| src/app/modules/Transportation/TransactionItem/models/list.ts | 16 | 12 |
| src/app/modules/Transportation/TransactionItem/services/transactionitem.service.ts | 30 | 9 |
| src/app/modules/Transportation/TransactionItem/transactionitem.routes.ts | 9 | 16 |
| src/app/modules/Transportation/TransportationAgreement/components/details/details.component.html | 97 | 304 |
| src/app/modules/Transportation/TransportationAgreement/components/details/details.component.scss | 0 | 571 |
| src/app/modules/Transportation/TransportationAgreement/components/details/details.component.ts | 221 | 426 |
| src/app/modules/Transportation/TransportationAgreement/components/list/list.component.html | 46 | 192 |
| src/app/modules/Transportation/TransportationAgreement/components/list/list.component.scss | 0 | 356 |
| src/app/modules/Transportation/TransportationAgreement/components/list/list.component.ts | 208 | 603 |
| src/app/modules/Transportation/TransportationAgreement/models/create.ts | 16 | 11 |
| src/app/modules/Transportation/TransportationAgreement/models/details.ts | 3 | 18 |
| src/app/modules/Transportation/TransportationAgreement/models/list.ts | 34 | 157 |
| src/app/modules/Transportation/TransportationAgreement/services/transportationagreement.service.ts | 41 | 129 |
| src/app/modules/Transportation/TransportationAgreement/transportationagreement.routes.ts | 8 | 16 |
| src/app/modules/Transportation/TransportationAgreementItem/components/details/details.component.html | 12 | 41 |
| src/app/modules/Transportation/TransportationAgreementItem/components/details/details.component.scss | 0 | 0 |
| src/app/modules/Transportation/TransportationAgreementItem/components/details/details.component.ts | 130 | 242 |
| src/app/modules/Transportation/TransportationAgreementItem/components/list/list.component.html | 18 | 4 |
| src/app/modules/Transportation/TransportationAgreementItem/components/list/list.component.scss | 0 | 0 |
| src/app/modules/Transportation/TransportationAgreementItem/components/list/list.component.ts | 367 | 132 |
| src/app/modules/Transportation/TransportationAgreementItem/models/create.ts | 5 | 9 |
| src/app/modules/Transportation/TransportationAgreementItem/models/details.ts | 2 | 11 |
| src/app/modules/Transportation/TransportationAgreementItem/models/list.ts | 5 | 11 |
| src/app/modules/Transportation/TransportationAgreementItem/services/transportationagreementitem.service.ts | 19 | 9 |
| src/app/modules/Transportation/TransportationAgreementItem/transportationagreementitem.routes.ts | 8 | 16 |
| src/app/modules/Transportation/TransportationInvoice/components/details/details.component.html | 12 | 17 |
| src/app/modules/Transportation/TransportationInvoice/components/details/details.component.scss | 0 | 0 |
| src/app/modules/Transportation/TransportationInvoice/components/details/details.component.ts | 127 | 222 |
| src/app/modules/Transportation/TransportationInvoice/components/list/list.component.html | 20 | 4 |
| src/app/modules/Transportation/TransportationInvoice/components/list/list.component.scss | 0 | 0 |
| src/app/modules/Transportation/TransportationInvoice/components/list/list.component.ts | 366 | 136 |
| src/app/modules/Transportation/TransportationInvoice/models/create.ts | 4 | 3 |
| src/app/modules/Transportation/TransportationInvoice/models/details.ts | 2 | 5 |
| src/app/modules/Transportation/TransportationInvoice/models/list.ts | 5 | 6 |
| src/app/modules/Transportation/TransportationInvoice/services/transportationinvoice.service.ts | 21 | 10 |
| src/app/modules/Transportation/TransportationInvoice/transportationinvoice.routes.ts | 8 | 16 |
| src/app/modules/Transportation/TripSheet/components/details/details.component.html | 38 | 178 |
| src/app/modules/Transportation/TripSheet/components/details/details.component.scss | 0 | 61 |
| src/app/modules/Transportation/TripSheet/components/details/details.component.ts | 118 | 248 |
| src/app/modules/Transportation/TripSheet/components/list/list.component.html | 26 | 205 |
| src/app/modules/Transportation/TripSheet/components/list/list.component.scss | 0 | 357 |
| src/app/modules/Transportation/TripSheet/components/list/list.component.ts | 176 | 420 |
| src/app/modules/Transportation/TripSheet/models/list.ts | 25 | 24 |
| src/app/modules/Transportation/TripSheet/services/tripsheet.service.ts | 16 | 85 |
| src/app/modules/Transportation/TripSheet/tripsheet.routes.ts | 7 | 4 |
| src/app/modules/Transportation/Trips/components/details/details.component.html | 15 | 100 |
| src/app/modules/Transportation/Trips/components/details/details.component.scss | 1 | 45 |
| src/app/modules/Transportation/Trips/components/details/details.component.ts | 17 | 42 |
| src/app/modules/Transportation/Trips/components/list/list.component.html | 22 | 175 |
| src/app/modules/Transportation/Trips/components/list/list.component.scss | 1 | 407 |
| src/app/modules/Transportation/Trips/components/list/list.component.ts | 175 | 325 |
| src/app/modules/Transportation/Trips/services/trips.service.ts | 21 | 53 |
| src/app/modules/Transportation/Trips/trips.routes.ts | 6 | 15 |
| src/app/modules/shared/components/data-table/data-table.component.html | 15 | 1 |
| src/app/modules/shared/components/data-table/data-table.component.scss | 6 | 0 |
| src/app/modules/shared/components/data-table/data-table.component.ts | 21 | 0 |
| src/app/modules/shared/utils/list-query.ts | 10 | 0 |
| src/app/modules/shared/utils/scalar-validators.ts | 19 | 0 |
| src/app/modules/shared/utils/time-utils.ts | 37 | 0 |

Additional integrations: src/app/modules/i18n/vocabs/en.ts and ar.ts. Direct root page routes/sidebar/service registrations inspected; no new menu/permission/provider or broad compiler include.

Documentation: ui/00-preamble.md, 02-service-and-response-wrappers.md, 06-grid-and-footer.md, 13-modal-with-tabs.md, 17-dates.md, 19-validation-messages.md, screens/00-catalog.md, screens/01-list-with-modal-editor.md, CHANGELOG.md and Sigma .agents/skills/sigma-screen-refactor/SKILL.md. Existing unrelated documentation work preserved.
