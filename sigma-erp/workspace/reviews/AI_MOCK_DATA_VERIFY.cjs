// Source-only parsing, adoption reconciliation and exact diff inspection. No application compilation/runtime.
const fs=require('fs'), path=require('path'), cp=require('child_process'), {pathToFileURL}=require('url');
const root='F:/My Work/Sigma/SiGmaAngularFrontEnd';
const ts=require(path.join(root,'node_modules/typescript'));
function rg(pattern,glob) {
 const result=cp.spawnSync('rg',['-l',pattern,'src/app/modules','-g',glob,'-g','!*.spec.ts'],{cwd:root,encoding:'utf8'});
 if(result.status>1)throw new Error(result.stderr);
 return result.stdout.trim().split(/\r?\n/).filter(Boolean);
}
function git(args,repo=root) {
 const result=cp.spawnSync('git',['-c',`safe.directory=${repo}`,'-C',repo,...args],{encoding:'utf8',maxBuffer:40*1024*1024});
 if(result.status!==0)throw new Error(result.error?.message || result.stdout || result.stderr || `Git exited ${result.status}`);
 return result.stdout;
}
(async()=>{
 const angular=await import(pathToFileURL(path.join(root,'node_modules/@angular/compiler/fesm2022/compiler.mjs')).href);
 const inventory=JSON.parse(fs.readFileSync('F:/My Work/Sigma/reviews/AI_MOCK_DATA_ADOPTION.json','utf8'));
 const diagnostics=[], forms=[], imports=[];
 const templates=new Set([...rg('appMockData','*.html'),...rg('mockData|mock-data|deepSeekSettings','*.html')]);
 for(const relative of templates) {
   const source=fs.readFileSync(path.join(root,relative),'utf8'), parsed=angular.parseTemplate(source,relative);
   if(parsed.errors?.length) diagnostics.push({file:relative,errors:parsed.errors.map(error=>String(error))});
   for(const match of source.matchAll(/<([a-z-]+)\s+appMockData\b/g)) forms.push({file:relative,element:match[1]});
 }
 const sourceFiles=new Set([...inventory.imports,...rg('mockData|MockData|DeepSeek|deepSeek','*.ts'),
   'src/app/modules/Administration/Settings/settings.routes.ts','src/app/modules/Administration/Settings/components/settings-layout/settings-layout.component.ts',
   'src/app/modules/UserGuide/content/administration-guide.ts','src/app/modules/UserGuide/components/reader/guide-reader.component.ts',
   'src/app/modules/UserGuide/content/customer-profile-topics.ts',
   'src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts',
   'src/app/modules/shared/components/form-section/form-section.component.ts']);
 for(const relative of sourceFiles) {
   const source=fs.readFileSync(path.join(root,relative),'utf8'), parsed=ts.createSourceFile(relative,source,ts.ScriptTarget.Latest,true);
   if(parsed.parseDiagnostics.length)diagnostics.push({file:relative,errors:parsed.parseDiagnostics.map(error=>ts.flattenDiagnosticMessageText(error.messageText,' '))});
   if(source.includes("import { MockDataFormsModule }"))imports.push(relative);
   if(source.includes('template: `')) {
     const template=source.match(/template:\s*`([\s\S]*?)`/);
     if(template&&(template[1].includes('appMockData')||relative.includes('mock-data-action.component.ts'))) {
       const parsedTemplate=angular.parseTemplate(template[1],relative);
       if(parsedTemplate.errors?.length)diagnostics.push({file:relative,errors:parsedTemplate.errors.map(String)});
       for(const match of template[1].matchAll(/<([a-z-]+)\s+appMockData\b/g))forms.push({file:relative,element:match[1],inline:true});
     }
   }
 }
 const dictionaries={};
 for(const language of ['en','ar']) {
   const source=fs.readFileSync(path.join(root,`src/app/modules/i18n/vocabs/${language}.ts`),'utf8');
   const block=source.match(/mockData:\s*\{([\s\S]*?)\n\s*\},/)[1];
   dictionaries[language]=[...block.matchAll(/\b([a-zA-Z]+):/g)].map(match=>match[1]).sort();
 }
 if(JSON.stringify(dictionaries.en)!==JSON.stringify(dictionaries.ar))diagnostics.push({translation:'mockData key mismatch'});
 const scoped=[...new Set([...imports,...forms.map(form=>form.file),
 'src/app/modules/Administration/Settings/components/api-key/api-key.component.ts',
 'src/app/modules/Administration/Settings/components/api-key/api-key.component.html',
 'src/app/modules/Administration/Settings/components/settings-layout/settings-layout.component.ts',
 'src/app/modules/Administration/Settings/components/settings-layout/settings-layout.component.html',
 'src/app/modules/Administration/Settings/components/settings-layout/settings-layout.component.scss',
 'src/app/modules/Administration/Settings/services/api-key.service.ts','src/app/modules/Administration/Settings/settings.routes.ts',
 'src/app/modules/shared/components/mock-data','src/app/modules/shared/service/mock-data.service.ts',
 'src/app/modules/shared/components/editable-collection-table',
 'src/app/modules/shared/components/form-section/form-section.component.ts','src/app/modules/shared/components/form-section/form-section.component.html','src/app/modules/shared/components/form-section/form-section.component.scss',
 'src/app/modules/UserGuide/content/shared-screen-guidance.ts','src/app/modules/UserGuide/content/administration-guide.ts',
 'src/app/modules/UserGuide/content/customer-profile-topics.ts',
 'src/app/modules/UserGuide/components/reader/guide-reader.component.ts','src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts',
 'src/app/modules/i18n/vocabs/en.ts','src/app/modules/i18n/vocabs/ar.ts','tsconfig.app.json'])];
 let diff='';
 for(let index=0;index<scoped.length;index+=60) {
   diff+=git(['diff','--',...scoped.slice(index,index+60)]);
   git(['diff','--check','--',...scoped.slice(index,index+60)]);
 }
 fs.writeFileSync('F:/My Work/Sigma/reviews/AI_MOCK_DATA_FRONTEND_SCOPED.diff',diff);
 const initialDirty=new Set(['src/app/modules/UserGuide/components/reader/guide-reader.component.ts','src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu-data.ts',
 'src/app/modules/Vouchers/Invoices/Invoice/components/list/list.component.html','src/app/modules/Vouchers/Invoices/Invoice/components/list/list.component.scss','src/app/modules/Vouchers/Invoices/Invoice/components/list/list.component.ts',
 'src/app/modules/Vouchers/Invoices/Invoice/components/tax-advance-details/tax-advance-details.component.html','src/app/modules/Vouchers/Invoices/Invoice/components/tax-advance-details/tax-advance-details.component.ts',
 'src/app/modules/Vouchers/Invoices/Invoice/invoice.routes.ts','src/app/modules/Vouchers/Invoices/Invoice/models/details.ts','src/app/modules/Vouchers/Invoices/Invoice/models/list.ts',
 'src/app/modules/Vouchers/Invoices/Invoice/services/invoice.service.ts','src/app/modules/i18n/vocabs/ar.ts','src/app/modules/i18n/vocabs/en.ts',
 'src/app/modules/shared/components/feature-title/feature-title.component.scss','src/app/modules/shared/components/filter-panel/filter-panel.component.html',
 'src/app/modules/shared/components/filter-panel/filter-panel.component.scss','src/app/modules/shared/components/filter-panel/filter-panel.component.ts',
 'src/app/modules/shared/components/filter-panel/filter-panel.directives.ts','tsconfig.app.json']);
 const knownBehavior=new Set(scoped.filter(file=>/Settings|i18n|shared-screen-guidance|tsconfig/.test(file)));
 // Owner-requested card column widths are reviewed directly, not classified as mechanical adoption.
 knownBehavior.add('src/app/modules/Customers/Individual/IndividualPartner/components/details/details.component.ts');
 knownBehavior.add('src/app/modules/Customers/Companies/CompanyPartner/components/detalisForm/credit-cards/credit-cards.component.ts');
 const routine=[];
 for(const file of [...new Set([...imports,...forms.map(form=>form.file)])]) {
   const normal=file.replace(/\\/g,'/');
   if(initialDirty.has(normal)||knownBehavior.has(file)||knownBehavior.has(normal)||normal.includes('Invoice/components/')&&normal.includes('core-editor'))continue;
   const head=cp.spawnSync('git',['-c',`safe.directory=${root}`,'-C',root,'show',`HEAD:${normal}`],{encoding:'utf8'});
   if(head.status!==0)continue; // Already-untracked owner source: preserve its scoped adoption only.
   const source=fs.readFileSync(path.join(root,file),'utf8');
   const reversed=source.replace(/import \{ MockDataFormsModule \} from 'src\/app\/modules\/shared\/components\/mock-data\/mock-data-forms.module';\r?\n/,'')
     .replace(/MockDataFormsModule, ?/g,'').replace(/(<[a-z-]+) appMockData\b/g,'$1')
     .replace(/ mockDataPaymentField="(?:cardNumber|cvv)"/g,'');
   const normalize=text=>text.replace(/\r\n/g,'\n').replace(/[ \t]+(?=\n)/g,'');
   if(normalize(reversed)!==normalize(head.stdout)) diagnostics.push({file:normal,reason:'non-routine diff requires manual source review'});
   else routine.push(normal);
 }
 inventory.forms=forms; inventory.imports=imports; inventory.sourceVerification={diagnostics,translationKeys:dictionaries.en.length,routineDiffs: routine.length,scopedFiles:scoped};
 fs.writeFileSync('F:/My Work/Sigma/reviews/AI_MOCK_DATA_ADOPTION.json',JSON.stringify(inventory,null,2));
 console.log(JSON.stringify({forms:forms.length,imports:imports.length,translationKeys:dictionaries.en.length,routineDiffs:routine.length,diagnosticCount:diagnostics.length,diagnostics:diagnostics.slice(0,12)},null,2));
 if(diagnostics.length)process.exitCode=1;
})().catch(error=>{console.error(error.message);process.exitCode=1;});
