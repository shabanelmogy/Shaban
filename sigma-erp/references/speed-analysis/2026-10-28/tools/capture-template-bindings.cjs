// Read-only template GETs. Saves structural bindings only, never raw HTML or model values.
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),origin='https://app.speedautosystems.com';
const routes=JSON.parse(fs.readFileSync(path.join(root,'data/routes.json'))),active=JSON.parse(fs.readFileSync(path.join(root,'data/active-menu.json')));
const requested=new Set();function menu(n){if(n.url)requested.add(n.url);(n.items||[]).forEach(menu)}active.menu.items.forEach(menu);
const templates=[...new Set(routes.filter(r=>requested.has(r.name)&&typeof r.templateUrl==='string').map(r=>r.templateUrl))];
const jar=new Map();
async function request(url,options={}){
 if(new URL(url).origin!==origin)throw Error('Out-of-origin URL refused');
 let res=await fetch(url,{...options,headers:{Cookie:[...jar].map(([k,v])=>k+'='+v).join('; '),...options.headers},redirect:'manual',signal:AbortSignal.timeout(45000)});
 for(const c of res.headers.getSetCookie()){const [pair]=c.split(';'),p=pair.indexOf('=');jar.set(pair.slice(0,p),pair.slice(p+1));}
 return res;
}
async function main(){
 await request(origin+'/Account/Login');
 const body=new URLSearchParams({usernameOrEmailAddress:process.env.SPEED_ANALYSIS_EMAIL,password:process.env.SPEED_ANALYSIS_PASSWORD,isNewMethod:'true',tenancyName:'',returnUrlHash:''});
 const login=await request(origin+'/Account/LoginNew?returnUrl=/Application',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded','X-Requested-With':'XMLHttpRequest'},body});
 delete process.env.SPEED_ANALYSIS_PASSWORD;delete process.env.SPEED_ANALYSIS_EMAIL;
 if(!(await login.json()).success)throw Error('Login failed');
 const results=[];let cursor=0;
 const attrs=s=>Object.fromEntries([...s.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)].map(m=>[m[1].toLowerCase(),m[2]??m[3]]));
 async function worker(){while(cursor<templates.length){const templateUrl=templates[cursor++],url=origin+'/AbpAppView/Load?viewUrl='+encodeURIComponent(templateUrl)+'&_t='+Date.now();try{
  const res=await request(url),html=await res.text();
  const tags=[...html.matchAll(/<([\w:-]+)\b([^<>]*)>/g)].map(m=>({tag:m[1].toLowerCase(),a:attrs(m[2])}));
  const controllers=[...new Set(tags.map(t=>t.a['ng-controller']||t.a['data-ng-controller']).filter(Boolean))];
  const fields=tags.filter(t=>t.a['ng-model']||t.a['data-ng-model']).map(t=>({tag:t.tag,bindings:Object.fromEntries(Object.entries(t.a).filter(([k])=>/^(name|type|ng-model|data-ng-model|ng-required|required|min|max|minlength|maxlength|ng-min|ng-max|ng-disabled|ng-readonly|ng-if|ng-show|ng-options)$/.test(k)))}));
  const actions=[...new Set(tags.flatMap(t=>['ng-click','ng-submit','ng-change'].map(k=>t.a[k]).filter(Boolean)))];
  results.push({templateUrl,status:res.status,contentType:res.headers.get('content-type'),sha256DecodedUtf8:crypto.createHash('sha256').update(html).digest('hex'),controllers,fields,actions,formNames:tags.filter(t=>t.tag==='form').map(t=>t.a.name||t.a.id).filter(Boolean),source:'Authenticated template GET; structural attributes extracted without executing Angular. Raw HTML discarded.'});
 }catch(e){results.push({templateUrl,error:e.message});}
 if(results.length%40===0)console.log('Templates '+results.length+'/'+templates.length);
 }}
 await Promise.all([worker(),worker(),worker()]);
 fs.writeFileSync(path.join(root,'data/template-bindings.json'),JSON.stringify({captureUtc:new Date().toISOString(),scope:'Only templates referenced by active-sidebar routes. No domain-service calls. No raw HTML or model values retained.',results},null,2));
 console.log(JSON.stringify({requested:templates.length,succeeded:results.filter(r=>r.status===200).length,withControllers:results.filter(r=>r.controllers?.length).length,errorCount:results.filter(r=>r.error||r.status!==200).length,errorExamples:results.filter(r=>r.error||r.status!==200).slice(0,6).map(r=>({templateUrl:r.templateUrl,status:r.status,error:r.error}))}));jar.clear();
}
main().catch(e=>{console.error(e.message);process.exitCode=1});
