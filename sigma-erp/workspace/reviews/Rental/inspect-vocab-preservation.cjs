// Read-only translation snapshot inventory; no compilation or application execution.
const fs = require('fs');
const ts = require('F:/My Work/Sigma/SiGmaAngularFrontEnd/node_modules/typescript');
const root = 'F:/My Work/Sigma';
const owned = new Set(['rentalAgreement', 'rentalBooking', 'rentalQuotation', 'masterAgreement', 'rentalTariff', 'tariffCards', 'tariffCard', 'driverTimeSheet', 'rentalPlanner']);
function leaves(file) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const values = new Map();
  function object(node, prefix) {
    for (const prop of node.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      const key = prefix ? `${prefix}.${prop.name.text}` : prop.name.text;
      if (ts.isObjectLiteralExpression(prop.initializer)) object(prop.initializer, key);
      else values.set(key.replace(/^data\./, ''), prop.initializer.getText(source));
    }
  }
  function walk(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === 'locale') object(node.initializer, '');
    else ts.forEachChild(node, walk);
  }
  walk(source);
  return values;
}
const inventory = ['en', 'ar'].map(language => {
  const before = leaves(`${root}/reviews/Rental/BASELINE_src_app_modules_i18n_vocabs_${language}.ts`);
  const after = leaves(`${root}/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/${language}.ts`);
  const changes = [...new Set([...before.keys(), ...after.keys()])].filter(key => before.get(key) !== after.get(key));
  return { language, changedKeys: changes.length, outsideOwnedBlocks: changes.filter(key => !owned.has(key.split('.')[0])) };
});
console.log(JSON.stringify(inventory, null, 2));
