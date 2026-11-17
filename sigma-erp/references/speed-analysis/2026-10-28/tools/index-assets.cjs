// Parses downloaded text. Never evaluates application code or invokes application services.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const parser=require(process.env.SPEED_BABEL_PARSER||'C:/Users/user/AppData/Local/npm-cache/_npx/ad9a3fdbcad992c6/node_modules/@babel/parser');
const root=path.resolve(__dirname,'..'), out=(p,x)=>fs.writeFileSync(path.join(root,p),typeof x==='string'?x:JSON.stringify(x,null,2));
const context=JSON.parse(fs.readFileSync(path.join(root,'data/sidebar-context.json'),'utf8').replace(/^\uFEFF/,''));
const flags=context['abp.features.allFeatures'], grants=context['abp.auth.grantedPermissions'];
function member(n){if(!n)return '';if(n.type==='Identifier')return n.name;if(n.type==='ThisExpression')return 'this';if(['MemberExpression','OptionalMemberExpression'].includes(n.type))return member(n.object)+'.'+(n.computed?n.property.value:n.property.name);return '';}
function walk(n,fn,anc=[]){if(!n||typeof n!=='object')return;fn(n,anc);for(const[k,v]of Object.entries(n)){if(['loc','start','end','extra','comments','errors'].includes(k))continue;if(Array.isArray(v))for(const c of v)if(c?.type)walk(c,fn,anc.concat(n));else{}else if(v?.type)walk(v,fn,anc.concat(n));}}
function val(n){if(!n)return null;if(['StringLiteral','NumericLiteral','BooleanLiteral'].includes(n.type))return n.value;if(n.type==='NullLiteral')return null;if(n.type==='ArrayExpression')return n.elements.map(val);if(n.type==='ObjectExpression')return Object.fromEntries(n.properties.filter(x=>x.type==='ObjectProperty').map(x=>[x.key.name??x.key.value,val(x.value)]));if(n.type==='BinaryExpression'&&n.operator==='+'){const a=val(n.left),b=val(n.right);if(typeof a==='string'&&typeof b==='string')return a+b;}return {expression:n.type};}
function enabled(key){const x=flags[key];return x?.value==='true'||x?.value===true||x==='true'||x===true;}
function truth(n){if(!n)return null;if(n.type==='BooleanLiteral')return n.value;if(n.type==='UnaryExpression'&&n.operator==='!'){let x=truth(n.argument);return x===null?null:!x;}if(n.type==='CallExpression'){const key=val(n.arguments[0]);if(member(n.callee)==='abp.features.isEnabled')return enabled(key);if(member(n.callee)==='abp.auth.hasPermission')return grants[key]===true;}if(n.type==='LogicalExpression'){const a=truth(n.left),b=truth(n.right);if(n.operator==='&&')return a===false||b===false?false:a===true&&b===true?true:null;if(n.operator==='||')return a===true||b===true?true:a===false&&b===false?false:null;}return null;}
const parseResults=[],routes=[],controllers=[],registrations=[],services=[];
for(const file of ['application.js','common.js','login.js','service-proxies-angular.js']){
 const src=fs.readFileSync(path.join(root,'raw',file),'utf8');
 const ast=parser.parse(src,{sourceType:'script',errorRecovery:true,attachComment:false,allowReturnOutsideFunction:true});
 parseResults.push({file,errors:ast.errors.map(x=>({message:x.message,line:x.loc?.line})),sha256:crypto.createHash('sha256').update(src).digest('hex')});
 console.log('Parsed '+file+'; errors='+ast.errors.length);
 const loc=n=>({file:'raw/'+file,line:n.loc.start.line,endLine:n.loc.end.line,start:n.start,end:n.end});
 walk(ast,(n,anc)=>{
  if(n.type!=='CallExpression')return;
  const target=member(n.callee), kind=target.split('.').pop();
  if(kind==='state'&&n.arguments[0]?.type==='StringLiteral'&&n.arguments[1]?.type==='ObjectExpression'){
   const props=Object.fromEntries(n.arguments[1].properties.filter(x=>x.type==='ObjectProperty').map(x=>[x.key.name??x.key.value,x.value]));
   const guards=anc.filter(a=>a.type==='IfStatement').map(a=>({expression:src.slice(a.test.start,a.test.end),value:truth(a.test),branch:n.start>=a.consequent.start&&n.end<=a.consequent.end?'then':'else'}));
   const route={name:n.arguments[0].value,url:val(props.url),templateUrl:val(props.templateUrl),menu:val(props.menu),controller:val(props.controller),guards,source:loc(n)};
   route.guardAssessment=guards.some(g=>g.value!==null&&(g.branch==='then'?!g.value:g.value))?'excluded-by-static-guard':guards.some(g=>g.value===null)?'unknown':'passes-static-guards';
   routes.push(route);
  }
  if(['controller','factory','service','directive','filter'].includes(kind)&&n.arguments[0]?.type==='StringLiteral'){
   const item={kind,name:n.arguments[0].value,source:loc(n)};registrations.push(item);
   const arr=n.arguments[1], fn=arr?.type==='ArrayExpression'?arr.elements[arr.elements.length-1]:arr;
   const injections=arr?.type==='ArrayExpression'?arr.elements.slice(0,-1).map(x=>val(x)):[];
   if(!fn||!['FunctionExpression','ArrowFunctionExpression'].includes(fn.type))return;
   if(kind==='controller'){
    const alias={};injections.forEach((x,i)=>{if(fn.params[i]?.type==='Identifier')alias[fn.params[i].name]=x;});
    const c={...item,id:'C'+String(controllers.length+1).padStart(4,'0'),injections,services:injections.filter(x=>typeof x==='string'&&x.startsWith('abp.services.app.')),actions:[],serviceCalls:[],permissions:[],features:[],settings:[],templates:[],modalControllers:[],navigation:[],fields:[]};
    walk(fn,b=>{
     if(b.type==='AssignmentExpression'){
      const lhs=member(b.left);
      if(lhs.startsWith('vm.')&&['FunctionExpression','ArrowFunctionExpression'].includes(b.right.type))c.actions.push({name:lhs.slice(3),parameters:b.right.params.map(p=>p.name||p.type),source:loc(b)});
      else if(lhs.startsWith('vm.'))c.fields.push(lhs.slice(3));
     }
     if(b.type==='ObjectProperty'){
      const key=b.key.name??b.key.value,v=val(b.value);
      if(key==='templateUrl'&&typeof v==='string')c.templates.push(v);
      if(key==='controller'&&typeof v==='string')c.modalControllers.push(v);
     }
     if(b.type==='CallExpression'){
      const name=member(b.callee),parts=name.split('.'),svc=alias[parts[0]];
      if(svc?.startsWith('abp.services.app.'))c.serviceCalls.push({service:svc,method:parts.slice(1).join('.'),arguments:b.arguments.map(x=>src.slice(x.start,x.end)).map(x=>x.length>500?x.slice(0,500)+' [truncated]':x),source:loc(b)});
      const first=val(b.arguments[0]);
      if(name==='abp.auth.hasPermission'&&typeof first==='string')c.permissions.push(first);
      if(name==='abp.features.isEnabled'&&typeof first==='string')c.features.push(first);
      if(name==='abp.setting.get'&&typeof first==='string')c.settings.push(first);
      if(['$state.go','$state.href'].includes(name)&&typeof first==='string')c.navigation.push(first);
     }
    });
    for(const k of ['permissions','features','settings','templates','modalControllers','navigation','fields'])c[k]=[...new Set(c[k])];
    const safe=c.name.replace(/[^a-zA-Z0-9._-]/g,'_');c.readableFile='readable/controllers/'+c.id+'--'+safe+'.js';
    fs.mkdirSync(path.join(root,'readable/controllers'),{recursive:true});
    out(c.readableFile,'// Extracted registration; inert review copy, not a standalone runnable module.\n// Source: '+c.source.file+':'+c.source.line+'-'+c.source.endLine+'\n'+src.slice(n.start,n.end)+';\n');
    controllers.push(c);
   }
   if(kind==='factory'&&item.name.startsWith('abp.services.app.')){
    const svc={...item,methods:[]};
    walk(fn,b=>{
     if(b.type!=='AssignmentExpression'||!member(b.left).startsWith('this.')||b.right.type!=='FunctionExpression')return;
     const method={name:member(b.left).slice(5),parameters:b.right.params.map(x=>x.name),url:null,httpMethod:null,source:loc(b)};
     walk(b.right,x=>{if(x.type==='ObjectProperty'){const k=x.key.name??x.key.value;if(k==='method')method.httpMethod=val(x.value);if(k==='url'){const v=x.value;method.url=v.type==='BinaryExpression'&&member(v.left)==='abp.appPath'?val(v.right):val(v);}}});svc.methods.push(method);
    });services.push(svc);
   }
  }
 });
}
const menus=context['abp.nav.menus'];let active=enabled('POS')?'POS':['CRS.Rental','CRS.Limo','CRS.Transportation','CRS.Lease','FMS.VehicleAssignment','WORKSHOP'].some(enabled)?'CRS':['MCC','VMIWorkshop'].some(enabled)?'MCC':['TMS','TFMS'].some(enabled)?'TollsFines':enabled('VMIGeneric')?'VMIGeneric':enabled('Core.Support')?'Support':'MainMenu';
if(enabled('ExternalLogin')&&grants['Page.ExternaLogin']===true&&grants.Pages!==true)active='ExternalLogin';
out('data/parse-results.json',parseResults);out('data/routes.json',routes);out('data/controllers.json',controllers);out('data/registrations.json',registrations);out('data/services.json',services);out('data/active-menu.json',{name:active,basis:'Manual transcription of common.views.layout.sidebar selection branches against captured literal feature values and permissions. Not UI observation.',source:controllers.find(c=>c.name==='common.views.layout.sidebar')?.source,menu:menus[active]});
console.log(JSON.stringify({routes:routes.length,uniqueRoutes:new Set(routes.map(r=>r.name)).size,controllers:controllers.length,services:services.length,methods:services.reduce((n,s)=>n+s.methods.length,0),activeMenu:active}));
