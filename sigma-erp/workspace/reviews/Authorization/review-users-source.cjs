// Source parsing only: no application compilation, tests or runtime verification.
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const ts = require(path.join(root, 'node_modules/typescript'));
const files = [
  'src/app/modules/Administration/Users/components/details/details.component.ts',
  'src/app/modules/Administration/Users/components/details/details.component.html',
  'src/app/modules/Administration/Users/components/access-editor/access-editor.component.html',
  'src/app/modules/i18n/vocabs/authorization.ts',
  'src/app/modules/UserGuide/content/administration-guide.ts',
];
(async () => {
  const { parseTemplate } = await import(pathToFileURL(path.join(root, 'node_modules/@angular/compiler/fesm2022/compiler.mjs')).href);
  let failures = 0;
  for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), 'utf8');
    const errors = file.endsWith('.html') ? parseTemplate(source, file).errors || []
      : ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true).parseDiagnostics;
    for (const error of errors) { failures++; process.stderr.write(file + ': ' + (error.messageText ? ts.flattenDiagnosticMessageText(error.messageText, '\n') : String(error)) + '\n'); }
  }
  process.stdout.write(`${files.length} source files parsed; ${failures} syntax errors. No type-check/build/runtime claim.\n`);
  process.exitCode = failures ? 1 : 0;
})();
