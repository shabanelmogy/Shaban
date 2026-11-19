// Read source syntax only. This does not compile, test, build, or run the application.
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const ts = require(path.join(root, 'node_modules/typescript/lib/typescript.js'));
const sourceFiles = [
  'src/app/modules/HRM/Payroll/PayrollProcess/components/process/payroll-process.component.ts',
  'src/app/modules/UserGuide/content/hrm-guide.ts',
  'src/app/modules/i18n/vocabs/en.ts',
  'src/app/modules/i18n/vocabs/ar.ts',
];
(async () => {
  let failed = false;
  for (const file of sourceFiles) {
    const source = ts.createSourceFile(file, fs.readFileSync(path.join(root, file), 'utf8'), ts.ScriptTarget.Latest, true);
    const diagnostics = source.parseDiagnostics;
    process.stdout.write(JSON.stringify({ file, syntaxDiagnostics: diagnostics.length }) + '\n');
    if (diagnostics.length) {
      failed = true;
      for (const diagnostic of diagnostics) process.stdout.write(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n') + '\n');
    }
  }
  const compiler = await import(pathToFileURL(path.join(root, 'node_modules/@angular/compiler/fesm2022/compiler.mjs')).href);
  const templatePath = 'src/app/modules/HRM/Payroll/PayrollProcess/components/process/payroll-process.component.html';
  const template = compiler.parseTemplate(fs.readFileSync(path.join(root, templatePath), 'utf8'), templatePath);
  process.stdout.write(JSON.stringify({ file: templatePath, syntaxDiagnostics: template.errors?.length ?? 0 }) + '\n');
  if (template.errors?.length) {
    failed = true;
    for (const error of template.errors) process.stdout.write(error.toString() + '\n');
  }
  process.exitCode = failed ? 1 : 0;
})();
