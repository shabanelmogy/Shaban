// Source parsing and local import inventory only: no emit, type checking, build or tests.
const fs = require('fs');
const path = require('path');
const ts = require('F:/My Work/Sigma/SiGmaAngularFrontEnd/node_modules/typescript');
const repo = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const files = [];
function collect(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) collect(file);
    else if (/\.ts$/.test(file) && !/\.spec\.ts$/.test(file)) files.push(file);
  }
}
collect(`${repo}/src/app/modules/Rental`);
files.push(...['src/app/pages/routing.ts', 'src/app/_metronic/layout/layout.module.ts', 'src/app/_metronic/layout/components/toolbar/toolbar.component.ts', 'src/app/modules/shared/service/tariffSetting.service.ts', 'src/app/modules/i18n/vocabs/en.ts', 'src/app/modules/i18n/vocabs/ar.ts'].map(file => `${repo}/${file}`));
const diagnostics = [];
const missingImports = [];
const missingNamedExports = [];
const exportCache = new Map();
function exportedNames(file) {
  if (exportCache.has(file)) return exportCache.get(file);
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const names = new Set();
  for (const statement of source.statements) {
    if (ts.isExportDeclaration(statement)) {
      if (!statement.exportClause) return null; // wildcard barrels require resolution outside this inventory.
      if (ts.isNamedExports(statement.exportClause)) for (const element of statement.exportClause.elements) names.add(element.name.text);
    }
    if (statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
      if (statement.name?.text) names.add(statement.name.text);
      if (ts.isVariableStatement(statement)) for (const declaration of statement.declarationList.declarations) if (ts.isIdentifier(declaration.name)) names.add(declaration.name.text);
    }
  }
  exportCache.set(file, names);
  return names;
}
for (const file of files) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  for (const diagnostic of source.parseDiagnostics) {
    const position = source.getLineAndCharacterOfPosition(diagnostic.start || 0);
    diagnostics.push({ file, line: position.line + 1, message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n') });
  }
  function visit(node) {
    let specifier;
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) specifier = node.moduleSpecifier;
    else if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) specifier = node.arguments[0];
    if (specifier && ts.isStringLiteral(specifier)) {
      const name = specifier.text;
      const base = name.startsWith('.') ? path.resolve(path.dirname(file), name) : name.startsWith('src/') ? path.resolve(repo, name) : null;
      if (base && !['', '.ts', '.d.ts', '/index.ts', '.json'].some(suffix => fs.existsSync(base + suffix))) missingImports.push({ file, name });
      if (base && fs.existsSync(base + '.ts') && ts.isImportDeclaration(node) && node.importClause?.namedBindings && ts.isNamedImports(node.importClause.namedBindings)) {
        const names = exportedNames(base + '.ts');
        if (names) for (const element of node.importClause.namedBindings.elements) {
          const symbol = (element.propertyName || element.name).text;
          if (!names.has(symbol)) missingNamedExports.push({ file, name, symbol });
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}
console.log(JSON.stringify({ filesParsed: files.length, diagnostics, missingImports, missingNamedExports }, null, 2));
