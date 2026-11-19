// Source inspection only: no type-check, build, test, application or database execution.
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const ts = require(path.join(root, 'node_modules/typescript/lib/typescript.js'));
const payroll = path.join(root, 'src/app/modules/HRM/Payroll');
const collect = dir => fs.readdirSync(dir, { withFileTypes: true }).reduce((out, item) => {
  const file = path.join(dir, item.name);
  return out.concat(item.isDirectory() ? collect(file) : [file]);
}, []);
const extra = [
  'src/app/pages/routing.ts',
  'src/app/modules/i18n/vocabs/en.ts',
  'src/app/modules/i18n/vocabs/ar.ts',
  'src/app/modules/UserGuide/content/hrm-guide.ts',
  'src/app/_metronic/layout/components/toolbar/toolbar.component.ts',
].map(file => path.join(root, file));
const tsFiles = collect(payroll).filter(file => file.endsWith('.ts')).concat(extra);
const sources = new Map();
const errors = [];
for (const file of tsFiles) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  sources.set(file, source);
  for (const diagnostic of source.parseDiagnostics) errors.push(`${file}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, ' ')}`);
  if (file.startsWith(payroll)) {
    const inspect = node => {
      if (ts.isObjectLiteralExpression(node)) {
        const template = node.properties.find(p => p.name?.getText(source) === 'templateUrl')?.initializer;
        if (template && ts.isStringLiteral(template) && !fs.existsSync(path.resolve(path.dirname(file), template.text)))
          errors.push(`Missing component template ${template.text} in ${file}`);
        const names = new Set(node.properties.map(p => p.name?.getText(source)));
        if (names.has('labelKey') && names.has('value') && names.has('icon') && !names.has('accent'))
          errors.push(`SummaryCard requires accent in ${file}`);
      }
      ts.forEachChild(node, inspect);
    };
    inspect(source);
  }
}
const propertyName = node => node?.name && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) ? node.name.text : null;
const objectProperty = (object, key) => object?.properties?.find(node => propertyName(node) === key)?.initializer;
const localeObject = file => {
  let result;
  for (const statement of sources.get(file).statements) if (ts.isVariableStatement(statement)) {
    for (const declaration of statement.declarationList.declarations) if (declaration.name.getText() === 'locale') result = objectProperty(declaration.initializer, 'data');
  }
  return result;
};
const en = localeObject(path.join(root, 'src/app/modules/i18n/vocabs/en.ts'));
const ar = localeObject(path.join(root, 'src/app/modules/i18n/vocabs/ar.ts'));
const hasKey = (object, key) => key.split('.').reduce((node, segment) => objectProperty(node, segment), object) !== undefined;
const keys = new Set();
const backendService = fs.readFileSync('F:/My Work/Sigma/SigmaBackend/SiGma.Business/Services/Payrolls/PayrollRunService.cs', 'utf8');
for (const match of backendService.matchAll(/"((?:payrollProcess|finalSettlementProcess)\.[a-zA-Z0-9_.]+)"/g)) keys.add(match[1]);
const checkObjectDuplicates = (object, label) => {
  if (!object || !ts.isObjectLiteralExpression(object)) return;
  const seen = new Set();
  for (const property of object.properties) {
    const name = propertyName(property);
    if (name && seen.has(name)) errors.push(`Duplicate translation key ${label}.${name}`);
    if (name) { seen.add(name); checkObjectDuplicates(property.initializer, `${label}.${name}`); }
  }
};
for (const [language, dictionary] of [['en', en], ['ar', ar]]) {
  for (const name of ['leaveSalaryPayrollProcess', 'payrolls', 'payrollProcess', 'finalSettlementProcess', 'paySlips']) checkObjectDuplicates(objectProperty(dictionary, name), `${language}.${name}`);
  checkObjectDuplicates(objectProperty(objectProperty(dictionary, 'sideMenu'), 'payrolls'), `${language}.sideMenu.payrolls`);
}
for (const [file, source] of sources) {
  if (file.includes('/i18n/') || file.includes('\\i18n\\')) continue;
  const visit = node => {
    if (ts.isStringLiteral(node) && /^(leaveSalaryPayrollProcess|payrollProcess|payrolls|finalSettlementProcess|paySlips)\.[a-zA-Z]/.test(node.text)) keys.add(node.text);
    ts.forEachChild(node, visit);
  };
  visit(source);
}
const exportsOf = file => {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const names = new Set();
  for (const node of source.statements) {
    if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) for (const element of node.exportClause.elements) names.add(element.name.text);
    if (node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
      if (node.name) names.add(node.name.text);
      if (ts.isVariableStatement(node)) for (const declaration of node.declarationList.declarations) names.add(declaration.name.getText(source));
    }
  }
  return names;
};
let localImports = 0;
for (const [file, source] of sources) {
  if (!file.startsWith(payroll)) continue;
  for (const node of source.statements) {
    if (!ts.isImportDeclaration(node)) continue;
    const specifier = node.moduleSpecifier.text;
    if (!(specifier.startsWith('.') || specifier.startsWith('src/'))) continue;
    const resolved = path.resolve(specifier.startsWith('.') ? path.dirname(file) : root, specifier) + '.ts';
    localImports++;
    if (!fs.existsSync(resolved)) { errors.push(`Missing import ${specifier} in ${file}`); continue; }
    const names = exportsOf(resolved);
    const binding = node.importClause?.namedBindings;
    if (binding && ts.isNamedImports(binding)) for (const element of binding.elements) {
      const name = element.propertyName?.text ?? element.name.text;
      if (!names.has(name)) errors.push(`Missing named export ${name} in ${resolved}`);
    }
  }
}
(async () => {
  const { parseTemplate } = await import(pathToFileURL(path.join(root, 'node_modules/@angular/compiler/fesm2022/compiler.mjs')).href);
  const templates = collect(payroll).filter(file => file.endsWith('.html'));
  for (const file of templates) {
    const content = fs.readFileSync(file, 'utf8');
    const parsed = parseTemplate(content, file);
    if (parsed.errors?.length) for (const error of parsed.errors) errors.push(`${file}: ${error}`);
    for (const match of content.matchAll(/['"]((?:leaveSalaryPayrollProcess|payrollProcess|payrolls|finalSettlementProcess|paySlips)\.[a-zA-Z0-9_.]+)['"]/g)) keys.add(match[1]);
  }
  keys.add('payrollProcess.issues.duplicatePayrollScope');
  for (const key of [...keys]) {
    if (key.endsWith('.')) {
      keys.delete(key);
      const options = key === 'finalSettlementProcess.bases.' ? ['basic', 'gross'] : key === 'finalSettlementProcess.proration.' ? ['calendarDays', 'fixed30'] : [];
      if (!options.length) errors.push(`Unresolved dynamic translation family ${key}`);
      for (const option of options) keys.add(key + option);
    }
  }
  for (const key of keys) {
    if (!hasKey(en, key)) errors.push(`Missing English key ${key}`);
    if (!hasKey(ar, key)) errors.push(`Missing Arabic key ${key}`);
  }
  for (const key of ['sideMenu.hrm', 'sideMenu.payrolls.processPayroll', 'sideMenu.payrolls.processLeaveSalary', 'sideMenu.payrolls.processedPayrolls', 'sideMenu.payrolls.finalSettlementProcess', 'sideMenu.payrolls.paySlips']) {
    if (!hasKey(en, key) || !hasKey(ar, key)) errors.push(`Missing bilingual navigation key ${key}`);
  }
  const summary = { scope: 'source syntax, exact local import exports and feature translation presence only', typescriptFiles: tsFiles.length, templates: templates.length, localImports, translationKeys: keys.size, errors };
  fs.writeFileSync('F:/My Work/Sigma/reviews/PAYROLL_FINAL_SETTLEMENT_PAY_SLIPS_SOURCE_CHECK.json', JSON.stringify(summary, null, 2) + '\n');
  process.stdout.write(JSON.stringify(summary, null, 2) + '\n');
  process.exitCode = errors.length ? 1 : 0;
})().catch(error => { process.stderr.write(String(error)); process.exitCode = 1; });
