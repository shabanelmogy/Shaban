# عقد تنفيذ تفاصيل تأجير المركبات

## Remove the on-screen Info card — 2026-11-20

At the owner's request, remove the summary card and Info dialog from the screen. Keep the applied month, category, vehicle count and grand total as print-only context using the shared UI21 visibility utility. The report tables, footer totals, Excel and email output retain their existing scope. This replaces the previous on-screen Info placement decision.

## تعديل العرض بطلب المالك — ١٦ نوفمبر ٢٠٢٦

توضيح لاحق: عنوان Current fleet status يظهر في شريط التابات فقط؛ يُحذف العنوان المكرر داخل لوحة الملخص ويبقى توقيت الملخص دون تغيير.

اختار المالك لاحقًا التابات بدل الطي: Rental details وCurrent fleet status بمكوّن EditorTabs المشترك، وكل قسم بعرض التقرير كاملًا. تبقى اللوحتان مركبتين وتخفى غير النشطة بقواعد screen فقط؛ الطباعة تعرضهما معًا. تعيد تعديلات المرشحات/Reset وتغير السياق التاب الأساسي؛ يحتفظ Refresh لنفس المرشحات بالتاب الحالي. التبديل يعيد منفذ تمرير الجدول المحدد للبداية عبر DataTable.scrollToStart بلا طلب جديد. يظل Excel على عقد التقرير الكامل القائم بالأقسام كلها؛ طلب التابات تعديل عرض ولا يغير نطاق التصدير المجمد. يبقى Info آخر الإجماليات وصف البحث الواحد كما طلب المالك؛ وصف الطي التالي سجل القرار السابق الذي استبدله اختيار التابات.

فلاتر الشهر وفئة العقد وأفعال التقرير في صف تحكم واحد بالمالك المشترك inline/stable، مع التجاوب والتحقق الحاليين. يُنقل نص amountBasis القائم من الشريط الظاهر إلى نافذة قراءة مشتركة يفتحها زر Info الأخير في صف الإجماليات؛ لا قراءة أو حساب جديد، وتغلق النافذة عند إبطال النتيجة أو تغير سياق/صلاحية العرض. يضاف في صف الإجماليات قبل Info زر لطي Current fleet status وإظهاره؛ طيه يخفي العمود الجانبي ويترك المساحة للجدول، دون إعادة طلب البيانات. يبدأ الملخص ظاهرًا، وتظل الطباعة كاملة حتى إن كان مطويًا على الشاشة. لا تغيير حقول أو مبالغ أو حسابات أو صلاحيات/منح أو مسارات أو كاش/تحميل أو خلفية أو schema؛ التجميع المحدود مصرح والقبول البصري الحي معلق.

| Item | Value |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-11 |

وافق المالك «نفذ كل التعديلات المطلوبة» ثم فوض اختيار الأقرب في مبلغ اليوم والإجماليات. يوسع هذا تفويض المراجعة السابقة إلى تنفيذ التقرير القائم فقط. UI07/BE5، الجذر discovery/contract/backend/integration، عامل UI مستقل بعد freeze؛ source-only.

## المعنى والأدلة

الصورتان6/7 وSpeed C1087/R0398/C1089 تثبت الشهر وجدول حالات/مبالغ يومية وإجمالي المركبة/كل يوم/العام وعدد المركبات وملخص الحالة وExcel/Email/Refresh. المرجع المسمى VehicleType هو agreementCategories Rental/Lease؛ يغير الاسم في Sigma إلى فئة العقد مع خيار جميع الفئات، ولا نساوي هويات VehicleType بالتصنيفين. الفلتر categoryId:null|1|2؛ نطاق الصفوف كل أسطول المركبات الحية المسموح بها، والتصنيف يحد عقود الإيجار المساهمة فقط لأن Vehicle لا يملك Rental/Lease category. يوضح ذلك بالدليل.

اختيار المالك المفوض: مبلغ اليوم هو حصة مبلغ بند الإيجار المحفوظ TotalCharge على كامل مدة العقد حسب ticks التشغيل الفعلية، قبل الضريبة والإضافات والخصم العام غير المسند للبند؛ ليس إيراد journal بتاريخه ولا تسعيرًا جديدًا. عقد Rental يستعمل DateAndTime..ReturnDateAndTime، Lease DateAndTime..EndDate، half-open. يتطلب بند Rent حي/selected واحدًا، scale صحيحًا ومبلغًا ضمن policy؛ يستخدم FinancialNumberPolicy.AllocateProportionally لتوزيع كامل العقد على أيامه المحلية الحسابية دون timezone conversion، ثم يقرأ الشهر فقط لتبقى حصة اليوم مستقلة عن شهر العرض. حد36600 يوم للعقد لمنع توزيع غير محدود، وإلا amount=null+invalidRent. لا rates من tariff أو إعادة ضرب monthlyprice. هذه معلومة تحليلية من مبلغ العقد الحالي وليست snapshot محاسبيًا تاريخيًا، ولا أثر على مستند أو posting.

كل المجاميع صافي يشمل السالب بقرار التفويض، لا نسخ asymmetry موجبات الصف/صافي اليوم في Speed. backend فقط يملك totals؛ عند unknown contribution يبقى total المعني null ويظهر سبب. لا توزيع لخصم عام/ضريبة أو تحويل عملة. قاعدة العملة base مثبتة Currency واحدة؛ مبالغ BookingCharge بالموديل بلا CurrencyId مستقل، ولذلك التقرير يشرح أساس العملة. لا تخلط عملات مستندات فواتير.

توضيح خوارزمي عند المصالحة: يمرر مقدار بند Rent المطلق إلى shared AllocateProportionally ثم يعيد إشارته لكل حصة، للاستفادة من حماية الباقي الموجب مع منع إنتاج يوم موجب من بند سالب صغير موزع على أيام كثيرة. لا يغير الصافي أو التقريب أو حدود مدة العقد. إجماليات التذييل تخص كامل نتيجة الشهر/الفئة، لا تعاد مع التصفية المحلية أو صفحات الجدول، ويوضح ذلك بالعرض والدليل.

حالة اليوم آخر حالة/حدث مسجل قبل نهاية اليوم، من VehicleStatus.CreatedAt ثم الحركات ذات التاريخ الفعلي NRM/Workshop/Collection/Custody/Delivery (الـstatus timestamp هو وقت التسجيل، لا اختراع effective date). rental active interval يظهر hired، booking live غير inactive وNew/Confirmed فقط يظهر reservation عند غياب عقد؛ غياب history = unknown وليس available مصطنع. Overlap عقود أو حالة متساوية التاريخ متعارضة = amount null/overlap أو status unknown مع issue. التاريخ المثبت في الحركات أولى من status log إذا timestamp متساوٍ؟ لتفادي التخمين tie مختلف الحالة=unknown. إسناد العقد VehicleId الحالي إن لم تكن له replacements؛ Lease مع replacements بالمصدر لا يُسند للمركبة الحالية تخمينًا، يظهر attributionUnavailable في days للمركبات المتصلة ويمنع مبلغًا خاطئًا، لا كتابة backfill. نشر قيد عدم دعم reconstruction تاريخية كامل بدل ادعائها.

ملخص الحالات CURRENT آخر VehicleStatus لكل مركبة من نفس population، count للمركبات لا vehicle-days، SummaryAsOfDate يوضح توقيته، وهذا يطابق طلب Speed summary بلا شهر. الخلايا الشهرية تحليل مستقل. تشمل Unknown، كل ملخص sourcebackend مع نسب وإجمالي Count.

## API المشترك

GET VehicleReports/VehicleRentalDetails موجود read permission VehicleReports.CreateVehicleRentalDetailsReport؛ query monthKey=yyyy-MM required وcategoryId nullable1/2. الشهر المحلي الصارم parseلاDate.ToString، أيام الشهر الفعلية. GET VehicleReports/VehicleRentalDetailsExport نفسالعقد بإذن مستقل. POST VehicleReports/VehicleRentalDetailsEmail filter+to email address، يعيد Result، bodyserverderived، لا HTML موثوق من العميل.

Result<VehicleRentalDetailsReportVm>. entity:
monthKey:string,days:number[],currencyCode:string,decimalPlaces:number,summaryAsOfDate:string,vehicleCount:number,rows:VehicleRentalDetailsRowVm[],statusSummary:VehicleStatusSummaryVm[],dayTotals:VehicleRentalDayTotalVm[],grandTotal:string|null.
Row: vehicleId:number,plateNo:string,makeAndModel:string,cells:VehicleRentalDayCellVm[],total:string|null.
Cell: day:number,status:string,amount:string|null,issue:string|null.
DayTotal: day:number,amount:string|null.
Summary: status:string,count:number,percentage:number(0..100).
status stable codes: available,hired,reservation,nrm,workshop,collection,custody,delivery,notReady,forSale,defleeted,totalLoss,sold,unknown؛ أخرى mapunknown واضح. issue:invalidRent,overlap,attributionUnavailable. amount is string via converter, no NaN/number money. جميع rows ودقة وتذييل ثابت server، لا slicingفيالخادم ولا جمعFE.

Filter monthKey/categoryId، emptycategory=all. اختيار الشهر الحاليdefault. Categories محلية ثابتة 1Rental2Lease بلا network lookup/cache. no VehicleType CRUD أو statusfakeendpoint. Current history المالي/الدليل يشرح حدود المصدر.

## الشكل والعمر والمخرجات

ReportPage/FeatureTitle/ReportActions/PrimaryActionButton/DataTable/StateMessage/ReportPrintSession، typedform appDatePicker viewmonth. عمودplateNo/makeAndModel ثم1..N بخلايا مبلغموجود أوstatusمترجم، ثمtotal؛ dynamic columns منresponse.days. footer/summary areaيعرضvehicleCount وdayTotals وgrandTotal دونجمعFE، complete print/export لكلsource rows/summary/totals بغض النظرpage. dataKeyvehicleId، noTreeNode/accounts/children، noaccumulation.

إلغاءعندfilter/access/dataContext/session/destroy، visibleowner readprogress global defer/finalize، Bootstrapلاnetworkcategories، false-envelope/HTTP errors+Retry، قراءةمرةتستبدلarray، appliedfilteroutput. route read؛ Excel read+VehicleReports.VehicleRentalDetailsExport؛ Email read+VehicleReports.VehicleRentalDetailsEmail؛ server prerequisiteللعمليتينRead وتصنيفReportEffects. لا منح تلقائي.

Email editor dialogshared يجمع عنوانمستلمواحد معemailvalidator، يشرحfreshcomplete report ويمنعrepeatwhilebusy. خدمةMessageDeliveryService موجودة ترسلSMTPوتكتبMessageLog؛ settingsSettingsEmailSmtpModel صفوحيدحيبالمستأجر، nodataexposure. لا إرسالفعليأثناءالتنفيذ. النتيجة uncertain بعدattemptغيرمؤكدلاتعادآليًا؛ sentPOST مستقلعنتدميرdialog/context ويمنعنشرقديم عبرownercontext. لا durableidempotencyمخترعبلاسكيما؛ userrepeatmanual بعدuncertainيتطلبقرارمنواجهةقبلsendمرةأخرىأوإغلاقالdialog. helperowner reusedلاEmailHelperجديدفيالميزة.

## التنفيذ والتفويض

الجذرbackendDTO/policy/service/controller/permissions/email/resources/wiring/translations/tsconfig/reconciliation. عاملUIيملكReports/VehicleRentalDetails/** وUserGuide/content/vehicle-rental-details-topic.ts فقط؛ يزيلsourcefake statusفقطإذالاconsumerخارجي. يسلّمtranslationJSONولايلمسshared/routes/vocabs/backend. عاملتدقيقbackendreadonlyلاحقعندالحاجة. يحفظالجميعpeerchanges. المراحل0/1/2/5/6 وdialogemailمن3بلامستندماليأوschema؛ no riskyfinancialtransition. مواصفاتsourceمكتوبةعندالحاجةدونتشغيل. لاbuild/test/lint/browser/database/migration/snapshot/commit/push/deploy أوSigmaMCP/Graphify. لاschemaمطلوببالتقرير. تشغيلSMTPمرجعيأول مرةعندالمالكبإذنمستقل، لايُدعىقبولspeedأوحسابخادمهالمجهول.


## استكمال عقد تذييل الملخص — نفس التفويض، ٢٠٢٦-١١-١١

الصورة6 تثبت صف إجمالي العدد والنسبة داخل جدول الملخص أيضًا. أضيف حقل statusSummaryTotal:VehicleStatusSummaryVm {status:"total",count:vehicleCount,percentage:100 أو0 إن كان الأسطول فارغًا} من الخادم. لا يعد صف حالة إضافيًا داخل population، ويعرض عبر footerRows مستقلًا عن body ويصدر معالملخص ويضمنEmail. لا تجمعه الواجهة أو يدخل countsمرتين. بقية العقد ثابتة. تذييل الجدول المشترك اختير وفق الخطة Frozen الخاصة به لمنع secondgrid غيرمصطف.
