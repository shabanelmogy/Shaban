| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-10-25 |

# خطة تنفيذ الإطفاء

## الطلب والتفويض والأدلة

طلب المالك البحث عن الشاشة وتنفيذ إصلاحها أو إنشائها، ثم فوّض اختيار السيناريو المناسب ثلاث مرات لأن طريقة العمل غامضة لديه. الصورة الثانية تثبت تفاصيل الحساب اليومي؛ وطلب المالك عرض الشاشة كتابات. القرار هنا اختيار منفذ معلن بناءً على تفويضه، وليس ادعاء أن صيغة الحساب أو مصادر المدة كانت موجودة بالمصدر.

الدليل E1 Amorization.PNG: مجموعتان عاديتان/مخصصتان، month وPrepare/Excel/Save، أعمدة prepaidAccount/supplier/detail/vehicle/expense، count/total، و؟ لكل صف. الدليل E2 qwer.PNG: نافذة مبلغ الأصل وفترة التغطية وعدد أيامها وفترة الشهر وأيام الإطفاء والصيغة والمبلغ. قيمة31.04 في أكتوبر دليل ناتج مرجع قديم لا تفويض لكسور يوم من منطقة زمنية. نستخدم DateOnly/calendar-day arithmetic وrounded cumulative recognition differences لتوزيع التقريب دون تجاوز الأصل، ونعرض الفرق عن القسط الخام بشفافية.

## الموجود وخريطة الأثر

الموجود رابط /Amortization وإعدادات DocumentType.Amortization والترقيم فقط؛ لا route/component/service/entity/API/engine. BillDetail يملك AccountId,PostedNetAmount,SupplierId,VehicleId وBill يملك source journal/currency/branch/approval؛ OpeningBalancePrepaid يملك account/vehicle/debit/credit/source journal. لا مدد تغطية فيهما. PrepaidExpense links: Value=prepaid account وAccountId=expense. PostingSelect operational؛ BranchService source opted-in cache؛ FX غير مدعوم للترحيل.

Keep: مصادر Bill/OpeningBalancePrepaid وLinkAccounts وJournalVoucherResolver والمكونات المشتركة. Create: جدول تغطية مستقل بالإطفاء، مصادره روابط FK ثابتة إلى بند Bill أو OpeningBalancePrepaid، أو جدول مخصص بالحسابين والمبلغ. هذا يضيف المدة داخل مالك الإطفاء دون تعديل نماذج مصدر الفاتورة/الأرصدة. Create: run شهري + snapshots للسطور +approval history. Extend: writer guards للوثيقة/الأرصدة المرتبطة لمنع تعديل الأصل تحت جدول حي؛ ربط generated journal بمصدره في مصدر تنقل JVs؛ DI/route/guide والترجمات. لا نسخ شاشة legacy أو مكوّنات عامة أو تغيير bank/stock/salary. لا migration/snapshot من الوكيل.

## القرارات المختارة والعقد

الأنماط UI1/13 routed tabbed financial workspace، UI6 read grid وUI14 configuration dialog؛ BE15 financial aggregate مصدره run، وBE7 bounded batch reads. التابات الأربعة: automatic,custom,schedules,runs. monthly preview complete contract max2000 rows مع فشل معلن فوق الحد لا صمت/صفحة ناقصة. schedules/sources/run reads complete bounded كذلك. لا preview amount موثوق من العميل.

جداول التغطية مستقلة ثابتة بعد الإنشاء؛ غير المستخدمة تحذف وتُنشأ بدلًا منها لتصحيحها، وبعد وجود أي run line لا تعدل/تحذف حفاظًا على الدليل. مصدر Bill eligible approved posted nonvoid base-currency وAccount Prepayment وصافي PostedNetAmount>0؛ لا تخمين مبلغ net لنسخة legacy ناقصة ولاVAT، المصدر OB netDebit>0 من source posted nonvoid samebase. mapping expense يثبت من PrepaidExpense وposting eligibility. Branch من المصدر إذا موجودة؛ وإذا غير محددة يختار المستخدم branch صحيحة صراحة. custom يحدد DebitAccountId وCreditAccountId مختلفين من AnyPosting، positive amount basecurrency، branch، start/end،description. هذه الحسابات مخصصة عامة ولا نفترض أن كل مخصص Revenue في الصورة.

Coverage: startDate<=endDate، calendar dates inclusive، max1200months منعًا لمدخل غير محدود؛ month overlap days/total days. monthly expense=Round(amount*cumulativeDaysThroughMonth/totalDays)-Round(amount*cumulativeDaysBeforeMonth/totalDays)، policy money decimals؛ sum months exactly principal ولا partial-day/DST. لا catch-up لأشهر لم تطلب ولا تغيير تواريخ المصدر. المصدر والprincipal/accounts/branch/coverage immutable snapshots؛ Prepare/Save/Approve يعيدون تحقق أصل المصدر وتوافق المبلغ والحسابين/الفرع/العملة. principal علىOB هو صافي الرصيد الافتتاحي الباقي؛ legacy prior manual amortization لا يمكن استنتاجه من الوصف ويجب تحديد تغطيته كرصيد افتتاحي صحيح، لاbackfill تلقائي.

Save: يرسل month/isCustom/previewKey opaque فقط؛ recompute تحت القفل ومقارنة signature محدثة، وإلا409 مع إعادة الإعداد. ينشئ run Pending وgenerated JV draft بتاريخ آخر الشهر (لاpost)، snapshots وreservations atomically. يسمح عدة runs للشهر إذا ظهرت جداول جديدة؛ unique tenant+schedule+month active reservation يمنع تكرار المصدر. لا zero expense أو empty save. Reject terminal معreason1..500 ويحرر reservations؛ UnApprove Approved→Pending guarded originalperiod/allocations يحفظreservations؛ Void Approved→void بحفظ journal/number/history ودون reversal ويحرر reservations؛ Delete فقط Pending بلاdecisionhistory، soft-delete owned draft/lines/JV. اعتماد Pending يرحل الحقيقي ويعيد تحقق sources/accounts/currency/period. audit actor خادمي. lock order: JournalVoucherAllocation أولًا ثم AmortizationSchedule، كل الكتابات والمصدرguards تحت نفس common allocation lock؛ لا EF parallel علىDbContext واحد. PK/FKs tenant-safe repository والتاريخ محفوظ.

## خطة التنفيذ والتسليم

١- freeze هذا العقد ثم workers مستقلون: backend owns new amortization entities/config/VM/service/controller only؛ frontend owns Amortization folder and its dedicated vocabulary file/guide content only؛ root owns source guards, common route/DI/enum/source navigation registrations, vocabulary registration/guide registration/tsconfig, generated packets, diff review and final integration. ٢- root integrates against exact DTOs في AMORTIZATION_DOMAIN_API_CONTRACT_FREEZE. ٣- source checks only؛ owner migration AddAmortizationWorkspace ثم build/runtime/DB/SQL/timing and concurrent checks. لا runtime أواختبارات/بناء في المهمة.

فهارس: schedule source tenant+sourceID unique filtered live لكل BillDetail/OB؛ runline tenant+schedule+month unique filtered IsReserved=1/live؛ run month+custom lookup index، approvallog run+date+id. هذه correctness keys وتوصيات query shape مدعومة؛ أثر الكتابة/المساحة وتقييمSQL عند المالك. وجودالجداول الجديدة يتطلب migration لا يُولدها الوكيل.

الكاش: sources/schedules/preview/runs/approval/journal/log/PostingSelect/policy operational/direct؛ branch SourceOwner BranchService ونجاحwriters/notifications الحالية، finite bootstrap ثم watch binding وإعادةتحقق عندحفظ custom branch؛ teardown/context/Retry معselectedlabels. لا sourcecache جديد. page reads/save/prepare/export use LoadingService paired finalize؛ body dialogs use local StateMessage واحد؛ no duplicate table indicator.

الحزم: PLAN00 ثم0/1/2/3/4/5/6 بحسب هذا النطاق؛ -Check ناجح قبل الاستخدام. guides بلغةAR/EN ضمنexisting record-list UserGuide. تبقى plans for rejected/void history/oldmanual data apparent بالscreenguide؛ لا unresolved decision يُخفى.
