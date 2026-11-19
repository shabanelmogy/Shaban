const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { execFileSync } = require('child_process');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const ts = require(root + '/node_modules/typescript');
const directories = [
  'src/app/modules/Vouchers/Invoices/Invoice/components/tax-advance-details',
  'src/app/modules/Vouchers/Receipts/Receipt',
];
const changed = execFileSync('git', ['-c', 'core.safecrlf=false', 'diff', '--name-only', '--',
  'src/app/modules/Rental/Booking', 'src/app/modules/Rental/Agreement', 'src/app/modules/Lease/LeaseAgreement'],
  { cwd: root, encoding: 'utf8' }).trim().split(/\r?\n/).filter(Boolean);
const files = new Set(changed);
for (const file of [
  'src/app/modules/Vouchers/Invoices/Invoice/models/tax-advance.ts',
  'src/app/modules/Vouchers/Invoices/Invoice/services/tax-advance.service.ts',
  'src/app/modules/Vouchers/Invoices/Invoice/invoice.routes.ts',
  'src/app/modules/Limousine/LimoQuotation/components/list/list.component.html',
  'src/app/modules/Limousine/Location/components/details/details.component.ts',
  'src/app/modules/Limousine/TripGridCustomization/components/details/details.component.ts',
  'src/app/modules/i18n/vocabs/en.ts', 'src/app/modules/i18n/vocabs/ar.ts',
]) files.add(file);
function walk(relative) {
  for (const item of fs.readdirSync(path.join(root, relative), { withFileTypes: true })) {
    const next = relative + '/' + item.name;
    if (item.isDirectory()) walk(next);
    else if (/\.(ts|html)$/.test(next) && !next.endsWith('.spec.ts')) files.add(next);
  }
}
directories.forEach(walk);
function parse(file) { return ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true); }
function objectKeys(node, prefix = '', keys = new Set()) {
  if (!ts.isObjectLiteralExpression(node)) return keys;
  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const name = property.name.text;
    const key = prefix ? prefix + '.' + name : name;
    if (ts.isObjectLiteralExpression(property.initializer)) objectKeys(property.initializer, key, keys);
    else keys.add(key);
  }
  return keys;
}
function localeKeys(lang) {
  let data;
  const source = parse(path.join(root, 'src/app/modules/i18n/vocabs/' + lang + '.ts'));
  function visit(node) {
    if (ts.isPropertyAssignment(node) && node.name.text === 'data' && ts.isObjectLiteralExpression(node.initializer)) data = node.initializer;
    ts.forEachChild(node, visit);
  }
  visit(source);
  return objectKeys(data);
}
(async () => {
  const ng = await import(pathToFileURL(root + '/node_modules/@angular/compiler/fesm2022/compiler.mjs').href);
  const issues = [], counts = { ts: 0, html: 0 }, requiredKeys = new Set(['contractSettlement.expectedAdvance', 'contractSettlement.expectedDeposit']);
  for (const relative of files) {
    const file = path.join(root, relative), text = fs.readFileSync(file, 'utf8');
    if (relative.endsWith('.ts')) {
      counts.ts++;
      const source = parse(file);
      source.parseDiagnostics.forEach(error => issues.push({ file: relative, message: ts.flattenDiagnosticMessageText(error.messageText, ' ') }));
      for (const node of source.statements) {
        if (!ts.isImportDeclaration(node)) continue;
        const imported = node.moduleSpecifier.text;
        let local = imported.startsWith('src/') ? path.join(root, imported) : imported.startsWith('.') ? path.resolve(path.dirname(file), imported) : null;
        if (!local) continue;
        local = fs.existsSync(local + '.ts') ? local + '.ts' : local + '/index.ts';
        if (!fs.existsSync(local)) { issues.push({ file: relative, message: 'Missing import ' + imported }); continue; }
        const bindings = node.importClause?.namedBindings;
        if (!bindings || !ts.isNamedImports(bindings)) continue;
        const declarations = parse(local).statements;
        const exports = new Set();
        declarations.forEach(statement => {
          if (statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
            if (statement.name) exports.add(statement.name.text);
            if (ts.isVariableStatement(statement)) statement.declarationList.declarations.forEach(item => exports.add(item.name.text));
          }
          if (ts.isExportDeclaration(statement) && statement.exportClause && ts.isNamedExports(statement.exportClause))
            statement.exportClause.elements.forEach(item => exports.add(item.name.text));
        });
        bindings.elements.forEach(item => { const name = (item.propertyName || item.name).text;
          if (!exports.has(name)) issues.push({ file: relative, message: 'Unconfirmed named export ' + name + ' from ' + imported }); });
      }
    } else if (relative.endsWith('.html')) {
      counts.html++;
      (ng.parseTemplate(text, relative).errors || []).forEach(error => issues.push({ file: relative, message: error.toString() }));
    }
    if (relative.includes('tax-advance-details')) {
      for (const match of text.matchAll(/['"]((?:invoice|general|validationMessages|mangeDetails)\.[A-Za-z0-9_.]+)['"]/g)) requiredKeys.add(match[1]);
    }
  }
  const locales = { en: localeKeys('en'), ar: localeKeys('ar') };
  for (const lang of ['en', 'ar']) {
    for (const key of requiredKeys) if (!locales[lang].has(key) && !locales[lang].has(key + '.discardTitle'))
      issues.push({ locale: lang, message: 'Missing translation ' + key });
    for (const key of locales.en) if (key.startsWith('invoice.taxAdvance.') && !locales[lang].has(key)) issues.push({ locale: lang, message: 'Missing translation ' + key });
  }
  console.log(JSON.stringify({ status: issues.length ? 'Issues' : 'Passed', boundary: 'Syntax, local imports/exports, literal translations only; no compilation/typechecking/tests/runtime', counts, checkedTranslationKeys: requiredKeys.size, issues }, null, 2));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
