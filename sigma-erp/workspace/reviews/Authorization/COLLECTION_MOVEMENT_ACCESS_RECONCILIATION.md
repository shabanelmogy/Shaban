# مطابقة صلاحيات حركات الاستلام — CollectionMovement

| البند | النتيجة |
|---|---|
| الحالة | Implemented — source-only operation-confirmed; runtime acceptance pending |
| المصدر | [العقد المجمد](COLLECTION_MOVEMENT_ACCESS_CONTRACT_FREEZE.md) و[الاكتشاف](COLLECTION_MOVEMENT_ACCESS_DISCOVERY.md) |
| جرد هذا الإقفال | `collectionMovement` من resource-only إلى operation-confirmed وحده؛ 145/263 مؤكدًا، 59 resource-only، 55 unknown، 2 context-only، 2 alias |
| التالي | `logsMovement` مستقل رغم استخدامه CollectionMovement.GetMovements |

## خريطة الأفعال الحقيقية

| الوظيفة | Angular | API والخادم |
|---|---|---|
| القائمة/البحث والصفحات وExcel | `Movements/collectionMovement/components/list/list.component.ts/html` تحت `CollectionMovement.View`، `switchMap` و`denied$` وإلغاء Excel والصفوف القديمة عند تغيّر الحساب/فرع الوصول | `CollectionMovementController.GetListAsync` بـ`ToActionResult`؛ `CollectionMovementService.GetManyWithNavigationsAsync` يبدأ `Repository.Query<CollectionMovement>` scoped بتاريخ `BranchInId`، مع 1..100 وحساب النتائج ثم DateAndTime/Id desc |
| عرض تفاصيل محفوظة | `/collectionMovement/details/:id`, `details.component.ts/html`، حارس View، محو القراءة بعد revoke/session، Retry، مؤشر محلي | `GET /CollectionMovement/GetById/{id}` و`GetByWithNavigationsId/{id}` تحت `CollectionMovement.View`، 404 للغائب/الفرع غير المرئي؛ عدم عرض حقول المرجع المخفي |
| إنشاء مستقل | `/collectionMovement/create` يعمل بـ`CollectionMovement.Create` دون GET القائمة؛ `CurrentBranch/Options` يقدّم فروع `canTransact` الحقيقية، DateTime/Branch مطلوبان | `POST /CollectionMovement`: BranchInId موجب ونشط و`AllowsWrite` قبل الحفظ، `DateAndTime` صحيح، رقم وSubscriptionId من المستودع لا Max(Id) ولا request، والمركبة/العميل من اتفاقية الإيجار إن اختيرت |
| اتفاقية/مركبة/سائق اختيارية | `RentalAgreement.Lookup` + `RentalAgreement.View` للاتفاقية؛ `Vehicle.Lookup` فقط لمركبة مباشرة بلا اتفاقية؛ `Driver.Lookup` عند إرسال سائق، وأخطاء lookups الاختيارية لا توقف حفظ الحركة بدونها | `PermissionPrerequisites` يختبر شرط الحقول في `CollectionMovementAddVm`، والخادم يرفض الاتفاقية غير scoped أو الملغاة، أو المركبة المختلفة عن اتفاقيتها، أو السائق غير المرئي/غير النشط |
| حذف حقيقي | زر Delete مشروط بـ`View + Delete` وهوية الصف الحالي، confirmation تراجع grant/snapshot، وDELETE المرسل يستقر حتى لو غُلق component مع `CAN_PRESENT_API_OUTCOME` | `RemoveAsync` يجد الحركة من Repository.Query بحسب فرعها التاريخي، 404 للغائب، `AllowsWrite` عند الحذف، ثم soft delete عبر repository/EF، والـAPI يمنع Delete دون View بواسطة prerequisite |
| قارئ حركة موحّد | `logsMovement` يستهلك `CollectionMovement.GetMovements` وليس GET قائمة الاستلام | `GetMovements` منحة مستقلة، نتيجة `ToActionResult`، فصل مصادر Agreement/Delivery/NRM/Workshop/Collection بنطاق كل مصدر، ومخرجات فرع الاستلام والأسماء حسب نطاق مراجعها |
| عمليات غير مدعومة | لا Edit/Close/Return/Activate/Import متخيلة من Speed | Update/Activate/CheckUnique/GetSelect/GetAllWithNavigations/bulk AddList/UpdateList ترجع 405؛ `PermissionEndpointResolver` يجعل منحها غير قابلة للإسناد، مع إبقاء `Remove` و`GetMovements` الحقيقيين |

## فوارق دورة العمل والأمان

- `BranchInId` هو الفرع التاريخي لواقعة الاستلام؛ لا يتغير بسبب انتقال المركبة. تبقى حركة الفرع المسموح مرئية، بينما بيانات المركبة/العميل/السائق أو الاتفاقية الخارجة عن نطاق المستخدم تتحول إلى null ولا يُستعمل رقم FK الخام لتعويض التسمية المحجوبة. مرشحات SQL القياسية و`GridFilterProjection` على إسقاط مراجع scoped بدلاً من أرقام/أسماء غير مرئية.
- مصدر Speed (دليل 2026-10-27 وتحليل `2026-10-28/.../05-collection-movements.md` وC0691/C0692/C0693/C0694) يدعم Close/AddDriver، لكن Sigma الحالية لا تملك نموذج حالة أو endpoint لتلك الدورة؛ لا يُعرض إغلاق متخيل. `DateIn` المحفوظ من `DateAndTime` هو تاريخ الاستلام الفعلي، و`Status` لا يُختلق `Delivered`. قيم أنواع Speed لا تساوي Enum Sigma 0..4.
- إرسال POST/DELETE يُكمل بعد إزالة النافذة؛ لا تظهر نتيجة جلسة/actor آخر. المسودة غير المرسلة لا تُفقد عند سحب مؤقت للمنحة مع الحساب نفسه، وتتوقف المحاولات الجديدة؛ تغيّر الحساب يلغي ملكية القراءة والصادرات. لا تُنفذ الكتابة المؤجلة بناء على grant كان متاحًا وقت فتح النافذة فقط.
- UI22: مؤشر الصفحة العام للقائمة/Excel/DELETE/POST، ومؤشر محلي لتفاصيل الحوار والمراجع الاختيارية؛ لا تدعي صحة المظهر التشغيلي دون عرض متصفح. خيارات `CurrentBranch` هي actor-bound وليست `Branch.GetSelect` محجوبة على create-only. كاش Vehicle/RentalAgreement بحسب opt-in الخدمة الأساسية؛ لا نفرض caching على قراءة العمليات.

## قاعدة البيانات والهجرة المنفّذة

أضيف الفهرس المقيّد بـ`CollectionMovementConfig` على `(SubscriptionId, BranchInId, DateAndTime DESC, Id DESC)` مع `INCLUDE(Type, IsDeleted)`. EF أنشأ **`20261111203606_CollectionMovementReceivingBranchIndex20261111`**، ومُررت الهجرة بنجاح عبر `dotnet ef database update ... --project SiGma.DataAccess --startup-project SiGma.DataAccess --context SiGmaDbContext --configuration Release` بعد مراجعة أن التغيير البنيوي الوحيد هو CreateIndex. تتضمن Up backfill لسجلات **تجريبية** `BranchInId` فارغة أو أقل من 1 بأول فرع حقيقي نشط داخل **الاشتراك نفسه**، ولا تخترع فرعًا ولا تتجاوز إلى اشتراك آخر؛ Down لا يزيل قيمة الفرع التي تمت معالجتها لأن الأصل السابق غير محفوظ. أكدت `dotnet ef migrations list --no-build` وجود هذه الهجرة ضمن السجل بعد التطبيق؛ اسم EF الأخير قبلها `20261111193031_MovementPermissionsScope20261111`.

## التحقق والقيود

مصادر تنفيذ الخادم: `SiGma.Business/Services/CollectionMovementService.cs` و`SiGma.ServerAPI/Controller/CollectionMovementController.cs` و`SiGma.ServerAPI/Authorization/PermissionEndpointResolver.cs`, `PermissionPrerequisites.cs`، AddVm وEF config/migration. الواجهة: `Movements/collectionMovement` (access/routes/list/details/service/models)، أجزاء route policy المختصة، ودليل `UserGuide/content/movements-guide.ts` بالعربية والإنجليزية. source specs في `tests/SiGma.BranchAccess.Tests/CollectionMovementAccessContractTests.cs` و`components/list/list-access.spec.ts`، لم تُشغّل.

نجح `git diff --check` في المسارات المحصورة في المستودعين (تنبيه LF→CRLF فقط). **تم بناء مشروع DataAccess تلقائيًا لإنشاء وتطبيق الهجرة فقط**، وليس بناء التطبيق؛ لم تنفذ tests/lint/typecheck/browser/HTTP أو SQL execution plan/قياس أداء، ولم يحدث commit/push/deploy. لا تفسر مطابقة المصدر أو نجاح هجرة الفهرس على أنه قبول حقيقي لكل SQL projection أو استثناءات EF أو التوصيل الشبكي. يلزم قبول المالك لخصوصية الفروع/المراجع، وقواعد حذف الملفات، ومؤشرات UI22 تحت التشغيل.
