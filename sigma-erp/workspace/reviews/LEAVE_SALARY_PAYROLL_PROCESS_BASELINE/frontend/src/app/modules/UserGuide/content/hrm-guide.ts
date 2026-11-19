import type { GuideSection } from '../models/user-guide.model';

export const HRM_GUIDE: GuideSection = {
  id: 'hrm', titleKey: 'sideMenu.hrm', title: { en: 'Human Resources and Payroll', ar: 'الموارد البشرية والرواتب' },
  overview: {
    en: 'Prepare effective-dated staff salaries and overtime, calculate the payroll month, save a revision and approve that exact revision. Disbursement is a separate workflow. Saved history and operation logs preserve every successful payroll change.',
    ar: 'جهّز رواتب الموظفين بتواريخ سريانها والعمل الإضافي، ثم احسب شهر الرواتب واحفظ نسخة واعتمد النسخة نفسها. الصرف دورة مستقلة. يحتفظ سجل النسخ وسجل العمليات بكل تغيير ناجح على المسير.',
  },
  steps: [
    { title: { en: 'Prepare staff inputs', ar: 'جهّز بيانات الموظفين' }, description: { en: 'Use dated salary revisions, recorded overtime and complete deduction schedules.', ar: 'استخدم تعديلات الراتب المؤرخة والعمل الإضافي المسجل وجداول الخصومات المكتملة.' }, icon: 'bi bi-people' },
    { title: { en: 'Calculate the month', ar: 'احسب الشهر' }, description: { en: 'Process the month and resolve every row issue before Save.', ar: 'عالج الشهر وصحح جميع ملاحظات الصفوف قبل الحفظ.' }, icon: 'bi bi-calculator' },
    { title: { en: 'Save a revision', ar: 'احفظ نسخة' }, description: { en: 'Save the reviewed server calculation. Changed unpaid values create a new revision; earlier values remain available.', ar: 'احفظ الحساب الذي راجعته من الخادم. تغيّر القيم قبل الصرف ينشئ نسخة جديدة، وتظل القيم السابقة متاحة.' }, icon: 'bi bi-floppy' },
    { title: { en: 'Review and approve', ar: 'راجع واعتمد' }, description: { en: 'Open Payrolls, review the saved rows and approve the current revision.', ar: 'افتح قائمة مسيرات الرواتب وراجع الصفوف المحفوظة ثم اعتمد النسخة الحالية.' }, icon: 'bi bi-check2-circle' },
    { title: { en: 'Keep history and trace operations', ar: 'راجع التاريخ والعمليات' }, description: { en: 'Browse earlier revisions and the actor, time and amount of each save, recalculation and approval.', ar: 'اعرض النسخ السابقة والمستخدم والتوقيت والمبلغ لكل حفظ وإعادة حساب واعتماد.' }, icon: 'bi bi-clock-history' },
  ],
  topics: [
    {
      titleKey: 'sideMenu.payrolls.processPayroll', title: { en: 'Payroll Process', ar: 'معالجة الرواتب' },
      route: '/ProcessPayroll', icon: 'bi bi-calculator',
      purpose: { en: 'Calculate and save monthly employee payroll with immutable revision history.', ar: 'حساب وحفظ الرواتب الشهرية للموظفين مع الاحتفاظ بنسخ تاريخية ثابتة.' },
      steps: [
        { en: 'Choose a complete month (MM/YYYY), then Process. The server selects the salary effective for that period and returns Code, Name, Basic, Allowances, Gross, Overtime, Additional, Deductions and Net Pay.', ar: 'اختر شهرًا كاملًا (MM/YYYY) ثم عالج. يختار الخادم الراتب الساري للفترة ويعرض الرمز والاسم والأساسي والبدلات والإجمالي والعمل الإضافي والإضافات والخصومات وصافي الراتب.' },
        { en: 'Review the vertically centered row figures. Press the small red icon in the final Notes column of an employee row to open their notes, or the red icon beside the month actions for general payroll notes. Close the details, fix the source record and Process again. Net Pay = Gross + Overtime + Additional − Deductions. The screen does not accept edited payroll amounts.', ar: 'راجع الأرقام وعناصر الصف المتوسطة رأسيًا. اضغط الأيقونة الحمراء الصغيرة في عمود الملاحظات بآخر صف الموظف لعرض تفاصيله، أو الأيقونة الحمراء بجوار أزرار الشهر لعرض ملاحظات الرواتب العامة. أغلق التفاصيل وصحح السجل المصدر ثم أعد المعالجة. صافي الراتب = الإجمالي + العمل الإضافي + الإضافات − الخصومات. لا تقبل الشاشة تعديل مبالغ الرواتب مباشرة.' },
        { en: 'Save stores the displayed calculation after the server rechecks it. If inputs changed, Process again. Repeating the same successful save does not create a duplicate; changed unpaid values append a new revision.', ar: 'يحفظ «حفظ» الحساب المعروض بعد إعادة التحقق منه على الخادم. إذا تغيرت البيانات فأعد المعالجة. تكرار الحفظ الناجح نفسه لا ينشئ نسخة مكررة؛ وتغيّر القيم قبل الصرف يضيف نسخة جديدة.' },
        { en: 'Use Saved revisions to browse an earlier snapshot, Current calculation to return, and Operations log to see successful changes. Saved revisions can be exported to Excel. Cancel a discard decision to retain an unsaved calculation.', ar: 'استخدم النسخ المحفوظة لعرض لقطة سابقة، والحساب الحالي للعودة، وسجل العمليات لعرض التغييرات الناجحة. يمكن تصدير النسخ المحفوظة إلى Excel. ألغِ قرار تجاهل الحساب للاحتفاظ بالحساب غير المحفوظ.' },
      ],
      notes: [
        { en: 'Process, Save, Excel and operation-log actions are beside the Month filter; Back to payrolls appears there when opened from the list. On narrow screens the shared filter panel wraps the actions below the fields.', ar: 'توجد أزرار المعالجة والحفظ وExcel وسجل العمليات بجانب فلتر الشهر، ويظهر معها زر العودة إلى الرواتب عند فتح الشاشة من القائمة. على الشاشات الصغيرة ترتب لوحة الفلاتر الأزرار أسفل الحقول.' },
        { en: 'Gross already includes Basic and Allowances; they are not added twice. Stored overtime amounts are used, including the previous month when HRM settings require it. Scheduled installments use the final remainder; saving payroll does not mark them paid.', ar: 'يشمل الإجمالي الأساسي والبدلات بالفعل، فلا تُجمع مرتين. تُستخدم مبالغ العمل الإضافي المسجلة، بما فيها الشهر السابق عندما تقتضي إعدادات الموارد البشرية ذلك. يأخذ القسط الأخير باقي القسمة؛ وحفظ المسير لا يجعل الأقساط مصروفة.' },
        { en: 'Missing or ambiguous salaries, incomplete deductions, duplicate overtime, negative net, recorded absences and mid-month changes needing proration block Save. Leave counters have no period and are not automatically deducted. Resolve the displayed policy/input issue first.', ar: 'تمنع الرواتب الناقصة أو غير المحددة والخصومات غير المكتملة والإضافي المكرر والصافي السالب والغياب المسجل وتغييرات منتصف الشهر التي تحتاج احتسابًا نسبيًا الحفظ. عدادات الإجازة لا تحدد فترة فلا تخصم تلقائيًا. عالج الملاحظة المعروضة عن السياسة أو البيانات أولًا.' },
        { en: 'An older unpaid revision becomes Superseded after a changed Save. Its historical approval remains visible, but cannot authorize payment of the new revision. Paid figures stay locked; recalculated differences require a separate settlement.', ar: 'تصبح النسخة السابقة غير المصروفة «مستبدلة» بعد حفظ تغييرات. تظل موافقتها التاريخية ظاهرة لكنها لا تسمح بصرف النسخة الجديدة. تظل القيم المصروفة مقفلة، وتتطلب الفروق المعاد حسابها تسوية مستقلة.' },
      ],
    },
    {
      titleKey: 'sideMenu.payrolls.processedPayrolls', title: { en: 'Payrolls and approvals', ar: 'مسيرات الرواتب والموافقات' },
      route: '/ProcessedPayrolls', icon: 'bi bi-check2-square',
      purpose: { en: 'Review saved monthly runs and approve the current revision for the separate disbursement workflow.', ar: 'مراجعة مسيرات الشهور المحفوظة واعتماد النسخة الحالية لدورة الصرف المستقلة.' },
      steps: [
        { en: 'Set Date Range and Type Payroll; choose Pending Approval when needed, then Search. Date refers to the final day of the payroll month. Excel above the list includes every matching payroll, not only the visible page.', ar: 'حدد نطاق التاريخ ونوع الرواتب، واختر بانتظار الموافقة عند الحاجة ثم ابحث. يشير التاريخ إلى آخر يوم من شهر الرواتب. يشمل Excel أعلى القائمة كل المسيرات المطابقة، وليس الصفحة الظاهرة فقط.' },
        { en: 'View opens the stored rows read-only. Edit opens the current unpaid run: Process again and Save changed figures as a new revision. Approve requires confirmation and rechecks the current saved version.', ar: 'يفتح «عرض» الصفوف المخزنة للقراءة فقط. يفتح «تعديل» المسير الحالي غير المصروف: أعد المعالجة واحفظ القيم المتغيرة كنسخة جديدة. يحتاج «اعتماد» تأكيدًا ويتحقق مجددًا من النسخة الحالية المحفوظة.' },
        { en: 'Export to Excel in a row exports that saved payroll’s employee lines. Operations log shows creation, recalculation/replacement and approval with the user, UTC-derived display time, revision and amounts.', ar: 'يصدر Excel الخاص بالصف بنود الموظفين في المسير المحفوظ. يعرض سجل العمليات الإنشاء وإعادة الحساب والاستبدال والاعتماد مع المستخدم والتوقيت ورقم النسخة والمبالغ.' },
      ],
      notes: [
        { en: 'Approval applies to one saved revision. Changed recalculation before payment resets active approval and keeps the old revision approved historically. A concurrent change requires refreshing the list before acting.', ar: 'تخص الموافقة نسخة محفوظة واحدة. تعيد تغييرات الحساب قبل الصرف الموافقة الحالية إلى الانتظار، مع الاحتفاظ بالموافقة التاريخية للنسخة السابقة. يتطلب التغيير المتزامن تحديث القائمة قبل الإجراء.' },
        { en: 'Approve does not disburse or post a journal. Disbursement and monetary settlements require their separate payment workflow. Cancelled is reserved for cancelling a complete run and is not used for replacing revisions.', ar: 'لا يصرف «اعتماد» الراتب ولا يرحّل قيدًا. يحتاج الصرف والتسويات المالية دورة دفع مستقلة. تُحجز حالة «ملغى» لإلغاء المسير كاملًا، ولا تستخدم لاستبدال النسخ.' },
      ],
    },
  ],
  questions: [
    { question: { en: 'Which salary is used for an older month?', ar: 'أي راتب يُستخدم لشهر سابق؟' }, answer: { en: 'The latest salary effective in that payroll period, not a future salary revision. Saved payroll revisions retain their original figures.', ar: 'آخر راتب سارٍ في فترة الرواتب، وليس تعديل راتب مستقبليًا. تحتفظ النسخ المحفوظة بأرقامها الأصلية.' } },
    { question: { en: 'Does recalculation cancel the whole run?', ar: 'هل إعادة الحساب تلغي المسير كاملًا؟' }, answer: { en: 'No. Changed unpaid payroll creates a new revision and supersedes the old revision. The new revision needs approval.', ar: 'لا. تنشئ تغييرات المسير غير المصروف نسخة جديدة تستبدل السابقة. تحتاج النسخة الجديدة موافقة.' } },
    { question: { en: 'Does Save or Approve mean the salary was paid?', ar: 'هل الحفظ أو الموافقة يعني أن الراتب صُرف؟' }, answer: { en: 'No. Payment is separate; it must use the current approved revision and keep that paid snapshot immutable.', ar: 'لا. الصرف مستقل، ويجب أن يستخدم النسخة الحالية المعتمدة ويحافظ على ثبات اللقطة المصروفة.' } },
  ],
};
