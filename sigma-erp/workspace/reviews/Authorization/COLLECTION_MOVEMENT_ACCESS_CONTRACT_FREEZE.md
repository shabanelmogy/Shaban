# عقد الصلاحيات المجمد — حركات الاستلام CollectionMovement

| البند | القيمة |
|---|---|
| Status | Frozen — source implementation authorized |
| التاريخ | 2026-11-11 |
| مصدر الاكتشاف | [COLLECTION_MOVEMENT_ACCESS_DISCOVERY.md](COLLECTION_MOVEMENT_ACCESS_DISCOVERY.md) |
| الجرد قبل الإقفال | 144/263؛ `collectionMovement` resource-only |

## العمليات والمنح المعتمدة

| العملية | المنح | endpoint |
|---|---|---|
| القائمة، البحث/الصفحات، Excel، العرض/التفاصيل | `CollectionMovement.View` | GET list، GetById، GetByWithNavigationsId/:id؛ الجذر مقيد بفرع الاستلام المحفوظ |
| الإنشاء | `CollectionMovement.Create` | POST /CollectionMovement؛ مستقل عن View، و`CurrentBranch/Options` يحدد فرع استلام نشطًا قابلًا للكتابة بلا اشتراط `Branch.Lookup` إضافي |
| اختيار اتفاقية اختياري | Create + `RentalAgreement.Lookup` + `RentalAgreement.View` عند وجود AgreementId | Lookup ثم GET تفاصيل الاتفاقية؛ الخادم يجلب سياق المركبة والعميل ولا يثق بالهوية المرسلة من المتصفح |
| اختيار مركبة مباشرةً | Create + `Vehicle.Lookup` عند إرسال VehicleId بدون اتفاقية مرجعية | `Vehicle/GetSelect`، لا يشترط لمجرد إنشاء حركة خالية من مركبة |
| اختيار سائق | Create + `Driver.Lookup` إذا أرسل DriverId | `Driver/GetSelect`؛ بدونه لا يمنع حركة بلا سائق |
| حذف حركة محفوظة | `CollectionMovement.View` + `CollectionMovement.Delete` | DELETE /CollectionMovement?id؛ تأكيد هوية الصف الحالي، branch write محفوظ، 404 خارج scope، لا إلغاء لطلب أُرسل بالفعل |
| قارئ سجل الحركات الموحد | `CollectionMovement.GetMovements` مستقل عن View | GET /CollectionMovement/GetMovements؛ يُبقي تجميع أنواع المصادر المراجعة تحت نطاق الفروع الخاص بكل مصدر |

يظل `CollectionMovement` مستقلًا عن `WorkshopMovement` و`DeliveryMovement` وNRM؛ لا يشترط منح View على Create-only. `BranchInId` فرع استلام تاريخي مطلوب عند الإنشاء، لا يُستنتج من فرع المركبة الحالي؛ الخادم يحميه عبر `BranchAccessSnapshot.AllowsWrite` وحارس EF المركزي، ويقرأ سجلاته التاريخية حسب الفرع المسجل حتى بعد انتقال المركبة. يمكن إظهار BranchInName المحفوظ بينما تُحجب بيانات مركبة/اتفاقية/سائق/عميل خرجت من نطاق المستخدم. لا تتطلب شاشة العرض lookup مستقل لمجرد قراءة DTO مستهدف ضمن صلاحية View.

العمليات الموروثة Update/HandleActivate/CheckUnique/GetSelect/GetAllWithNavigations/bulk AddList/UpdateList غير مستخدمة وغير مثبتة كسلوك هذه الشاشة؛ تُعاد 405 وتُستبعد grants القابلة للإسناد. `GetByIdWithNavigations` ليس ضمن 405 لأنه قارئ فعلي. **الحذف مدعوم ويجب ألا يُلغى**، ويظل endpoint GetMovements المتخصص. لا تنشئ إجراء Close/AddDriver استنادًا إلى Speed وحده، حتى يُعتمد نموذج حالة ووثيقة انتقال خادمية مستقلة. لا تُصطنع Status="Delivered" بوصفها حالة lifecycle مسجلة؛ تاريخ DateIn = DateAndTime هو تاريخ واقعة الاستلام الحقيقية ويمكن إظهاره بلا استنتاج إغلاق.

## تحقق الخادم وإسقاط البيانات

- لا `SubscriptionId` أو `No` أو `CustomerId` قابل للكتابة من العميل. الاشتراك يأتي من JWT الموقّع والمستودع، ورقم المستند يولد من مالك ترقيم Repository (لا تحسب `MaxId+1`). `DateAndTime` حقيقي مطلوب وغير default، Type null أو NrmMovementType 0..4، FuelLevel null أو enum 0..8، KMs string اختيارية تحافظ على الصفر وقواعد المدخل، Notes طولها مضبوط بعقد الحقل القائم/المخطط. DriverId/AgreementId/VehicleId اختيارية لكن موجب إن حضرت.
- عند اتفاقية مستخدمة، تحقق `Repository.Query<Agreement>` من الاشتراك/الفرع وصلاحية المرجع، وخذ CustomerId/VehicleId من الخادم، لا تثق بقيم client. ارفض VehicleId لا يتطابق مع الاتفاقية، وألا تصل البيانات من فرع غير مرئي. الاتفاقية اختيارية؛ لا تربط إنشاء مستقلًا بها. في حالة vehicle direct تحقق من نطاق المركبة؛ عند DriverId اختياري تحقق من نطاقه وكونه نشطًا. `BranchInId` مطلوب وموجب وفاصل السلطة historical root؛ تحقّق من فرع نشط ونفس الاشتراك + write access قبل حفظ الحركة. لا تراجع أو تستبدل قيم تاريخ حركات محفوظة بسبب نقل المركبة.
- GET قائمة وتفاصيل من `Repository.Query<CollectionMovement>` filtered by stored BranchInId؛ 404 للغائب أو خارج الفرع دون كاشف، والإسقاط إلى whitelisted DTO/scoped refs قبل الفلترة والفرز على الحقول المسموح عرضها. Count على نفس query؛ pageSize 1..100، تاريخ min/max آمن، Skip safe، DateAndTime DESC/Id DESC؛ `GetListAsync` و`GetMovementsAsync` يتعاملان مع StatusCodes عبر `ToActionResult` ولا يخفيان فشلًا تحت HTTP 200.
- DELETE يثبت record داخل tenant/branch `AllowsWrite` بواسطة الخدمة والحارس المركزي قبل soft delete؛ سجل مستمد من GET View قد ينتقل/يُسحب وصوله قبل التأكيد، فهناك إعادة تحقق داخل API. لا تؤثر صلاحية Delete على GetMovements/المصادر الأخرى.

## عمر Angular/التحميل

- `/collectionMovement` يحتاج View، `/create` يحتاج Create فقط، و`/details/:id` View. create-only لا يطلق GET القائمة أو export أو dropdowns محجوبة. يبحث ويصدر تحت `switchMap`/`takeUntil(denied$)` وسياق الجلسة، ويمنع فتح صف أقدم أو نشر Export بعد سحب المنحة/تغيير الحساب/الفرع. عند عودة View يعيد القراءة بسياق المالك إن لم تتغير الهوية.
- تأكيد حذف بـView+Delete وهوية الصف الحالية، والقرار المؤجل يُلغى عند تغيير grant/query/session، لكن DELETE المرسل يكمل وينشر نتيجته فقط في جلسة المالك وقت الإرسال عبر `CAN_PRESENT_API_OUTCOME`. ينجح الحذف ثم يعيد صفحة القائمة بشكل مشروع بعد نجاح الخادم؛ لا ينشر نتيجة حساب آخر.
- محرر Create يحافظ على draft عند تغير grant مع الحساب نفسه، ويمنع POST جديدًا دون Create أو conditional Lookup المرجعي. تحميل CurrentBranch/Options actor-bound وoptional lookups بحسب grant، مع Retry وفصل أخطاء الاتفاقية المطلوبة عن خيارات غير مطلوبة. قراءة Details مرتبطة بView وتُلغى عند revoke، والـPOST المرسل مستقل عن destroy ويحجب Toast القديم. UI22: page loader للقائمة/Export/Delete/Save، local dialog spinner للـGET/detail/lookup. Cache sources تُفصل حسب opt-in لا يُفرض cache على كل GET.
- دليل المستخدم بالعربية/الإنجليزية يوثّق الحذف واشتراط فرع الاستلام، الاتفاقية الاختيارية، والاختيارات المشروطة، والفروق عن Speed؛ وتكتب مواصفات مصدرية سلبية قبل ترقية صف الجرد. لا تُعد `Status` دعوى إغلاق ولا تنفذ هجرة status. قبل عمليات schema/SQL: ثبت حاجة FK/Index لفرع CollectionMovement على مخطط مالك DB ثم نفذ الهجرة المطلوبة فقط مع توثيق بيانات التجربة؛ لا تفترض نجاح build/HTTP/EF دون تشغيله.
