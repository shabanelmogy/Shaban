const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const reviewRoot = 'F:/My Work/Sigma/reviews';
const snapshots = ['CASH_DEPOSITS_INITIAL_SOURCE_SNAPSHOT.json', 'CASH_DEPOSITS_INTEGRATION_SOURCE_SNAPSHOT.json'];
const folder = `${reviewRoot}/CashDepositsSourceDiff`;
fs.mkdirSync(folder, { recursive: true });
const entries = [];
for (const snapshot of snapshots) {
  const saved = JSON.parse(fs.readFileSync(`${reviewRoot}/${snapshot}`, 'utf8'));
  for (const [index, row] of saved.entries()) {
    const file = row.Path.replace(/\\/g, '/');
    const before = row.Content.replace(/\r\n/g, '\n');
    const after = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n') : '';
    if (before === after && fs.existsSync(file)) continue;
    const prefix = snapshot.includes('INTEGRATION') ? 'integration' : 'feature';
    const previous = `${folder}/${prefix}-${index}-before.txt`;
    const current = `${folder}/${prefix}-${index}-after.txt`;
    fs.writeFileSync(previous, before);
    fs.writeFileSync(current, after);
    const result = cp.spawnSync('git', ['diff', '--no-index', '--no-ext-diff', '--', previous, current], { encoding: 'utf8' });
    if (![0,1].includes(result.status)) throw new Error(result.stderr);
    const diff = result.stdout.replaceAll(previous, file + ' (initial)').replaceAll(current, file + ' (current)');
    fs.writeFileSync(`${folder}/${prefix}-${index}.diff`, diff);
    entries.push({ file, diff: `${folder}/${prefix}-${index}.diff`, status: fs.existsSync(file) ? 'modified' : 'removed', originalSnapshot: snapshot });
  }
}
fs.writeFileSync(`${reviewRoot}/CASH_DEPOSITS_DIFF_INDEX.json`, JSON.stringify(entries, null, 2));
console.log(entries.map(entry => entry.file + ' -> ' + path.basename(entry.diff)).join('\n'));
