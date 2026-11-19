# HRM — إصلاح سلامة البيانات

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-11 |
| Contract | HRM_DATA_INTEGRITY_CONTRACT_FREEZE.md |

## النتيجة والنطاق

طبقنا شريحة سلامة البيانات من التقرير العام بعد طلب المالك التنفيذ ثم المتابعة. أكد المالك أن البيانات تجريبية وأن الأولوية للصواب، واستفسر عن فترتي حضور منفصلتين: كلاهما مدعوم داخل سجل اليوم بأربعة clocks، ولا يتعارض مع uniqueness للموظف/اليوم. لا توجد إعادة كتابة بيانات أو حذف/دمج تاريخ أو سياسة overnight جديدة أو تغيير رواتب قانونية.

### ما تغير

- DutySchedule يحتفظ بـ IsAbsent عند تعديل/مسح shift/clocks؛ الجديدة فقط تبدأ false. تصحيح الغياب صريح من Attendance. الصفوف غير المعدلة لا تُرسل ولا تتغير.
- Attendance single/bulk writes تتحقق من الموظف والوردية والهوية والحقول وكل keys قبل mutation، مع قفل Staff المشترك لتسلسلها مع DutySave. التاريخ الجديد/المعدل يستخدم Date.Date؛ لا تكرار جديد لنفس موظف/يوم حي.
- كلا قارئي الدوام، الحالي والlegacy، وقارئ/كاتب Staff Duty لا يختاران أعلىId عند تعارض Attendance، ويعيدان localized conflict. legacy successful JSON array محفوظ؛ internal interface يمرر Result لكي يكون الفشل HTTP409 قياسيًا.
- Attendance EF يحتوي computed AttendanceDay وAttendanceDeletedKey وunique tenant/staff/day/live key. NULL IsDeleted محسوب live مثل repository؛ soft-deleted keys متمايزة. التطبيق يحتاج owner migration قبل تشغيله بهذا النموذج.
- salary validator واحد في create/revision يرفض السالب والدقة الزائدة والسعة الزائدة، ثم يتحقق من Gross بعد bounded components. DTO ranges أصبحت decimal(18,2) magnitude؛ inputs لا تُقرب بصمت ولا تغير salary groups القديمة عند الرفض. trailing zeros المقابلة لنفس القيمة مقبولة.
- OvertimeService وStaff overtime يستخدمان TryCalculateHoursAmount من StaffOvertimePolicy؛ storage bounds وrate scale2/amount capacity وoverflow failures موحدة. rate hierarchy/holiday classification/saved snapshot rules والمعادلة الحالية محفوظة.
- Staff OT minute conversion وmonthly total لا يسببان Int32 overflow. قبل sparse Save تُحسب الدقائق الجديدة + الأيام غير المعدلة وتُراجع amounts/fallback calculation. البيانات غير القابلة للعرض تُرفض برسالة، دون clamping أو إخفاء أصلها.
- minute conversion يستعيد أثر precision6 عند تحويل integer minutes→hours→minutes:2min→0.033333h→2min؛ فقط داخل half-storage-unit tolerance0.00003 minute. fractional minutes الأخرى تحتفظ بسلوك truncation السابق، ولم تضف واجهة دقائق كسرية.
- مراجعة المصادر تطبق bounds على hours/rate حتى مع وجود amount snapshot؛ المبلغ القديم لا يُعاد تسعيره. fallback للصف الذي يفتقد amount يستخدم original hours، لا دقائق العرض المقطوعة.
- Duty save يفحص الشهر كاملًا قبل تعديل أي يوم، ويعيد فشل refresh بدل نجاح بصفوف فارغة. Staff OT يفعل الشيء نفسه لفشل refresh؛ failure يمنع commit في transaction القفل المشترك.
- Bulk Attendance يرفض تغيير key إلى key مشغول بسجل آخر حتى لو السجل الآخر ضمن الدفعة ويتحرك؛ لا swap workflow أو transient index collision.
- دليل HRM ودليل Staff بالعربية والإنجليزية يصفان السلوك الفعلي والتعارض وحدود الأرقام وفترتي العمل.

## الملفات التي عدلتها المهمة

Backend root: `F:/My Work/Sigma/SigmaBackend`:

1. `SiGma.Business/IServices/IAttendanceService.cs`
2. `SiGma.Business/Services/AttendanceService.cs`
3. `SiGma.Business/Services/StaffServices/StaffService.cs`
4. `SiGma.Business/Services/StaffServices/StaffOvertimePolicy.cs`
5. `SiGma.Business/Services/OvertimeService.cs`
6. `SiGma.DataAccess/Configuration/AttendanceConfig.cs`
7. `SiGma.ServerAPI/Controller/AttendanceController.cs`
8. `SiGma.ViewModels/ViewModels/Staff/StaffSalaryPackageVm.cs`
9. `SiGma.Helpers/Localization/Shared/GeneralMessage.resx`
10. `SiGma.Helpers/Localization/Shared/GeneralMessage.ar-SA.resx`

Frontend root: `F:/My Work/Sigma/SiGmaAngularFrontEnd`:

1. `src/app/modules/UserGuide/content/hrm-guide.ts` — Attendance and Overtime notes only; prior administration/opening additions preserved.
2. `src/app/modules/UserGuide/content/staff-guide.ts` — Staff salary, DutySchedule and StaffOverTime notes.

Review artifacts: this file; frozen slice contract; HRM_ATTENDANCE_INTEGRITY_IMPLEMENTATION_NOTES.md; HRM_OVERTIME_INTEGRITY_IMPLEMENTATION_NOTES.md. Earlier broad business review remains a historical audit, not overwritten as if defects had never existed.

## Decisions / conformance / phases

| Concern | Evidence / comparison | Final decision |
|---|---|---|
| Ordinary CRUD | BE13, BranchService checks then localized result; current Attendance DTOs | composite-key/bulk overrides justified; no generic engine changes |
| Aggregate writers | BE14/PurchaseOrderService validation before tracked graph mutation; current Staff owner | same salary/day collection owner; all calculations validated before one save |
| Race boundary | BE8/15, UnitOfWork.ExecuteUniqueWriteAsync, existing OvertimeService | Staff tenant lock shared by Attendance single/bulk/delete and Duty/OT writers; no extra nested transaction |
| Money | BE15/FinancialNumberPolicy, SalaryPackageConfig18,2 + frozen salary/OT contracts | reject client scale beyond2; Gross from exact validated parts; computed OT shared AwayFromZero |
| EF key | BE2 tenant uniqueness; OvertimeConfig null-live computed day/deletion key | same live-row semantics; migration required, no files generated |
| API errors | generic controller ToActionResult and EN/AR resx | typed localized errors; legacy array success retained |
| DTO / grid | Attendance staff/code/designation/shift/absence/date/clocks; Duty day/date/weekday/shift/clocks/identity; OT serverhours/rate/amount | list columns/ListVM properties unchanged; no extra state/permission fields |
| AutoMapper | existing Staff and Attendance maps; prepared scalar batches maintain stored identity/audit/No | no profile changes/reverse maps; no trusted client money totals or tenant input |
| User guide | Master7 + existing reader `/UserGuide/hrm`, `/UserGuide/staff` and menu | bilingual topics updated; no new reader/navigation/layout |
| Scope | prior full-stack review stage1, owner execution request, experimental-data continuation | F01/F03/F04 and Attendance uniqueness implemented; full leave/payroll/country engines remain later stages |

PLAN00 existing-state/options resolved by approved stage1; Phase00 scope/evidence, Phase01 frozen amendments, Phase03 writers, Phase05 direct API integration, Phase06 source reconciliation applied. Phase02 UI grid redesign skipped (DTO/columns unchanged). Phase04 new approval/payment transitions skipped (none authorized by this slice). Phase03 frontend forms unchanged: current failure handling keeps entered values and displays server errors. User-guide handoff completed. No new screenshot evidence; previous opening screenshot not used to infer rules here.

## Owner migration / data preflight

Run **`Add-Migration AddAttendanceDayUniqueness`** after reviewing the existing pending migrations. Name was checked against current migration classes. It should add the two computed columns and the unique index from AttendanceConfig only for this slice; inspect generated scope before applying it.

**Existing duplicate live keys prevent index creation.** This read-only preflight query is provided for the owner; it was not executed here:

```sql
SELECT SubscriptionId, StaffId, CONVERT(date, [Date]) AS AttendanceDay,
       COUNT_BIG(*) AS LiveRecordCount
FROM Attendance
WHERE (IsDeleted = 0 OR IsDeleted IS NULL) AND StaffId IS NOT NULL
GROUP BY SubscriptionId, StaffId, CONVERT(date, [Date])
HAVING COUNT_BIG(*) > 1;
```

Before migration, resolve each experimental conflict explicitly using the intended day facts and both work intervals. No bulk-delete/merge policy or executed cleanup is part of this task. Existing migrations/model snapshot were already changed by the owner/prior work and remain untouched by this task. Because the new model selects computed columns, apply the schema migration before running the changed application; the application-layer lock is already implemented but cannot substitute for the schema.

## Manual verification required

1. One day08:00–12:00 and16:00–20:00 in the first/second pairs: create/read/edit/DutySave preserve both; a second Attendance for the same staff/day is rejected.
2. IsAbsent=true: changing shift, one clock, or clearing all clocks through DutySchedule preserves true. Explicit Attendance edit of Absent remains supported.
3. Duplicate staff/day with different stored timestamp times: current and legacy Duty reads and sparse Duty save reject conflict without writes. List can still expose records for correction.
4. Concurrent Attendance Add versus Duty Save for the same tenant/staff/day: only one live row succeeds; different staff/day and different tenants remain independent keys. Soft delete then replacement and NULL IsDeleted behavior match the index.
5. Single/bulk invalid/missing/cross-tenant Staff/Shift/update Id, duplicate request keys, batch failure: no partial persistence; same valid saved identity can update its own key.
   Bulk swap of two occupied days is rejected before writing. A conflict on an untouched day also rejects Duty save before writing an unrelated valid day.
6. Staff create + same-date revise: negative,1.001, Decimal.MaxValue, Gross above capacity reject before modifying existing salary groups.1.00 accepted; Gross equals Basic+Transport+House exactly. Maximum boundary tested by owner using exact decimal JSON, not imprecise client JS literals.
7. Staff OT minute2 round trip displays2 after saving/reloading; ordinary minutes1/59/60/61. int.MaxValue boundary and multiple days whose total exceeds Int32: controlled failure before save. Stored oversized daily hours produce an actionable read error.
8. Compare daily OT and Staff OT amount at equivalent hours/rate, supported caps, negative/high rates, computed amount beyond18,2 and arithmetic overflow. Saved valid rates/amounts remain historical under the existing writer semantics.
9. Sparse OT save with one invalid day or invalid untouched stored amount/fallback leaves every requested day unchanged. Monthly process remains append-only operational history, not payment.
10. Compile both repositories, replay API errors in English/Arabic, verify existing Angular failure/retry retains values and guide navigation/RTL/theme. These actions remain owner verification pending.

## Verification performed and limits

Separate scoped Git diffs and whitespace/merge-marker checks in both actual repositories; existing pre-task changes distinguished (Staff opening delete blocker, HRM administration guide additions and resource keys). All seven new resources exist in EN/AR, resx XML parsed and names are unique. Source imports/interface/controller/DTO references checked; `FinancialNumberPolicy` explicitly imported where introduced. Routes and successful payloads preserved; new conflict failures recorded above. Eight generated recipes current before implementation and checked at handoff; no book/template regeneration needed because no shared canonical rule changed.

No build, test, lint, database command, migration generation/application, snapshot edit, browser automation, commit, push, deployment, SigmaMCP or Graphify was run. Schema state, SQL computed index behavior, runtime locking, EF generated migration and compiler acceptance remain pending. This is implemented source, not certified running functionality.

Suggested scoped commits (do not include unrelated pending changes):

- SigmaBackend: `fix(hrm): preserve absence and enforce attendance and amount bounds`
- SiGmaAngularFrontEnd: `docs(hrm): explain attendance and payroll input integrity rules`

Agents: two `sol_worker` gpt-5.6-sol agents under canonical AGENTS delegation authorization. Attendance worker owned AttendanceService/AttendanceConfig; OT worker owned StaffOvertimePolicy/OvertimeService. Root owned contract, StaffService integration, resources, legacy API adaptation, guides and final reconciliation. Nonoverlapping implementation reduced independent tracing time; final read-only reviews checked integrated changes. No agent changed migrations or prior unrelated work.

Final worker findings reconciled: stored-rate validation gap closed in both Staff read/untouched-write paths؛ full-month Duty duplicate preflight and refresh propagation closed؛ bulk occupied-key swaps now fail before mutation. Remaining worker warnings concern owner-run schema/runtime verification, not unimplemented source findings in this slice.
