const fs = require('fs');
const ts = require('F:/My Work/Sigma/SiGmaAngularFrontEnd/node_modules/typescript');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const blocks = new Set(['location', 'tripType', 'tripBooking', 'limoQuotation', 'limousineTariff', 'limousineTariffReport', 'limousineUtilizationReport', 'chauffeurForcedAllocationsReport', 'driversTracker', 'tripGridCustomization']);
for (const language of ['en', 'ar']) {
  const file = root + '/src/app/modules/i18n/vocabs/' + language + '.ts';
  let text = fs.readFileSync(file, 'utf8');
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  const ranges = [];
  function visit(node) {
    if (ts.isPropertyAssignment(node) && blocks.has(node.name.text) && ts.isObjectLiteralExpression(node.initializer)) ranges.push([node.initializer.getStart(), node.initializer.end]);
    ts.forEachChild(node, visit);
  }
  visit(ast);
  for (const [start, end] of ranges.sort((a,b) => b[0] - a[0])) text = text.slice(0, start) + text.slice(start, end).replace(/[\t ]+$/gm, '') + text.slice(end);
  fs.writeFileSync(file, text);
}
