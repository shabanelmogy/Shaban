# عقد صلاحيات عروض أسعار تأجير المعدات — EquipmentQuotation

| البند | القيمة |
|---|---|
| Status | Frozen — source-only implementation |
| التاريخ | 2026-11-11 |
| مرجع الاكتشاف | [EQUIPMENT_QUOTATION_ACCESS_DISCOVERY.md](EQUIPMENT_QUOTATION_ACCESS_DISCOVERY.md) |
| الجرد قبل التبني | 146/263؛ صف `EquipmentQuotation` مورد فقط |

## 1. مواءمة الموارد والأفعال

`/EquipmentQuotation` اسم **مسار**؛ المورد الصالح للإسناد في API هو **`Quotation`**. لا تسند مفاتيح `EquipmentQuotation.*` أو `RentalQuotation.*`. الواجهة لا تصنع حقًا بسبب حالة `canEdit/canDelete/canApprove*`؛ يلزم **المنحة الحالية والحالة الخادمية معًا**. صلاحية القراءة على الصف تعود لفرع عرض السعر **المحفوظ** (`Quotation.BranchId`)، لا لفرع المركبة أو المورد الحالي.

| العملية | شرط واجهة وخادم | المسار/الطلب |
|---|---|---|
| القائمة/البحث/Excel والعرض والطباعة | `Quotation.View` | GET `/Quotation`, GET `/Quotation/GetByWithNavigationsId/{id}` وGetById alias؛ فرع العرض التاريخي |
| فتح إنشاء مستقل | `Quotation.Create` مع `Customer.Lookup` و`Equipment.Lookup` و`CarModel.Lookup` | POST `/Quotation`، لا GET list عند Create-only، خيارات الفرع `CurrentBranch/Options` actor-bound وليست `Branch.Lookup` لازمة تلقائيًا |
| تعديل المحرر | `Quotation.View` + `Quotation.Update` مع `Customer.Lookup` و`Equipment.Lookup` و`CarModel.Lookup` اللازمة لصفوف المعدات | PUT `/Quotation`، طلب تفاصيل محفوظة أولًا، تحقّق من حالة Pending/Rejected والملكيات للصفوف |
| اختياري SalesPerson | السابق مع `Staff.Lookup` فقط عند إرسال `SalesPersonId` | `Staff/GetSelect`، يمكن حفظ العرض بدونه؛ لا يفتح إسناد موظف خارجي |
| اختياري Contact | السابق مع `Contact.GetSelectByCompany` فقط عند `ContactId` | GET SelectByCompany/{partnerId}، والخادم يفحص انتماء ContactId لنفس العميل والاشتراك والفرع |
| فلتر عميل بالقائمة | `Quotation.View` + `Customer.Lookup` عند `partnerId/customerId` أو grid على اسم/هوية العميل | GET القائمة؛ سقوط Lookup يمسح الفلتر ويعيد بحثًا بلا عميل، ولا يفرض المنحة على القائمة العادية |
| حذف مسموح بالحالة | `Quotation.View` + `Quotation.Delete` | DELETE `/Quotation?id=...`؛ تأكيد صلاحية الهوية الحالية وحارس branch write، أوقف الحذف للسجل المرتبط أو المعتمد |
| اعتماد داخلي | `Quotation.View` + `Quotation.InternallyApprove` | POST `/Quotation/{id}/internally-approve` |
| رفض داخلي | `Quotation.View` + `Quotation.InternallyReject` | POST `/Quotation/{id}/internally-reject` |
| اعتماد العميل | `Quotation.View` + `Quotation.CustomerApprove` | POST `/Quotation/{id}/customer-approve` |
| رفض العميل | `Quotation.View` + `Quotation.CustomerReject` | POST `/Quotation/{id}/customer-reject` |
| إعادة للمراجعة | `Quotation.View` + `Quotation.Revise` | POST `/Quotation/{id}/revise` |
| إلغاء الاعتماد | `Quotation.View` + `Quotation.Unapprove` | POST `/Quotation/{id}/unapprove`؛ فقط بعد تحقق الخادم من عدم وجود PO/MasterAgreement حي |
| إنشاء اتفاقية رئيسية | `Quotation.View` + `EquipmentMasterAgreement.Create` (ومنح سابقة يعلنها مالك الاتفاقية) | رابط `/EquipmentMasterAgreement/create?quotationId=...`؛ ينقل المصدر فقط ولا يتخطى حارس الاتفاقية |
| عرض الاتفاقية الرئيسية | `Quotation.View` + `EquipmentMasterAgreement.View` | رابط `/EquipmentMasterAgreement/view/{id}` |
| إنشاء أمر شراء معدات | `Quotation.View` + `PurchaseOrder.Create` (ومنح المصدر في مالك PO) | محرر PurchaseOrder داخل القائمة بعد موافقتين حقيقيتين |
| استعراض أوامر الشراء | `Quotation.View` + `PurchaseOrder.View` | جدول PurchaseOrder المقيَّد بالعرض وصلاحية PO |

أضف العمليات الستة إلى `ReviewedPermissionOperations` مع prereq `Quotation.View`. `Quotation.Update/Delete` يتطلبان View أيضًا في API، وCreate/Update require fixed `Customer.Lookup` و`Equipment.Lookup` و`CarModel.Lookup`. **تصحيح دليل المصدر بتاريخ 12 نوفمبر 2026:** `EquipmentQuotationService.getEquipmentTypes()` يستدعي `FleetService` الذي يملك المورد الفعلي `Equipment` وGET `Equipment/GetSelect`؛ الاسم `Fleet.Lookup` في تجميد 11 نوفمبر لم يكن grant مطابقًا لأي endpoint مستهلك، وتصحيحه إلى `Equipment.Lookup` يحفظ المستهلك الحقيقي ولا يضيف صلاحية افتراضية. عزل `Contact.GetSelectByCompany` و`Staff.Lookup` وفلتر العميل **شرطي** في `PermissionPrerequisites` على DTO الحقيقي و`ListSmBase`, بما يشمل grid المحمي؛ لا يكفي إخفاء اختيار Angular. الغموض في `EquipmentMasterAgreement` أو `PurchaseOrder` يبقى ملكًا لوحداتهما ويُفحص منحهما صراحة في انتقال شاشة العرض، ولا تُفتح endpoints التابعة هنا.

## 2. الخادم والعمليات الموروثة

`Quotation.AddVM/UpdateVM` حقولهما في المصدر: تاريخ DateOnly صالح، Period موجب، PartnerId صالح Customer، BranchId موجب ومكتوب عليه من العضو، QuotationType enum، بنود معدات واحدة على الأقل (EquipmentTypeId, CarModelId, Units موجبة، إيجار غير سالب)، ساعات ورسوم وملاحظات ضمن حدود VM. Source `SubscriptionId/No`, approval/status/server-side links غير قابلة للكتابة من العميل. `Repository.AddAsync` يملك رقم المستند؛ `ExecuteUniqueWriteAsync` يمنع تصادم الرقم. BranchId التاريخي **مطلوب عند الإضافة** وimmutable على تعديل سجل محفوظ خارج قواعد تغيير فرع موثقة، مع تحقق `AllowsWrite` لفرع الأصل وفرع تعديل إن كان مسموحًا وbranch active/same tenant، وتظل حماية DbContext المركزية قائمة. تحقق Partner/Contact/Staff/Equipment/CarModel الحي scoped، ولا تقبل مرجع آخر الاشتراك أو فرعًا مخفيًا. اقتصر الـDTO على بيانات مرئية/مسموح بها عند العرض/القائمة ورفض 404 للغائب/خارج branch، لا تعرض خام foreign key للمرجع المحجوب.

`Remove`, `Update` والانتقالات الستة **مدعومة** بقدر الحالة وعدم ربط مستندات تالية، ولا تُغلق. `GetSelect`, `GetAllWithNavigations`, `HandleActivate`, `CheckUnique`, bulk AddList/UpdateList غير مدعومة في شاشة Sigma ولا مستهلك مثبت لها؛ تعيد 405 مع تعطيل grants القابلة للإسناد. `GetByIdWithNavigations` قارئ مدعوم تحت View وليس 405. كل service failure يجب أن يصل عبر `ToActionResult`/status بدل 200 نجاح، مع 404 للسجل المخفي. لا تستخدم صلاحيات Speed التي ليس لها endpoint Sigma، ولا تسمح برفع/حذف/طباعة عامة بلا مصدر.

## 3. عمر Angular والتبعية والأداء

سجل `/EquipmentQuotation` View، `/create` Create+required lookups، `/view/:id` View، `/edit/:id` View+Update+lookups بــroute policy صريح. تحميل القائمة والمرشحات وExcel ممنوع على create-only/view-only route، بينما editor GET محفوظ يتطلب View. `AccessViewPolicyService.revision`, `denied$`, `observeAuthSession`, `readAuthSessionKey`, `dataContext`, `ReferenceLookupCache.contextChanges` تبطل GET/results والتصدير/طباعة الصف القديم عند revoke/actor/session/branch context. عودة المنحة تسمح بإعادة القراءة بنفس المالك فقط ولا تمحو مسودة تحرير غير محفوظة في نفس الحساب. أزرار الصف لها permission requirement وحالة server `can*` صحيحة و`quotations().includes(row)` قبل الفتح أو التأكيد.

POST/PUT/DELETE وtransitions **المُرسَلة** مستقلة عن DestroyRef (لا `takeUntilDestroyed` على الكتابة) حتى تستقر عند الخادم؛ لا إرسال جديد بعد سحب المنحة. إلغاء التأكيد/تغيّر الصف والمنحة/المالك يمنع **الإرسال**، لكن لا يلغى request وصل للخادم. `CAN_PRESENT_API_OUTCOME` يقيّد النشر/Toast والإعادة لسياق الإرسال الصحيح، والمعترض العام مالك toast واحد. UI22 مؤشر صفحة للقائمة/Excel/الأفعال/الحفظ، ومحلي لقراءة التفاصيل والاختيارات مع Retry وعدم تكرار spinners. `Staff`/`Contact` اختيارية حسب موضع الاستهلاك، بينما `Customer.Lookup`/`Equipment.Lookup`/`CarModel.Lookup` required في محرر الإنشاء/التعديل. CurrentBranch خيارات فرع actor-bound، ولا تحمل تلقائيًا إحداثيات branch user غير قابلة للكتابة.

لا هجرة جديدة بلا فجوة مثبتة؛ `QuotationConfig` فيه unique `(SubscriptionId,No)` وDate/approval indexes وconcurrency tokens، والعزل `BranchScopeRegistry.Direct<Quotation>("BranchId")`. راجع Count/Skip/Take وترتيب Id stable قبل Excel، وقيّم index BranchId عند SQL-plan/قبول المالك فقط. source specs سلبية للمنح وحالات الاعتماد الستة وbranch/customer/optional refs وstale/export/print/posted writes، ودليل UserGuide عربي/إنجليزي قبل ترقية صف الجرد وحده. بناء Business/tests/lint/typecheck/browser/commit/push غير مصرح به ضمن هذا التنفيذ؛ الهجرات المطلوبة فقط بعد إثبات فرق مخطط.
