# خطة تنفيذ إدارة اللغات ونصوص الترجمة من قاعدة البيانات

| البند | القيمة |
|---|---|
| Status | Frozen |
| Owner verification pending | yes |
| تاريخ الخطة | 2026-10-14 |
| بوابة التنفيذ | معتمدة صراحة بتاريخ 2026-10-17؛ سجل الانتظار السابق محفوظ أدناه |
| نطاق الطلب | الخاصية كاملة كما في الصور: اللغات، الافتراضية، نصوص الترجمة، المحرر، التخزين، والقراءة الفعلية |

## 1. النتيجة المطلوبة وبوابة الموافقة

بعد التنفيذ يستطيع المستخدم إضافة لغة، تحديد لغة افتراضية لاشتراكه، فتح «تغيير النصوص»، اختيار لغة أساس ولغة هدف ومصدر، البحث وعرض النصوص الفارغة، ثم حفظ ترجمة مفتاح أو الانتقال بين المفاتيح. النص المحفوظ يظهر فعليًا في واجهة Sigma، وتستخدم رسائل الخادم المصدر المناسب أيضًا.

القراءة الأساسية بعد الدخول ستكون من API يعيد **قاموسًا محلولًا من قاعدة البيانات**، وليس شاشة تحرير منفصلة عن ترجمة التطبيق. تحتفظ الملفات بدور المرجع الأصلي، والتشغيل قبل الدخول، والتعافي عند تعذر قراءة قاعدة البيانات. لا يحذف التنفيذ ملفات القاموس ولا يكتب تعديلات المستخدم في ملفات المصدر.

الموافقة المقترحة تعتمد القرارات D1–D8 أدناه وتسمح بإكمال جميع شرائح التنفيذ. حتى ذلك الوقت هذه خطة Draft وليست عقدًا Frozen. تعليمات المالك الأخيرة «اكتب الخطة وانتظر من الموافقة» هي سبب التوقف؛ ليس هناك طلب إذن إضافي لتعديلات روتينية.

التعديلات السابقة لوحدة Languages محفوظة في شجرة العمل، لكنها **مسودة تحتاج مصالحة**؛ لم تُفعّل الخاصية الجديدة ولم تُضف جداولها أو API أو تحميلها من قاعدة البيانات. لا تُعامل وثيقة المراجعة السابقة على أنها قبول نهائي. راجع `LANGUAGES_FEATURE_REVIEW.md` لسجل التصحيح و`LANGUAGES_FRONTEND_CONTRACT_FREEZE.md` للعقد التاريخي المحدود.

## 2. مصادر السلطة والمراجع

- `F:/My Work/Sigma/AGENTS.md`، المهارة `.agents/skills/sigma-screen-refactor/SKILL.md`، Master1–8، وPLAN-00.
- UI1–10،13،15–16،19،22–29؛ قائمة اللغات وقائمة النصوص من نوع01: shared DataTable مع محرر حواري، لا شاشة تقارير ولا مستند مالي.
- المرجع المعتمد للقائمة: `Workshop/Job/components/list`؛ مالك المحرر: `shared/components/editor-dialog` وUI13. مرجع الـAPI العام: `BranchService`/BE13؛ إعداد الافتراضية يتبع BE16 ومالك `IServiceHelper`؛ النصوص إعدادات مفتاحية ذات قراءة مركبة، وليست CRUD يتيح إنشاء مفاتيح عشوائية.
- فحص `Generate-SigmaRecipes.ps1 -Check` نجح لكل الحزم الثماني قبل هذه الخطة. لا تعديل للحزم أو الكتب مطلوب في مرحلة التخطيط. الدروس العامة التي تثبت أثناء التنفيذ ستحدّث الكتاب والمهارة والحزم في المهمة نفسها.

## 3. Existing-State Inventory — ما الموجود الآن؟

| المجال | المالك/المصدر الحالي | السلوك المثبت | الفجوة |
|---|---|---|---|
| لغات الواجهة | `AppComponent` + `i18n/vocabs/{en,ar,ch,es,jp,de,fr}.ts` | تحميل القواميس إلى ngx-translate عند إنشاء التطبيق | لا قراءة لترجمات الاشتراك من API |
| خدمة الترجمة | `i18n/translation.service.ts` | `loadTranslations`, `setLanguage`, fallback إنجليزي، تخزين اختيار في localStorage | لا نسخة أصلية مستقلة/قاموس DB/إبطال تحميل حسب الاشتراك |
| قائمة اللغات | `Administration/Languages` | اسم وعلم وعمليات عامة؛ الواجهة قيد إعادة الهيكلة | لا كود ثقافة محفوظ ولا لغة افتراضية ولا قفل مدمج ولا نصوص |
| التخزين | `Helpers/Models/Language.cs` و`LanguageConfig` | LanguageName وFlag فوق EntityBase؛ نطاق اشتراك | لا جدول مفاتيح/قيم/تخصيصات أو إعداد افتراضية |
| Language API | `LanguageController`, `LanguageService`, `ILanguageService` | الخدمة والكونترولر يرثان العمليات العامة؛ لا override خاص | لا خيارات مترابطة ولا نصوص أو تحميل runtime |
| اختيار لغة بعد الدخول | `header/navbar/navbar.component.ts` | قائمة محلية ثابتة من سبع لغات | لا تظهر لغة أضافها المستخدم |
| اختيار لغة قبل الدخول | `auth/auth.component.ts` | سبع لغات ثابتة دون سياق اشتراك موثوق | يجب إبقاء الملفات قبل المصادقة؛ لا كشف لتخصيصات اشتراكات أخرى |
| رسائل API | `Helpers/Localization/Shared/GeneralMessage.*.resx`, `MockDataMessage.*.resx` | IStringLocalizer وResourceManager؛ إنجليزي وعربي | إضافة UI API وحدها لا تغيّر رسائل الخادم |
| ثقافة الطلب | `token.interceptor`/`api-request.ts` و`DependencyResolver` | العربية ar-SA؛ غير العربية en-US؛ ثقافتان مسجلتان | دعم اللغات الجديدة يحتاج توافقًا بين الطرفين |
| Tenant/Auth | Repository وtokenInterceptor | الاشتراك من المصادقة؛ HttpClient جذري واحد | لا API صلاحيات أو permission service؛ لا اختراعه هنا |
| Shared editor footer | `EditorDialogComponent` | Cancel/Save/Edit وSave-and-Print | لا Previous/Save-and-Next؛ يجب توسيع المالك المشترك بدل إساءة استخدام زر الطباعة |
| الدليل | UserGuide/Administration | قارئ عربي/إنجليزي ومشترك، ومسودة موضوع Languages | يلزم تحديثه بالدورة النهائية كاملة |

ملاحظة مصدرية: القواميس في هذا المستودع ملفات TypeScript مصدّرة إلى ngx-translate؛ قد تبدو وقت التشغيل ككائنات JSON. النقل المقترح لا يعتمد على كون ملفها الأصلي JSON.

**قياس مصدري للنسخة الحالية فقط:** فحص AST للملفات دون تنفيذها وجد 15,178 قيمة EN و14,136 AR، و967 ZH و966 ES و964 JA و960 DE و974 FR: إجمالي34,145 قيمة، وليس عدد مفاتيح فريدة. أكبر مفتاح94 حرفًا وأكبر قيمة294 حرفًا. لا duplicate property أو تعبير غير حرفي أو نص HTML ظاهر في هذه العينة. GeneralMessage يحتوي1,194 قيمة لكل من EN/AR؛ MockDataMessage يحتوي8 لكل لغة. يعاد استخراج القياس عند التنفيذ لأن شجرة العمل تتغير؛ هذه ليست حدودًا تجارية ولا إثباتًا للبناء.

## 4. Functional Evidence — الصور والسلوك المطلوب

الصور مرجع وظيفي، وليست مرجع الألوان والمقاسات والمكتبات. اللغة EN والاتجاه LTR واضحان؛ تاريخ الالتقاط وإصدار النظام ودور المستخدم Unknown.

| Evidence ID/الصورة | التصنيف | المتطلب | التنفيذ المقترح |
|---|---|---|---|
| E0 Languages2.PNG السابقة | Explicit | Language/Flag، Create، Cancel/Save | نفس الحقول مع الكود الناتج والتحقق، shared modal |
| E1 1.PNG | Explicit | Name/Code/Creation Time، Change texts، Set as default، لغة افتراضية واحدة | قائمة مشتركة؛ كود محفوظ؛ إعداد افتراضية خاص بالاشتراك؛ فتح النصوص بلغة الهدف محددة |
| E1 1.PNG، الملاحظة | Explicit note | منع تعديل/حذف تعريف المدمج والسماح بتعديل نصوصه | قرار D4 يحتاج اعتماد المالك؛ enforce بالخادم وبالواجهة |
| E2 2.PNG | Explicit | Key/Base Value/Target Value وEdit، البحث وRefresh، paging | DataTable مشترك بقراءة server-paged وعدد فعلي، Actions أولًا وفق UI5 |
| E3 3.PNG | Explicit | اختيار لغة أساس مع بحث | خيارات من مالك اللغات، لا قائمة منفصلة |
| E4 4.PNG | Explicit | اختيار لغة هدف مع بحث | نفس المصدر؛ حفظ الكود الحقيقي وعدم تحويله إلى علم |
| E5 5.PNG | Explicit | فلتر Source | مصادر Sigma الحقيقية في D5؛ لا نقل Abp/AbpWeb/AbpZero/Speed كأسماء وهمية |
| E6 6.PNG | Explicit | Target value: All/Empty ones | Empty تعني القيمة المباشرة قبل fallback حتى لا تخفي الإنجليزية النواقص |
| E7 7.PNG | Explicit | مفتاح read-only، نص الأساس read-only، ترجمة الهدف multiline، Previous/Cancel/Save&Close/Save&Next | controlled EditorDialog، تأكيد تجاهل فقط عند ترك تعديل غير محفوظ |
| تسلسل E1–E7 + طلب «كاملة» | Strong inference approved workflow scope | المحفوظ يؤثر في قارئ الواجهة والخادم | runtime slices إلزامية وليست مجرد واجهة إدارة |

## 5. خيارات التخزين والقرار الموصى به

| الخيار | ماذا يقرأ التطبيق؟ | الصيانة والتوافق | القرار |
|---|---|---|---|
| ملفات أصلية + تخصيصات DB فقط | ملفات ثم override API | الأقل حجمًا؛ القيمة غير المعدلة تظل آتية مباشرة من الملف | صالح؛ لكنه أقل وضوحًا لطلب القراءة الكاملة من DB |
| نقل جميع النصوص إلى DB وترك الملفات | DB فقط، بما فيه قبل الدخول | يتطلب قراءة عامة/سياق اشتراك قبل المصادقة؛ تعطل DB قد يمنع نصوص الدخول | لا أوصي به |
| **Baseline في DB + تخصيصات اشتراك + ملفات مرجعية/تعافٍ** | **بعد الدخول: API يحل القيم من DB. قبل الدخول وعند الفشل: ملفات أصلية** | مفاتيح المصدر تبقى معلومة؛ import للإصدارات الجديدة؛ تخصيصات المستخدم لا تُكتب فوقها | **D1 — الموصى به** |

طبقات القيمة الفعلية: تخصيص غير فارغ للغة المختارة → baseline غير فارغ لتلك اللغة → تخصيص/baseline اللغة الافتراضية → baseline الإنجليزية → المفتاح عند غياب جميع القيم. عندما تكون لغة الافتراضية نفسها ناقصة لا يوجد تكرار/حلقة؛ الإنجليزية هي fallback نهائي ثابت. في شاشة الإدارة تعرض `Target Value` القيمة المباشرة للغة الهدف، لا القيمة الناتجة عن fallback. تعرض قيمة الأساس المباشرة مع إشارة للغياب، دون اختراع قيمة.

## 6. Logic Ambiguity / Decision Review — قرارات الموافقة

| القرار | الاقتراح المحدد | الدليل/السبب | الحالة |
|---|---|---|---|
| D1 التخزين/runtime | Baseline DB + Tenant overrides + الملفات للتشغيل قبل الدخول/التعافي | طلب القراءة من DB، مالك ngx-translate الحالي | Proposed — الموافقة على الخطة تعتمد هذا الاختيار |
| D2 نطاق التخصيص | خاص بكل اشتراك؛ baseline عالمي read-only صادر من الكود | Language الحالي tenant-scoped؛ لا تغيير نصوص اشتراك آخر | Proposed |
| D3 اللغة الافتراضية | واحدة لكل اشتراك، en عندما لا توجد قيمة محفوظة؛ الاختيار الشخصي الصريح يتقدم عليها | الصورة تظهر English(Default) والمصدر يملك fallback en | Proposed |
| D4 تعريفات المدمج | en/ar/zh/es/ja/de/fr تعريفات مدمجة محمية؛ نصوصها قابلة للتخصيص. لغة المستخدم قابلة للتعديل/الحذف بعد فحص الاستخدام | E1 يطلب قفلًا؛ قفل الوصول يحتاج اعتمادًا صريحًا | **انتظار اعتماد**؛ الموافقة على الخطة تشمل القفل أو يذكر المالك استثناءه |
| D5 المصادر | Sigma.UI وSigma.API.GeneralMessages وSigma.API.MockDataMessages | المصادر الحقيقية التي تم العثور عليها؛ لا أسماء Abp وهمية | Proposed |
| D6 فارغ/Reset | حفظ النص الفارغ يعني «بلا ترجمة مباشرة» ويستخدم fallback؛ إجراء واضح «استعادة النص الأصلي» يزيل تخصيص مفتاح واحد فقط بعد تأكيد | Empty ones بالصورة؛ الاستعادة امتداد موصى به، لا حذف جماعي | Proposed؛ الاستعادة غير مطلوبة للصورة ولكن مفيدة للتعافي |
| D7 التنقل | Save&Next يحفظ ثم يتحرك؛ Previous يتحرك دون حفظ ويطلب discard إذا تغيّر النص؛ نهايات القائمة تعطل الحركة | E7 لا يثبت auto-save للسابق؛ اختيار محافظ | Proposed |
| D8 بيانات قديمة | لا حذف/دمج تلقائي لأي Language موجود. mapping للأسماء المعروفة فقط؛ المختلف/المكرر يبقى محفوظًا ويظهر في تقرير تعارض قبل فرض unique/backfill | حماية البيانات وعدم تخمين code عند عدم وجود دليل | Proposed؛ أي تنظيف أو إعادة كتابة متعارضة يحتاج قرارًا منفصلًا |

إن غيّر المالك خيارًا سنحدّث هذا القرار صراحة قبل تجميد العقود. لا تسمح الموافقة بتدمير بيانات قائمة، أو إضافة نظام صلاحيات جديد، أو تشغيل migrations، أو commit/push/deploy.

## 7. نموذج البيانات المقترح

أسماء الجداول التالية مقترحة وتُثبت في Phase1؛ كل نوع مسمى في ملف مستقل. الـbaseline العالمي له owner قراءة/مزامنة صريح، ولا يستخدم Tenant Repository لإضافة بيانات عالمية. تخصيصات الاشتراك تستخدم EntityBase وRepository الحالي؛ لا تثق بأي subscriptionId من العميل.

| الجدول/المالك | البيانات المطلوبة | uniqueness/concurrency | السياسة |
|---|---|---|---|
| Built-in language catalog | cultureCode، name/nativeName، flag، direction، catalogVersion | cultureCode | تعريفات المدمج من نسخة التطبيق؛ غير قابلة للتعديل من شاشة tenant |
| Language الحالي | إضافة cultureCode، nativeName/direction حيث لا يمكن اشتقاقهما، مع Name/Flag الحاليين | كود لغة حي فريد داخل الاشتراك، بعد تدقيق البيانات القديمة | المستخدم يعدل تعريف لغة مضافة؛ الكود ثابت بعد استخدامه في نصوص، لا cascade rename |
| LocalizationKey | source، key، catalogVersion، placeholderContract، current/retired marker | source+key | مفاتيح الكود فقط؛ لا إنشاء مفتاح عشوائي من الواجهة |
| LocalizationBaseline | keyIdentity، languageCode، originalValue، sourceRevision/hash | keyIdentity+languageCode | أصل اللغة المستخرج من ملفات النسخة؛ القيم المفقودة لا تُملأ بترجمة مزعومة |
| LanguageTextOverride | languageCode، keyIdentity، value، version، audit/tenant | tenant+languageCode+keyIdentity، optimistic concurrency | يحفظ فرق المستخدم؛ updates scalars فقط، ويحمي تعديل مستخدم آخر |
| LanguageSettings | defaultLanguageCode، configurationRevision | صف حي واحد لكل tenant | عبر مالك single-row settings؛ الافتراضية لا تعني built-in |

يفصل `isBuiltIn` عن `isDefault` وعن `isActive`: الملاحظة في الصورة تستعمل Default* لوصف التعريفات المحمية، بينما English(Default) هي اللغة المختارة. الأعمدة/الشارات في Sigma ستكون واضحة: مدمجة، افتراضية، ونشاط حيث يوفره المصدر. لا نعيد تسمية IsActive إلى Default.

الكود يدعم culture identifiers صحيحة مثل en، ar، ar-EG، sq، hr؛ ليس ISO country flag. الهوية مركبة case-normalized بالمالك، مع تحويل ar-SA↔ar وen-US↔en عندما يحدد catalog أن هذه aliases لنفس اللغة. لا تحويل عشوائي لكل لغة إلى en-US. نحافظ على الأكواد الحالية zh/ja المثبتة في الملفات.

حدود مقترحة: Source64، Key256، cultureCode32، Name/NativeName250، Value4000. القياس الحالي يدعم هذه الحدود للنصوص المستوردة؛ تفحص أطوال كل سجل قديم قبل تقييد Name/Flag، ولا تضيق عمودًا قديمًا تلقائيًا. لا نختزل نصًا/مفتاحًا يتجاوز الحد؛ نرفض النسخة أو القيمة برسالة واضحة. تصمم unique indexes بما يناسب حدود SQL Server والفلاتر الحية، ولا ينشأ index على Value.

## 8. تهيئة القاعدة ومزامنة ملفات المصدر

1. أداة extraction محددة النطاق تقرأ AST لكائنات `locale.data` وXML لمصدري resx، وتنتج catalog versioned يحفظ المصدر والكود والمفتاح والقيمة الأصلية. ترفض المفاتيح المتصادمة عند flattening والتعبيرات غير المدعومة؛ لا eval ولا صامت partial import.
2. أداة import/backend command منفصلة ومعتمدة يطلقها المالك بعد تطبيق migration. لا seed في GET ولا تشغيل migration تلقائيًا ولا endpoint عام يستقبل baseline من متصفح tenant.
3. initial import يضيف baseline والمفاتيح؛ لا يحذف Language موجودًا ولا يغير ترجمات مستخدم. سجل الاستيراد يبين النسخة والعدادات والتعارضات، دون أسرار.
4. عند إصدار جديد: upsert للأصل الذي يملكه الكود فقط؛ keys removed تُعلّم retired ولا تمحى تخصيصاتها. keys added تظهر في الإدارة؛ اللغات بلا ترجمة مباشرة تظهر ضمن Empty ones. لا يستبدل الأصل تخصيص المستخدم.
5. تغيير placeholderContract في أصل مفتاح يضع التخصيص القديم في حالة needsReview؛ يحفظه للعرض والتصحيح لكنه لا يطبقه runtime إذا لم يعد صالحًا. لا مسح تلقائي.
6. إرجاع النسخة/تعطيل DB runtime يعود إلى ملفات الأصل دون إزالة البيانات؛ النسخة المتقاعدة لا تُطبّق خارج مجموعة مفاتيح الإصدار الجاري.

## 9. Target API Contract — مقترح للتجميد بعد الموافقة

| العملية | Route مقترح | الطلب | الاستجابة/القواعد |
|---|---|---|---|
| قائمة اللغات | GET `/Language` | paging، فلاتر مثبتة، sort whitelist | قائمة المدمج + لغات الاشتراك، هوية code مستقرة وid فقط إذا persisted؛ count كامل |
| خيارات الإدارة/runtime | GET `/Language/Options` | لا tenant في الطلب | languages، sources، defaultLanguageCode، revision |
| إنشاء/تعديل تعريف | POST/PUT `/Language` | editable name/code/flag/direction حسب Mode | validate code/duplicate/culture/ownership؛ المدمج مقفول وفق D4 |
| حذف لغة مضافة | DELETE `/Language?id=…` | هوية محفوظة | لا حذف المدمج/الافتراضية أو لغة مستخدمة في overrides؛ رفض واضح بدل cascade/data loss |
| تعيين الافتراضية | PUT `/Language/Default` | `{languageCode, expectedRevision}` | إعداد واحد، التحقق من التوفر وrevision؛ لا تغيير الاختيارات الشخصية الصريحة |
| نصوص قائمة | GET `/LanguageText` | baseLanguageCode، targetLanguageCode، source، search، targetState=all/empty، pageNo/pageSize، sort | `Results<LanguageTextListVM>`، TotalCount قبل paging، direct target values، no fallback masking |
| تفاصيل مفتاح | GET `/LanguageText/Detail` | code/source/key هوية validated | key، قيم الأساس والهدف، expectedVersion، placeholder hints/review state |
| حفظ نص | PUT `/LanguageText` | `{targetLanguageCode,source,key,value,expectedVersion}` | سلطة التحقق server؛ revision جديدة وقيمة محفوظة canonical؛409 على التعارض |
| استعادة الأصل | DELETE `/LanguageText/Override` | code/source/key+expectedVersion | تخصيص واحد فقط بعد التأكيد؛ لا حذف الأصل أو مفتاح الكود |
| Runtime واجهة | GET `/Localization/Runtime` | languageCode، knownRevision اختياري | `Result<RuntimeLocalizationVM>` يحوي resolved UI dictionary، revision، fallback/direction وavailable languages |

جميع routes authenticated، عبر environment.baseUrl وHttpClient الحالي؛ لا HttpClient خاص أو token يدوي. أسماء endpoints أعلاه ليست APIs موجودة الآن. لا نشر response عالمي يحوي ترجمات جميع الاشتراكات.

الـwrite يحتوي editable inputs وهوية القرار فقط، دون audit/tenant/default/built-in flags من المتصفح. ListVM للنصوص: identity(source+key+targetCode)، key، baseValue، targetValue، version/action state فقط. Grid: Actions → Key → Base Value → Target Value؛ لا بيانات tenant أو audit غير معروضة. ملصقات needsReview تظهر حيث تؤثر في Save/runtime.

filter semantics: base/target/source مطلوبة؛ Source default=Sigma.UI؛ Base default=en؛ الهدف من الصف المختار؛ اختيار نفس base/target مسموح لكنه يوضح أنه تعديل لغة الأساس نفسها. Search يبحث المفتاح والقيم المباشرة للغتين؛ empty string لا يرسل. Empty ones تعني absent/null/whitespace direct target دون fallback. paging default15 وخيارات10/15/20/50/100؛ sort keys confirmed بمسار إسقاط ثابت مع key tie-breaker. حفظ/Refresh/paging/export تستخدم applied query snapshot لا تغييرات الفلتر غير المرسلة.

## 10. التحقق والحماية وسلوك المحرر

- الـKey والـSource والكود والمفتاح معروفون للخادم؛ لا تغييرهم داخل المحرر ولا كتابة arbitrary dictionary paths. مفاتيح `__proto__`, `constructor`, `prototype` وأي flatten collision لا تُقبل كمسار قابل لتعديل الكائن؛ يستخدم البناء safe maps وتعريفات catalog مثبتة.
- النص Plain text افتراضيًا؛ لأن العينة لا تحتاج HTML، لا تدخل markup/script جديدًا ولا يستخدم innerHTML خاص بالمحرر. الملفات القديمة تبقى كما هي؛ إن وجد import لاحق HTML حقيقي يكون له عقد ومراجعة قبل عرضه، لا تفسيره تلقائيًا.
- preserve tokens الفعلية للمفتاح: `{{name}}` للواجهة، `{0}` لرسائل الخادم و`{first}/{last}/{totalRecords}` حيث يوجد. مقارنة مجموعة tokens بالمالك، مع رفض placeholders missing/unknown أو format malformed. تكرار token في الصياغة لا يفرض نفس عدد مرات ظهوره. اللغة الأخرى ليست دليلًا لإزالة token مطلوب في القالب المرجعي.
- لا auto-translate/AI ولا نصوص Albanian مخترعة. لغة جديدة تظهر ناقصة وتستفيد من fallback حتى يدخل المستخدم قيمها.
- يظل Save متاحًا لإظهار required/pattern/maxlength feedback. failure يبقي المسودة. الخادم validates كل payload؛ frontend validation للمساعدة فقط.
- Save&Close يحفظ ثم يغلق على نجاح فقط. Save&Next يحفظ ثم يفتح التالي؛ عند فشل الحفظ يبقى. إذا نجح Save وفشل تحميل التالي، تعرض «حُفظ النص، تعذر تحميل التالي» مع Retry؛ لا يعاد إرسال الحفظ.
- Previous لا يحفظ ضمنيًا، ويطلب shared discard إذا dirty. أول/آخر record يعطل الحركة المقابلة. التنقل عبر حدود الصفحات يستخدم نفس applied filter/sort وسلسلة مفاتيح مستقرة، لا موضع array غير موثوق.
- يثبت المحرر نتيجة قائمة المفاتيح عند فتح session. في Empty ones، المفتاح المحفوظ لا يؤدي لتخطي التالي عند خروجه من الفلتر؛ يتقدم بمفتاح cursor من الـsnapshot قبل تحديث القائمة. API يعيد neighbor/cursor أو تُجمع هويات محدودة موثوقة تحت نفس query؛ freeze يختار المسار الأقل تكلفة، ولا loads كامل نصوص35 ألف قيمة في محرر صغير.
- Cancel/X/Escape/route/Previous تطبق نفس dirty rule؛ busy/loading/save/pending decision تمنع الحركة. takeUntilDestroyed، identity checks، freezeFormState، catchError وfinalize لكل دورة.
-409 يعطي تعارضًا مع Reload/review؛ لا overwrite/retry صامت. في create override المتوقع عدم وجود row، unique constraint يحمي insert concurrent؛ version موجود يحمي update/reset.

## 11. Runtime — كيف يقرأ الفرونت والخادم من DB؟

### الواجهة

1. يحتفظ `TranslationService` بنسخة immutable من ملفات الأصل. بعد الدخول، `LayoutComponent` يفعّل مالك runtime مرة لكل جلسة موثقة؛ لا inject AuthService بشكل دائري ولا HTTP من interceptor.
2. يطلب options/default ثم قاموس اللغة الفعّالة محلولًا من DB. الأولوية: اختيار شخصي صالح للاشتراك الحالي → افتراضية الاشتراك → en. اختيار localStorage العام القديم لا يُعامل كتفضيل صالح لكل اشتراك تلقائيًا؛ مفاتيح تفضيل scoped لا تحوي token نفسه.
3. يثبت القاموس باستبدال نسخة اللغة من original snapshot + response الآمن؛ `setTranslation(...,true)` وحده ليس كافيًا لأنه يترك overrides قديمة عند التبديل/الاستعادة. يطبق setDefaultLang/use في ترتيب يحافظ على fallback ويطلق الأحداث لتحديث النصوص الحالية.
4. تبديل اللغة/جلسة الاشتراك يلغى القراءة السابقة ولا يطبق استجابة stale. القاموس لا يتسرب بين اشتراكين. logout يرجع إلى الملفات ويزيل state الخاصة بالاشتراك دون clear-all للتخزين.
5. حفظ النص يحدث القاموس الفعّال أو يبطل revision ثم يعيد تحميله قبل إعلان «طبّق على الواجهة». إن نجح persistence وفشل refresh، يميز نجاح التخزين عن تطبيق الشاشة ويوفر Retry دون save مكرر.
6. Cache محدود للمحتوى المصادق عليه بـtenant-session+language+catalogRevision+overrideRevision، لا indefinite localStorage ولا failed read cache. cache invalidation عند Save/Reset/default/language changes، وإعادة القراءة عند الدخول/Refresh مع revision.
7. API failure لا ينتج قاموسًا فارغًا ولا يمنع الدخول؛ يحتفظ بآخر قاموس صالح للجلسة نفسها أو ملفات التعافي ويظهر تنبيه قابل لإعادة المحاولة. لا يحمل قيم tenant قديم كتعافٍ.
8. قائمة Navbar بعد الدخول تستهلك نفس Languages/Options وتدعم اللغة المضافة. `dir` يعتمد metadata اللغة الفعالة، ويحدث `html lang/dir` وRTL stylesheet الحالي؛ لا يقتصر `lang==='ar'` على اللغات RTL الجديدة.

### رسائل الخادم

يفحص التنفيذ ويحدث المالك المشترك لـGeneralMessage وMockDataMessage، وليس generic IStringLocalizer لكل نوع في الحل. reader async يحضر snapshot للـtenant/culture والـrevision في بداية الطلب بعد authentication؛ adapter synchronous يقرأ منه ثم resource baseline عند التعذر. لا database query متزامن لكل `localizer[key]` ولا dict tenant داخل singleton غير مفصول.

فجوة مؤكدة يجب إغلاقها: بعض generic Service calls تمرر `GeneralMessage.SuccessedToAdd`، وهي **القيمة المترجمة** من Designer، إلى `GetString`، بدل هوية المفتاح. بعض calls الأخرى تستخدم literal key عبر `LocalizeMessage`. التنفيذ يجرد direct consumers لهذين المصدرين ويجعل lookup بالهوية (`nameof`/مفتاح ثابت)، دون تعديل Designer generated أو مطابقة النص المعروض عكسيًا إلى مفتاح ملتبس. هذا جزء من اكتمال رسائل DB ويحتاج source diff audit مستقل.

`apiCulture` وSupportedCultures وrequest localization يصيرون متوافقين مع metadata واللغات المتاحة؛ لا تغيير CultureInfo للعالم كله ولا افتراض قبول كل لغة من متصفح مجهول. أخطاء bootstrap/schema/tenant/auth نفسها تبقى لها fallback موثوق من resx عند تعذر DB، ولا تحتاج أن تُحلّ عبر القاعدة التي فشلت.

## 12. UI / shared conformance قبل التنفيذ

| Concern | Book/reference | Shared owner | Target match/deviation |
|---|---|---|---|
| قائمة اللغات/النصوص | UI1/3/5/6/28؛ Job list | FeatureTitle/DataTable/sigma-list-* | fill host، لا page scroll، rows فقط scroll، pager ثابت |
| فلاتر النصوص | UI4/16؛ Job/FilterPanel | FilterPanel وDropdown |4 حقول base/target/source/state +Search، stableLayout، Reset/Refresh، body overlays |
| الصفحات/فرز/أخطاء | UI2/6/22/28؛ Job bindListQueries | resolveListPaging/Subject switchMap/StateMessage | totalCount قبل slice؛ paging أثناء pending يستبدله لا يُسقطه |
| محرر اللغة/النص | UI13/19/10؛ EditorDialog | padded controlled shell/FieldError/Confirmation | key في subtitle؛ text-only controls؛ لا نسخ CSS |
| أزرار Previous/Save&Next | UI13/24؛ EditorDialog public API | توسيع اختياري typed footer actions/projection | يحافظ defaults لكل المستهلكين؛ لا fake Save&Print، لا footer خاص متكرر |
| RTL/lang/menu | UI25/27؛ TranslationService/Navbar | مالك runtime/metadata | نفس المالك للـlanguage selection والاتجاه، دون browser reload إلزامي |
| feedback | UI22؛ errorInterceptor | مالك واحد لكل عملية | composite persistence+runtime يحدد feedback الصحيح؛ لا success مزدوج |
| UserGuide | Master7؛ Administration reader | دليل قائم ثنائي اللغة | إضافة دورة النصوص/الافتراضية/empty/validation/recovery دون viewer جديد |

## 13. Impact Map / Keep–Extend–Create

| المجال | التصنيف | ملفات/قراء متأثرون مباشرة | المخاطر ومرحلة التنفيذ |
|---|---|---|---|
| ngx-translate/ملفات القواميس | Keep + Extend | AppComponent/TranslationService | عدم كسر fallback والتبديل؛ Phase5 |
| Language feature/DTO/service/entity | Extend + Refactor | Angular Languages وLanguage backend/maps/config | هويات قديمة، uniqueness، lock/default؛ Phase1–4 |
| Localization keys/baseline/override | Create | Helpers/DataAccess/ViewModels/Business/ServerAPI المخصصة | schema/tenant/concurrency؛ Phase1 |
| Runtime API/reader | Create | TranslationService/LayoutComponent | startup/failed DB/token/client chain؛ Phase5 |
| Languages menu/RTL | Extend | Navbar وTranslationService/Auth lifecycle | custom language، logout isolation؛ Phase5 |
| Backend resources | Extend | Shared General/Mock resource readers ومستهلكو الرموز المباشرون فقط | static values مقابل keys، ثقافة الطلب؛ Phase5 |
| Shared EditorDialog | Extend | مالك footer + نصوص language editor | backward compatibility لجميع المستهلكين؛ Phase3 |
| Guide/translations | Extend | Administration guide/EN/AR، review artifacts | final actual workflow conformance؛ Phase6 |
| Generic CRUD/Repository/Auth permission | Keep | القائمة/claims/tenant boundaries | لا إعادة كتابة المعمارية/صلاحيات عامة |
| Migrations/snapshots | Owner only | EF schema deployment | لا ينشئها أو يشغّلها الوكيل |
| Duplicate Language old rows | Keep pending owner decision | بيانات قائمة غير مفحوصة DB | لا تنظيف/دمج تلقائي ولا rewrite destructive |

## 14. Migration / compatibility / rollout

المخطط الجديد يحتاج `Add-Migration AddDatabaseLocalizationCatalogAndOverrides` اسمًا مقترحًا؛ لم يظهر migration Language/Localization مطابق في scoped filename search الحالي. يُعاد فحص الاسم عند التنفيذ. الوكيل يعدل Entity/EF source فقط ويقدم الأمر، ولا يولد migration ولا يغير snapshot ولا يتصل بقاعدة البيانات.

تسلسل المالك: نسخة احتياطية للبيانات → مراجعة mapping/tables/indices والـLanguage القديمة → إنشاء ومراجعة migration → تطبيقها → استيراد catalog المطابق للإصدار → فحص عدد keys/values/errors → نشر API المتوافق → تشغيل runtime frontend → acceptance.

مع شرط unique جديد، التقرير يذكر كل code مكرر/null/name غير معروف وأي قيمة أكبر من الحد قبل إنشاء index. Unknown legacy rows تبقى بلا code pending resolution؛ تُعرض كحالة غير مكتملة ولا تستعمل كهوية ترجمة متخيلة. لا نسقط Name/Flag القديمة ولا نعتمد نفس اسم اللغة للتعرف على builtin إذا لم يدعمه code mapping.

التعافي: تعطيل القراءة الديناميكية يرجع إلى الملفات؛ لا حذف جداول/tables/overrides، ويمكن إعادة نشر الإصدار السابق طالما schema changes additive. importer لا يغير تخصيصات المستخدم؛ failed import لا يعلن catalog version نشطًا جزئيًا. أي multi-save publish/import يحتاج transaction صريحة؛ حفظ نص منفرد يستخدم EF implicit transaction بsave واحد مع version/index checks. Settings defaults تمر عبر IserviceHelper ولا تنشئ صفًا جديدًا في كل حفظ.

## 15. Dependency-Ordered Implementation Plan

| الشريحة | التسليم | الاعتماد | المراحل/الملفات |
|---|---|---|---|
| S0 — الموافقة وتجميد العقود | تسجيل D1–D8؛ تحديث العقد التاريخي؛ inventory مباشر نهائي | موافقة المالك | PLAN-00/Phase00–01، reviews |
| S1 — مصالحة المسودة | إغلاق pending Delete/paging/export/date findings وتنسيق source/diff | S0 | Languages/frontend؛ لا إعلان اكتمال قبلها |
| S2 — storage/catalog | entities/config/DTO/interfaces/import artifact/keys/tokens contract | S0 | Phase01، Helpers/DataAccess/ViewModels، migration handoff |
| S3 — backend API | list/options/text save/reset/default/runtime + concurrency/tenant validations | S2 | Phase01–04، Services/Controller/maps/localized messages |
| S4 — واجهة الإدارة | Languages actions/default/locks، قائمة النصوص/filt، EditorDialog navigation | S3 frozen read/write contracts | Phase02–04، Languages/shared footer/ENAR |
| S5 — runtime UI | DB dictionary read، defaults/menu/RTL/cache/logout/session/retry | S3 | Phase05، TranslationService/Layout/Navbar/auth direct lifecycle |
| S6 — runtime API messages | General/Mock adapter/snapshot/key consumers/request culture | S3 | Phase05، localization/service shared owners |
| S7 — دليل ومصالحة شاملة | دليل actual workflow، diff review لكل repo، API/UI/schema matrix | S1–S6 | Phase06؛ source-only handoff |
| S8 — تفعيل فعلي بواسطة المالك | Migration/import/build/runtime/browser/data acceptance | S7 | لا يمكن ادعاء أنه تم source-only |

بعد تجميد S3 يمكن فصل backend/frontend أو text grid/editor إلى أعمال مستقلة بملكية ملفات واضحة، مع root مسؤول عن العقود والتكامل والمصالحة. لا delegation قبل shared freeze ولا وكلاء يحررون ملفات مشتركة بالتزامن. التخطيط الحالي read-only بلا وكلاء؛ محاولة delegation السابقة لم تبدأ التنفيذ وأوقفت.

## 16. Verification Matrix / قبول المالك

| الاختبار/المخاطرة | مراجعة المصدر المطلوبة | قبول runtime/data للمالك |
|---|---|---|
| قواعد البيانات | entity/config/index/concurrency/tenant/audit/DTO contract | migration/index lengths، استيراد كامل وإعادة import دون duplicates |
| Tenant isolation | token session/key/repository queries/runtime responses | اشتراكان لهما ترجمة مختلفة لنفس المفتاح؛ logout/login لا ينقل القاموس |
| القراءة الفعلية | API resolved dictionary → TranslationService/use → rendered key | تعديل label موجود ثم إعادة فتح/تحميل التطبيق؛ ظهور DB value |
| Default | إعداد واحد، validation/version، personal precedence | تعيين لغة افتراضية، مستخدم دون تفضيل، مستخدم اختار لغة أخرى |
| Built-in locks | server and UI state contract، لا edit/delete bypass | رفض API direct للمدمج مع قبول تعديل نصه |
| Language legacy | non-destructive mapping/duplicates/unknown outputs | فحص تقرير البيانات قبل unique index؛ لا حذف/دمج صامت |
| Empty/filter/search | direct values قبل fallback؛ applied queries/paging/totalCount | empty/all، البحث في key/base/target، تبديل source/target، page size فقط |
| Editor navigation | cursor/session identity/dirty/finalize | Previous، Save&Close، Save&Next عبر الصفحات وآخر صف وEmpty ones |
| Invalid tokens/markup | placeholder validator/known-key/plain-text/limits | حذف {{count}} أو{0}، إدخال token غريب، HTML، value أطول من الحد |
| Concurrency | expectedVersion + unique creates/reset/default | مستخدمان يعدلان المفتاح؛ الثاني409 دون overwrite، Reload يحفظ فهم التغيير |
| Failure/recovery | declared+HTTP+stale cancel، bootstrap fallback | DB down،401،500، failed import، saved-but-next/runtime-load-failed، Retry لا يحفظ مرتين |
| API messages | resolved snapshot + stable General/Mock key lookup | تخصيص رسالة مستخدمة فعليًا واختبارها بالعربية/لغة أخرى حسب مصدرها |
| الجديد في إصدار | catalog sync/version/retired/token review | key جديد، تعديل baseline، تخصيص قديم محفوظ، retired key غير مطبق |
| Shared UI/RTL | component inputs/registration/theme/tokens/footer backwards compatibility | Arabic/RTL،he/fa إذا أضيفت،dark،نarrow/intermediate،keyboard/focus/one-scroll |
| Feedback | interceptor/composite success ownership | إشعار واحد صحيح؛ نجاح storage لا يزعم نجاح runtime refresh الفاشل |
| Guide | topic/route/menu/ENAR → final source | قراءة دليل الإدارة وروابطه والتصرفات الفعلية |

لن يُشغّل الوكيل build/test/lint/browser/database ضمن تعليمات Sigma الحالية إلا بتفويض صريح لتلك الأدوات في مهمة التنفيذ. source parsing/counting ليس compilation أو اختبار runtime. توفير خطة tests لا يعني تشغيلها أو إثبات النجاح.

## 17. حدود الاكتمال وطلب الموافقة

الخاصية ليست مكتملة بإنشاء الشاشة أو API Save وحدهما. يلزم إغلاق S1–S7، وصول القاموس الفعلي إلى قارئ الواجهة، ربط مصادر API المعتمدة، توافق الترجمة والـtenant/default/menu، ودليل الشاشة ومراجعة الـdiff. التفعيل الفعلي S8 يظل pending owner migration/import/acceptance.

**الاعتماد المطلوب:** الموافقة على الخطة والقرارات D1–D8، خصوصًا القراءة المحلولة من DB لكل اشتراك، قفل تعريفات اللغات المدمجة مع السماح بتعديل نصوصها، والأولوية للاختيار الشخصي فوق اللغة الافتراضية. إذا رغب المالك بتغيير قرار يذكر رقمه؛ لا يبدأ التنفيذ حتى تصل الموافقة.

## اعتماد التنفيذ — 2026-10-17
وافق المالك صراحة: «نعم، اعتمد الخطة كاملة ونفذها». أصبحت القرارات D1–D8 معتمدة؛ عقد التنفيذ التفصيلي Frozen في LANGUAGES_DATABASE_CONTRACT_FREEZE.md. تحفظ الأقسام السابقة سجل طلب الانتظار التاريخي؛ بوابة الانتظار السابقة لم تعد سارية. الترحيل والتشغيل وقبول المالك ما زالت pending.

