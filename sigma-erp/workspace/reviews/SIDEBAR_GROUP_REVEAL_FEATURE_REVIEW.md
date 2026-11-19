# Sidebar expanded-group reveal

تحديث المالك بتاريخ ١ نوفمبر ٢٠٢٦: فتح قائمة لها فروع يرفع عنوانها؛ اختيار صفحة فرعية يحتفظ بموضع القائمة. القرار الحالي في القسم التالي يحل محل رفع الصفحة المختارة بتاريخ ٣١ أكتوبر، مع حفظ السجل السابق كدليل تاريخي.

## ثبات القائمة عند اختيار صفحة فرعية — ٢٠٢٦-١١-٠١

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| النطاق | تعديل متناسب من المستوى الصغير في مالك القائمة المشترك؛ المرحلتان الخامسة والسادسة بالقدر المنطبق |

قرار المالك الصريح: «اما اضغط على قائمة ليها فروع تحتها تطلع لفوق لكن اما اضغط على فرع تابع ليها متتحركش». هذا ينسخ جزء محاذاة الصفحة المختارة من القرار السابق؛ لا قرار أعمال ناقص. شكل الواجهة استثناء غلاف التنقل المشترك وفق كتلة الواجهة الأولى، ولا ينطبق شكل خلفي أو مراحل قوائم البيانات والكتابة وإجراءات الأعمال. لا حاجة لخطة أو ملف تجميد جديد لتصحيح هذه القاعدة الواحدة.

| الاهتمام | القاعدة والمالك الفعلي | المطابقة النهائية |
|---|---|---|
| فتح مجموعة رئيسية أو متداخلة | كتلة الواجهة الأولى؛ SidebarMenuComponent.toPanelItems/command ثم ngAfterViewChecked | يبقى طلب محاذاة العنوان عند فتح مجموعة، بعد حالة الإفصاح المرئية ومن خلال إطار الرسم ومراقب الحجم الحاليين |
| اختيار صفحة | كتلة الواجهة الأولى؛ command واشتراك NavigationEnd | أزيل طلب pendingReveal للورقة وإعادة restoreReveal بعد تغير المسار؛ الإلغاء المشترك يوقف أي محاذاة سابقة، والتحديد يتحدث على نفس كائنات العناصر |
| الإفصاح والتركيب | LayoutComponent وموضعا app-sidebar-menu في سطح المكتب والدرج | تبقى حالة البحث والمجموعات والمطابقة النشطة وإعادة الكشف عند إعادة تركيب القائمة كما كانت؛ إعادة التركيب ليست حدث اختيار الصفحة |
| التركيز والتمرير | كتل الواجهة الأولى والسابعة والعشرين والثامنة والعشرين | لا تغيير قالب أو أنماط أو روابط أو مفاتيح؛ يظل التمرير داخل القائمة وإلغاء الإطار والمراقب عند التفاعل والتدمير |
| الدليل | الكتلة الرئيسية السابعة؛ SHARED_SCREEN_GUIDANCE | شرح عربي وإنجليزي محدث، يستهلكه القارئ الحالي عبر UserGuide/:sectionId وروابط أدلة الوحدات القائمة |

مصادر الدليل المرجعي المقروءة: references/speed-analysis/README.md وفهرس الحزمة بتاريخ ٢٨ أكتوبر وEVIDENCE-AND-LIMITS.md. المقارنة المرجعية غير منطبقة على قاعدة المحاذاة هذه: الحزمة تصف قائمة ومسارات ووظائف سبيد، ولا تثبت حركة قائمة سيجما المشتركة. لا شاشة أعمال أو حقول أو حسابات أو أذونات في النطاق؛ طلب المالك والمصدر المحلي هما دليل السلوك المقبول. لا جمع خارجي أو مساواة وظيفية شاملة مدعاة.

دليل المصدر: المكوّن المشترك يستعمل MenuCatalogService.tree المحلية؛ التنفيذ المثبت لمكتبة القوائم يستدعي الأمر قبل تبديل الإفصاح، ولذلك أبقينا مسار انتظار العرض للمجموعات. اشتراك المسار يعدّل activeRoute وstyleClass في مكانهما، والروابط الأصلية ومسار تنقل لوحة المفاتيح محفوظان. لا طلب قراءة أو عنوان خدمة أو استعلام يضاف أو يتغير من هذا التعديل. تبقى عمليات SidebarShortcutsService.load/recordVisit وسياسة المصدر والجلسة والتحميل كما هي؛ لا اعتماد كاش أو مؤشر جديد. لا مبرر لفهرس قاعدة بيانات لسلوك تمرير محلي، ولا تعديل خادم أو خرائط أو حسابات أو مخطط أو حاجة لترحيل.

التحقق المصدري: روجع فرق المكوّن كاملاً وفق المستودع الأمامي، وفرق الدليل بما فيه تعديل سابق مستقل للتحميل محفوظ؛ لا تغيير له من هذه المهمة. جرى فحص علامات الدمج والمسافات والرموز المحذوفة ومساري طلب المحاذاة. حُدثت كتلة الواجهة الأولى والمهارة وسطر المراجعة بنفس القرار؛ أُعيدت الحزم الثماني بالمولد فقط، ومراجعة دلالية تؤكد أن تعديلنا يغير بصمة الكتلة الأولى في الحزم التابعة دون قواعد أو مراجع جديدة. تبقى تغييرات الوثائق السابقة محفوظة. الفحص النهائي للحزم ناجح. لا بناء أو اختبارات أو فحص تنسيق أو متصفح أو تشغيل تطبيق أو قاعدة بيانات أو ترحيل أو إيداع أو دفع أو نشر. لا وكلاء إضافية لأن العمل قاعدة واحدة مترابطة ولا يستوفي بوابة التفويض المتوازي.

قبول المالك المتبقي: افتح مجموعة ثم مجموعة متداخلة وتحقق من ارتفاع العنوان ضمن مدى القائمة؛ مرّر واختر صفحة أخرى ثم نفس الصفحة، وتحقق من ثبات موضع القائمة مع التحديد الصحيح؛ كرر الرجوع وتغيير معاملات الرابط، ولوحة المفاتيح، والعربية والإنجليزية، والمظهرين. يبقى إغلاق درج الهاتف عند الانتقال وإعادة الكشف عند فتحه مجددًا قائمين. القياس المرئي قبل وبعد يستعمل نفس حجم النافذة وحالة البحث والمجموعات وموضع التمرير؛ لا زمن أو ثبات مرئي مقاس مدعى.

رسالة إيداع الواجهة المقترحة: `fix(sidebar): preserve scroll position when selecting a page`. رسالة الوثائق المقترحة: `docs(sidebar): distinguish group reveal from page selection`.

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Tier S, shared shell navigation behavior. Owner asks that activating a sidebar group brings its heading upward to reveal children. Apply sigma-screen-refactor, Master5/7 and UI1/27/29, current SidebarMenuComponent as canonical shell owner; no backend/API/state schema. Initial eight-packet check current. Actual installed PrimeNG PanelMenu invokes commands before toggling root/nested expanded state, then child height changes through motion. Existing one-shot ngAfterViewChecked scroll can be clamped before expansion has provided sufficient scroll range.

Frozen correction: preserve native PanelMenu disclosure/keyboard/route handling, existing hierarchy, aside/Drawer single instance, search and independent pin actions. Queue alignment after rendered expansion; observe the existing menu content's changing size so the same activated heading remains aligned as siblings collapse/children expand. Change only menuScroll.scrollTop, bounded by its native available range, without spacers, window scrolling or moving catalog entries. Cancel pending frame/observation on next command, route/model rebuild, search, pin, pointer/manual wheel/touch/navigation key or destruction; only a newly opened group begins reveal. Existing view/guide wording already promises this behavior; clarify timing and manual-scroll precedence in its existing shared guide. No unrelated source edits, builds/tests/runtime/browser/DB/commits. No subagents because the correction is small and sequential.

| Concern | Book / actual owner | Target |
|---|---|---|
| Scroll ownership | UI1; SidebarMenuComponent.menuScroll and sigma-menu-scroll | Only bounded menu vertical position changes; preserve scrollbar gutter and pin clearance |
| Disclosure timing | UI1/27; installed primeng-panelmenu.mjs onHeaderClick/onItemClick/onItemToggle | Capture pre-toggle intent, check rendered aria-expanded after change, align after layout and content resize |
| Lifetime | UI28/29; existing DestroyRef | Cancel frame and disconnect observer; no repeated animation polling |
| Guide | Master7; shared-screen-guidance used by current reader | EN/AR shared navigation step |

## Final source reconciliation

Implemented in the existing shared SidebarMenuComponent, without API, routes, catalog, CSS geometry or hierarchy changes. After the rendered expanded state is confirmed, requestAnimationFrame aligns only menuScroll. ResizeObserver follows the actual sigma-panel-menu block, viewport and installed PrimeNG p-panelmenu-content-container motion boxes. Individual boxes cover sibling collapse/expansion even when their total height is unchanged. Native scroll range clamps the target; no artificial spacer is added.

The scoped TS/HTML diff was reviewed together: public template handlers cancel pending frames and disconnect the observer on manual pointer/wheel/touch/navigation keys, search, pin, next command, route/model replacement and destruction. Collapse starts no alignment. Existing leaf navigation and publisher focus/disclosure owners are retained. Desktop and Drawer use the same shared component. The existing EN/AR shared navigation guide was updated and its current GuideReader consumer confirmed.

Reusable timing/cancellation guidance was promoted to UI block 1 and the skill with a dated revision row. The generator refreshed PLAN-00 and PHASE-00 through PHASE-06. Semantic review confirmed UI1 remains their shared-shell authority, existing standalone root wiring references remain intact, and no feature-specific API or workflow rule was introduced. Final generator -Check and scoped frontend git diff --check passed.

| Concern | Result |
|---|---|
| Bounded scroll and root/nested opening | Source conforms; no window scrolling or node reordering |
| Motion timing and sibling collapse | Frame plus real content-container resize observation |
| Lifetime/manual precedence | Cancellation and observer cleanup reviewed |
| Guide handoff | Existing shared reader, EN/AR updated |
| Owner verification | Pending: desktop/mobile, root/nested group near bottom, close, pin, manual wheel/touch/keyboard, RTL/light/dark |

No build, tests, browser, runtime or database actions were run; visual acceptance remains pending under the workspace source-only boundary.

## Later owner request: retain disclosure on hide/show — 2026-10-24

Tier S bounded correction to the same shell navigation owner. Owner asks that
closing and reopening navigation keeps the selected menu elements. Source
shows Layout's conditional desktop aside and mobile Drawer destroy the menu;
its adapter formerly recreated expansion only from the route/search. Treat
"selected" as expanded/collapsed groups while the active leaf still follows
the current route. No cross-session persistence requested.

Confirmed implementation contract: one typed transient SidebarMenuState object
per Layout instance, passed to its sole mounted menu on both surfaces. Retain
normal disclosure, search text and separate search disclosure. Snapshot final
publisher item.expanded after view checks, before model rebuild and destruction;
installed PrimeNG root command runs before sibling collapse/toggle, so command
time is not the final state. Stable catalog group IDs are cached in the adapter.
Query changes reset search disclosure only; Clear restores normal disclosure.
The same query on remount retains its search disclosure. No second menu, storage,
new service/provider, runtime class, API, database or schema change.

| Concern | Canonical reference/shared owner | Final conformance |
|---|---|---|
| Navigation lifetime | UI1 LayoutComponent and existing aside/Drawer | Same conditional mount and focus/mask cleanup; both pass navigationState |
| Disclosure | UI1 SidebarMenuComponent; installed PanelMenu onHeaderClick/onItemToggle | Capture publisher mutations including sibling auto-collapse; explicit saved false overrides initial route expansion |
| Identity/search | MenuCatalogService.idFor and existing translated filtering | Stable IDs; search states separate; route-derived active leaf unchanged |
| State input | SidebarMenuState; SidebarMenuComponent.state | Optional default for standalone consumers, Layout owns shared object across remounts; no global preference |
| Guide | Master7 shared-screen-guidance and existing GuideReader | EN/AR explains hide/show, desktop/mobile and Clear behavior across current module guide overviews |

Source-only scope: sidebar TS/new type, Layout TS/HTML and shared guide. Existing
reveal observer/frame cancellation retained. No new action or translation key;
no backend shape applies. Phases 5 and scoped 6 apply; no CRUD/grid/domain-action
phase. No agents used because this is one small sequential correction.

Promoted reusable lifetime rule to UI1 and skill with a revision row. Generated
packet refresh and final source/whitespace checks are recorded below. Owner
acceptance remains required: open nested groups, close an active group, hide/show,
change language, search/collapse/remount/Clear, desktop↔mobile, active route
highlight and original keyboard/pin/reveal behavior in both directions/themes.
No build, tests, lint, runtime/browser, database, migration or commit executed.
No migration required. Suggested frontend commit:
`fix(sidebar): retain disclosure when navigation reopens`.

Final source comparison confirmed both Layout template mounts pass the same
typed state object; a fresh standalone menu still has a local default. The
new file contains an interface only, imported through its consumers, so no
runtime compile-root expansion was added. Read exact publisher root/nested
mutations and adapter capture/rebuild/destruction paths. Scoped frontend and
documentation git diff --check passed; new untracked type read directly and
merge/whitespace scan clean. No API/schema/translation-key changes. Existing
reveal behavior and unrelated pending diffs preserved.

Generator refreshed all eight outputs; immediate before/after comparison found
only UI1 provenance hash changes in PHASE-00/02/03/05. Other packet bodies,
templates and references unchanged; final Check passed all eight. Suggested
documentation commit: `docs(sidebar): record disclosure lifetime behavior`.

## Owner correction: restored selection must move upward — 2026-10-24

Owner confirms disclosure retention works, but the selected entry is not brought
upward on reopen. Root cause: only an explicit PanelMenu command queued reveal;
remount hydrated expanded state without queuing any alignment. Tier S correction
in the existing shared owner, not another state or scroll subsystem. Contract:
on remount with retained disclosure, reveal the active visible leaf, otherwise
its deepest visible ancestor, otherwise the deepest expanded restored group.
Do not change collapsed states to expose a hidden leaf. Use existing native
bounded scroll range; content near the end may not reach the very top.

| Concern | Owner/reference | Reconciled source |
|---|---|---|
| Restore timing | UI1 SidebarMenuComponent.ngAfterViewChecked | Restore once after adapter mount; if publisher row is not ready, retain intent until it renders |
| Stable row identity | Existing catalog ID and shared item template | data-sigma-menu-id resolves rendered header/treeitem without translated text, route guessing or unsafe CSS selector interpolation |
| Reveal lifetime | Existing frame + ResizeObserver owner, UI1/27/28 | Share explicit/restored alignment; leaf/collapsed heading need no expanded flag; explicit opening still requires expanded=true |
| Drawer sizing | Existing viewport/content/motion observers | Zero-height row/viewport waits for resize; target observed too; no repeated timer loop |
| Manual precedence | Existing cancelReveal and handlers | Cancel pending restore/frame/observation on user input, navigation, search, pin and destruction |
| Guide | Shared-screen-guidance and current reader | EN/AR updated with selected-entry reveal, closed-ancestor preservation and native scroll limit |

Changed sidebar TS/HTML and shared guide only in frontend; UI1/skill/revision
row record reusable behavior. No backend/API/schema, routes/providers, styles,
translation keys or new runtime declarations. Existing groups, selection/pins,
focus and page scroll preserved. Small sequential scope; no agents. Phase5 and
scoped Phase6 applied, CRUD/action phases not applicable. Source reviewed final
adapter initialization, row identity, visible traversal, type/import/template
parity, pending target and cancellation paths. ES2022 supports Array.at under
the current tsconfig. Frontend scoped git diff --check and merge-marker search
passed. Existing unrelated pending changes preserved.

Generator refreshed all eight outputs, semantic before/after review found UI1
provenance hashes only in PHASE-00/02/03/05, with bodies/references unchanged;
final Check passed all eight. Builds/tests/lint/browser/runtime/database/migrations/
commits were not run. Owner verification pending: selected page near bottom,
desktop hide/show, Drawer reopen/resize, closed ancestor, search matches/no match,
manual cancellation and RTL/themes. No migration. Suggested frontend commit:
`fix(sidebar): reveal restored selection after reopening`; documentation:
`docs(sidebar): clarify restored selection alignment`.


## إظهار الصفحة المختارة بعد الانتقال — ٢٠٢٦-١٠-٣١

التفويض/القرار: بلاغ المالك عن استمرار ارتفاع القائمة عند اختيار DriversTracker تبعه التوضيح «المفروض القائمة تترفع عشان اظهر العنصر اللى ضغطت عليه». المطلوب ليس منع كل حركة بل محاذاة العنصر المختار نحو أعلى مساحة القائمة ضمن المدى المتاح، مع ثبات هويته والمجموعات. جُمدت الخطة المتناسبة قبل التنفيذ في SIDEBAR_SELECTION_REVEAL_MAINTENANCE_EVOLUTION_PLAN.md (Impact Map وKeep/Refactor/Extend والبدائل والقبول). لا تغيير ميزات خريطة السائقين أو تبويبات الحجز.

المسار/الأدلة: SidebarMenuComponent المشترك هو المالك الفعلي لdesktop aside وmobile Drawer من Layout، وsidebar-menu-data.ts يربط DriversTracker كما في التشخيص السابق. المصدر المثبت primeng-panelmenu.mjs:1293 ينشئ root ngFor دون trackBy مخصص، وPanelMenuList.onChanges يعيد processedItems عند تبدل children؛ إعادة إنشاء جميع كائنات model في NavigationEnd كانت تفقد الهوية. قرئت مهارة Sigma وPrimeNG router ثم audit-troubleshooting وUI1/27/28/29 وMaster1/5/7، وحزم PLAN00/PHASE05 بعد drift Check. هذا تشخيص state/rendering وليس استخدام API publisher غير صالح، فلا ادعاء validate_usage أو تحقق تشغيل. مدخل تحليل Speed قُرئ؛ حركة shell القائمة خاص بسيجما، وDriver tracker يثبت المسار الوظيفي دون قاعدة لمحاذاة قائمة سيجما، لذلك الجزء N/A لمرجع أعمال/حسابات Speed. لا جمع خارجي.

التنفيذ: NavigationEnd يلغي reveal القديم، ويحدّث activeRoute signal والزيارة وexpanded كما كان، ثم يعدّل styleClass على كائنات panelItems وأبنائها نفسها؛ لا استدعاء toPanelItems في هذا الحد. القالب المقدم داخل المكتبة يقرأ isLeafActive المتصل بالـsignal في صف/رابط الاختيار، فيبقى تمييزه مشتقًا من نفس path/exact/exclusions عند publisher OnPush دون تدمير العقد. لا model arrays/child object recreation عند اختيار الشاشة. filterMenu يظل يعيد البناء عند البحث/اللغة لغرضهما القائم، لا اختيار الصفحة فقط.

إظهار المختار: command الرابط الورقي يحدد نفس pendingReveal، مع revealRequiresExpansion=false؛ لذلك إعادة اختيار نفس الصفحة تستطيع رفع صفها أيضًا. بعد تغير path الحقيقي يعيد restoreReveal اختيار العنصر النشط المرئي أو أقرب أصل مرئي إذا بقيت المجموعة مطوية. المقارنة linkKey لا تتأثر query/fragment أو trailing slash/case، فتغيير فلاتر الصفحة لا يبدأ حركة جديدة. تستخدم المحاذاة ngAfterViewChecked ثم requestAnimationFrame وResizeObserver الحاليين، وتعدل menuScroll.scrollTop فقط بقيمة clamped؛ لا scrollIntoView عام أو window/صفحة، ولا spacer/نقل عقد. فحص isConnected/measurable وmanual pointer/wheel/touch/navigation-key/search/pin/command/destroy cancellation يبقى كما كان؛ الإجراء الجديد يجدد reveal بعد اكتمال مسار التنقل نفسه، لا قبل إعادة بناء شجرة جديدة.

العقود المحفوظة: expanded/searchExpanded وautoExpandOnActive الابتدائي وremount/drawer lifetime، اللغة/الألوان/RTL/العلامة النشطة والـPin/chevron والبحث والـCtrl K، exactActive وactiveExclusions، native routerLink/publisher keyboard commands. لا تغيير route أو Action permissions أو guard للكتابة/dirty. تبقى المجموعات المطوية مطوية عند انتقال خارجي ويكشف أصلها المرئي بدل فتحها قسرًا. إذا كان المختار قريبًا من نهاية القائمة، يحكم المدى الحقيقي أقصى رفع ممكن؛ لا اصطناع فراغ.

الأداء/تحميل/الكاش: لا request/read URL أو query جديد من المحاذاة. SidebarShortcuts.load/recordVisit ومالكا auth/session/invalidation كما هم، ولا cache أو global/local loading owner أو start/finalize جديد. يتوقف navigation عن تخصيص شجرة جديدة كاملة؛ ذلك حقيقة source لا زمن مقاس. لا SQL/index جديد مبرر لسلوك عرض محلي. قياس التنقل/الرسم وظهور العنصر وموضع menuScroll أثناء الحركة pending داخل التطبيق؛ لا تغيير حد أداء أو ادعاء معالجة زمن صفحة السائقين.

الوثائق والتسليم: حُدث UI1 والمهارة والـrevision لنفس القاعدة العامة، ودليل التنقل المشترك EN/AR في shared-screen-guidance.ts الذي يستهلكه GuideReader لكل /UserGuide/:sectionId. جُددت الحزم الثماني بالمولد فقط؛ Check ناجح للثماني، ومراجعة دلالية لبصمة UI1 الجديدة ومالكي route/shared shell في PHASE05 تؤكد التبعية دون ادعاء API/شكل CRUD جديد. تقرير تشخيص active-item السابق يحيل إلى هذه النتيجة بدل الاقتراح التاريخي بتثبيت الموضع فقط.

التحقق: روجع diff TS/HTML كاملاً؛ نجح تحليل الصياغة للمكوّن والدليل وقالب Angular وgit diff --check، ولا typings/import/translation جديدة خارج signal المحلي. لا tests جديدة صغيرة تعكس التنفيذ ولا تشغيل tests/build/lint/browser/database/migration/commit/push/deploy؛ المصدر لا يثبت ارتفاعًا مقاسًا أو قبولًا بصريًا. لا خادم أو schema ولا Add-Migration مطلوب. لم تُستخدم وكلاء إضافية لأن التصحيح مترابط وصغير داخل مالك واحد والجذر يملك كامل المطابقة. رسالة واجهة مقترحة: fix(sidebar): reveal selected page without rebuilding menu nodes؛ رسالة وثائق مقترحة: docs(ui): define selected-page sidebar reveal.

القبول المتبقي للمالك: اختيار DriversTracker من Limousine بعد تمرير القائمة، ثم اختيار صفحة أخرى والعودة وBack، وإعادة اختيار الصفحة نفسها، وتغيير query فقط، وبقاء العنصر/أصله المرئي ظاهرًا مع الإفصاح الحالي؛ تدخل التمرير اليدوي يوقف المحاذاة، وآخر عناصر/ارتفاع قصير وRTL/theme وDrawer. قياس مقدار الإزاحة مع نفس viewport/sidebar/search/expanded state قبل وبعد، ومراقبة أن هوية صفوف غير المختار لا تُعاد إنشاؤها عند NavigationEnd.

## مراجعة سلوك المستوى الثالث — ٢٠٢٦-١١-١١

| البند | القيمة |
|---|---|
| Status | Draft |
| Owner verification pending | yes |
| النطاق | مراجعة مصدرية لسلوك الإفصاح والتحديد والتمرير والتركيز في القائمة المشتركة |
| الشكل | غلاف التنقل المشترك وفق UI1، مع UI27 وUI29 والمرحلتين ٥ و٦ بالقدر المنطبق |

المرجع الحالي هو قرار ١ نوفمبر في هذا السجل ودليل التنقل المشترك. فتح مجموعة يقرّب عنوانها من أعلى حاوية تمرير القائمة ضمن المدى المتاح. اختيار رابط صفحة يحدّث التمييز ويحتفظ بموضع القائمة والمجموعات. ينطبق المسار نفسه على القائمة الثابتة والدرج. في شجرة الحسابات، «التقارير العامة» مجموعة في المستوى الثالث و«ميزان المراجعة» صفحة في المستوى الرابع. عنصر «التدفقات النقدية» في فرع التقارير مثال لصفحة في المستوى الثالث. الدليل المصدري في `sidebar-menu-data.ts:1162–1197`.

### النتائج

| الأولوية | ما ثبت من المصدر | التصحيح المقترح |
|---|---|---|
| أولى | اشتراك التنقل يحدّث إشارة المسار ويعدّل التمييز على العناصر الموجودة. أثر تحديث الصلاحيات الذي أُضيف في `2f762dc1` يستدعي بناء القائمة، والبناء يقرأ إشارة المسار عبر فحص الرابط النشط. بذلك يشترك الأثر في تغيّر عنوان الصفحة ويعيد إنشاء العناصر ومصفوفات الأبناء، حتى عند تغيّر الاستعلام وحده. يعيد المكوّن المثبّت معالجة الأبناء ويستبدل صفوف الجذر مع تغيّر هويتها. هذا يخالف عقد ثبات هوية الصفوف ويعرّض موضع التمرير والتركيز للتغيّر. مواضع الدليل في `sidebar-menu.component.ts:75–107,137–148,190–240` و`primeng-panelmenu.mjs:659–661,1293`. | قصر أثر إعادة بناء القائمة على تغيّر شجرة الصلاحيات، وعزل قراءة المسار أثناء البناء عن تبعيات الأثر. يظل التمييز مستجيبًا لتغيّر المسار في القالب وعلى العناصر الحالية. يستمر البناء المخصص للبحث واللغة. |
| ثانية | في إصدار برايم إن جي المثبّت 21.1.10، يغيّر سهم اليمين أو اليسار مسار التركيز النشط فقط. إعلان التوسّع والسهم المرئي يقرآن هذا المسار، بينما عرض الفروع وحفظ الإفصاح وإطلاق محاذاة العنوان يعتمد على حالة التوسّع ومسار النقر. المجموعة المطوية يمكن أن تُعلَن مفتوحة مع بقاء فروعها مخفية. وبالمثل قد تبقى مجموعة مفتوحة بالنقر بعد محاولة طيّها بالسهم. دليل المكتبة في `primeng-panelmenu.mjs:214–241,253–257,384–405,782–799,854–883`، ودليل الحفظ والمحاذاة في `sidebar-menu.component.ts:242–251,276–318`. | توحيد نتيجة فتح وطيّ المجموعة بين النقر ولوحة المفاتيح بحيث تتفق حالة العرض والإعلان والحفظ. التحقق من التنقل بين الفروع الظاهرة واستعادتها بعد إخفاء القائمة وفتحها في الاتجاهين، مع بقاء التثبيت إجراءً مستقلًا. |

محاذاة المجموعة عند النقر تتبع حاوية التمرير المحلية بعد تحقق التوسّع. أمر رابط الصفحة يلغي طلب المحاذاة السابق. المسار غير المباشر عبر أثر إعادة البناء هو المخالفة المثبتة لقاعدة هوية الصفوف. حركة الشاشة الفعلية ومقدارها وأثرها على التركيز تحتاج معاينة.

### المراجع والتحقق

- قُرئت قاعدة الفتح والتحديد في UI1، ودليل التنقل العربي والإنجليزي في `shared-screen-guidance.ts:182–187`، والقالب والمكوّن ومصدر المكتبة المثبّت. شمل الفحص كود الاختبار الحالي، الذي يتحقق من فتح عنوان مجموعة رئيسية بمفتاح الإدخال في السطور ٩٠–٩٦. مسار أسهم لوحة المفاتيح وموضع التمرير في المستوى الثالث يحتاجان تحققًا مستقلًا.
- دليل سبيد في ٢٧ أكتوبر وفهرس شرح الشاشات يصفان وظائف الشاشات. كود ٢٨ أكتوبر في `raw/application.js:26935–27010` يختار شجرة التنقل ويهيئ القائمة، وفي `raw/metronic.js:1` يربط تمرير المجموعة بخيار التمرير التلقائي وإعدادات العرض. هذا دليل على وجود التمرير عند الإفصاح في المرجع، وتحدد وثائق سيجما سلوكها المطلوب. روجع مدخل أودو المحلي، وموضوع المراجعة يخص تفاعل غلاف سيجما ولا يتطلب مرجعًا لدورة أعمال.
- نجح فحص الحزم الثماني. روجع فرق الملفات المعنية في مستودع الواجهة، ونجح فحص المسافات. التغيير المحلي السابق في فهرس القائمة محفوظ. ملف المراجعة هو التغيير في هذه المهمة.
- الإفصاح والتحديد عمليتان محليتان. مسارا قراءة الاختصارات وتسجيل الزيارة في المالك الحالي خارج نتيجة التصحيح المقترح. لا حاجة لخادم أو استعلام أو فهرس أو ترحيل. تبقى معاينة التمرير والتركيز وأي قياس للأداء عند التشغيل. لم يُشغّل التطبيق أو المتصفح أو البناء أو الاختبارات، ولم تُنفذ أوامر بيانات أو إيداع أو نشر. تمت المراجعة مباشرة لأن المسارين يشتركان في مالك القائمة.
- للمعاينة بعد التصحيح، افتح «الحسابات ← التقارير ← التقارير العامة» بحساب يملك الوصول. افتح المجموعة بالنقر ثم بالأسهم، وتحقق من ظهور الفروع واتساق اتجاه السهم. اختر صفحة بعد تمرير القائمة وراقب موضع القائمة والتركيز ثم غيّر الفلتر أو ارجع للصفحة السابقة. أعد فتح القائمة على الكمبيوتر والهاتف وتحقق من الاستعادة باللغتين.

## تنفيذ ملاحظات المستوى الثالث — ٢٠٢٦-١١-١١

| البند | القيمة |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| التفويض | طلب المالك «عدل الملاحظات» بعد مراجعة النقطتين أعلاه |
| النطاق | مالك القائمة المشترك، وحالتا منع رجوع العطل، ودليل التنقل المشترك |

- **اختيار الصفحة وثبات القائمة.** يتابع أثر التحديث مرجع الشجرة المصفّاة حسب الصلاحيات. يُهيأ هذا المرجع عند التركيب لتفادي بناء أول مكرر قبل استعادة التمرير. تعزل عملية بناء العناصر قراءة المسار عن تبعيات الأثر، وتظل إعادة البناء للبحث واللغة والصلاحيات في مساراتها الحالية. يحدّث حدث التنقل التمييز على نفس العناصر، بما في ذلك تغيير استعلام الصفحة، مع بقاء قواعد اختيار الرابط الدقيق والاستثناءات.
- **إفصاح المجموعة بلوحة المفاتيح.** يلتقط مستمع حاوية القائمة سهمي الفتح والطيّ للمجموعة الفرعية قبل معالج المكتبة المثبّت. يستخدم زر المجموعة نفسه لتشغيل أمر سيجما وتبديل حالة المكتبة الظاهرة والمحفوظة معًا. سهم اليمين يفتح والسهم الأيسر يطوي وفق ترتيب المفاتيح الحالي للمكتبة. تبقى حركة التركيز الأخرى عند المكتبة ويظل التثبيت إجراءً مستقلًا. يُزال المستمع عند تدمير القائمة، ويستخدم كلا تركيبيها في الكمبيوتر والدرج المكوّن نفسه.
- **الدليل.** حُدثت إرشادات فتح المجموعة وطيّها بالعربية والإنجليزية في `shared-screen-guidance.ts` التي يقرأها دليل المستخدم المشترك. تُطبّق قاعدة UI1 الحالية للمحاذاة والإفصاح دون تغيير العقد أو القاعدة العامة، ولم تستدعِ المراجعة تعديل الكتب أو الحزم المشتقة.
- **المطابقة.** روجع فرق الملفات المعنية في مستودع الواجهة، وفُحصت المسافات وتحليل صياغة ملفات تايب سكريبت المعدلة، ونجح فحص اتساق الحزم الثماني. حُفظ التغيير المحلي السابق في فهرس القائمة. كُتبت حالتا تحقق لهوية صفوف المجموعة عند اختيار صفحة وتغيير الاستعلام، وللفتح والطيّ بالأسهم واستقلال التثبيت. تنفيذ الاختبارات والبناء ومعاينة التطبيق متبقية وفق حدود التحقق المصدري. العمل مترابط داخل مالك واحد وأُجري دون تفويض فرعي. لا تغيير لخادم أو استعلام أو تحميل أو كاش أو فهرس أو مخطط، ولا حاجة لترحيل.
- **قبول المالك.** افتح «الحسابات ← التقارير ← التقارير العامة» من لوحة المفاتيح وجرّب اليمين واليسار مع مراقبة ظهور الفروع. مرّر القائمة واختر صفحة فرعية ثم غيّر الفلتر وارجع للخلف وراقب ثبات التمرير والتحديد. كرر على الكمبيوتر والدرج بالعربية والإنجليزية. رسالة الإيداع المقترحة للواجهة هي `fix(sidebar): preserve menu rows and sync nested keyboard disclosure`.
