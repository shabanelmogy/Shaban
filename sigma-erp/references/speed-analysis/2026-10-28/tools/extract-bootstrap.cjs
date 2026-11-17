const fs=require('fs'), path=require('path');
const parser=require('C:/Users/user/AppData/Local/npm-cache/_npx/ad9a3fdbcad992c6/node_modules/@babel/parser');
const source=fs.readFileSync(0,'utf8').replace(/^\uFEFF/,'');
const ast=parser.parse(source,{sourceType:'script'});
function name(n){return n?.type==='Identifier'?n.name:n?.type==='MemberExpression'?name(n.object)+'.'+(n.computed?n.property.value:n.property.name):'';}
function literal(n){
 if(!n)return null;
 if(['StringLiteral','NumericLiteral','BooleanLiteral'].includes(n.type))return n.value;
 if(n.type==='NullLiteral')return null;
 if(n.type==='ArrayExpression')return n.elements.map(literal);
 if(n.type==='ObjectExpression')return Object.fromEntries(n.properties.filter(p=>p.type==='ObjectProperty').map(p=>[p.key.name??p.key.value,literal(p.value)]));
 if(n.type==='UnaryExpression'&&n.operator==='-')return -literal(n.argument);
 return {unresolvedExpression:n.type};
}
const allowed=new Set(['abp.nav.menus','abp.features.allFeatures','abp.auth.grantedPermissions']);
const result={captureUtc:new Date().toISOString(),scope:'Selected menu, feature flags and granted-permission booleans only. No account settings, identifiers, cookies or credentials.'};
function walk(n){if(!n||typeof n!=='object')return;if(n.type==='AssignmentExpression'&&allowed.has(name(n.left)))result[name(n.left)]=literal(n.right);for(const [k,v]of Object.entries(n))if(!['loc','start','end','comments','tokens'].includes(k)){if(Array.isArray(v))v.forEach(walk);else if(v&&typeof v==='object')walk(v);}}
walk(ast);
fs.writeFileSync(path.resolve(__dirname,'../data/sidebar-context.json'),JSON.stringify(result,null,2));
const menu=result['abp.nav.menus'];
console.log(JSON.stringify({savedAssignments:Object.keys(result),menus:menu?Object.keys(menu):[],topLevel:menu?.MainMenu?.items?.map(x=>({name:x.name,displayName:x.displayName,children:x.items?.length}))},null,2));
