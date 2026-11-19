// Source inventory/adoption only. Does not compile, build or run the application.
const fs = require('fs');
const path = require('path');
const cp = require('child_process');
const {pathToFileURL} = require('url');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd';
const ts = require(path.join(root, 'node_modules/typescript'));
const modulePath = 'src/app/modules/shared/components/mock-data/mock-data-forms.module';
const inventory = { status:'Implemented — source-only', ownerVerificationPending:true, forms:[], excluded:[], imports:[], unsupported:[] };
function files(pattern, extension) {
  const result=cp.spawnSync('rg',['-l',pattern,'src/app/modules','-g',extension,'-g','!*.spec.ts'],{cwd:root,encoding:'utf8'});
  if(result.status>1) throw new Error(result.stderr);
  return result.stdout.trim().split(/\r?\n/).filter(Boolean);
}
function save(relative, source, updated) {
  const target=path.join(root,relative);
  if(fs.readFileSync(target,'utf8')!==source) throw new Error(`Ownership conflict: ${relative}`);
  if(updated!==source) fs.writeFileSync(target,updated);
}
(async()=>{
  const angular = await import(pathToFileURL(path.join(root,'node_modules/@angular/compiler/fesm2022/compiler.mjs')).href);
  for(const relative of files('\\[formGroup\\]','*.html')) {
    const source=fs.readFileSync(path.join(root,relative),'utf8');
    if(/[/\\](auth|UserGuide)[/\\]/i.test(relative) || /[/\\][^/\\]*reports?[^/\\]*[/\\]/i.test(relative)) { inventory.excluded.push({file:relative,reason:'authentication/documentation/report owner'}); continue; }
    const parsed=angular.parseTemplate(source,relative);
    if(parsed.errors?.length) { inventory.unsupported.push({file:relative,reason:'existing template parse diagnostics'}); continue; }
    const edits=[];
    function walk(nodes, owningForm=false, excluded=false) {
      for(const node of nodes||[]) {
        let owner=owningForm, skip=excluded;
        if(node instanceof angular.TmplAstElement) {
          const group=node.inputs.find(input=>input.name==='formGroup');
          if(group) {
            const expression=group.value.source||'';
            const classes=node.attributes.find(attr=>attr.name==='class')?.value||'';
            skip=excluded || /filter|search|query/i.test(expression) || /filter|search/i.test(classes)
              || node.attributes.some(attr=>attr.name==='appFilterPanel') || node.inputs.some(input=>input.name==='appFilterPanel');
            if(!owner && !skip && ['form','div','section','fieldset'].includes(node.name)) {
              if(!node.attributes.some(attr=>attr.name==='appMockData')) {
                const start=node.startSourceSpan.start.offset;
                edits.push({position:start+1+node.name.length,text:' appMockData'});
              }
              inventory.forms.push({file:relative,element:node.name,form:expression,line:node.startSourceSpan.start.line+1});
              owner=true;
            } else if(!owner && skip) inventory.excluded.push({file:relative,form:expression,reason:'filter/search/query'});
          }
        }
        if(node.children) walk(node.children,owner,skip);
        if(node.branches) for(const branch of node.branches) walk(branch.children,owner,skip);
        if(node.body) walk(node.body.children,owner,skip);
        if(node.empty) walk(node.empty.children,owner,skip);
        if(node.cases) for(const item of node.cases) walk(item.children,owner,skip);
      }
    }
    walk(parsed.nodes);
    let updated=source;
    for(const edit of edits.sort((a,b)=>b.position-a.position)) updated=updated.slice(0,edit.position)+edit.text+updated.slice(edit.position);
    save(relative,source,updated);
  }
  for(const relative of files('ReactiveFormsModule','*.ts')) {
    if(/[/\\](auth|UserGuide)[/\\]/i.test(relative) || relative.includes('components/mock-data/')) continue;
    const source=fs.readFileSync(path.join(root,relative),'utf8');
    const parsed=ts.createSourceFile(relative,source,ts.ScriptTarget.Latest,true);
    const edits=[];
    let added=false;
    function visit(node) {
      if(ts.isDecorator(node) && ts.isCallExpression(node.expression) && ['Component','NgModule'].includes(node.expression.expression.getText(parsed))) {
        const obj=node.expression.arguments[0];
        if(obj && ts.isObjectLiteralExpression(obj)) {
          for(const property of obj.properties) {
            if(!ts.isPropertyAssignment(property) || !['imports','exports'].includes(property.name.getText(parsed)) || !ts.isArrayLiteralExpression(property.initializer)) continue;
            const names=property.initializer.elements.map(item=>item.getText(parsed));
            if(names.includes('ReactiveFormsModule') && !names.includes('MockDataFormsModule')) {
              edits.push({position:property.initializer.getStart(parsed)+1,text:'MockDataFormsModule, '});added=true;
            }
          }
        }
      }
      ts.forEachChild(node,visit);
    }
    visit(parsed);
    if(added) {
      if(!source.includes(`from '${modulePath}'`)) edits.push({position:0,text:`import { MockDataFormsModule } from '${modulePath}';\n`});
      let updated=source;
      for(const edit of edits.sort((a,b)=>b.position-a.position)) updated=updated.slice(0,edit.position)+edit.text+updated.slice(edit.position);
      save(relative,source,updated);inventory.imports.push(relative);
    }
  }
  fs.writeFileSync('F:/My Work/Sigma/reviews/AI_MOCK_DATA_ADOPTION.json',JSON.stringify(inventory,null,2));
  console.log(JSON.stringify({forms:inventory.forms.length,importOwners:inventory.imports.length,excluded:inventory.excluded.length,unsupported:inventory.unsupported}));
})().catch(error=>{console.error(error.message);process.exitCode=1;});
