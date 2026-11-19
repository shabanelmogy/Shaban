// Read-only grammar and translation inspection; no compilation, tests, or application execution.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const require = createRequire(`${root}/package.json`);
const ts = require('typescript');
const { parseTemplate } = await import(pathToFileURL(`${root}/node_modules/@angular/compiler/fesm2022/compiler.mjs`));
const feature = `${root}/src/app/modules/Banking/ChequesPayables`;
const files = [];
function collect(folder) {
  for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) collect(file);
    else if (!file.endsWith('.spec.ts') && /\.(ts|html)$/.test(file)) files.push(file);
  }
}
collect(feature);
const diagnostics = [];
const keys = new Set();
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  if (file.endsWith('.ts')) {
    const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
    for (const item of parsed.parseDiagnostics) diagnostics.push(`${file}: ${ts.flattenDiagnosticMessageText(item.messageText, ' ')}`);
  } else {
    const parsed = parseTemplate(source, file);
    for (const item of parsed.errors ?? []) diagnostics.push(String(item));
  }
  for (const match of source.matchAll(/['"](pdcPayable\.[A-Za-z0-9_.]+)['"]/g)) keys.add(match[1]);
}

function translationBlock(language) {
  const file = `${root}/src/app/modules/i18n/vocabs/${language}.ts`;
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  for (const item of source.parseDiagnostics) diagnostics.push(`${file}: ${ts.flattenDiagnosticMessageText(item.messageText, ' ')}`);
  let block;
  function visit(node) {
    if (ts.isPropertyAssignment(node) && node.name.getText(source) === 'pdcPayable' && ts.isObjectLiteralExpression(node.initializer)) block = node.initializer;
    ts.forEachChild(node, visit);
  }
  visit(source);
  if (!block) throw new Error(`Missing pdcPayable block in ${language}`);
  const entries = new Map();
  function flatten(node, prefix) {
    const seen = new Set();
    for (const item of node.properties) {
      if (!ts.isPropertyAssignment(item)) continue;
      const name = item.name.text ?? item.name.getText(source);
      if (seen.has(name)) diagnostics.push(`${language}: duplicate translation ${prefix}.${name}`);
      seen.add(name);
      const key = `${prefix}.${name}`;
      if (ts.isObjectLiteralExpression(item.initializer)) flatten(item.initializer, key);
      else entries.set(key, item.initializer.text);
    }
  }
  flatten(block, 'pdcPayable');
  return entries;
}
const en = translationBlock('en');
const ar = translationBlock('ar');
const namespaces = ['pdcPayable.statuses', 'pdcPayable.paymentMethods', 'pdcPayable.importDialog'];
for (const suffix of ['createTitle', 'viewTitle', 'editTitle', 'statuses.Pending', 'statuses.Cleared', 'statuses.Cancelled',
  'paymentMethods.Cheque', 'paymentMethods.PDCPayable', 'discardTitle', 'discardMessage', 'discard',
  'importDialog.discardTitle', 'importDialog.discardMessage', 'importDialog.discard']) keys.add(`pdcPayable.${suffix}`);
for (const key of keys) {
  if (namespaces.includes(key)) continue;
  for (const [language, entries] of [['en', en], ['ar', ar]]) {
    if (!entries.has(key)) diagnostics.push(`${language}: missing translation ${key}`);
  }
}
for (const [language, entries, other] of [['en', en, ar], ['ar', ar, en]]) {
  for (const key of entries.keys()) if (!other.has(key)) diagnostics.push(`${language}: unmatched translation ${key}`);
}
console.log(JSON.stringify({ files: files.length, translationKeysReferenced: keys.size, diagnostics }, null, 2));
process.exitCode = diagnostics.length ? 1 : 0;
