const fs = require('fs');
const path = require('path');
const ts = require('F:/My Work/Sigma/SiGmaAngularFrontEnd/node_modules/typescript');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
function entries(node, prefix = '', result = {}) {
  if (!ts.isObjectLiteralExpression(node)) return result;
  for (const p of node.properties) {
    if (!ts.isPropertyAssignment(p)) continue;
    const name = p.name.text;
    const key = prefix ? prefix + '.' + name : name;
    result[key] = p.initializer;
    entries(p.initializer, key, result);
  }
  return result;
}
function locale(file) {
  const text = fs.readFileSync(file, 'utf8');
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  let data;
  const visit = n => { if (ts.isVariableDeclaration(n) && n.name.text === 'locale') data = entries(n.initializer)['data']; ts.forEachChild(n, visit); };
  visit(ast);
  return { text, ast, values: entries(data) };
}
const en = locale(root + '/src/app/modules/i18n/vocabs/en.ts');
const ar = locale(root + '/src/app/modules/i18n/vocabs/ar.ts');
const keys = new Set();
const walk = dir => { for (const name of fs.readdirSync(dir)) { const file = path.join(dir,name); if (fs.statSync(file).isDirectory()) walk(file); else if (/\.(ts|html)$/.test(name) && !/\.spec\./.test(name)) { const source=fs.readFileSync(file,'utf8'); for (const m of source.matchAll(/['"]((?:general|tripBooking|location|tripType|limoQuotation|limousineInvoice|limousineTariff|limousineTariffReport|limousineUtilizationReport|chauffeurForcedAllocationsReport|sideMenu|driversTracker|tripGridCustomization)\.[\w.]+)['"]/g)) keys.add(m[1]); } } };
walk(root + '/src/app/modules/Limousine');
console.log(JSON.stringify({ missingEN: [...keys].filter(k=> !en.values[k]).sort(), missingAR: [...keys].filter(k=>!ar.values[k]).sort() },null,2));
