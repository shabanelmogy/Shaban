# خطة تذييل الجدول المشترك لتفاصيل التأجير

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-11-11 |

طلب المالك تنفيذ كل التعديلات والصورة7 تثبت إجماليات بنفس أعمدة الأيام. UI6/20 وMaster5 يوجبان توسيع قدرة الجدول المشترك الناقصة. الخطة محصورة في capability إضافية، لا إعادة هيكلة مستهلكين أو تغيير حسابات/منح. الجذر يملك shared وحده، والواجهة تتبناه فورًا.

| البديل | الأثر | القرار |
|---|---|---|
| جدول إجماليات مستقل | headers وscroll مستقلان لا يضمنان اصطفاف الأيام | يستبدل في شريحة التأجير |
| footerRows typed في DataTable | tfoot في الجدول نفسه، format قائم بلا إعادة جمع | المعتمد |
| تقرير native table خاص | ينافس المالك المعتمد | مستبعد |

العقد: @Input footerRows:ReadonlyArray<T>=[]؛ صفوف جاهزة من backend owner، خارج الفرز/التصفية/الترقيم/selection/actions/hierarchy. نفس columns/width/classes وdisplayValue formatter فقط؛ لا روابط/interactive cellTemplate في التذييل. خلايا فارغة لselection/actions تحفظ عدد الأعمدة. لا callback جديد أو operation أو حساب أو cache. لا effect على مستهلك defaultempty، ولا فرق فيdataset/count/page. أول عمود rendered يتبع sticky existing shared owner بما فيهfooter. الطباعة تستخدم نفسfooter، scrollablefalse/printAllRows وsigma-print-flow مالكها القائم. لا palette أو scrollbar خاص.

التنفيذ: إضافة Input/template وأقل SCSS لازم في shared DataTable؛ كتابة source spec يحفظ footerخارجdata؛ عاملواجهةيتبناهبدلsecondtable؛ توثيق UI6 ورouting/revision row مهارة Sigma، ثم generatorللحزم المتأثرة+semanticreview+Check. أصل featurefreeze مستمر بالمالكيالمالي نفسه. لا migration أو data أو writes. لا تنفيذ build/test/lint/browser/DB. Source parser/diff/contract checks فقط، runtime columnalignment/RTL/themes/print/pagination/selection acceptanceعندالمالك.

المصالحة: نُفذ Input الافتراضي الفارغ وPrimeNG #footer في نفس الجدول، formatter والأعمدة نفسها، خلايا alignment غير تفاعلية وsticky/print عبر الأنماط القائمة. تبناه جدول المصفوفة وملخص الحالات مع authoritative summaryTotal، دون زيادة value/count أو جمع في الواجهة. كتبت حالتا source specification دون تشغيل. حدث UI6 ورابط المهارة وصف المراجعة بتاريخ2026-11-11، وجددت الحزم عبر generator ثم Check أعاد8/8OK. template parser وPrimeNG usage metadata بلا أخطاء؛ القبول المرئي/التشغيلي ما زال معلقًا. لا توسيع لأي مستهلك غير مطلوب.
