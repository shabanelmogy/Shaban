| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | no |
| Date | 2026-10-25 |

# تعميم مراجعة سرعة التحميل والاستعلامات والفهارس

طلب المالك إضافة «اختبار سرعة التحميل وتحسين الكويري واقتراح فهارس مناسبة» بشكل عام في الوثائق. النطاق تعليمات وكتب ومهارة وحزم فقط؛ لم يطلب تشغيل قياسات أو تعديل التطبيق أو schema في هذه الرسالة. لا تعديل لقواعد الكاش أو الحسابات أو API أو تشغيل database/browser/build/test/lint/migrations/commit. الحالة تخص اكتمال تعديل الوثائق ومطابقتها، لا نجاح قياس أداء أي شاشة.

## القرار والعقود

يصبح فحص الأداء إلزاميًا ومتناسبًا لكل شاشة جديدة أو مراجعة، داخل artifact الميزة نفسه. يميّز بين صحة مؤشر التحميل، وتصنيف الكاش، والسرعة المقاسة. يبدأ من المسار والمكوّن الفعليين ثم HTTP/query/حجم البيانات/render. تشمل المراجعة فتح الشاشة والبحث والترقيم والتفاصيل والإجراءات والتقرير والتصدير عند وجودها، مع إثبات المصدر والرحلات المتكررة أو التسلسل غير الضروري.

التحسينات المؤكدة تنفذ فقط في نطاق التنفيذ المأذون، مع حفظ tenant/history/live/ledger/financial/state/count/filter/order/page/complete-export. الفحص source-only لا يتحول إلى إذن تشغيل. يسجل before/after فعليًا عند توفر إذنه وأدلته، وإلا يسجل خطة قابلة للتكرار وقياسات owner pending؛ لا وصف أن السرعة اختُبرت دون قياس.

اقتراح الفهرس يحتاج query/table/mapping وcoverage موجودة، وترتيب keys وINCLUDE/filter عند الحاجة، وفائدة متوقعة وتكلفة كتابة/مساحة وoverlap وحالة الاقتراح والتحقق. لا فهرس لكل عمود بحث، ولا uniqueness لتسريع قراءة، ولا تجاهل null/live/history semantics أو تكرار index يغطيه مركب موجود. حالة no-new-index المبررة صحيحة. الاقتراح ليس EF implementation أو فهرسًا مطبقًا؛ المهاجرات والتطبيق وقياس plans/IO تظل ضمن حدود التنفيذ الحالية.

## الملفات والمطابقة

| المالك/الملف | التغيير | دليل المطابقة |
|---|---|---|
| AGENTS.md | بوابة عامة مبكرة وطلب أدلة الأداء والفهارس في التقرير | Master5/7 وUI29 وBE7/2؛ لا تعارض مع source-only أو migration boundary |
| .agents/skills/sigma-screen-refactor/SKILL.md | خلاصة البوابة وجدول concerns وصف revision-history | كل قاعدة تحمل البلوك المالك؛ لا pending-promotion |
| master/05-continuous-quality-gates.md | gate إلزامية متناسبة للمصدر والقياس والكويري والفهارس والمطابقة | تفرق source findings عن runtime acceptance ولا تفرض benchmark framework أو scan شامل |
| master/07-end-to-end-reconciliation-and-final-report.md | تسليم نتائج/خطة before-after وموقف الفهارس | التقرير الحالي يكفي؛ لا ملفات checklist إضافية لكل شاشة |
| backend/07-listvm-scope-rule.md | توسيع inventory من action flags إلى request path كامل مع bounded projection/query work | تحفظ count/page والقيود وترفض توازي EF على context واحد |
| backend/02-step-2-ef-configuration.md | استبدال طلب index للعمود المفلتر تلقائيًا بجدول توصيات مبني على الأدلة | keys/include/filter/overlap/write cost/history/null/uniqueness والتفريق بين proposal وschema source/applied |
| ui/29-verification-expectations.md | خطوات قياس opening/usable/settled/search/detail/export، cold/warm وظروف وعينات ومصدر الأدلة | لا target زمني عام أو percentile غير مسند؛ القياس الفعلي يحتاج إذن التشغيل |
| CHANGELOG.md | تسجيل تعليمات المالك العامة والحدود والتصحيح | متزامن مع الكتب والمهارة |
| templates PHASE00/02/03/05/06 | source inventory ومصفوفة الأداء عند الاكتشاف، واستهلاكها بالقائمة والمحرر والتكامل والتسليم | لا ادعاء performance pass من diff أو مصدر؛ gap المصدر يمنع ادعاء المطابقة |
| recipe-manifest.json | dependencies BE2/7 اللازمة للحزم ذات الصلة | JSON سليم، بلا تكرار؛ الحزم تحمل بصمات المالكين |
| generated PLAN00 وPHASE00..06 | تجديد بالمولد فقط ثم Check | regenerate بعد الكتب/templates/manifest ومراجعة دلالية ثم Check أخير؛ لا تعديل generated يدوي |

المسارات النسبية للكتب والحزم أعلاه تحت:

```text
F:/My Work/Shaban Documents/Shaban/sigma-erp
```

تعليمات المشروع والمهارة والتقرير تحت جذر مساحة العمل. راجعت source diff في مستودع الوثائق والمواضع المحلية غير المملوكة لمستودع التطبيق، وحُفظت التغييرات السابقة. فحص diff --check وmanifest dependencies/JSON وهيكل عناوين template، ومطابقة generated مع owners، وGenerate-SigmaRecipes -Check للحزم الثماني نجحت؛ تحذيرات CRLF فقط. لا source تطبيق جديد أو دليل شاشة يحتاج تحديثًا؛ التعديل لمنهج المراجعة العام فقط. لا migration أو صلاحية أو حساب أو SQL/فهرس فعلي جديد.

المراحل المتناسبة: اكتشاف ملاك القاعدة، تجميد النطاق من طلب المالك، تحرير التعليمات والكتب/المهارة والقوالب، تجديد الحزم ومطابقتها. لا مراحل backend/frontend implementation أو runtime لهذه الرسالة. لم تستخدم subagents لأن تحرير قاعدة واحدة مترابطة بين الكتب والقوالب يجعل التنسيق أطول من التنفيذ ويزيد خطر تعارض النصوص. لا Missing/Conflicting/Uncertain باقٍ في قاعدة الوثائق؛ أدلة الأداء في أي ميزة مستقبلية تسجل حسب حالتها الفعلية.

اقتراح commit للوثائق فقط: `require screen performance audits and evidence-backed index proposals`؛ لم ينفذ commit أو push. التعليمات/المهارة المحلية تحفظ مع حدود الملكية الحالية دون نقلها أو commit لها. لا commands محظورة نُفذت، ولا قياسات قبل/بعد أو runtime ناجحة يُدّعى تنفيذها في هذه المهمة.
