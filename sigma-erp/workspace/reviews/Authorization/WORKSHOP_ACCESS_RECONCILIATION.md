# مطابقة صلاحيات تعريف الورش Workshop

| البند | النتيجة |
|---|---|
| الحالة | Implemented — source-only, runtime acceptance pending |
| المصدر الحاكم | [عقد Workshop المجمد](WORKSHOP_ACCESS_CONTRACT_FREEZE.md) |
| اكتشاف المراجع | [WORKSHOP_ACCESS_DISCOVERY.md](WORKSHOP_ACCESS_DISCOVERY.md) |
| الجرد | Workshop انتقل وحده من resource-only إلى operation-confirmed؛ 143/263 مؤكدة، 61 محددة المورد |
| فصل الوحدات | /Workshop تعريف أسماء الورش المشترك بين فروع الاشتراك؛ /WorkshopMovement حركة مستقلة بفرع تاريخي |

## المطابقة الفعلية

| الوظيفة | Angular | Backend / Authorization |
|---|---|---|
| القائمة والتصفية والصفحات وExcel | components/list/list.component.ts/html مع canReadList وإلغاء طلبات القراءة ومنع الصفوف والصادرات القديمة | Workshop.View على GET list عبر generic Controller/Service وRepository.Query<Workshop> |
| عرض التفاصيل مباشرة | workshop.routes.ts وworkshop-access.ts وcomponents/details مع Workshop.View وحارس سياق القراءة | Workshop.View على GET by ID وعلى inherited GetByIdWithNavigations؛ override DetailAsync واستدعاء alias له باستعلام اشتراك scoped، 404 خارج الاشتراك |
| إنشاء مستقل من رابط مباشر | route /Workshop/create مع Workshop.Create، بلا GET list | POST Add؛ اسم غير فارغ بحد 250، الهوية والرقم من الخادم |
| تعديل اسم محفوظ | Workshop.View + Workshop.Update، يتوقف زر التحرير والحفظ عند فقد أحدهما | PUT Update؛ PermissionPrerequisites يلزم View فوق Update، واسم غير فارغ بحد 50، تحديث سجل scoped بالاشتراك |
| خيارات تعريف الورش | لا تشترط منحة View على Create ولا تعرض lookup بدل list | Workshop.Lookup مستقل على GET GetSelect، مستخدم فعلًا في Fleet/ServiceLog وWorkshop/Job |
| المركبات المتخصصة | ليست قائمة تعريف الورش | Workshop.GetVehicleDetails وWorkshop.SearchVehicles عمليات Reviewed مستقلة؛ لا تُدمج بمنحة View |
| إزالة/تفعيل/فحص فريد/قراءات عامة غير مستهلكة وbulk | لا أزرار في شاشة تعريف الورش | overridden 405، وتعطيل منح resolver غير المدعومة |

## حدود الأمان والتحميل

- Workshop لا يملك BranchId؛ نطاقه tenant-wide؛ لا تُعمم عليه متطلبات WorkshopMovement.BranchId أو إجراءات Speed (C1459/C1457/C1456/C1461) الخاصة بالحركات. WorkshopMovement عنصر جرد آخر.
- مسارات View/Create/Details في سجل RouteAccessPolicyRegistry تمنع الدخول دون المنحة؛ create-only لا يطلق GET list. الواجهة لا تعتمد على route guard وحده: القائمة/المحرر/Excel تفحص الوصول وسياق الحساب قبل القراءة أو النشر.
- قراءات القائمة والتصدير تستعمل مؤشر الصفحة UI22؛ قراءة محرر التفاصيل تستخدم مؤشرًا محليًا. POST/PUT يستمران حتى النهاية بعد إغلاق المحرر، مع CAN_PRESENT_API_OUTCOME لمنع إشعار نتيجة جلسة منتهية.
- عامل الخادم حافظ على مستهلكات Workshop.Lookup وعمليات المركبة المراجعة وملفات الورشة/الحركات الأخرى. Workshop.Update يتطلب View في API ذاتها وليس Angular وحده.
- PermissionAuthorizationFilter يشترط أصلًا نطاق فرع فعّال للمستخدم العادي، حتى لتعاريف الشركة العامة؛ هذه سياسة عامة قائمة ولم تُغيّر. يلزم قبولها تشغيليًا.

## مسارات التسليم والفحص

- Angular: Movements/Workshop/components/{list,details}، workshop.routes.ts، workshop-access.ts، services/workshop.service.ts، shared/authorization/route-access-policy.ts (Workshop-only) وUserGuide/content/movements-guide.ts.
- Backend: SiGma.Business/Services/WorkShopServices/WorkshopService.cs، SiGma.ServerAPI/Controller/WorkshopController.cs (`SearchVehicles`→`ToActionResult`)، SiGma.ServerAPI/Authorization/PermissionEndpointResolver.cs وPermissionPrerequisites.cs (Workshop-only). VMs بقيت دون تعديل؛ inherited GET/POST/PUT قائمة. `GetByIdWithNavigations` يعيد نتيجة View من الخدمة وليس `405`.
- source-only specs: Movements/Workshop/components/list/list-access.spec.ts وtests/SiGma.BranchAccess.Tests/WorkshopAccessContractTests.cs، لم تُشغّلا.
- قبول المالك لاحقًا: build/tests، تحقق HTTP من 403/405، tenancy، إمكان lookup على شاشات Job وServiceLog، وحياة الحفظ بعد إغلاق النافذة وExcel/المسارات المباشرة. لم تنفذ DB/migration/snapshot/commit/push/deploy.

## إقفال المطابقة المصدرية — 11 نوفمبر 2026

وصل تسليم Backend النهائي من worker-4، وأكد تنفيذ Service/Resolver/Prerequisites والمواصفات المصدرية. راجع worker-3 Angular قراءة فقط واكتشف حالتين مؤكّدتين صُحّحتا: (1) إغلاق شاشة إنشاء لمستخدم Create-only كان يعيده لنفس /Workshop/create بنافذة مغلقة؛ صار الانتقال يستبعد المسار نفسه. (2) تحديث cache في نفس الحساب أثناء تعديل غير محفوظ كان يعيد جلب الاسم ويمحو المسودة؛ صار يحافظ عليها حتى الحفظ أو قرار التجاهل. تدقيق worker-3 الختامي لم يجد عائقًا مصدرّيًا آخر مؤكدًا. وأضاف prime حماية الاحتفاظ بمسودة edit عند سحب عرض مؤقتًا ثم إعادة المنحة دون refetch فوقها.

نجح git diff --check المحصور بالواجهة والخلفية (exit 0)، مع تنبيه LF→CRLF للـroute policy فقط. specs المصدرية كُتبت ولم تُشغّل، ولا يُدعى نجاح typecheck أو EF translation أو قبول HTTP. الجرد رُقّي **صف Workshop فقط** إلى operation-confirmed؛ العدد 143 مؤكدًا/61 resource-only/55 unknown/2 context-only/2 alias = 263.
