const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const {pathToFileURL} = require('url');
const repo = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const before = read(path.join(process.env.TEMP, 'sigma-legacy-dependencies-before-20261015.json'));
const after = read(path.join(repo, 'package-lock.json'));
const manifest = read(path.join(repo, 'package.json'));
read(path.join(repo, 'angular.json'));
const targets = ['@angular/material', 'ngx-clipboard', 'clipboard', 'nouislider', 'datatables.net', 'datatables.net-bs5', 'jquery', '@types/datatables.net', '@types/jquery'];
const failures = [];
for (const name of targets) {
  if (manifest.dependencies?.[name] || manifest.devDependencies?.[name]) failures.push(`Still declared: ${name}`);
  if (Object.keys(after.packages).some(key => key.endsWith(`node_modules/${name}`))) failures.push(`Still locked: ${name}`);
  if (fs.existsSync(path.join(repo, 'node_modules', name))) failures.push(`Still installed: ${name}`);
}
const removed = Object.keys(before.packages).filter(key => !after.packages[key]);
const added = Object.keys(after.packages).filter(key => !before.packages[key]);
const changedVersions = Object.keys(after.packages).filter(key => before.packages[key] && before.packages[key].version !== after.packages[key].version);
const changedSurvivors = Object.keys(after.packages).filter(key => key && before.packages[key] && JSON.stringify(before.packages[key]) !== JSON.stringify(after.packages[key]));
if (added.length || changedVersions.length) failures.push('Unexpected additions/version changes');
for (const key of ['dependencies', 'devDependencies']) {
  if (JSON.stringify(manifest[key]) !== JSON.stringify(after.packages[''][key])) failures.push(`Lock root differs: ${key}`);
}
const cdk = read(path.join(repo, 'node_modules/@angular/cdk/package.json'));
if (manifest.dependencies['@angular/cdk'] !== '17.3.10' || after.packages['node_modules/@angular/cdk'].version !== '17.3.10' || cdk.version !== '17.3.10') failures.push('CDK version drift');
if (!fs.existsSync(path.join(repo, 'node_modules/@angular/cdk/drag-drop/index.d.ts'))) failures.push('Missing CDK drag-drop entry');
const changedFiles = cp.execFileSync('git', ['diff', '--name-only', '--diff-filter=ACM'], {cwd:repo, encoding:'utf8'}).trim().split(/\r?\n/);
const ts = require(path.join(repo, 'node_modules/typescript'));
const parsedTs = [];
for (const file of changedFiles.filter(file => file.endsWith('.ts'))) {
  const source = ts.createSourceFile(file, fs.readFileSync(path.join(repo,file),'utf8'), ts.ScriptTarget.Latest, true);
  for (const error of source.parseDiagnostics) failures.push(`${file}: ${ts.flattenDiagnosticMessageText(error.messageText, ' ')}`);
  parsedTs.push(file);
}
(async () => {
  const compiler = await import(pathToFileURL(path.join(repo, 'node_modules/@angular/compiler/fesm2022/compiler.mjs')).href);
  const parsedHtml = [];
  for (const file of changedFiles.filter(file => file.endsWith('.html'))) {
    const parsed = compiler.parseTemplate(fs.readFileSync(path.join(repo,file),'utf8'), file);
    for (const error of parsed.errors || []) failures.push(`${file}: ${error}`);
    parsedHtml.push(file);
  }
  const result = {date:'2026-10-15', mode:'source-only; no build, tests or lint', removedPackageNodes:removed.length, removed, added, changedVersions, changedSurvivors: changedSurvivors.map(key=>({key, before:before.packages[key], after:after.packages[key]})), targetsAbsent:true, cdk:cdk.version, parsedTs, parsedHtml, failures};
  fs.writeFileSync('F:/My Work/Sigma/reviews/LEGACY_FRONTEND_DEPENDENCY_CLEANUP_SOURCE_AUDIT.json', JSON.stringify(result,null,2)+'\n');
  console.log(JSON.stringify({...result, removed:undefined, changedSurvivors: changedSurvivors.map(key=>({key,before:before.packages[key],after:after.packages[key]}))},null,2));
  process.exitCode = failures.length ? 1 : 0;
})().catch(error=>{console.error(error); process.exitCode=1;});
