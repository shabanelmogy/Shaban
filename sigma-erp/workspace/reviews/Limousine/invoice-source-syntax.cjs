const fs = require('fs');
const path = require('path');
const {pathToFileURL} = require('url');
const ts = require('F:/My Work/Sigma/SiGmaAngularFrontEnd/node_modules/typescript');
const root = 'F:/My Work/Sigma/SiGmaAngularFrontEnd/src/app/modules/Limousine/LimousineInvoice';
(async () => {
  const ng = await import(pathToFileURL('F:/My Work/Sigma/SiGmaAngularFrontEnd/node_modules/@angular/compiler/fesm2022/compiler.mjs').href);
  let countTS = 0, countHTML = 0, issues = [];
  const visit = dir => {
    for (const item of fs.readdirSync(dir, {withFileTypes:true})) {
      const file = path.join(dir,item.name);
      if(item.isDirectory()) { visit(file); continue; }
      if(file.endsWith('.ts') && !file.endsWith('.spec.ts')) {
        countTS++;
        const source = ts.createSourceFile(file,fs.readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true);
        for(const error of source.parseDiagnostics) issues.push({file,message:ts.flattenDiagnosticMessageText(error.messageText,' ')});
        ts.forEachChild(source,node=>{
          if(ts.isImportDeclaration(node)) {
            const value=node.moduleSpecifier.text;
            const target=value.startsWith('src/') ? path.join('F:/My Work/Sigma/SiGmaAngularFrontEnd',value) : value.startsWith('.') ? path.resolve(path.dirname(file),value) : null;
            if(target && !fs.existsSync(target+'.ts') && !fs.existsSync(target+'/index.ts')) issues.push({file,message:'Missing local import '+value});
          }
        });
      } else if(file.endsWith('.html')) {
        countHTML++;
        const parsed = ng.parseTemplate(fs.readFileSync(file,'utf8'),file,{preserveWhitespaces:false});
        for(const error of parsed.errors||[]) issues.push({file,message:error.toString()});
      }
    }
  };
  visit(root);
  console.log(JSON.stringify({check:'Syntax and local-import paths only; no typechecking/build/tests/runtime',countTS,countHTML,issues},null,2));
})().catch(error=>{console.error(error.message);process.exitCode=1});