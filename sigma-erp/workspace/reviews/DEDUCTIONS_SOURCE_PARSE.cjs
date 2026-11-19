const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const ts = require(root + '/node_modules/typescript');
const feature = root + '/src/app/modules/HRM/Deductions/Deduction';
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).reduce((all, item) => all.concat(item.isDirectory() ? files(path.join(dir, item.name)) : [path.join(dir, item.name)]), []);
}
(async () => {
  const compiler = await import(pathToFileURL(root + '/node_modules/@angular/compiler/fesm2022/compiler.mjs').href);
  let failures = 0;
  let sourceCount = 0;
  const sources = files(feature).filter(file => file.endsWith('.ts'));
  sources.push(root + '/src/app/modules/UserGuide/content/hrm-guide.ts');
  sources.push(root + '/src/app/modules/shared/components/editor-dialog/editor-dialog.component.ts');
  sources.push(root + '/src/app/_metronic/layout/components/toolbar/toolbar.component.ts');
  sources.push(root + '/src/app/modules/i18n/vocabs/en.ts', root + '/src/app/modules/i18n/vocabs/ar.ts');
  for (const file of sources) {
    const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    sourceCount++;
    for (const error of source.parseDiagnostics) {
      failures++;
      console.log(file + ': ' + ts.flattenDiagnosticMessageText(error.messageText, '\n'));
    }
    if (!file.startsWith(feature)) continue;
    for (const node of source.statements) {
      if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) continue;
      const name = node.moduleSpecifier.text;
      if (!name.startsWith('.') && !name.startsWith('src/')) continue;
      const target = name.startsWith('src/') ? path.join(root, name) : path.resolve(path.dirname(file), name);
      if (![target + '.ts', path.join(target, 'index.ts')].some(file => fs.existsSync(file))) {
        failures++; console.log('Missing import: ' + file + ' -> ' + name);
      }
    }
  }
  let templateCount = 0;
  for (const file of files(feature).filter(file => file.endsWith('.html')).concat(root + '/src/app/modules/shared/components/editor-dialog/editor-dialog.component.html')) {
    templateCount++;
    const parsed = compiler.parseTemplate(fs.readFileSync(file, 'utf8'), file);
    for (const error of parsed.errors || []) { failures++; console.log(error.toString()); }
  }
  console.log(JSON.stringify({ sourceCount, templateCount, failures, scope: 'syntax and source import-path existence only; no build, type-check or runtime' }));
  process.exitCode = failures ? 1 : 0;
})();
