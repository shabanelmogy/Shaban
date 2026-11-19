const fs = require('fs');
const ts = require('F:/My Work/Sigma/SiGmaAngularFrontEnd/node_modules/typescript');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/i18n/vocabs/';
const requirements = JSON.parse(fs.readFileSync('F:/My Work/Sigma/reviews/Limousine/INVOICE_FRONTEND_TRANSLATION_REQUIREMENTS.json', 'utf8'));
requirements.en['tripBooking.fullyInvoiced'] = 'Fully invoiced';
requirements.ar['tripBooking.fullyInvoiced'] = 'مفوتر بالكامل';
function nodes(source) {
  const ast = ts.createSourceFile('locale.ts', source, ts.ScriptTarget.Latest, true), result = {};
  function obj(node, prefix) {
    if (!ts.isObjectLiteralExpression(node)) return;
    result[prefix] = node;
    for (const p of node.properties) if (ts.isPropertyAssignment(p)) {
      const key = prefix ? prefix + '.' + p.name.text : p.name.text;
      result[key] = p.initializer; obj(p.initializer, key);
    }
  }
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.text === 'locale') obj(node.initializer.properties.find(p => p.name.text === 'data').initializer, '');
    ts.forEachChild(node, visit);
  }
  visit(ast); return result;
}
function render(object, indent) {
  return Object.entries(object).map(([key,value]) => ' '.repeat(indent) + JSON.stringify(key) + ': ' +
    (typeof value === 'object' ? '{\n' + render(value, indent+2) + ' '.repeat(indent) + '}' : JSON.stringify(value)) + ',\n').join('');
}
for (const language of ['en','ar']) {
  const file = root + language + '.ts'; let source = fs.readFileSync(file, 'utf8');
  const map = nodes(source), groups = {};
  for (const [key,value] of Object.entries(requirements[language])) {
    if (map[key]) continue;
    const parts = key.split('.'); let parent = parts.slice(0,-1).join('.');
    while (!map[parent] || !ts.isObjectLiteralExpression(map[parent])) parent = parent.split('.').slice(0,-1).join('.');
    const tail = parts.slice(parent ? parent.split('.').length : 0); let group = groups[parent] ??= {};
    for (let i=0;i<tail.length-1;i++) group = group[tail[i]] ??= {};
    group[tail[tail.length-1]] = value;
  }
  const changes = [];
  for (const [parent,items] of Object.entries(groups)) {
    const node = map[parent], indent = source.slice(source.lastIndexOf('\n',node.getStart())+1,node.getStart()).match(/^\s*/)[0].length+2;
    changes.push({ position: node.end-1, text: (node.properties.length && !node.properties.hasTrailingComma ? ',' : '') + '\n' + render(items,indent) + ' '.repeat(indent-2) });
  }
  for (const change of changes.sort((a,b)=>b.position-a.position)) source = source.slice(0,change.position) + change.text + source.slice(change.position);
  fs.writeFileSync(file, source.trimEnd() + '\n');
  console.log(language + ': invoice/fully-billed keys reconciled without overwriting existing values');
}
