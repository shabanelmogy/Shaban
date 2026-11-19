const fs = require('fs');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs';
const changes = {
  en: { select: 'Selection', paymentMethod: 'Payment Method', posted: 'Posted', voided: 'Voided', saveAndPrint: 'Save and Print', saveRetry: 'Your changes are retained. Review and retry.' },
  ar: { select: 'التحديد', paymentMethod: 'طريقة الدفع', posted: 'مرحل', voided: 'ملغى', saveAndPrint: 'حفظ وطباعة', saveRetry: 'تم الاحتفاظ بتعديلاتك. راجعها وأعد المحاولة.' },
};
for (const [language, keys] of Object.entries(changes)) {
  const file = `${root}/${language}.ts`;
  let source = fs.readFileSync(file, 'utf8');
  const editor = Object.entries(keys).filter(([key]) => key !== 'saveRetry').map(([key,value]) => `        ${JSON.stringify(key)}: ${JSON.stringify(value)},`).join('\n');
  source = source.replace('      "editor": {', '      "editor": {\n' + editor);
  source = source.replace('      "errors": {', '      "errors": {\n        "saveRetry": ' + JSON.stringify(keys.saveRetry) + ',');
  fs.writeFileSync(file, source);
}
