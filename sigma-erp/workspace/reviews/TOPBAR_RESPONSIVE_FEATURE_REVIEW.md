# Topbar responsive adjustment

| Item | Value |
|---|---|
| Status | Implemented — source-only |
| Owner verification pending | yes |
| Date | 2026-10-24 |

Bounded presentation repair (tier S), authorized by the owner request to fix
TopBar responsiveness. Shape is the authenticated shared shell, UI1 exception;
backend shape N/A. Existing shell/header/shortcuts and PrimeNG controls remain
the owners. No business, API, model, permissions or persistence change.

## Source decisions before editing

| Concern | Owning book | Actual reference/shared owner | Target |
|---|---|---|---|
| Responsive frame | UI1/25 | ShellHeaderComponent, LayoutComponent | Explicit two-row header below1200px; retain992px navigation breakpoint and desktop logo/sidebar alignment |
| Shortcut coverage | UI1/27 | AppbarShortcutsComponent, existing recent/pin service | Use actual header width for CSS and menu membership; collapse direct shortcuts below1600px, retaining every saved entry in overflow |
| Control geometry | UI24/25 | Existing PrimeNG Toolbar/Select/Button | Shrinkable label tracks, bounded groups, mobile branch remains readable; language full choices reachable through existing popup |
| Overlays | UI1/27 | Existing PrimeNG Popover/Select and focus helpers | Bound popup width/height to viewport; close shortcut popup before its trigger disappears at breakpoint changes |
| Guide | Master7 | Administration navigation topic and shared guide reader | Describe responsive rows and overflow, preserve current routes/actions |

Evidence: toolbar start/end had no explicit tablet row contract, shortcut CSS
mixed window media queries with header container queries, while overflowEntries
used window.innerWidth. A header narrower than the browser could hide direct
entries while omitting them from overflow. Popup content padding and fixed minimum
widths also require bounding on narrow screens. No screenshot supplied; source
supported layout decisions only. No new business decisions required.

Discovery/freeze, scoped frontend presentation/integration and reconciliation
apply. Grid/write/domain-action/backend phases do not apply. No subagents:
header/shortcut sizing is one tightly coupled, small workstream.

## Reconciliation

### Owner amendment, 2026-10-24 — one compact row

The owner rejected the previous responsive appearance and explicitly requested
one row, narrower controls and adapted badge titles on small screens. This
supersedes the two-row decision above. Frozen bounded repair: keep Toolbar
nowrap at every width, compact selectors/captions and account labels before
reducing mobile actions; hide the decorative logo on phones and expose Manage
through the existing Shortcuts menu. Recent, branch/language selection, theme,
account and refresh status remain reachable. At the narrowest widths branch
and language use labelled icon controls with full names in their popups/title.
Use a visible shortcut trigger for focus return when the separate Manage button
is hidden. Existing saved shortcuts, cache state and API contracts are unchanged.
UI1/24/25/27; existing shell/shortcuts are the approved shared owners. Backend N/A.
Source-only reconciliation and visual acceptance remain distinct.

Implemented the frozen presentation decisions in the existing owners:

- `src/app/layout/shell-header.component.scss`: explicit two-row Toolbar below
  1200px, bounded/shrinkable mobile brand and branch label, compact account below
  1400px, existing48px language icon control below480px with full popup choices.
- `src/app/layout/components/header/appbar-shortcuts/appbar-shortcuts.component.{ts,scss}`:
  all header presentation breakpoints use the header container. A bounded
  ResizeObserver measures that same host for1600px overflow membership; window
  resize remains a fallback. Disconnect/DestroyRef guard on teardown. Close
  popups when changing layouts, returning focus to the lasting Manage control
  only when the closing popup owned focus. Manager dialog columns still use
  viewport media queries because its dialog belongs to the viewport.
- `src/styles.scss`: existing shell/shortcut popup wrappers get viewport width
  bounds and zero duplicate shortcut content padding. Shell popup content owns
  one vertical scroll area bounded by viewport height. Preserved unrelated
  dirty shared-button/cache changes already present in this file/worktree.
- `src/app/layout/shell-header.component.spec.ts`: populated shortcut fixtures,
  resize/overflow regression source and width boundary cases280–1800px with both
  directions/themes. Specs were written, not executed.
- `src/app/modules/UserGuide/content/administration-guide.ts`: bilingual
  SHELL_NAVIGATION_TOPIC (`shell.guide`), existing `/UserGuide/administration`
  reader/sidebar entry. Covers second row, retained overflow choices, compact
  accessible actions and short-screen menu scrolling. No new guide viewer/route.

Final source comparison matches the conformance table: no API/VM/mapper/domain
calculation or financial effect; navigation992px remains independent; all saved
shortcut IDs/order survive collapse; branch/language FormControls, save/retry
guards, theme/account actions and existing overlay focus helpers remain intact.
No new translation keys needed. No migration or backend changes.

Promoted reusable sizing/overflow ownership to UI1 and skill rule/revision in the
same task. Regenerated all eight packets via the generator, reviewed the updated
UI1 provenance and preserved phase05/06 shell/reference/verification boundaries;
final recipe Check all8 passed. Source reviewed complete scoped frontend diff,
owning documentation delta, installed Toolbar/Popover/DestroyRef declarations,
imports, lifetime and whitespace. No unresolved material contract decision.

Owner verification pending: build frontend; open populated TopBar at280/320/380,
768/992/1199/1200 and1600/1800px; test RTL and both themes with long branch/user
names, all shortcuts, changing width while a shortcut popup has focus, short
landscape height, language/branch failure recovery and keyboard focus. Source
evidence does not prove rendered geometry. Builds, tests, lint, browser/runtime,
database/migration commands, commits/pushes/deployment were not run.

Suggested commits only: frontend `fix: make topbar controls and shortcuts responsive`;
documentation `docs: define container-based topbar responsiveness`. No subagents
were used because this small coupled repair did not meet the delegation gate.


## One-row amendment reconciliation — 2026-10-24

The amendment supersedes the historical two-row reconciliation above.
Implemented in the same shell owner: nowrap Toolbar/start/end;56px desktop and
48px phone minimum header; branch/language widths180/140px, then150/110px;
secondary captions disappear below1200px. Existing account/cache badges compact
below1400px. Phones use one row with hidden decorative logo and duplicate Manage,
36px controls then32px below480px; branch is an accessible icon below360px.
Recent and Shortcuts remain visible; the latter already contains Manage.
Existing popup choices/full titles retain complete names; added shortcut/theme/
account hover titles. Menu IDs, branch guards, locale/theme/account actions and
cache refresh lifetime/delay are preserved. No overlay clipping/scroll-hiding fix.

Shortcut manager close now focuses visible Manage or Shortcuts, avoiding the
hidden mobile trigger. Existing geometry spec source now asserts navigation and
account share a row, with the narrow branch-label expectation matching icon mode.
Specs were updated, not run. Scope is the seven existing frontend shell/shortcut/
guide files; no backend or global style changes in this amendment.

Conformance: UI1 shared shell owner and container1600px membership; UI24/25 theme
and logical geometry; UI27 labels and visible focus target; Master7 bilingual
Administration guide updated. Source comparisons reviewed all changed rules,
templates and focus method; scoped git diff --check passed. UI1 and skill rule/
revision promoted together. Generated all8 packets through the generator; checked
updated UI1 provenance and preserved phase05 wiring/phase06 reference and owner
verification boundaries; final -Check passed all8. Existing dirty source and
cache documentation were preserved. Runtime geometry, build/specs, populated
menus and mobile touch/RTL/theme acceptance remain owner-pending under the
source-only boundary. No database/build/test/lint/browser/commit commands ran.

## تكبير شعار أعلى القائمة وتحسين عرضه — ٢٠٢٦-١٠-٣١

نُفذ تعديل صغير من الفئة S بطلب المالك، داخل المالك المشترك الحالي ShellHeaderComponent فقط. الشكل هو authenticated shell من UI1، وليس شاشة CRUD؛ الخلفية غير منطبقة. استُخدمت مهارة sigma-screen-refactor وUI1/25/27 والحزمة PHASE05 بتناسب بعد نجاح Check للحزم الثماني. روجعت نقطة تحليل Speed ومدخل لقطة القائمة بتاريخ ٢٠٢٦-١٠-٢٨؛ شكل شعار Sigma وأبعاده خارج الدورات الوظيفية المرجعية، فلا تُنقل هوية Speed أو شكلها. لا لقطة جديدة من المالك ولا فجوة أعمال تحتاج قرارًا.

راجعت الصورة المحلية seven-stars-logo.png فعلًا: أبعادها 1200×503. كانت داخل صندوق 160×40 مع object-fit:contain؛ أصبح الصندوق 200×48، فيزيد الرسم الظاهر بنحو ٢٠٪ مع بقاء نسبة الصورة كاملة. على العرض المتوسط أصبح 112×36 بدل 100×32، وإخفاء الشعار تحت 768px بقي كما يملك UI1 حتى يتسع الشريط لأدواته. منطقة الشعار ما زالت 280px بمحاذاة القائمة، والشريط 56px وفي صف واحد. أضيفت مسافة داخلية بسيطة وحواف مستديرة للرابط، وخلفية مرور بلون surface-soft وإطار focus-visible بلون primary؛ لا تشويه للصورة أو تغيير للأصل أو فلتر ألوان أو حركة جديدة. رابط لوحة القيادة واسمه المتاح وزر القائمة وحدوده محفوظة.

الملفات: src/app/layout/shell-header.component.scss ودليل src/app/modules/UserGuide/content/administration-guide.ts في موضوع التنقل بمسار /UserGuide/administration. لا API أو DTO أو Mapper أو حسابات أو صلاحيات أو schema، ولا Add-Migration. جرد الأداء والتحميل والكاش لهذه الشريحة: نفس أصل الصورة الثابت المحلي، بلا طلب بيانات أو lookup أو اشتراك أو استعلام جديد؛ لا مؤشر تحميل أو كاش مصدر جديد مطلوب، ولا فهرس مبرر. زمن العرض والمقارنة المرئية غير مقاسين.

روجع كامل فرق الملفين في مستودع الواجهة، ونجح فحص صياغة SCSS ودليل TypeScript وgit diff --check. لم تُشغل بناء أو اختبارات أو lint أو متصفح أو قاعدة بيانات أو commit. القبول المرئي عند المالك: ظهور الرسم كاملًا ومتمركزًا على الكمبيوتر، وبقاء الشريط في صف واحد على الحجم المتوسط، وعدم تزاحم زر القائمة، ووضوح focus في الاتجاهين والمظهرين. لا وكلاء فرعيين لصغر التعديل وتسلسله. لا قاعدة مشتركة جديدة أو كتاب/مهارة معدلة تستوجب توليد حزم.

رسالة حفظ مقترحة للواجهة: fix(shell): enlarge and refine the sidebar brand logo

استكمال طلب المالك في ٣١ أكتوبر ٢٠٢٦: زيد صندوق الشعار مرة إضافية إلى 208×52 بدل 200×48، وعلى الحجم المتوسط إلى 120×40 بدل 112×36. نسبة الرسم محفوظة عبر contain، ويبقى ارتفاع الرابط المكتبي مع الحشو 56px داخل ارتفاع الشريط القائم، وعرضه مع الحشو 224px داخل المساحة الصافية 232px. لا زيادة في عرض منطقة القائمة أو تغيير لإخفاء الهاتف. دليل التنقل السابق ما زال مطابقًا لأنه يصف التكبير دون تثبيت رقم. روجع فرق SCSS كاملًا ونجح فحص الصياغة وdiff --check؛ المعاينة عند المالك، ولا أوامر تشغيل أو اختبار أو مخطط أو وكلاء لهذه الزيادة الصغيرة.
