const fs = require('fs');
const path = require('path');
const ts = require('F:/My Work/Sigma/SiGmaAngularFrontEnd/node_modules/typescript');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const files = [];
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    if (fs.statSync(file).isDirectory()) walk(file);
    else if (/\.(ts|html)$/.test(name) && !/\.spec\.ts$/.test(name)) files.push(file);
  }
}
walk(root + '/src/app/modules/Limousine');
files.push(...['src/app/modules/i18n/vocabs/en.ts', 'src/app/modules/i18n/vocabs/ar.ts',
  'src/app/_metronic/layout/layout.module.ts', 'src/app/_metronic/layout/components/toolbar/toolbar.component.ts'].map(f => root + '/' + f));
(async () => {
  const compiler = await import('file:///' + root + '/node_modules/@angular/compiler/fesm2022/compiler.mjs');
  const errors = [];
  let typescript = 0, templates = 0;
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    if (file.endsWith('.ts')) {
      typescript++;
      const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
      for (const error of ast.parseDiagnostics) errors.push({ file, message: ts.flattenDiagnosticMessageText(error.messageText, '\n') });
      for (const statement of ast.statements) {
        if (!ts.isImportDeclaration(statement)) continue;
        const specifier = statement.moduleSpecifier.text;
        if (!(specifier.startsWith('.') || specifier.startsWith('src/'))) continue;
        const target = specifier.startsWith('.') ? path.resolve(path.dirname(file), specifier) : path.join(root, specifier);
        if (![target, target + '.ts', path.join(target, 'index.ts')].some(p => fs.existsSync(p))) errors.push({ file, missingImport: specifier });
      }
    } else {
      templates++;
      for (const error of compiler.parseTemplate(source, file).errors ?? []) errors.push({ file, message: error.toString() });
    }
  }
  const result = { verification: 'Syntax parsing and local import resolution only; no typecheck/build/test/runtime', typescript, templates, errors };
  fs.writeFileSync('F:/My Work/Sigma/reviews/Limousine/SOURCE_VERIFICATION.json', JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
