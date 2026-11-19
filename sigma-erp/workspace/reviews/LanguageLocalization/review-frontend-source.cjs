// Syntax/translation source audit only; does not build, type-check or run tests.
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const ts = require(path.join(root, 'node_modules/typescript'));
const paths = [
  'src/app/modules/Administration/Languages',
  'src/app/modules/shared/components/editor-dialog',
  'src/app/modules/shared/components/data-table',
  'src/app/modules/shared/components/primary-action-button',
  'src/app/_metronic/layout/components/header/navbar',
  'src/app/_metronic/layout/layout.component.ts',
  'src/app/_metronic/layout/components/toolbar/toolbar.component.ts',
  'src/app/modules/i18n/translation.service.ts',
  'src/app/modules/i18n/vocabs/languages.ts',
  'src/app/modules/i18n/vocabs/localization-runtime.ts',
  'src/app/modules/i18n/vocabs/en.ts',
  'src/app/modules/i18n/vocabs/ar.ts',
  'src/app/modules/UserGuide/content/languages-topic.ts',
  'src/app/modules/UserGuide/content/shared-screen-guidance.ts',
  'src/app/modules/auth/services/auth.service.ts',
];

function files(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing source path: ${file}`);
  return fs.statSync(file).isDirectory()
    ? fs.readdirSync(file).reduce((all, item) => all.concat(files(path.join(file, item))), [])
    : [file];
}

(async () => {
  const { parseTemplate } = await import(pathToFileURL(path.join(root, 'node_modules/@angular/compiler/fesm2022/compiler.mjs')).href);
  let scriptCount = 0;
  let templateCount = 0;
  const errors = [];
  for (const file of paths.reduce((all, item) => all.concat(files(path.join(root, item))), [])) {
    const source = fs.readFileSync(file, 'utf8');
    if (/\.(ts)$/.test(file) && !file.endsWith('.spec.ts')) {
      scriptCount++;
      const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
      for (const diagnostic of parsed.parseDiagnostics) {
        errors.push(`${file}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
      }
    } else if (file.endsWith('.html')) {
      templateCount++;
      const parsed = parseTemplate(source, file);
      for (const diagnostic of parsed.errors || []) errors.push(String(diagnostic));
    }
  }
  if (errors.length) {
    process.stderr.write(errors.join('\n') + '\n');
    process.exitCode = 1;
  } else {
    process.stdout.write(`Source syntax parsed: ${scriptCount} TypeScript files, ${templateCount} templates. No type-check/build/runtime claim.\n`);
  }
})();
