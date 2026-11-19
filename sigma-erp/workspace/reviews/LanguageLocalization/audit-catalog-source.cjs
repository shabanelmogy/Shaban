// Read-only catalog/source consistency audit; does not execute application code.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app';
const catalog = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const en = new Set();
const ar = new Set();
const hash = crypto.createHash('sha256');
const compare = (left, right) => left < right ? -1 : left > right ? 1 : 0;
const sorted = [...catalog.entries].sort((left, right) =>
  compare(left.source, right.source) || compare(left.key, right.key) || compare(left.languageCode, right.languageCode));
for (const entry of sorted) {
  for (const field of ['source', 'key', 'languageCode', 'value']) {
    const bytes = Buffer.from(entry[field], 'utf8');
    const size = Buffer.alloc(4);
    size.writeInt32BE(bytes.length);
    hash.update(size);
    hash.update(bytes);
  }
  if (entry.source === 'Sigma.UI' && entry.languageCode === 'en') en.add(entry.key);
  if (entry.source === 'Sigma.UI' && entry.languageCode === 'ar') ar.add(entry.key);
}
if (hash.digest('hex') !== catalog.version) throw new Error('Catalog framing hash mismatch');
const featureKey = key => /^(language|languageManagement|localizationRuntime)\./.test(key);
const missingAr = [...en].filter(key => featureKey(key) && !ar.has(key));
const missingEn = [...ar].filter(key => featureKey(key) && !en.has(key));
const missingUsed = new Set();
const inputPaths = [
  path.join(root, 'modules/Administration/Languages'),
  path.join(root, '_metronic/layout/components/header/navbar'),
];
function scan(file) {
  if (fs.statSync(file).isDirectory()) {
    for (const item of fs.readdirSync(file)) scan(path.join(file, item));
  } else if (/\.(ts|html)$/.test(file)) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(/['"]((?:language|languageManagement|localizationRuntime)\.[A-Za-z0-9_.]+)['"]/g)) {
      if (!en.has(match[1]) || !ar.has(match[1])) missingUsed.add(match[1]);
    }
  }
}
inputPaths.forEach(scan);
if (missingAr.length || missingEn.length || missingUsed.size) {
  throw new Error(JSON.stringify({ missingAr, missingEn, missingUsed: [...missingUsed] }));
}
process.stdout.write(`Catalog integrity and touched translation source parity passed; ${catalog.entries.length} source values. No build/runtime claim.\n`);
