| Field | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-23 |
| Scope | Tier S: selected-row appearance in the existing shared sidebar |

## Request and decision

The owner requested a background and distinct colored border for the selected
sidebar item, recalling its previous appearance. Implemented a tinted row,
colored outline and stronger logical-start edge using current Sigma tokens.
This is an authorized presentation adjustment to the existing shared owner;
route selection, catalog, pin, disclosure and business behavior stay intact.
No screenshot was supplied; no material business/API decision is unresolved.

The pre-edit decision/conformance entry was written in
`APP_SHELL_SIDEBAR_FEATURE_REVIEW.md`; concurrent documentation maintenance moved
that existing report to `Archive/Completed/2026-10-23/` during implementation.
This current report records the completed outcome without rewriting the archive.

## Final source conformance

| Concern | Owning book | Producer → consumer/shared owner | Final evidence |
|---|---|---|---|
| Selected identity | UI1 | SidebarMenuComponent.toPanelItems → item.styleClass → custom template row | New sigma-panel-item-active binding consumes the existing sigma-menu-active state, including current matching/exclusions. |
| Paint | UI1/24 | SidebarMenuComponent SCSS and global Sigma tokens | Entire row uses primary-soft background; 1px outline mixes 38% primary with border; 3px logical-start edge uses primary. Existing bold primary label/icon and .5rem radius retained. |
| Geometry | UI1 | Existing .sigma-panel-item → desktop aside/mobile Drawer | Transparent borders reserved on every row; 7px padding plus 1px border, and 5px logical-start padding plus 3px border, retain the previous 8px effective inset. Pin/disclosure layout and concurrent scrollbar clearance preserved. |
| Theme/direction | UI24/25 | src/styles.scss and assets/sass/_sigma-base.scss → shared sidebar | Existing primary/surface/border/primary-soft definitions verified; logical border/padding follows both directions. One rule covers all breakpoints and themes. Visual acceptance pending. |
| User guide | Master7 | SHARED_SCREEN_GUIDANCE → GuideReaderComponent.sharedScreenGuidance | Added one EN/AR paragraph explaining active-row appearance; existing /UserGuide/:sectionId routes and module guide menu entries retained. |

## Changes and reconciliation

- Frontend: `src/app/layout/components/sidebar/sidebar-menu/sidebar-menu.component.html`, `sidebar-menu.component.scss`, and `src/app/modules/UserGuide/content/shared-screen-guidance.ts`.
- Documentation: canonical `ui/01-feature-folders-and-wiring.md`, the workspace screen-refactor skill and its revision row, this review, and generator-owned packets.
- Recipe check passed initially. After canonical maintenance, regenerated PLAN-00 and PHASE-00 through PHASE-06 through the generator. An initial post-generation check encountered concurrent canonical changes; regeneration from the latest sources resolved it, and all eight checks passed. Semantic review confirms current shell/reference ownership; this sidebar rule changes UI1 provenance and adds no new packet/reference. Pre-existing packet edits and concurrent user changes were preserved.
- Reviewed complete scoped frontend diffs and relevant documentation/generated diffs. Whitespace checks passed in the frontend and documentation repositories; no scoped conflict markers were found. The same existing active expression owns label and row styling. No new imports, API types, translation keys or route wiring were introduced.
- Applied focused discovery, presentation decision, shared styling, guide handoff and Phase6 source reconciliation. Backend, read-grid, editor, domain-action and runtime-wiring changes do not apply. No API/DTO, AutoMapper, domain calculation, permission, persistence or schema change; no migration required.
- No subagents were used because one small sequential styling change does not meet the delegation gate. No builds, tests, lint, browser automation, database commands, migrations, commits, pushes or deployments ran.

## Owner verification

Compilation and rendered appearance remain pending. Navigate between two screens
and confirm the highlight follows the active entry; inspect hover/focus and Pin,
Arabic/English, light/dark, and the mobile Drawer. Source inspection establishes
the shared bindings and styles, not runtime or visual acceptance.

Suggested frontend commit: `style(sidebar): restore tinted active row and accent border`.

Suggested documentation commit: `docs(ui): record shared sidebar active-row presentation`.

## Owner correction — group title offset, 2026-10-24

Tier S: owner reports Account Settings is shifted in sidebar. Account Settings and Chart of Accounts are sibling catalog entries; their hierarchy/order is already correct. Shared template uses native button `.sigma-panel-group` for groups and anchor for leaves. Existing button styling resets border/background/font but leaves native padding/margin. UI1 owns common row insets; source supports resetting those inner button margins/padding to zero instead of altering the Account Settings depth or adding a per-feature offset.

Before-edit conformance: UI1 sidebar shell/reference `SidebarMenuComponent` owns row inset, disclosure/Pin order and14px nested-list indentation. Target retains all existing geometry and resets only inner native button default spacing in shared SCSS. This affects same-level groups generally on desktop and mobile; existing route/search/Pin/keyboard/active-row behavior is unchanged. No API/DTO/schema/migration or backend change.

Changed shared sidebar SCSS, bilingual `shared-screen-guidance.ts`, UI1 owning block and screen-refactor skill/checklist/revision row. Same existing `/UserGuide/:sectionId` reader and Accounts menu entry consume shared guidance. No subagents: one small sequential fix. No build/test/lint/browser/database/migration/commit/deploy commands. Suggested frontend commit: `fix(sidebar): align group buttons with sibling links`; docs commit: `docs(ui): document sidebar group inset ownership`.

Final reconciliation: scoped frontend diff and whitespace passed. Owning UI1 and skill/checklist/revision row agree with shared SCSS. Regenerated PLAN-00 and PHASE-00 through PHASE-06 through generator; all8 follow-up checks OK. Semantic review retains existing sidebar ownership/reference and14px hierarchy; affected packets reflect updated UI1 provenance and introduce no new route/action/pattern. Pre-existing documentation/Git diff changes were preserved. Documentation whitespace passed. Owner must verify Account Settings alignment against Chart of Accounts, proper child indentation, Pin/disclosure, Arabic/English, both themes and desktop/mobile. Source evidence does not establish rendered alignment.


## تحرك القائمة عند اختيار تتبع السائق — تشخيص مصدرّي فقط، ٢٠٢٦-١٠-٣١

توضيح المالك: المقصود اختيار DriversTracker من مجموعة Limousine في قائمة النظام، وليس قائمة أقسام TripBooking. متابعة اليوم السابقة في EditorTabs لا تعالج هذا المسار؛ لا اعتبار لها إثباتًا لإصلاح هذا البلاغ. الطلب الحالي سؤال عن السبب، لذلك لم تُعدل مصادر التطبيق أو الإرشادات أو إعداداته، ولم تُنفذ build/test/browser/database. هذا ملحق تشخيص S في التقرير الحالي.

المسار الفعلي: sidebar-menu-data.ts:707–708 يربط عنصر السائقين بـ/DriversTracker، وpages/routing.ts:332–336 يحمل FleetDriversTracker_Routes، ثم DriversTracker/components/drivers-tracker.component.ts/.html يعرض LeafletMap داخل shell. مكوّن الشاشة لا يملك أمر scroll للقائمة. عند انتهاء كل انتقال، SidebarMenuComponent.ngOnInit subscription في sidebar-menu.component.ts:87–93 يلغي reveal ويحدث الزيارة ويحفظ expansion ثم يستبدل panelItems بالكامل عبر toPanelItems. الدالة تعيد إنشاء جميع كائنات الشجرة وصفوفها/أبنائها، لتحديث فئة العنصر النشط. قالب PrimeNG المثبت primeng-panelmenu.mjs:1293 يستخدم ngFor على model دون trackBy؛ لذلك يتغير identity وتُستبدل العقد/المكونات الداخلية عند إعادة إنشاء الكائنات. PanelMenuList.onChanges قرب660 يعيد processedItems أيضًا. حالة SidebarMenuState تحفظ searchTerm وexpanded وsearchExpanded فقط، ولا تحفظ scrollTop.

النتيجة المصدرية: يوجد إعادة بناء غير لازمة للشجرة عند اختيار رابط، مع فقد هوية عناصر العرض وعدم حفظ موضع التمرير أثناء هذا البناء. هذا سبب مرجح قوي للقفزة/إعادة حساب مدى التمرير التي يلاحظها المالك؛ لا إثبات تشغيل للترتيب الدقيق أو مقدار القفزة. لا أمر scrollTop=0 مباشر في الشاشة، وآلية محاذاة رأس المجموعة لا تبدأ عند رابط ورقي: command يفعل pendingReveal عند children فقط، وNavigationEnd يلغيها. التركيز الداخلي بالمكتبة قد يكشف العنصر كذلك؛ لم يُنسب القفز إلى الخريطة أو تبويبات المحرر دون دليل.

الإصلاح المقترح في المالك المشترك: الاحتفاظ بهوية panelItems وأبنائها عند تحديث العنصر النشط بعد انتقال عادي وتحديث styleClass فقط، مع بقاء تذكر expansion/visit وإلغاء reveal، وحصر إعادة البناء في تغير البحث/اللغة/الكتالوج فعلًا. أي حفظ/استعادة لموضع القائمة عند إعادة بناء لازمة يظل في viewport القائمة وحده، ولا يعيد محاذاة الصفحة أو يطغى على تفاعل المستخدم. لا تصحيح داخل DriversTracker أو EditorTabs مطلوب لهذا السبب.

قورنت ملكية UI1 للقائمة وفتح المجموعة وحفظ الإفصاح وUI27 للتركيز، ومهارة Sigma وPrimeNG router ثم audit-troubleshooting. ليس عيب API غير موثق، ولذلك استُخدم المصدر المثبت لإثبات إعادة البناء لا ادعاء MCP validation. الحزم الثماني اجتازت Check؛ لا تغيير canonical أو توليد لازم. مرجع Speed لا يقرر موضع تمرير قائمة سيجما، وشاشة التتبع/الخريطة ووظائفها ليست نطاق هذا التشخيص. القراءات/الكاش/loading/SQL/indexes بلا تغيير؛ لا قياس سرعة ولا اقتراح فهرس لهذا السلوك المحلي. التأكيد المتبقي: اختيار DriversTracker ورابط آخر بعد تمرير القائمة، مراقبة هوية الشجرة وscrollTop قبل/بعد NavigationEnd في desktop/Drawer وRTL؛ لا تنفيذ مطلوب أو مأذون من سؤال السبب وحده.


## تنفيذ توضيح إظهار المختار — ٢٠٢٦-١٠-٣١

صحح المالك المقصود: القائمة تتحرك لرفع العنصر الذي اختاره وإظهاره، لا تثبيت scrollTop مطلقًا. نُفذ الاحتفاظ بهوية model وعناصره مع تحديث active route، وإظهار الرابط الورقي نفسه عبر reveal الحالي وبعد تغير path، مع حفظ الإفصاح وحصر الحركة بmenuScroll. الخطة: SIDEBAR_SELECTION_REVEAL_MAINTENANCE_EVOLUTION_PLAN.md؛ المطابقة النهائية والأدلة/الفحوص والقبول المتبقي: SIDEBAR_GROUP_REVEAL_FEATURE_REVIEW.md، ملحق «إظهار الصفحة المختارة بعد الانتقال». التشخيص أعلاه سابق للتنفيذ ولا يقرر منع الحركة. الفحص مصدرّي ناجح، والقبول المرئي داخل التطبيق متبقٍ.
