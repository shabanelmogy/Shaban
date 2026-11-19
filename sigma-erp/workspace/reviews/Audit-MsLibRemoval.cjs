// Read-only source/parser inspection. This does not invoke Angular/.NET builds or tests.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const ts = require(path.join(root, 'node_modules/typescript'));
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const manifest = JSON.parse(fs.readFileSync('F:/My Work/Sigma/reviews/MS_LIB_REMOVAL_SOURCE_MANIFEST.json','utf8').replace(/^\uFEFF/, '')).map(file => file.replace(/\\/g, '/'));
const prefixes = manifest.filter(file => file.includes('/components/')).map(file => file.split('/components/')[0] + '/');
const git = args => cp.execFileSync('git', ['-c', `safe.directory=${root}`, '-C', root, ...args], {encoding:'utf8',stdio:['ignore','pipe','ignore']}).split(/\r?\n/).filter(Boolean);
const changed = [...new Set([...git(['diff','--name-only']), ...git(['ls-files','--others','--exclude-standard'])])];
const files = [...new Set([...manifest.filter(file => fs.existsSync(path.join(root,file))), ...changed.filter(file => fs.existsSync(path.join(root,file)) &&
  /\.(ts|html|scss)$/.test(file) && (prefixes.some(prefix => file.startsWith(prefix)) || file.startsWith('src/app/modules/UserGuide/content/') || /src\/app\/modules\/i18n\/vocabs\/(en|ar)\.ts$/.test(file) || file === 'src/app/_metronic/layout/components/toolbar/toolbar.component.ts'))])];
const problems = [], sourceFiles = new Map(), templates = new Set(), keys = new Set();
const columnPreservation = [];
function columnLabels(sf, nameKey, labelKey) {
  const labels=[];
  function walk(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const name = property(node,nameKey), label=property(node,labelKey);
      if (name && label && ts.isStringLiteralLike(name) && ts.isStringLiteralLike(label) && name.text!=='actions') labels.push(label.text==='id'?'general.id':label.text);
    }
    ts.forEachChild(node,walk);
  }
  let target=sf;
  if(sf.fileName.includes('vehicle-rental-details.component.ts')){
    for(const stmt of sf.statements)if(ts.isClassDeclaration(stmt))target=stmt.members.find(member=>member.name?.getText(sf)==='initStatusColumns')??target;
  }
  walk(target);return labels;
}
function duplicateKeys(sf) {
  const found=new Map();
  function walk(node,prefix) {
    if(ts.isObjectLiteralExpression(node)){
      const counts=new Map();
      for(const item of node.properties){
        if(!item.name||(!ts.isIdentifier(item.name)&&!ts.isStringLiteralLike(item.name)&&!ts.isNumericLiteral(item.name)))continue;
        const name=item.name.text,full=prefix?prefix+'.'+name:name;
        const count=(counts.get(name)??0)+1;counts.set(name,count);
        if(count>1)found.set(full,count);
        if(item.initializer)walk(item.initializer,full);
      }
    }else ts.forEachChild(node,child=>walk(child,prefix));
  }
  walk(sf,'');return found;
}
function parse(file) { if (!sourceFiles.has(file)) sourceFiles.set(file, ts.createSourceFile(file,read(file),ts.ScriptTarget.Latest,true)); return sourceFiles.get(file); }
for (const file of files.filter(file => file.endsWith('.ts'))) {
  const sf = parse(file);
  for (const diag of sf.parseDiagnostics) problems.push({file,kind:'typescript-syntax',message:ts.flattenDiagnosticMessageText(diag.messageText,' ')});
  for (const match of read(file).matchAll(/templateUrl:\s*['"]([^'"]+)/g)) templates.add(path.posix.normalize(path.posix.join(path.posix.dirname(file),match[1])));
  for (const match of read(file).matchAll(/(?:header|currentPageReport|emptyMessage):\s*['"]([^'"]+)/g)) if (match[1].includes('.')) keys.add(match[1]);
}
for(const lang of ['en','ar']){
  const file=`src/app/modules/i18n/vocabs/${lang}.ts`;
  const old=cp.execFileSync('git',['-c',`safe.directory=${root}`,'-C',root,'show',`HEAD:${file}`],{encoding:'utf8',stdio:['ignore','pipe','ignore']});
  const before=duplicateKeys(ts.createSourceFile(file,old,ts.ScriptTarget.Latest,true));
  for(const [key,count]of duplicateKeys(parse(file)))if(count>(before.get(key)??1))problems.push({file,kind:'new-duplicate-translation-property',key,count});
}
for (const file of manifest.filter(file=>fs.existsSync(path.join(root,file)))) {
  const old=cp.execFileSync('git',['-c',`safe.directory=${root}`,'-C',root,'show',`HEAD:${file}`],{encoding:'utf8',stdio:['ignore','pipe','ignore']});
  const before=columnLabels(ts.createSourceFile(file,old,ts.ScriptTarget.Latest,true),'colName','displayName');
  const after=columnLabels(parse(file),'field','header');
  const match=JSON.stringify(before)===JSON.stringify(after);
  columnPreservation.push({file,before:before.length,after:after.length,match});
  if(!match)problems.push({file,kind:'column-order-or-label-change',before,after});
}
for (const file of files.filter(file => file.endsWith('.html'))) templates.add(file);
function resolveImport(owner, spec) {
  let file = spec.startsWith('src/') ? spec : spec.startsWith('.') ? path.posix.normalize(path.posix.join(path.posix.dirname(owner),spec)) : null;
  if (!file) return null;
  return [file + '.ts', file + '/index.ts',file].find(candidate=>fs.existsSync(path.join(root,candidate)) && fs.statSync(path.join(root,candidate)).isFile()) ?? file;
}
function exportsOf(file) {
  const names = new Set(); let open = false;
  for (const stmt of parse(file).statements) {
    if (ts.isExportDeclaration(stmt)) {
      if (!stmt.exportClause) open = true;
      else if (ts.isNamedExports(stmt.exportClause)) stmt.exportClause.elements.forEach(item=>names.add(item.name.text));
    }
    if (stmt.modifiers?.some(mod=>mod.kind===ts.SyntaxKind.ExportKeyword)) {
      if (stmt.name) names.add(stmt.name.text);
      if (ts.isVariableStatement(stmt)) stmt.declarationList.declarations.forEach(item=>names.add(item.name.getText()));
    }
  }
  return {names,open};
}
let importCount=0;
for (const [file,sf] of [...sourceFiles]) for (const stmt of sf.statements) if (ts.isImportDeclaration(stmt)) {
  const resolved = resolveImport(file,stmt.moduleSpecifier.text);
  if (!resolved) continue;
  if (!fs.existsSync(path.join(root,resolved))) {problems.push({file,kind:'missing-source-import',target:resolved});continue;}
  const named = stmt.importClause?.namedBindings;
  if (!named || !ts.isNamedImports(named) || !resolved.endsWith('.ts')) continue;
  const exp = exportsOf(resolved);
  for (const item of named.elements) {importCount++;const name=(item.propertyName??item.name).text;if(!exp.open&&!exp.names.has(name))problems.push({file,kind:'missing-source-export',target:resolved,name});}
}
function property(node,key) {return node?.properties?.find(item=>item.name&&(item.name.text??item.name.getText())===key)?.initializer;}
function locale(lang) {
  const sf=parse(`src/app/modules/i18n/vocabs/${lang}.ts`);let data;
  function walk(node){if(ts.isVariableDeclaration(node)&&node.name.getText(sf)==='locale')data=property(node.initializer,'data');ts.forEachChild(node,walk);}walk(sf);return data;
}
const locales={en:locale('en'),ar:locale('ar')};
function label(key,lang){let node=locales[lang];for(const part of key.split('.'))node=property(node,part);return node;}
const publicInputs={
  'app-data-table':'src/app/modules/shared/components/data-table/data-table.component.ts',
  'app-primary-action-button':'src/app/modules/shared/components/primary-action-button/primary-action-button.component.ts',
  'app-feature-title':'src/app/modules/shared/components/feature-title/feature-title.component.ts',
};
function inputsOf(file){const text=read(file),names=new Set();for(const match of text.matchAll(/@Input\([^)]*\)\s*(?:readonly\s+)?(?:get\s+|set\s+)?(\w+)/g))names.add(match[1]);return names;}
(async()=>{
  const compiler=await import(require('url').pathToFileURL(path.join(root,'node_modules/@angular/compiler/fesm2022/compiler.mjs')).href);
  let templateCount=0,bindingCount=0;
  for(const file of templates){
    if(!fs.existsSync(path.join(root,file))){problems.push({file,kind:'missing-template'});continue;}
    const text=read(file),result=compiler.parseTemplate(text,file,{preserveWhitespaces:false});templateCount++;
    for(const error of result.errors??[])problems.push({file,kind:'angular-template',message:error.toString()});
    for(const match of text.matchAll(/['"]([A-Za-z][A-Za-z0-9_.]+)['"]\s*\|\s*translate/g))keys.add(match[1]);
    for(const match of text.matchAll(/(?:currentPageReport|emptyMessage)="([A-Za-z][A-Za-z0-9_.]+)"/g))keys.add(match[1]);
    function walk(nodes){for(const node of nodes??[]){if(publicInputs[node.name]){const valid=inputsOf(publicInputs[node.name]);for(const input of node.inputs??[]){if(input.type!==0)continue;bindingCount++;if(!valid.has(input.name))problems.push({file,kind:'unknown-shared-input',tag:node.name,name:input.name});}}walk(node.children);walk(node.branches);if(node.children===undefined&&node.templateAttrs)walk(node.children);}}
    walk(result.nodes);
  }
  for(const key of keys)for(const lang of ['en','ar'])if(!label(key,lang))problems.push({kind:'missing-translation',key,lang});
  const legacy=[];
  for(const file of files.filter(file=>/\.(ts|html|scss)$/.test(file)))if(/ms-lib|<\/?table-list\b|\b(?:ColType|ListCol|TableListComponent)\b/.test(read(file)))legacy.push(file);
  if(legacy.length)problems.push({kind:'legacy-reference',files:legacy});
  const report={sourceFiles:files.filter(f=>f.endsWith('.ts')).length,templates:templateCount,sourceNamedImports:importCount,sharedInputBindings:bindingCount,translationKeys:keys.size,columnConsumers:columnPreservation.length,preservedColumns:columnPreservation.reduce((n,row)=>n+row.after,0),problems};
  fs.writeFileSync('F:/My Work/Sigma/reviews/MS_LIB_REMOVAL_COLUMN_EVIDENCE.json',JSON.stringify(columnPreservation,null,2));
  fs.writeFileSync('F:/My Work/Sigma/reviews/MS_LIB_REMOVAL_SOURCE_AUDIT.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
  process.exitCode=problems.length?1:0;
})();
