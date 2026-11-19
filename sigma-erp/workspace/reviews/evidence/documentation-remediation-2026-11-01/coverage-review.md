# مراجعة تغطية الموجّه المختصر

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التاريخ | ٢٠٢٦-١١-٠١ |
| النطاق | قراءة المهارة الجديدة والسابقة كاملتين، ثم مقارنة دلالية انتقائية بمقاطع الكتب المالكة |
| النتيجة | لا قاعدة تنفيذية ثبت فقد مالكها الحي، ولا concern بلا مسار، ولا تعارض تفويض مؤثر بين نقطة الدخول والملف الحي |

أجرى المراجعة مساعد مستقل عن محرر الموجّه. النسخة القديمة قُرئت كدليل تاريخي محدد لهذه المهمة فقط، لا كتعليمات سارية. لم يُفحص مصدر التطبيق، ولم تُعد فحوص الجذر للروابط والبصمات والحزم. هذا الجدول سجل المقاطع التي قورنت، وليس ادعاء مقارنة كل فقرة في الكتب أو كل مستهلك تطبيقي.

| مجموعة القواعد السابقة | المالك الحي المختار من الموجّه | أمثلة التفاصيل المقروءة والمقارنة |
|---|---|---|
| التفويض والمراحل والافتراضات | الملف الحي؛ Master1/3/4/7 | مراجعة فقط، توقف الخطة، المرحلة المحددة، التوقف المحصور بالقرار المادي |
| التفويض المتعدد | الملف الحي؛ Controlled multi-agent strategy | اكتشاف وتجميد الجذر، ملكية مستقلة، المصالحة وقيود المساعدين |
| التناسب والمرجع المحلي | Master1/2/4/7 | Tier S، analysis-guide، reference-cycle، matched/partial/missing، عدم استنباط الخادم |
| الأداء والفهارس | Master5/7؛ UI29؛ BE2/7 | query boundaries، القياس البارد والدافئ، المصدر مقابل SQL، كلفة الفهرس والتحقق المتبقي |
| الحفظ والترقيم والاستعلام | BE7، المقاطع 23–76 و144–181 | DTO projection، first-match، filtered Includes/lambda، CodeCreateService، hidden per-row، منع parallel EF |
| الكاش وتصنيف المصدر | UI2، المقاطع 5–20 و433–567 | URL/service، opt-in/direct، bootstrap/watch، defaultIfEmpty، labels/context/Retry/teardown |
| الكتابة والاستيراد والمتابعة | UI2، المقاطع 268–423 | savedRows موجب، partial failure، Customer/ContactGroup، dependency، hidden→visible، TTL/realtime |
| استثناءات العرض والسياسة | UI2، المقاطع 182–245 و572–607؛ UI22 | Partner/GetCurrency، سياسة مالية مباشرة، Dashboard 60s، contextChanges وRetry |
| التحميل وعمر الطلب | UI22، المقاطع 5–112 و348–428 | visible host، page/dialog/silent، leases/providers، query/fragment، استقلال الكتابة |
| مظهر التحميل | UI22، المقاطع 290–341 | 160/56px، حلقة28px، loading-card، label/title، no inner scrollbar |
| الهيكل والقائمة الجانبية | UI1، المقاطع 185–295 و418–517؛ UI29 | route host، full-width، working composition، leaf scroll، group reveal، remount/gutter |
| اعتماد أنجولار والجلسة | UI1، المقاطع 819–878؛ UI22/28 | Angular21 gate، standalone، Signal Forms experimental، Zone، HttpClient، sign-out/stale session |
| القائمة والمرشحات والإخراج | UI6/7/8؛ BE9 | singleActionAsIcon، percentage، generic ListQuery، No value/Clear، int?، completeListRows |
| المحرر والأبناء والتأكيد | UI9/10/13/15/28 | إلغاء التأكيد الخاص، closed(saved)، canDeactivate، pure-view، stable IDs وRetry |
| التبويبات والارتفاع والقراءة | UI13، المقاطع 424–527 و616–646 و1087–1100 | horizontal/vertical، mounted panels، auto-basis/definite height، approval adapter، first activation |
| الجداول والمستندات | UI14، المقاطع 248–264 و424–493؛ UI18، المقاطع 95–103 | sigma-print-flow، None selector، fitWidth، 640/400px، composite details، toolbar، عرض1680 وتواريخ180 |
| الأرقام | UI14/19؛ BE18، المقاطع 48–63 | scale6، HasValidScale، رفض المدخل، coefficient/remainder، previewTax، استقلال المال والصحيح |
| التقارير والملخصات والطباعة | UI20/21؛ UI6؛ BE17 | SummaryCardValueDirective، wide/withActions/inlineFilterActions، incremental/complete، cancelPending |
| سياق القراءة والكتابة | UI28، المقاطع 5–18؛ UI21، المقاطع 48–58 | context revision، composed reads، confirmation القديم، استقلال الكتابة، prepared rows |
| مصدر السطر والتحويلات | UI13؛ BE14، المقاطع 51–178 | SourceDocumentPicker، retainOnBack/discardBaseline، detail-only، ItemRequisitionSourceQuery، legacy disjoint، discount shares |
| الأثر المالي والدورة | BE15، المقاطع 54–72 و511–552؛ BE18، المقاطع 214–265 | allowCreate:false، override، physical return/credit، tracked snapshots، approval/reasons، capacity/reservation |
| الإعدادات والتقارير ونتائج الدفعة | BE3/10/16/17 | terminal outcome، classification/posting، tenant singleton، no GET seed، bottom-up، cash diagnostics |
| المظهر والاختيارات | UI4/16/24 | checkbox tracks، virtual38px، MultiSelect tracks، p-button، PendingMotion، scrollbar |
| التسليم والأرشفة | Master5/7/8؛ الملف الحي | namespace/project، scoped diff، bilingual guide، compact router، mandatory live companion |

قرئت مقدمة الملف الحي مع نصه المنقول. الإشارات السابقة إلى نقطة الدخول داخل النص تُفسر بالمقدمة الجديدة على أنها مجموعة التعليمات المكونة من المدخل والملحق، فلا تُنشئ سلطة أرشيف أو نقطة دخول منافسة. لم تُسجل ملاحظة تستدعي تعديلًا بعد هذه المقارنة.
