import concurrent.futures as cf
import copy, csv, hashlib, html as H, json, re, time
import urllib.request as U
from urllib.parse import urljoin, urlsplit, urlunsplit, unquote
from pathlib import Path
import xml.etree.ElementTree as E
from lxml import html

ROOT=Path(__file__).parent
LIB=ROOT/'library'
for d in ['pages','text','assets','downloads','source']:
    (LIB/d).mkdir(parents=True,exist_ok=True)
UA='Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.7705'
PRODUCTS={'car-rental-software','vehicle-leasing-software','financial-system','limo-software','vehicle-mobile-inspection','uk-vehicle-safety-check-system','e-fuel-management-system','e-toll-download-system','traffic-fines-downloader','speed-crs-cloud-based-car-rental-software','speed-car-rental-software-uk'}
EXTRA={'speed-customer-relationship-management','speed-human-resource-management','garage-management-system','how-to-use-vmi','how-to-use-crs','limo-software-overview','speed-auto-systems-integration-with-zatca-e-invoicing-for-all-rental-leasing-companies-in-ksa','payments-automation-for-auto-industry-streamline-with-advance-solution','new-vehicle-mobile-inspection-app-for-automotive-mobility'}
EXTS={'.pdf','.doc','.docx','.xls','.xlsx','.ppt','.pptx','.zip','.csv'}
PREVIOUS={r['url']:r for r in json.loads((ROOT/'collected.json').read_text(encoding='utf-8')) if r['status']=='error'} if (ROOT/'collected.json').exists() else {}
def norm(url, base='https://speedautosystems.com/'):
    p=urlsplit(urljoin(base,url.strip()))
    if p.scheme not in {'http','https'}: return ''
    host=(p.hostname or '').lower().removeprefix('www.')
    path=re.sub('/+','/',p.path)
    if host=='speedautosystems.com':
        return urlunsplit(('https',host,path if Path(path).suffix else path.rstrip('/')+'/', '', ''))
    return urlunsplit((p.scheme,p.netloc,p.path,p.query,''))
def selected(url):
    p=urlsplit(url)
    if p.hostname!='speedautosystems.com': return False
    bits=p.path.strip('/').split('/')
    if any(x in p.path for x in ['request-','/pricing','/benefits-test/']): return False
    return bits[0] in PRODUCTS|EXTRA and not Path(p.path.rstrip('/')).suffix
def fetch(url):
    last=None
    for attempt in range(2):
        try:
            req=U.Request(url,headers={'User-Agent':UA})
            with U.urlopen(req,timeout=35) as r:
                return r.read(), norm(r.url), r.headers.get('Content-Type','')
        except Exception as ex:
            last=ex
            if '404' in str(ex) or '403' in str(ex): break
            time.sleep(0.4)
    raise last
def key(url): return hashlib.sha256(url.encode()).hexdigest()[:16]
def textify(node):
    n=copy.deepcopy(node)
    for t in n.xpath('//script|//style'): t.drop_tree()
    for t in n.iter():
        if t.tag in {'p','div','li','h1','h2','h3','h4','section','tr','ol','ul','br'}:
            t.tail='\n'+(t.tail or '')
            if t.tag in {'li','h1','h2','h3','h4'}: t.text='\n'+(t.text or '')
    return '\n'.join(re.sub(r'\s+',' ',s).strip() for s in n.text_content().splitlines() if s.strip())
def process(url):
    if url in PREVIOUS: return PREVIOUS[url]
    fn=LIB/'source'/(key(url)+'.html')
    try:
        if fn.exists(): raw=fn.read_bytes(); final=url; typ='text/html'
        else:
            raw,final,typ=fetch(url)
            fn.write_bytes(raw)
        doc=html.fromstring(raw)
        title=' '.join(doc.xpath('//title/text()')).split('|')[0].strip()
        links=[norm(a.get('href',''),url) for a in doc.xpath('//a[@href]')]
        main=copy.deepcopy((doc.xpath('//*[@id="main"]') or doc.xpath('//main') or doc.xpath('//article') or [doc])[0])
        for t in list(main.xpath('.//*[@id="footer"]|.//*[@id="socket"]|.//header|.//aside')):
            if t.getparent() is not None: t.drop_tree()
        is_index='/user-guide/' in url and url.rstrip('/').endswith('user-guide')
        # Retain navigation on guide index pages; remove repeated side menus from articles.
        if not is_index:
            for t in list(main.xpath('//*[contains(concat(" ",normalize-space(@class)," ")," bellows ") or starts-with(@id,"iks-menu")]')):
                if t.getparent() is not None: t.drop_tree()
        for t in list(main.xpath('.//script|.//style|.//form|.//nav|.//button|.//*[contains(@class,"av-social-sharing-box")]|.//*[contains(@class,"hr-custom")]')):
            if t.getparent() is not None: t.drop_tree()
        videos=[]
        for t in list(main.xpath('.//iframe')):
            src=norm(t.get('src',''),url)
            if 'youtube' in src or 'vimeo' in src:
                videos.append(src)
                a=html.Element('a',href=src); a.text='Watch source video online'
                t.getparent().replace(t,a)
            else: t.drop_tree()
        assets=[]
        for t in main.xpath('.//img'):
            src=norm(t.get('data-src') or t.get('src',''),url)
            if src and not src.startswith('data:'): assets.append(src); t.set('src',src)
            for attr in ['srcset','sizes','loading','onerror','onload']: t.attrib.pop(attr,None)
        for t in main.iter():
            for attr in list(t.attrib):
                if attr.startswith('on') or attr in {'style','class','width','height'}: t.attrib.pop(attr,None)
        for t in main.xpath('.//a[@href]'): t.set('href',norm(t.get('href'),url))
        text=textify(main)
        headings=[re.sub(r'\s+',' ',x.text_content()).strip() for x in main.xpath('.//h1|.//h2|.//h3|.//h4')]
        kind='user-guide' if '/user-guide/' in url else ('tutorial' if 'how-to-' in url else 'product-reference')
        if 'process-flow' in url: kind='process-flow'
        return {'url':url,'final_url':final,'title':title,'product':urlsplit(url).path.strip('/').split('/')[0],'kind':kind,'headings':headings,'text':text,'content':html.tostring(main,encoding='unicode'),'assets':sorted(set(assets)),'videos':videos,'links':sorted(set(filter(None,links))),'status':'ok','bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest()}
    except Exception as ex:
        return {'url':url,'status':'error','error':str(ex),'links':[]}
def download(url):
    suffix=Path(unquote(urlsplit(url).path)).suffix.lower()
    cat='downloads' if suffix in EXTS else 'assets'
    path=LIB/cat/(key(url)+suffix)
    try:
        if not path.exists():
            raw,final,typ=fetch(url)
            if 'text/html' in typ: raise ValueError('HTML returned for asset')
            path.write_bytes(raw)
        return {'url':url,'path':path.relative_to(LIB).as_posix(),'bytes':path.stat().st_size,'status':'ok'}
    except Exception as ex: return {'url':url,'status':'error','error':str(ex)}
def run():
    root=E.fromstring((ROOT/'page-sitemap.xml').read_bytes())
    urls={norm(x.text) for x in root.findall('{*}url/{*}loc')}
    queue={u for u in urls if selected(u)}
    seen=set(); records=[]
    with cf.ThreadPoolExecutor(max_workers=4) as pool:
        while queue:
            batch=sorted(queue-seen); queue=set()
            print('Batch',len(batch), 'known',len(seen),flush=True)
            for i,r in enumerate(pool.map(process,batch),1):
                seen.add(r['url']); records.append(r)
                queue.update(u for u in r['links'] if selected(u) and u not in seen)
                if i%30==0: print('Pages',len(records),'errors',sum(x['status']!='ok' for x in records),flush=True)
            queue-=seen
    (ROOT/'collected.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
    good=[r for r in records if r['status']=='ok']
    asset_urls={u for r in good for u in r['assets'] if urlsplit(u).hostname in {'speedautosystems.com','www.speedautosystems.com'}}
    asset_urls.update(u for r in good for u in r['links'] if Path(urlsplit(u).path).suffix.lower() in EXTS)
    print('Downloading',len(asset_urls),'assets and documents',flush=True)
    assets=[]
    with cf.ThreadPoolExecutor(max_workers=4) as pool:
        for i,a in enumerate(pool.map(download,sorted(asset_urls)),1):
            assets.append(a)
            if i%100==0: print('Assets',i,flush=True)
    (LIB/'assets-manifest.json').write_text(json.dumps(assets,ensure_ascii=False,indent=2),encoding='utf-8')
    mapping={r['url']:'pages/'+key(r['url'])+'.html' for r in good}
    amap={a['url']:a['path'] for a in assets if a['status']=='ok'}
    style='body{font:17px/1.65 Arial,sans-serif;max-width:1050px;margin:40px auto;padding:0 24px;color:#20262d}img{max-width:100%;height:auto;display:block;margin:16px 0}a{color:#075a94}table{border-collapse:collapse}td,th{border:1px solid #ccd4dd;padding:10px}nav{padding:12px 0}h1,h2,h3{line-height:1.3}li{margin:5px 0}'
    for i,r in enumerate(sorted(good,key=lambda r:r['url']),1):
        r['id']=f'S{i:03}'
        node=html.fromstring(r['content'])
        for t in node.xpath('.//img[@src]'):
            if t.get('src') in amap: t.set('src','../'+amap[t.get('src')])
        for t in node.xpath('.//a[@href]'):
            u=t.get('href')
            if u in mapping: t.set('href','../'+mapping[u])
            elif u in amap: t.set('href','../'+amap[u])
        body=html.tostring(node,encoding='unicode')
        out=f'<!doctype html><html lang="en"><meta charset="utf-8"><title>{H.escape(r["title"])}</title><style>{style}</style><nav><a href="../index.html">Library index</a> | <a href="{H.escape(r["url"])}">Original source</a> | {r["id"]}</nav><h1>{H.escape(r["title"])}</h1>{body}</html>'
        (LIB/mapping[r['url']]).write_text(out,encoding='utf-8')
        (LIB/'text'/(key(r['url'])+'.txt')).write_text(r['id']+'\n'+r['title']+'\n'+r['url']+'\n\n'+r['text'],encoding='utf-8')
        r['local_path']=mapping[r['url']]
        r.pop('content',None);r.pop('links',None)
    (LIB/'manifest.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
    with (LIB/'catalog.csv').open('w',encoding='utf-8-sig',newline='') as f:
        fields=['id','product','kind','title','url','local_path','status','error']
        w=csv.DictWriter(f,fieldnames=fields,extrasaction='ignore');w.writeheader();w.writerows(records)
    payload=json.dumps([{'id':r['id'],'product':r['product'],'kind':r['kind'],'title':r['title'],'url':r['url'],'path':r['local_path'],'text':r['text']} for r in good],ensure_ascii=False).replace('</','<\/')
    index='''<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><title>مكتبة وثائق سبيد</title><style>body{font:17px/1.7 Arial;max-width:1150px;margin:35px auto;padding:0 24px;color:#172433}input,select{font:inherit;padding:10px;margin:6px;max-width:90%}article{border-bottom:1px solid #d9e0e5;padding:14px 0}a{color:#065d91}small{color:#52606d}h2{font-size:20px;margin:3px}label{display:inline-block}</style><h1>مكتبة وثائق سبيد</h1><p>نسخة مرجعية للتحليل بتاريخ ٢٧ أكتوبر ٢٠٢٦. ابحث في عناوين الصفحات ونصوصها. الفيديوهات تحتاج إلى اتصال بالإنترنت. محتوى الوثائق وحقوقه لأصحابه.</p><p><a href="../Speed_Analysis_Guide.html">دليل التحليل المتكامل</a></p><label>بحث <input id="q" type="search" placeholder="عقد أو فاتورة أو agreement" size="45"></label><label>المنتج <select id="product"><option value="">جميع المنتجات</option></select></label><label>نوع المرجع <select id="kind"><option value="">جميع الأنواع</option></select></label><p id="count"></p><main id="rows"></main><script>const data=PAYLOAD;const el=id=>document.getElementById(id);const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));for(const field of ['product','kind']){for(const value of [...new Set(data.map(x=>x[field]))].sort()){let o=document.createElement('option');o.value=value;o.textContent=value;el(field).append(o)}}function render(){let q=el('q').value.toLowerCase().trim(),p=el('product').value,k=el('kind').value;let rows=data.filter(r=>(!p||r.product===p)&&(!k||r.kind===k)&&(!q||(r.title+' '+r.text+' '+r.id).toLowerCase().includes(q)));el('count').textContent='عدد الصفحات المطابقة '+rows.length+' من '+data.length;el('rows').innerHTML=rows.map(r=>'<article><small>'+esc(r.id)+' · '+esc(r.product)+' · '+esc(r.kind)+'</small><h2 dir="auto"><a href="'+esc(r.path)+'">'+esc(r.title)+'</a></h2><p><a href="'+esc(r.url)+'">المصدر الرسمي</a></p></article>').join('')}for(const id of ['q','product','kind'])el(id).addEventListener('input',render);render();</script></html>'''.replace('PAYLOAD',payload)
    (LIB/'index.html').write_text(index,encoding='utf-8')
    summary={'attempted':len(records),'saved':len(good),'errors':[{k:v for k,v in r.items() if k in ['url','error']} for r in records if r['status']!='ok'],'assets_saved':sum(a['status']=='ok' for a in assets),'assets_errors':sum(a['status']!='ok' for a in assets),'documents':[a for a in assets if a.get('path','').startswith('downloads/')],'products':{p:sum(r['product']==p for r in good) for p in sorted({r['product'] for r in good})}}
    (ROOT/'collection-summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(summary,ensure_ascii=False,indent=2),flush=True)
if __name__=='__main__':run()
