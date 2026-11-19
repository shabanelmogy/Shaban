// Read-only source inventory; does not compile, execute Angular, or run tests.
const fs = require('fs');
const path = require('path');
const ts = require('F:/My Work/Sigma/SiGmaAngularFrontEnd/node_modules/typescript');
const repo = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const blocks = new Set(['rentalAgreement', 'rentalBooking', 'rentalQuotation', 'masterAgreement', 'rentalTariff', 'tariffCards', 'tariffCard', 'driverTimeSheet', 'rentalPlanner']);
function vocab(language) {
  const filename = `${repo}/src/app/modules/i18n/vocabs/${language}.ts`;
  const source = ts.createSourceFile(filename, fs.readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true);
  const keys = new Map();
  const duplicates = [];
  function object(node, prefix) {
    const names = new Set();
    for (const prop of node.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      const name = prop.name.text;
      if (names.has(name)) duplicates.push(`${prefix}.${name}`);
      names.add(name);
      const key = prefix ? `${prefix}.${name}` : name;
      if (ts.isObjectLiteralExpression(prop.initializer)) object(prop.initializer, key);
      else keys.set(key.replace(/^data\./, ''), prop.initializer.getText(source));
    }
  }
  function walk(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === 'locale') object(node.initializer, '');
    else ts.forEachChild(node, walk);
  }
  walk(source);
  return { keys, duplicates: duplicates.filter(key => blocks.has(key.split('.')[1])) };
}
const en = vocab('en');
const ar = vocab('ar');
const scoped = key => blocks.has(key.split('.')[0]);
const missingAr = [...en.keys.keys()].filter(key => scoped(key) && !ar.keys.has(key));
const missingEn = [...ar.keys.keys()].filter(key => scoped(key) && !en.keys.has(key));
const references = new Set();
function files(dir) {
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...files(file));
    else if (/\.(ts|html)$/.test(file) && !/\.spec\.ts$/.test(file)) result.push(file);
  }
  return result;
}
for (const file of files(`${repo}/src/app/modules/Rental`)) {
  const source = fs.readFileSync(file, 'utf8');
  const matches = source.matchAll(/['"]((?:rentalAgreement|rentalBooking|rentalQuotation|masterAgreement|rentalTariff|tariffCards|tariffCard|driverTimeSheet|rentalPlanner)\.[\w.]+)['"]/g);
  for (const match of matches) references.add(match[1]);
}
// confirmDiscard receives a namespace and resolves its existing child keys.
const namespaces = new Set(['rentalAgreement.documents']);
const missingReferences = [...references].filter(key => !namespaces.has(key) && (!en.keys.has(key) || !ar.keys.has(key)));
console.log(JSON.stringify({ missingAr, missingEn, missingReferences, duplicateEn: en.duplicates, duplicateAr: ar.duplicates }, null, 2));
