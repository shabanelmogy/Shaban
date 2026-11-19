const fs = require('fs');
const cp = require('child_process');
const ts = require('F:/My Work/Sigma/SiGmaAngularFrontEnd/node_modules/typescript');
const repo = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const verification = JSON.parse(fs.readFileSync('F:/My Work/Sigma/reviews/Movements/CURRENT_SOURCE_VERIFICATION.json', 'utf8'));
const selected = verification.semanticChanges.filter(item => !process.argv[2] || item.file.includes(process.argv[2]));
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
function canonical(source) {
  const result = ts.transform(source, [context => {
    const block = node => ts.isBlock(node) ? node : ts.factory.createBlock([node], true);
    function visit(node) {
      node = ts.visitEachChild(node, visit, context);
      if (ts.isIfStatement(node)) return ts.factory.updateIfStatement(node, node.expression, block(node.thenStatement), node.elseStatement && (ts.isIfStatement(node.elseStatement) ? node.elseStatement : block(node.elseStatement)));
      if (ts.isBlock(node)) return ts.factory.createBlock(node.statements, true);
      return node;
    }
    return node => ts.visitNode(node, visit);
  }]);
  return result;
}
for (const item of selected) {
  const beforeText = cp.spawnSync('git', ['-c', `safe.directory=${repo}`, '-C', repo, 'show', `HEAD:${item.file}`], { encoding: 'utf8', windowsHide: true }).stdout;
  const sources = [beforeText, fs.readFileSync(repo + '/' + item.file, 'utf8')].map(text => ts.createSourceFile(item.file, text, ts.ScriptTarget.Latest, true));
  const members = sources.map(source => {
    const result = canonical(source);
    const map = new Map();
    for (const statement of result.transformed[0].statements) if (ts.isClassDeclaration(statement)) for (const member of statement.members) {
      const name = statement.name.text + '.' + (member.name ? printer.printNode(ts.EmitHint.Unspecified, member.name, source) : ts.SyntaxKind[member.kind]);
      if (item.members.includes(name)) map.set(name, printer.printNode(ts.EmitHint.Unspecified, member, source));
    }
    return { source, result, map };
  });
  const files = ['before', 'after'].map((side, index) => {
    const file = 'F:/My Work/Sigma/reviews/Movements/.semantic-' + side + '.txt';
    fs.writeFileSync(file, item.members.map(name => members[index].map.get(name) || '// absent: ' + name).join('\n\n'));
    return file;
  });
  console.log('\n' + item.file);
  console.log(cp.spawnSync('git', ['diff', '--no-index', '--', ...files], { encoding: 'utf8', windowsHide: true }).stdout);
  for (const member of members) member.result.dispose();
}
