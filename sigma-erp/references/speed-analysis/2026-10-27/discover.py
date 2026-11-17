import urllib.request as U
import xml.etree.ElementTree as E
from collections import Counter
from lxml import html
from pathlib import Path
base=Path(__file__).parent
U.install_opener(U.build_opener(U.HTTPSHandler()))
U._opener.addheaders=[('User-Agent','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.7705')]
data=(base/'page-sitemap.xml').read_bytes()
(base/'page-sitemap.xml').write_bytes(data)
urls=[a.text for a in E.fromstring(data).findall('{*}url/{*}loc')]
print('PAGES',len(urls))
print(Counter(u.split('/')[3] for u in urls))
print('OTHER', '\n'.join(u for u in urls if 'user-guide' not in u))
for name,url in [('sample','https://speedautosystems.com/car-rental-software/user-guide/rental-agreement-opening/')]:
    raw=U.urlopen(url,timeout=40).read()
    (base/(name+'.html')).write_bytes(raw)
    s=html.fromstring(raw)
    print(name,'CONTAINERS',[(t.tag,t.get('class'),len(t.text_content())) for t in s.xpath('//main|//article|//*[contains(@class,"entry-content")]')])
    print(name,'HEADINGS',[(t.tag,t.text_content().strip()[:150]) for t in s.xpath('//h1|//h2|//h3')][:30])
    print(name,'FILES',[(t.tag,t.get('src') or t.get('href')) for t in s.xpath('//iframe|//a[contains(@href,".pdf")]')])
