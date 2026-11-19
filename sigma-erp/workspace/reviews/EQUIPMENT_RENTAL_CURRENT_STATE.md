# Equipment Rental — current state

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Last recorded round | 2026-10-30 |
| Full review | [EQUIPMENT_RENTAL_FULL_STACK_REVIEW.md](EQUIPMENT_RENTAL_FULL_STACK_REVIEW.md) (306 KB, newest at the top) |

Read this first, then open only the needed section of the full review by heading.

## Summary

- Four screens: equipment rental quotations, master agreements, delivery notes, timesheets; plus billing, invoice and financial-status dialogs.
- Latest completed round (source-only): nine operational-conformance fixes — list lifetime, read cancellation, guarded confirmations, delivery and preparation date validation.
- The five findings of the read-only full review are fixed: write progress in the finance dialogs, the wrong "draft only" message, a per-rate reference query on agreement save, English business messages, and the delivery list repopulating after a context clear.
- Sections from the top of the file down to "تشخيص فشل ترحيل الساعات" are small diagnoses and fixes from 2026-10-30 after the handoff.
- Business logic missing versus the reference is recorded in the parity plan and deferred to the client review; no full parity is claimed.

## Contracts and plans in force

- [Reference details contract](EQUIPMENT_RENTAL_REFERENCE_DETAILS_CONTRACT_FREEZE.md): the nine operational fixes.
- [Review fixes plan](EQUIPMENT_RENTAL_REVIEW_FIXES_MAINTENANCE_EVOLUTION_PLAN.md): first slice only.
- [Simplification contract](EQUIPMENT_RENTAL_SIMPLIFICATION_CONTRACT_FREEZE.md) and [domain/API contract](EQUIPMENT_RENTAL_DOMAIN_API_CONTRACT_FREEZE.md); the older operational contract still governs pricing where not replaced.
- [Workflow overview](EQUIPMENT_RENTAL_WORKFLOW_OVERVIEW.md).

## Pending

- Runtime, browser and the owner checks listed in section "المطابقة النهائية وتسليم الجولة التشغيلية".
- Migration `UnifyEquipmentQuantityAndHourDetails` was pending with the owner on 2026-10-30; check the actual migration history before relying on that.
- Missing-logic decisions with the client.

## Useful sections in the full review

- ضبط التوافق التشغيلي قبل مراجعة العميل — ٣٠ أكتوبر ٢٠٢٦
- تنفيذ إصلاحات المراجعة وتعميم هدف التفاصيل المرجعية — ٣٠ أكتوبر ٢٠٢٦
- مراجعة شاملة دون تعديل المصدر — ٣٠ أكتوبر ٢٠٢٦ (cache, loading, performance and contract inventory)
- Current Sales / equipment-rental linkage audit — 2026-10-27
