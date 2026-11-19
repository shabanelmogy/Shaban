const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const { pathToFileURL } = require('url');
const ts = require('F:/My Work/Sigma/SiGmaAngularFrontEnd/node_modules/typescript');
const repo = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const root = path.join(repo, 'src/app/modules/Movements');
const output = { status: 'Implemented — source-only', ownerVerificationPending: true, limitations: 'Syntax, AST/source comparisons only; no Angular application compilation, tests, lint or runtime.', syntaxErrors: [], missingTranslations: [], unusedImports: [], semanticChanges: [], topLevelChanges: [], importPathErrors: [], componentImportsReviewed: [], files: [] };
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).reduce((all, entry) => all.concat(entry.isDirectory() ? files(path.join(dir, entry.name)) : path.join(dir, entry.name)), []);
}
function parse(file, text) {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  for (const error of source.parseDiagnostics) output.syntaxErrors.push({ file, message: ts.flattenDiagnosticMessageText(error.messageText, ' ') });
  return source;
}
function normalized(node) {
  if (ts.isBlock(node) && node.statements.length === 1 && node.parent && (ts.isIfStatement(node.parent) || ts.isForStatement(node.parent) || ts.isForOfStatement(node.parent))) return normalized(node.statements[0]);
  const children = [];
  ts.forEachChild(node, child => { children.push(normalized(child)); });
  return [node.kind, children.length ? children : node.text ?? node.getText()];
}
function members(source) {
  const map = new Map();
  for (const statement of source.statements) {
    if (ts.isClassDeclaration(statement)) for (const member of statement.members) map.set((statement.name?.text ?? '') + '.' + (member.name?.getText() ?? ts.SyntaxKind[member.kind]), JSON.stringify(normalized(member)));
  }
  return map;
}
function outerStatements(source) {
  return source.statements.map(node => ts.isClassDeclaration(node)
    ? ['class', node.name?.text, (node.modifiers ?? []).map(normalized), (node.heritageClauses ?? []).map(normalized)]
    : normalized(node));
}
function vocabulary(language) {
  const source = parse(language, fs.readFileSync(path.join(repo, `src/app/modules/i18n/vocabs/${language}.ts`), 'utf8'));
  const keys = new Set();
  function read(node, prefix = '') {
    if (!ts.isObjectLiteralExpression(node)) return;
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property)) continue;
      const name = property.name.text ?? property.name.getText();
      const key = prefix ? prefix + '.' + name : name;
      keys.add(key);
      read(property.initializer, key);
    }
  }
  const locale = source.statements.find(ts.isVariableStatement)?.declarationList.declarations[0]?.initializer;
  const data = locale?.properties?.find(p => p.name?.text === 'data')?.initializer;
  read(data);
  return keys;
}
(async () => {
  const { parseTemplate } = await import(pathToFileURL(path.join(repo, 'node_modules/@angular/compiler/fesm2022/compiler.mjs')).href);
  const en = vocabulary('en'), ar = vocabulary('ar');
  const prefixes = /^(general|mangeDetails|validationMessages|collectionMovement|deliveryMovement|custodymovement|workshopMaster|workshopMovement|nrm|movementLog|fuelLevelNames|partnerForm|rentalAgreement|userGuide|sideMenu)\./;
  for (const file of [...files(root), path.join(repo, 'src/app/modules/UserGuide/content/movements-guide.ts')]) {
    const text = fs.readFileSync(file, 'utf8');
    if (file.endsWith('.html')) {
      const result = parseTemplate(text, file);
      for (const error of result.errors ?? []) output.syntaxErrors.push({ file, message: error.toString() });
    } else if (file.endsWith('.spec.ts')) {
      const source = parse(file, text);
      for (const statement of source.statements) if (ts.isImportDeclaration(statement) && statement.moduleSpecifier.text.startsWith('.')) {
        const target = path.resolve(path.dirname(file), statement.moduleSpecifier.text) + '.ts';
        if (!fs.existsSync(target)) {
          output.importPathErrors.push({ file, specifier: statement.moduleSpecifier.text });
          continue;
        }
        const targetSource = parse(target, fs.readFileSync(target, 'utf8'));
        const exports = new Set(targetSource.statements.filter(node => node.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)).map(node => node.name?.text));
        for (const element of statement.importClause?.namedBindings?.elements ?? []) {
          const name = element.propertyName?.text ?? element.name.text;
          if (!exports.has(name)) output.importPathErrors.push({ file, specifier: statement.moduleSpecifier.text, name });
        }
      }
    } else if (file.endsWith('.ts')) {
      const source = parse(file, text);
      const imported = [];
      for (const statement of source.statements) if (ts.isImportDeclaration(statement)) {
        const specifier = statement.moduleSpecifier.text;
        if (specifier.startsWith('.') || specifier.startsWith('src/')) {
          const target = specifier.startsWith('src/') ? path.join(repo, specifier) : path.resolve(path.dirname(file), specifier);
          if (![target + '.ts', path.join(target, 'index.ts')].some(fs.existsSync)) output.importPathErrors.push({ file, specifier });
        }
        for (const element of statement.importClause?.namedBindings?.elements ?? []) imported.push(element.name.text);
      }
      const used = new Set();
      function usages(node) {
        if (ts.isImportDeclaration(node)) return;
        if (ts.isIdentifier(node)) used.add(node.text);
        ts.forEachChild(node, usages);
      }
      usages(source);
      for (const name of imported) if (!used.has(name)) output.unusedImports.push({ file: path.relative(repo, file), name });
      const relative = path.relative(repo, file).replace(/\\/g, '/');
      const head = cp.spawnSync('git', ['-c', `safe.directory=${repo}`, '-C', repo, 'show', `HEAD:${relative}`], { encoding: 'utf8', windowsHide: true });
      if (head.status === 0) {
        const originalSource = parse(file, head.stdout);
        const original = members(originalSource);
        const current = members(source);
        const changed = [...new Set([...original.keys(), ...current.keys()])].filter(key => original.get(key) !== current.get(key));
        if (changed.length) output.semanticChanges.push({ file: relative, members: changed });
        if (JSON.stringify(outerStatements(originalSource)) !== JSON.stringify(outerStatements(source))) {
          const before = originalSource.statements.filter(node => !ts.isClassDeclaration(node)).map(node => ts.createPrinter().printNode(ts.EmitHint.Unspecified, node, originalSource));
          const after = source.statements.filter(node => !ts.isClassDeclaration(node)).map(node => ts.createPrinter().printNode(ts.EmitHint.Unspecified, node, source));
          output.topLevelChanges.push({ file: relative, removed: before.filter(item => !after.includes(item)), added: after.filter(item => !before.includes(item)), classHeadersChanged: JSON.stringify(originalSource.statements.filter(ts.isClassDeclaration).map(node => outerStatements({ statements: [node] }))) !== JSON.stringify(source.statements.filter(ts.isClassDeclaration).map(node => outerStatements({ statements: [node] }))) });
        }
      }
      if (text.includes('standalone: true')) output.componentImportsReviewed.push(relative);
      output.files.push(relative);
    }
    for (const match of text.matchAll(/['"]([A-Za-z][A-Za-z0-9_.]+)['"]/g)) {
      const key = match[1];
      if (!key.endsWith('.') && prefixes.test(key) && (!en.has(key) || !ar.has(key))) output.missingTranslations.push({ file: path.relative(repo, file), key, en: en.has(key), ar: ar.has(key) });
    }
  }
  fs.writeFileSync('F:/My Work/Sigma/reviews/Movements/CURRENT_SOURCE_VERIFICATION.json', JSON.stringify(output, null, 2));
  console.log(JSON.stringify({ syntaxErrors: output.syntaxErrors, importPathErrors: output.importPathErrors, missingTranslations: output.missingTranslations, unusedImports: output.unusedImports, semanticChanges: output.semanticChanges }, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
