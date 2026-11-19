// Targeted translation authoring; parses source only and preserves unrelated entries.
const fs = require('fs');
const ts = require('F:/My Work/Sigma/SiGmaAngularFrontEnd/node_modules/typescript');
const values = {
  'rentalPlanner.loading': ['Loading rental planner...', 'جارٍ تحميل مخطط التأجير...'],
  'rentalAgreement.depositDialog.removeDocumentTitle': ['Remove attachment?', 'إزالة المرفق؟'],
  'rentalAgreement.depositDialog.removeDocumentMessage': ['This attachment will be excluded when the deposit is saved.', 'سيُستبعد هذا المرفق عند حفظ التأمين.'],
  'rentalAgreement.deliveryDate.validation.endDate': ['Delivery date must not be after the agreement end date.', 'يجب ألا يتجاوز تاريخ التسليم تاريخ انتهاء الاتفاقية.'],
  'rentalAgreement.deliveryDate.title': ['Change Delivery Date', 'تغيير تاريخ التسليم'],
  'rentalAgreement.logs.title': ['Agreement Log', 'سجل الاتفاقية'],
  'rentalAgreement.logs.subtitle': ['Agreement: {{no}}', 'الاتفاقية: {{no}}'],
  'masterAgreement.discardTitle': ['Discard changes?', 'تجاهل التغييرات؟'],
  'masterAgreement.discardMessage': ['Your unsaved master agreement changes will be lost.', 'ستفقد تغييرات الاتفاقية الرئيسية غير المحفوظة.'],
  'masterAgreement.discard': ['Discard', 'تجاهل'],
  'rentalAgreement.depositDialog.savedCleanupPending': ['The deposit was saved. Retry file cleanup to finish without saving the deposit again.', 'تم حفظ التأمين. أعد محاولة تنظيف الملفات لإكمال العملية دون حفظ التأمين مرة أخرى.'],
  'rentalBooking.saveSuccess': ['Rental booking saved successfully.', 'تم حفظ حجز التأجير بنجاح.'],
  'rentalAgreement.errors.invalidId': ['The rental agreement identifier is invalid.', 'معرّف اتفاقية التأجير غير صالح.'],
  'rentalAgreement.fuelLevel': ['Fuel Level', 'مستوى الوقود'],
  'rentalAgreement.discardTitle': ['Discard changes?', 'تجاهل التغييرات؟'],
  'rentalAgreement.discardMessage': ['Your unsaved agreement changes will be lost.', 'ستفقد تغييرات اتفاقية التأجير غير المحفوظة.'],
  'rentalBooking.fileCleanupFailed': ['Could not remove some files. Retry cleanup before leaving.', 'تعذر حذف بعض الملفات. أعد محاولة التنظيف قبل المغادرة.'],
  'rentalBooking.savedCleanupPending': ['The booking was saved. Retry file cleanup to finish; the booking will not be saved again.', 'تم حفظ الحجز. أعد محاولة تنظيف الملفات لإكمال العملية؛ لن يُحفظ الحجز مرة أخرى.'],
  'rentalBooking.argeements': ['Agreements', 'الاتفاقيات'],
  'rentalQuotation.actions.createMasterAgreement': ['Create Master Agreement', 'إنشاء اتفاقية رئيسية'],
  'rentalTariff.editorTitle': ['Rental Tariff', 'تعرفة التأجير'],
  'rentalTariff.editorSubtitle': ['Vehicle type: {{name}}', 'نوع المركبة: {{name}}'],
  'driverTimeSheet.discardTitle': ['Discard changes?', 'تجاهل التغييرات؟'],
  'driverTimeSheet.discardMessage': ['Your unsaved time sheet changes will be lost.', 'ستفقد تغييرات سجل وقت السائق غير المحفوظة.'],
  'driverTimeSheet.discard': ['Discard', 'تجاهل'],
};
for (const [index, language] of ['en', 'ar'].entries()) {
  const filename = `F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/${language}.ts`;
  let text = fs.readFileSync(filename, 'utf8');
  function objects() {
    const source = ts.createSourceFile(filename, text, ts.ScriptTarget.Latest, true);
    const map = new Map();
    function visit(node, prefix) {
      if (!ts.isObjectLiteralExpression(node)) return;
      map.set(prefix, node);
      for (const property of node.properties) {
        if (ts.isPropertyAssignment(property)) {
          const key = prefix ? `${prefix}.${property.name.text}` : property.name.text;
          map.set(key, property);
          if (ts.isObjectLiteralExpression(property.initializer)) visit(property.initializer, key);
        }
      }
    }
    function walk(node) {
      if (ts.isVariableDeclaration(node) && node.name.getText(source) === 'locale') visit(node.initializer, '');
      else ts.forEachChild(node, walk);
    }
    walk(source);
    return { source, map };
  }
  for (const [key, translations] of Object.entries(values)) {
    const { source, map } = objects();
    const existing = map.get(`data.${key}`);
    const literal = `'${translations[index].replace(/'/g, "\\'")}'`;
    if (existing) {
      text = text.slice(0, existing.initializer.getStart(source)) + literal + text.slice(existing.initializer.end);
    } else {
      const segments = key.split('.');
      const name = segments.pop();
      const parent = map.get(`data.${segments.join('.')}`);
      if (!parent || !ts.isObjectLiteralExpression(parent)) throw new Error(`Missing object ${key}`);
      const position = parent.getStart(source) + 1;
      const indent = '  '.repeat(segments.length + 2);
      text = text.slice(0, position) + `\n${indent}${name}: ${literal},` + text.slice(position);
    }
  }
  // The required PowerShell parity checker reads one property per line.
  if (language === 'ar') {
    for (const group of ['types', 'statuses', 'tabs', 'sections']) {
      const { source, map } = objects();
      const parent = map.get(`data.rentalBooking.${group}`);
      const replacement = '{\n' + parent.properties.map(property => `        ${property.getText(source)},`).join('\n') + '\n      }';
      text = text.slice(0, parent.getStart(source)) + replacement + text.slice(parent.end);
    }
  }
  fs.writeFileSync(filename, text);
}
