# اكتشاف صلاحيات عروض أسعار تأجير المعدات — EquipmentQuotation

| البند | النتيجة |
|---|---|
| Status | Discovery — source contract frozen separately |
| التاريخ | 2026-11-11 |
| الجرد عند البدء | 146/263 operation-confirmed؛ `EquipmentQuotation` resource-only |
| مصدر API الفعلي | **`Quotation`** وليس `EquipmentQuotation` ولا `RentalQuotation` |

## مرجع Speed والحدود

المرجع الصحيح هو دليل `references/speed-analysis/2026-10-27/Speed_Analysis_Guide.md` ووثيقة الشاشة المؤرخة `2026-10-28/sidebar/11-equipment-rental/screens/01-quotations.md`، المسار R0660/`tenant.crs_ersQuotation`، ووحدات C1494 للقائمة وC1492/C1493 للمحرر وC1497 للطباعة. يثبت المصدر التاريخي Create/Edit/View/Delete، اعتماد/رفض داخلي وعميل، Revise، Excel/Print، وربط PO وMasterAgreement. لا تستنتج من وجود `EditApprovedQuotation` في Speed أن Sigma تسمح تعديل المستند بعد الاعتماد؛ Sigma لديها حارس حالات وتبعية المستندات المرتبطة. لا تُخلط هذه الوحدة مع `07-sales/screens/02-sales-quotation.md`، أو تأجير المركبات العامة أو الليموزين.

## خريطة الاستهلاك الفعلي في Sigma

| العملية | مسارات المصدر | HTTP / السلوك |
|---|---|---|
| route/list/Excel | `SiGmaAngularFrontEnd/src/app/modules/Equipment Rental/EquipmentQuotation/equipmentrental.routes.ts`, `components/list/list.component.ts/html`, `services/equipmentrental.service.ts:42-52` | `/EquipmentQuotation`, GET `/Quotation`, Excel بجمع كل صفحات `pageSize=200`، مرشحات الرقم/الفرع/العميل/التاريخ/حالتَي الاعتماد، grid وsort |
| view/edit/create | `components/details/details.component.ts/html`, service :54-62 | `/view/:id` و`/edit/:id` و`/create`؛ GET `/Quotation/GetByWithNavigationsId/{id}`, POST `/Quotation`, PUT `/Quotation`; Create لا يحتاج قائمة View |
| حذف | `components/list/list.component.ts:361-366,416-459` | DELETE `/Quotation?id=...` مع تأكيد، فقط إذا `canDelete` حسب حالة الخادم |
| إجراءات الحالة الستة | `components/list/list.component.ts:369-393`; `QuotationController.cs:11-22`, `QuotationService.cs:277-365` | POST `/{id}/internally-approve`, `/internally-reject`, `/customer-approve`, `/customer-reject`, `/revise`, `/unapprove`; الخادم يتحقق من الحالة والمنع عند مستند تابع، لكن `ReviewedPermissionOperations` لا يسجل مفاتيحها بعد |
| مستندات مرتبطة | `list.component.ts:338-359`, `EquipmentMasterAgreement` و`PurchaseOrder` editors | إنشاء/عرض الاتفاقية الرئيسية وPO بعد الموافقات تحت **منح مواردها المستقلة**؛ لا يحول مجرد Quotation.View إلى الحق في تعديل/إنشاء مستند آخر |
| اختيارات الإنشاء | service :84-100، `details.component.ts:322-381` | Customer/GetSelect وStaff/GetSelect و**Equipment/GetSelect** (من `FleetService` ذي المورد `Equipment`، لا وجود لطلب Fleet/GetSelect) وCarModel/GetSelect؛ `Contact/GetSelectByCompany/{customerId}` اختياري. فرع التنفيذ من `CurrentBranch/Options` actor-bound بدل فرض Branch/GetSelect؛ وأجزاء Staff/Contact لا يجب أن تمنع الإنشاء إذا لم يرسلها المستخدم |

## فجوات المصدر قبل التنفيذ

Frontend route policy لا يسجل `/EquipmentQuotation` وأبناءه، والقائمة تبادر GET/اختيارات حتى لمستخدم Create-only؛ لا توجد `AccessViewPolicyService` عند أزرار الإجراءات/السطر والمرشحات أو كتلة محرر التفاصيل. التصدير/الطباعة/تأكيد الإجراءات قد تنشر نتائج بعد تغيّر الجلسة؛ POST/PUT/DELETE/ستة transitions كلها تستخدم `takeUntilDestroyed` (تحرم الخادم من إكمال كتابة أُرسلت عند انتقال route)، وتفتقر `CAN_PRESENT_API_OUTCOME`.

Backend `QuotationService` يصون `Repository.Query<Quotation>` scoped بفرع `BranchId` التاريخي عبر `BranchScopeRegistry.cs:33`، ويملك `ExecuteUniqueWriteAsync` وإجراءات الستة وحارسات الحالة/الترابط. لكنه يعيد فشل تفاصيل غير موجودة دون 404، ويقبل `Branch` بمجرد الوجود دون التحقق المبكر من writable/active، ولا يمنع `HandleActive`, `CheckUnique`, `GetSelect`, `GetAllWithNavigations` العامة غير المستخدمة، ويعيد فشل bulk دون 405. `Quotation` كيان فرعي مباشر يملك `BranchId` nullable تاريخيًا بينما VM الجديدة تطلبه موجبًا. `QuotationConfig.cs` لديه unique index `(SubscriptionId,No)`، Date وapproval indexes وconcurrency tokens؛ لا تعلن هجرة جديدة قبل إثبات فجوة مخطط فعلية.

الأداء/الكاش: `GetManyAsync` يقوم بالترشيح/count/page ثم projection ويحافظ على صفحات ≤200؛ يجب حماية grid المراجع المحجوبة وعدم تسريب customer/salesperson name من فروع أخرى. اختيارات Customer/Fleet/CarModel تستخدم مالك `BaseService` للكاش عند opt-in فقط، وCurrentBranch options للفرع؛ لا تُخزّن GET مستند تشغيل داخل reference cache. UI22 مؤشر صفحة للجدول وExcel وإجراءات الكتابة، ومؤشر داخل المحرر للـGET/الخيارات دون spinner مكرر. لا قياسات SQL/متصفح ولا تنفيذ source tests بعد.
