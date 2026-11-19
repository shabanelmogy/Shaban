// Source parsing and contract inventory only. No compilation, tests or runtime application.
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const frontend = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const feature = `${frontend}/src/app/modules/Banking/Cash Deposits/CashDeposit`;
const ts = require(`${frontend}/node_modules/typescript`);
function files(folder) {
  return fs.readdirSync(folder, { withFileTypes: true }).reduce((result, entry) => result.concat(entry.isDirectory() ? files(path.join(folder, entry.name)) : path.join(folder, entry.name)), []);
}
function dictionary(language) {
  const source = ts.createSourceFile(language, fs.readFileSync(`${frontend}/src/app/modules/i18n/vocabs/${language}.ts`, 'utf8'), ts.ScriptTarget.Latest, true);
  const result = new Map();
  function scan(node, prefix) {
    if (!ts.isObjectLiteralExpression(node)) return;
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const key = property.name.getText(source).replace(/^['"]|['"]$/g, '');
      const name = prefix ? `${prefix}.${key}` : key;
      if (ts.isObjectLiteralExpression(property.initializer)) scan(property.initializer, name);
      else result.set(name, property.initializer.getText(source));
    }
  }
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(source) === 'locale') scan(node.initializer, '');
    ts.forEachChild(node, visit);
  }
  visit(source);
  return { source, result };
}
(async () => {
  const compiler = await import(pathToFileURL(`${frontend}/node_modules/@angular/compiler/fesm2022/compiler.mjs`).href);
  const issues = [], inspected = [], usedKeys = new Set();
  const targets = files(feature).map(file => file.replace(/\\/g, '/')).filter(file => /\.(ts|html)$/.test(file));
  targets.push(`${frontend}/src/app/pages/routing.ts`, `${frontend}/src/app/_metronic/layout/layout.module.ts`, `${frontend}/src/app/_metronic/layout/components/toolbar/toolbar.component.ts`);
  for (const file of targets) {
    if (!fs.existsSync(file)) { issues.push(`Missing audit target ${file}`); continue; }
    const source = fs.readFileSync(file, 'utf8');
    inspected.push(file);
    if (file.endsWith('.html')) {
      const parsed = compiler.parseTemplate(source, file);
      for (const error of parsed.errors || []) issues.push(`${file}: ${error}`);
    } else {
      const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
      for (const error of parsed.parseDiagnostics) issues.push(`${file}: ${ts.flattenDiagnosticMessageText(error.messageText, '\n')}`);
      if (file.startsWith(feature)) {
        for (const node of parsed.statements) {
          if (!ts.isImportDeclaration(node)) continue;
          const specifier = node.moduleSpecifier.text;
          if (!specifier.startsWith('.') && !specifier.startsWith('src/')) continue;
          const resolved = specifier.startsWith('.') ? path.resolve(path.dirname(file), specifier) : `${frontend}/${specifier}`;
          if (![resolved + '.ts', resolved + '/index.ts', resolved + '.d.ts'].some(fs.existsSync)) issues.push(`${file}: unresolved source import ${specifier}`);
        }
      }
    }
    if (file.startsWith(feature)) for (const match of source.matchAll(/['"]((?:cashDeposits|general|validationMessages)\.[A-Za-z.]+)['"]/g)) usedKeys.add(match[1]);
  }
  const en = dictionary('en'), ar = dictionary('ar');
  for (const locale of [en, ar]) for (const error of locale.source.parseDiagnostics) issues.push(ts.flattenDiagnosticMessageText(error.messageText, '\n'));
  for (const key of usedKeys) {
    for (const [language, locale] of [['en', en], ['ar', ar]]) if (!locale.result.has('data.' + key)) issues.push(`${language}: missing ${key}`);
  }
  const enKeys = [...en.result.keys()].filter(key => key.startsWith('data.cashDeposits.'));
  const arKeys = [...ar.result.keys()].filter(key => key.startsWith('data.cashDeposits.'));
  for (const key of enKeys) if (!ar.result.has(key)) issues.push(`Arabic parity ${key}`);
  for (const key of arKeys) if (!en.result.has(key)) issues.push(`English parity ${key}`);
  const output = { mode: 'Source-only parsing; no type compilation or application execution', inspected, usedTranslationKeys: [...usedKeys].sort(), cashDepositKeys: { en: enKeys.length, ar: arKeys.length }, issues };
  fs.writeFileSync('F:/My Work/Sigma/reviews/CASH_DEPOSITS_SOURCE_AUDIT.json', JSON.stringify(output, null, 2));
  console.log(JSON.stringify({ inspected: inspected.length, translationKeys: usedKeys.size, cashDepositKeys: output.cashDepositKeys, issues }, null, 2));
})();
