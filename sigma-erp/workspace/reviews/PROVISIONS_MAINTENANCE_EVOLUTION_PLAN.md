# Provisions — implementation plan

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-25 |

## Scope and authority

Implement the first Provisions menu item at `/Provision`, in place. The owner requested creation from Provisions1/2/3.PNG, supplied Monthly Posting Capture.PNG as workflow evidence, and explicitly instructed implementation. The second screen is evidence and a future consumer, not an authorized monthly-posting implementation in this slice. Follow AGENTS.md, Master1–5/7, UI screen02 and BE14, with UI22/2/29 and BE7/2 gates. Initial recipe `-Check`: all eight packets OK; use PLAN-00 and Phases00–06 as applicable.

## Existing-state inventory and impact map

| Area | Existing evidence | Disposition |
|---|---|---|
| Angular list/editor | Vouchers/Provisions/Provision; active pages/routing.ts imports; old untyped forms, incorrect Customer account options, display aliases for absent fields | Refactor in place; shared Job list/editor shape, routed editor because debit/credit totals |
| API/service | ProvisionController and generic-only ProvisionService | Extend existing owner with bounded lean reads, validated aggregate writes, guarded delete and transactions read |
| Persistence | Provision, ProvisionDetail, shadow LeaseAgreementId/ProvisionId; single legacy JournalVoucherId | Keep historical links; extend with explicit nullable PartnerId on details and owned occurrences; do not migrate/backfill legacy records automatically |
| Lease writer | LeaseAgreementService owns agreement-linked Provision objects | Keep; prohibit this screen from editing/deleting agreement-owned records |
| Journal readers | JournalReportSourceResolver and JV source guards use legacy JournalVoucherId | Keep; this slice creates no journals; future posting must integrate all source/undo/report guards before release |
| Monthly Posting | Screenshot supplies Month, Prepare, rows, Posted, Post and Excel; no current implementation found | Defer implementation; freeze future occurrence-link boundary only |
| Guide/i18n | Existing generic record-list topic at /Provision | Extend actual invoice/voucher module guide with bilingual feature topic and dedicated feature vocabulary |

## Decisions, alternatives and compatibility

The owner explicitly selected first due date from entry date and amounts per month. Calendar schedule: first occurrence on/after EntryDate; DayOfMonth 1–31 clamps to the actual last day of short months; 0 explicitly means end of month. LastDate is the last of NumberOfMonths occurrences. Server owns dates and totals. Saving the definition has no financial effect, matching the existing save behavior and the second screenshot's separate Prepare/Post workflow. This is a scheduling facility, not a calculation of a legally/accountingly required provision estimate.

Use existing aggregate rather than a competing new provision module. Precreating unposted occurrences gives exact due dates and a future one-link-per-occurrence boundary; do not create future posted journals or infer old postings. Legacy records without occurrence evidence expose unknown completion. Any retained journal link or lease parent locks edit/delete, including deleted/void history. An explicit user Save of an eligible unposted legacy definition adopts the new schedule; merely reading never does.

## Migration and rollout

Owner migration required for occurrences and optional line contact reference (and explicit existing shadow parent relationship). No migrations, snapshots, DB commands or backfills are edited/run. Existing lease and journal links are retained. Owner reviews data compatibility before applying migration. The monthly posting writer remains deferred and must adopt journal authority, periods, approval, concurrency and source navigation contracts before it creates any financial effect.

## Execution and verification

Freeze `PROVISIONS_DOMAIN_API_CONTRACT_FREEZE.md`; parallel nonoverlapping backend and frontend editor work, root-owned list/integration/guide and complete diff reconciliation. Source-only: payload/DTO, filter/projection, ownership/delete, schedule, namespace/import, translation, cache/loading and complete scoped-diff review. Owner build, database migration, request/SQL plans, timing and browser checks remain pending.

## استكمال قرار الترحيل الشهري — ٢٠٢٦/١٠/٢٦

أجاب المالك عن سؤال النطاق المالي بصورة صفحة الترحيل الشهري التي تتضمن التجهيز والتصدير وزر الترحيل وحالة الترحيل. جُمّد هذا المسار في الخطة والعقد المستقلين، ثم نُفذ في المصدر؛ وبذلك انتهى تأجيل الصفحة المذكور أعلاه لهذا النطاق فقط. يبقى حفظ تعريف المخصص دون أثر محاسبي، وتُمنع الجداول المملوكة لعقود الإيجار أو المرتبطة بقيد قديم على رأس التعريف من الترحيل بهذه الصفحة. راجع [عقد الترحيل الشهري](MONTHLY_POSTING_DOMAIN_API_CONTRACT_FREEZE.md) و[مطابقة التنفيذ](MONTHLY_POSTING_FULL_STACK_REVIEW.md) للحالة الحالية؛ تظل الفقرات السابقة سجلًا لحدود التنفيذ وقت كتابتها. البناء والتشغيل وقاعدة البيانات والقياس عند المالك.
