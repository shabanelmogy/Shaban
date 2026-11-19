# Selected sidebar Arabic translation review

| Field | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-23 |
| Scope | Equipment Rental; Reports and its two children within Limousine; Assets; main Reports, including its nested salesperson group |
| Authorization | Source-read-only review; no application/configuration/instruction edits |

## Authorized implementation amendment — 2026-10-23

The owner's subsequent instruction `طبق التعديلات` authorizes the missing Arabic sidebar labels in the four reviewed subtrees. This is a tier-S vocabulary correction, using UI23 and the existing SidebarMenu/translation dictionaries; no business/API contract changes. The original read-only review and its provisional semantic observations below remain historical evidence.

Frozen implementation scope: add exactly the 84 missing consumed Arabic keys; retain the three already translated labels and all existing English keys, catalogue keys, routes, disclosures and runtime dictionary ownership. Add bilingual navigation guidance to the existing shared UserGuide overview. Do not add the three unused `sideMenu.reportss` alternatives merely for whole-block parity.

Conservative wording decisions: keep CID and AUH as supplied; translate Download Description literally. For Outstanding Agreements, Rental Vehicles On Service Replacements and Vehicle Charged Vs Driven, use literal Arabic with the existing English qualifier retained. These are display wording decisions only: do not assert a settlement state, replacement workflow, or distance/currency unit that the placeholder destinations do not establish. A fully localized business-specific replacement for these three qualifiers remains pending confirmed report semantics.

| Concern | Book block | Reference / shared owner | Target |
|---|---|---|---|
| Exact Arabic lookup paths | UI23 | `vocabs/en.ts`, `vocabs/ar.ts`; catalogue titles in `sidebar-menu-data.ts` | Add only the missing consumed Arabic leaves |
| Navigation shape | UI1 | SidebarMenuComponent / MenuCatalog / existing PanelMenu | Retain existing keys, routes and disclosure behavior |
| Guide handoff | Master7; UI23 | `SHARED_SCREEN_GUIDANCE`, existing GuideReader overview | Add one bilingual navigation paragraph |
| Verification boundary | Master7; UI29 | Source inventory and scoped diff | Source checks only; runtime dictionary and visual acceptance pending |

## Manifest and evidence

The owner's successive messages extend one sidebar-only review. Screen bodies, root Limousine's other entries, other modules, routes and report business logic are out of scope. Source: `SiGmaAngularFrontEnd/src/app/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts` and exact referenced keys in `modules/i18n/vocabs/en.ts`/`ar.ts`; `TranslationService` and existing bilingual screen headings are read only for resolution/terminology context. No screenshot supplied.

Authority: Master1/4/5/7; UI1 shared SidebarMenu/MenuCatalog/PanelMenu and UI23 exact namespaces, EN fallback and current-language dictionary rules; UI29 source-only limitations. Applied sigma-screen-refactor digest. Selected UI shape is shared sidebar navigation; no backend/CRUD shape or API change applies. Phases0/5/6 apply proportionally to key discovery, consumer resolution and final reconciliation; list/editor/domain-action implementation phases do not apply. The initial full generator check passed. Existing prior login-vocabulary and Reports-disclosure changes were present and preserved.

## Result

Counts include visible group headings and leaf labels, taken from the actual selected catalogue subtrees rather than every key in a similarly named dictionary block.

| Selected subtree | Actual labels | Missing Arabic | Missing English | Existing Arabic |
|---|---:|---:|---:|---:|
| Equipment Rental | 6 | 5 | 0 | 1 |
| Limousine → Reports | 3 | 3 | 0 | 0 |
| Assets | 7 | 7 | 0 | 0 |
| Main Reports | 71 | 69 | 0 | 2 |
| Total | 87 | 84 | 0 | 3 |

Main Reports includes `sideMenu.salepersonReport`, its discount-report child, `sideMenu.accountss.trialBalance` and `driverTimeSheetReport.title`. The latter two already resolve to `ميزان المراجعة` and `تقرير ساعات السائقين`. The Equipment guide already resolves to `دليل تأجير المعدات`. Preserve those three existing labels.

The confirmed defect is missing Arabic entries at the exact consumed paths, not a missing translation pipe. Some Arabic screen titles or similarly named keys exist elsewhere, but do not resolve these sidebar namespaces. English fallback explains untranslated shipped labels. The authenticated database runtime dictionary can override/fill labels; no database/runtime inspection was authorized, so actual deployed values cannot be asserted from shipped source alone. TranslationService starts from the selected language originals and overlays runtime values. Do not bypass its established freshness/session owners.

## Equipment Rental and Assets: proposed labels

All rows below are missing in the exact Arabic namespace. Full key prefix for the four equipment children: `sideMenu.equipmentRentals.`; for asset children: `sideMenu.assetss.`.

| Exact key | English | Proposed Arabic |
|---|---|---|
| sideMenu.equipmentRental | Equipment Rental | تأجير المعدات |
| sideMenu.equipmentRentals.quotations | Quotations | عروض الأسعار |
| sideMenu.equipmentRentals.masterAgreement | Master Agreement | الاتفاقية الرئيسية |
| sideMenu.equipmentRentals.deliveryNotes | Delivery Notes | سندات تسليم المعدات |
| sideMenu.equipmentRentals.timeSheet | Time Sheet | سجلات وقت المعدات |
| sideMenu.assets | Assets | الأصول |
| sideMenu.assetss.assetTypes | Asset Types | أنواع الأصول |
| sideMenu.assetss.assets | Assets | الأصول |
| sideMenu.assetss.depreciation | Depreciation | الإهلاك |
| sideMenu.assetss.depreciationSummary | Depreciation Summary | ملخص الإهلاك |
| sideMenu.assetss.depreciationDetail | Depreciation Detail | تفاصيل الإهلاك |
| sideMenu.assetss.depreciationReportFy | Depreciation Report FY | تقرير الإهلاك للسنة المالية |

Equipment Time Sheet and Delivery Notes terminology follows existing Equipment Rental guide topic names; it is not a change to the screen workflows or fiscal calculations.

## Limousine → Reports

| Exact key | English | Proposed Arabic |
|---|---|---|
| sideMenu.limousineReports | Reports | التقارير |
| sideMenu.limousineReportss.utilizationReport | Utilization Report | تقرير الاستخدام |
| sideMenu.limousineReportss.chauffeurForcedAllocationsReport | Chauffeur Forced Allocations Report | تقرير التخصيصات القسرية للسائقين |

Both report proposals reuse the already translated corresponding screen titles in `ar.ts`, preserving terminology rather than introducing competing sidebar names.

## Main Reports: missing labels

Every row below lacks its exact Arabic key. For compactness, `reportss.*` means `sideMenu.reportss.*`; other prefixes are written in full. Proposed labels are review recommendations, not implemented translations.

| Key | Proposed Arabic |
|---|---|
| sideMenu.reportsss | التقارير |
| reportss.vehiclePriceBasedOnTariffGroup | سعر المركبة حسب مجموعة التعريفة |
| reportss.vehiclesRevenueReport | تقرير إيرادات المركبات |
| reportss.vehicleRentalDetailsReport | تقرير تفاصيل تأجير المركبات |
| reportss.rentalSalesForSixtBahrain | مبيعات التأجير لشركة سيكست البحرين |
| reportss.vehiclesProfitLossByChassisNo | أرباح وخسائر المركبات حسب رقم الهيكل |
| reportss.profitLoss | الأرباح والخسائر |
| reportss.collection | التحصيل |
| reportss.collectionAndRefunds | التحصيل والمبالغ المستردة |
| reportss.collectionAndRefunds2 | التحصيل والمبالغ المستردة 2 |
| reportss.customerWiseCollectionReport | تقرير التحصيل حسب العميل |
| reportss.dailyBusinessReport | تقرير الأعمال اليومي |
| reportss.saleReport | تقرير المبيعات |
| reportss.saleReportBaseOnInvoice | تقرير المبيعات حسب الفاتورة |
| reportss.salesPersonInvoicesReport | تقرير فواتير مندوب المبيعات |
| reportss.vehiclesPurchaseReport | تقرير مشتريات المركبات |
| sideMenu.salepersonReport | تقارير مندوبي المبيعات |
| sideMenu.salepersonReports.salespersonDiscountReport | تقرير خصومات مندوبي المبيعات |
| reportss.taxCollection | تحصيل الضرائب |
| reportss.taxReturn | الإقرار الضريبي |
| reportss.expenses | المصروفات |
| reportss.vehicleExpenseType | نوع مصروف المركبة |
| reportss.agreementsReport | تقرير الاتفاقيات |
| reportss.staffPerformanceReport | تقرير أداء الموظفين |
| reportss.cidReport | تقرير CID — الاحتفاظ بالاختصار حتى يتأكد المقصود |
| reportss.outstandingAgreements | معلّق دلاليًا: يلزم تأكيد هل المقصود مبالغ الاتفاقيات المستحقة أم اتفاقيات لم تُغلق |
| reportss.overdueAgreements | الاتفاقيات المتأخرة |
| reportss.agreementOutstandingInvoicesReport | تقرير الفواتير المستحقة للاتفاقيات |
| reportss.dailyReport | التقرير اليومي |
| reportss.dailyRevenueReport | تقرير الإيرادات اليومية |
| reportss.vehicleStatusReport | تقرير حالة المركبات |
| reportss.vehicleStatusReport2 | تقرير حالة المركبات 2 |
| reportss.vehicleUtilizationAndRevenueReport | تقرير استخدام المركبات وإيراداتها |
| reportss.vehicleUtilizationReport | تقرير استخدام المركبات |
| reportss.vehicleUtilizationCommercialNonCommercial | استخدام المركبات التجارية وغير التجارية |
| reportss.detailedVehicleUtilizationReport | تقرير الاستخدام التفصيلي للمركبات |
| reportss.tollsReport | تقرير رسوم الطرق |
| reportss.darbTollsReport | تقرير رسوم درب |
| reportss.downloadDescription | تنزيل الوصف — يلزم تأكيد المحتوى لأن الرابط الحالي لا يثبت المعنى |
| reportss.updateFineTimeAuh | تحديث وقت المخالفة في أبوظبي — مع الاحتفاظ بالاختصار إن لم يتأكد المقصود من الخدمة |
| reportss.finesReport | تقرير المخالفات |
| reportss.surchargeVarianceReport | تقرير فروق الرسوم الإضافية |
| reportss.reconcileTolls | تسوية رسوم الطرق |
| reportss.reconcileDarbTolls | تسوية رسوم درب |
| reportss.tripsWithOvertime | الرحلات ذات العمل الإضافي |
| reportss.idleVehicleReport | تقرير المركبات غير المستخدمة |
| reportss.vehicleAgeingReport | تقرير تقادم المركبات |
| reportss.rentalVehiclesOnServiceReplacements | معلّق دلاليًا: يلزم تأكيد علاقة المركبات المؤجرة ببدائل الخدمة |
| reportss.dueForSaleVehicles | المركبات المستحقة للبيع |
| reportss.vehicleChargedVsDriven | معلّق دلاليًا: يلزم تأكيد وحدة المقارنة بين المفوتر والمقطوع |
| reportss.nonRevenueKmsReport | تقرير الكيلومترات غير المدرة للإيرادات |
| reportss.revenueByVehicleType | الإيرادات حسب نوع المركبة |
| reportss.limoDailyRevenueReport | تقرير الإيرادات اليومية لليموزين |
| reportss.revenueByTariffCard | الإيرادات حسب بطاقة التعريفة |
| reportss.revenueByBranch | الإيرادات حسب الفرع |
| reportss.revenueAnalysis | تحليل الإيرادات |
| reportss.incrementalSales | المبيعات الإضافية |
| reportss.amortization | الإطفاء |
| reportss.amortizationFy | الإطفاء للسنة المالية |
| reportss.outstandingsClearedInNextFyReport | تقرير المستحقات المسددة في السنة المالية التالية |
| reportss.mileageExceptionReport | تقرير استثناءات المسافة |
| reportss.salesPerformanceReport | تقرير أداء المبيعات |
| reportss.pointInTimeSalesPerformanceReport | تقرير أداء المبيعات في وقت محدد |
| reportss.debitorReconciliationReport | تقرير تسوية المدينين |
| reportss.monthEndLeaseAgreementOutstandingReport | تقرير مستحقات اتفاقيات الإيجار في نهاية الشهر |
| reportss.expenseReportByAccount | تقرير المصروفات حسب الحساب |
| reportss.monthlyInvoicingReport | تقرير الفوترة الشهرية |
| reportss.permanentVehiclesReadyToGoReport | تقرير المركبات الدائمة الجاهزة للانطلاق |
| reportss.higherCategoryVehicleReplacementHistoryReport | تقرير سجل استبدال المركبات بفئة أعلى |

The missing-coverage findings are confirmed independently of terminology uncertainty. Several report menu destinations currently reuse `/Account`, `/Vehicle`, `/Agreement` or `#`; their names alone do not prove the real report semantics. Do not invent a missing report, permission or calculation as part of translation work, and do not change routes in a translation-only follow-up. CID is not expanded without source evidence. Ambiguous labels above remain explicitly provisional until the corresponding report meaning is confirmed.

## Verification, reconciliation and handoff

Ran read-only Check-Translations for the exact Equipment, Assets, Limousine-report and main-report prefixes. Equipment gives6 EN/1 AR (5 missing); Assets7/0; Limousine Reports3/0. The main-report prefix checker is line-based and reports62 missing keys, not the complete consumed catalogue count. A scoped TypeScript AST inventory handles multiline properties and all actual catalogue descendants. It also excludes unused dictionary alternatives such as `sideMenu.reportss.trialBalance`/`driverTimeSheetReport` and includes the actual reused `sideMenu.accountss.trialBalance`/`driverTimeSheetReport.title` keys. This confirms main Reports71 labels,69 missing Arabic and2 translated; no missing English among actual selected labels. No case-only issue was found in the checked prefixes. Exact locations/EN/AR namespaces were checked; source whitespace passed.

Frontend repository root is `F:\My Work\Sigma\SiGmaAngularFrontEnd`. Existing scoped diff contains prior login vocabulary additions and Reports auto-expansion preference only; reviewed and preserved. No application, configuration, instruction, guide-content or canonical-book source was edited for this review. Only this artifact is the review deliverable; no migration, mapping, backend, API or business calculation change is proposed. User-guide edit gate does not authorize source edits in a read-only review.

Reused luna_explorer/gpt-5.6-luna for one bounded read-only semantic pass over the main Reports subtree while root audited the other groups and exact key inventory. No agent edited any file. Root verified its existing-label exceptions and marked unproven terminology provisional. No builds, tests, lint, browser/app checks, database commands, migrations, commits/pushes or deployment steps ran. Runtime database overrides and visual Arabic rendering remain pending owner verification. No implementation commit applies to this read-only review.

Packet maintenance: initial -Check passed; subsequent concurrent documentation updates changed fingerprints. Normalized procedures for every packet still matched current templates; rechecked Master preamble/UI23 authority and preserved approved reference roles. Regenerated PLAN-00 and PHASE-00 through PHASE-06 deterministically through the generator, then full -Check passed. No template/manifest/canonical rule changed by this review and no generated file was edited directly. Only derivative refresh and this report are writes; unrelated documentation edits preserved.
