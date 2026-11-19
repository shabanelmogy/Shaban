# عقد تقرير التحصيل حسب العميل

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| Date | 2026-11-18 |
| Tier / shape | M، UI07 / BE17 |
| Scope | Reports/CustomerWiseCollection |

طلب المالك مراجعة وتنفيذ التقرير وفق الصورة. تتطابق الأعمدة الستة بهذا الترتيب code/customerName/email/collections/refunds/netAmount. الفلاتر fromDate/toDate/branchId/customerType. النوع هو CustomerTypeIC في Sigma، Individual=0 وCompany=1، ويطابق PartnerType للفرد والشركة صراحةً. Code هو Partner.No وفق مالك تقارير العملاء CustomerService. تصنيف Customer.CustomerType (Self/Staff/Other) لا يمثل اختيار الصورة.

التقرير يلخص مصادر Collection And Refunds Report 2 المعتمدة. Collections مبالغ سندات القبض المؤهلة للعميل، بما يشمل قبض الوديعة مرة واحدة. Refunds مبالغ صرف العميل وردود ودائعه موجبة في عمود الرد، والصافي Collections ناقص Refunds. يستبعد سند استعمال الوديعة والمستند المبطل وغير المرحل، ومدفوعات المورد والرواتب والأقساط. يطابق العميل CustomerId ثم ContactId في القبض وفق مالك التخصيص، ومعرّف العميل المحفوظ في الصرف والرد. يشمل فقط طرفًا من نوع فرد أو شركة، ويجمع بالهوية مع العملة لا بالاسم. يبقى صف العميل الذي له رد فقط أو صافي صفر. لا إنشاء مستند أو schema أو كتابة بيانات.

يستخرج شرط صرف العميل القائم في CollectionRefundDetailReportService إلى مالك CollectionReportSourceQueries المشترك، مع الحفاظ على عقد التقرير الثاني. تبقى استبعادات الشركة في قراءات هوية منفصلة، وتبقى الصفوف والخيارات والإجماليات مقيدة بفروع السندات عبر QueryReport. تستخدم القراءة مجاميع SQL لكل مصدر/عميل/عملة مع تحقق دليل العملة والمبلغ قبل إخفاء أي تعارض بالتجميع. تستعمل الإجماليات SumCurrencyReadAmounts، وتفصل العملات ودقتها. كود العميل واسمه وبريده الحالي من Partner المقيد بالشركة للعميل الذي توجد له حركة مسموحة.

المتحكم CustomerCollectionReports وله GET Read/Options/Print/Export. الأولان بمنحة Read، وتحتاج Print/Export منحتي الإجراء والقراءة. يعد مالك EffectReads. الرد Result<CustomerCollectionReportVm> يحتوي fromDate/toDate/sections. القسم currencyId/currencyCode/decimalPlaces/rows/total. الصف customerId عدد صحيح خارج العرض، code/customerName/email نصوص، collections/refunds/netAmount نصوص مالية دقيقة في JSON. total بنفس شكل الصف، وتعرضه الواجهة كـfooter مستقل عن عدد الصفوف والتصفية والصفحات. الرد كامل. Options يرجع Result<CustomerCollectionReportOptionsVm> بداخل entity.branches كقائمة id/name. CustomerType اختياران محليان مترجمان وفق المجال الثابت، وكل branch من المصادر المالية المسموحة. لا تحميل لقائمة جميع العملاء لتوفير النوع.

تستخدم الواجهة المكون والمسار القائمين، مع ReportPage وDataTable وReportActions وFeatureTitle. يوسع مالك دورة تقرير التحصيل المشترك باستخراج دورة القراءة/الأذونات/التحميل/إبطال السياق/الطباعة المشتركة مع الحفاظ على واجهة createCollectionReportState للمستهلكين الثلاثة القائمين. يحتفظ كل تقرير بنموذجه ومرشحاته. لا توضع customerType داخل salesPersonId ولا تعرض حقول إضافية لملاءمة المالك المشترك. يقرأ كل إخراج النتيجة الكاملة، ويطبع كل العملات ويصدر Excel بالأعمدة الستة فقط مع هويات العملة والفترة في صفوف تحت الأعمدة النصية القائمة. الأخطاء مختصرة في الفلاتر دون شروحات داخل الجدول.

الجذر يملك العقد والربط والصلاحيات والترجمات والدليل والتحقق. وكيل الواجهة يملك CustomerWiseCollection وReports/shared/collection-report-state.ts وأي مالك دورة قراءة مستخرج تحت Reports/shared فقط. وكيل الخلفية يملك DTOs/interface/service/controller الجديدة وCollectionReportSourceQueries وشرط صرف التقرير الثاني المتأثر باستخراجه ومواصفات الخادم. لا تداخل في الملفات. الفحص والبناء مسموحان، واختبارات التشغيل والمتصفح وقبول SQL الفعلي معلقة.
