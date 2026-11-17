import json,re,csv
from collections import Counter
from pathlib import Path
from urllib.parse import urlsplit,unquote
from lxml import html
from zipfile import ZipFile
ROOT=Path(__file__).parent
broken=[];outside=[]
files=list((ROOT/'library/pages').glob('*.html'))+[ROOT/'library/index.html',ROOT/'Speed_Analysis_Guide.html']
for file in files:
    d=html.fromstring(file.read_bytes())
    for n in d.xpath('//*[@href]|//*[@src]'):
        value=n.get('href') or n.get('src')
        if value.startswith(('#','data:','mailto:','tel:')):continue
        if urlsplit(value).scheme:continue
        target=(file.parent/unquote(value.split('#')[0])).resolve()
        if not target.is_relative_to(ROOT):outside.append((str(file),value))
        if not target.exists():broken.append((str(file),value))
assert not broken,broken[:10]
assert not outside,outside[:10]
with ZipFile(ROOT/'Speed_Analysis_Guide.docx') as z:
    assert z.testzip() is None
    styles=html.fromstring(z.read('word/styles.xml'))
    assert b'w:pBdr' not in z.read('word/styles.xml').split(b'w:styleId="Title"')[1].split(b'</w:style>')[0]
for name,count in [('Requirements_Register.csv',60),('Decision_Questions.csv',32),('Collection_Issues.csv',27)]:
    with (ROOT/name).open(encoding='utf-8-sig',newline='') as f:
        rows=list(csv.reader(f));assert len(rows)-1==count,(name,len(rows)-1)
report={'html_files_checked':len(files),'broken_local_links':len(broken),'outside_links':len(outside),'docx_container':'valid','requirements':60,'questions':32,'collection_issues':27}
(ROOT/'qa/package-check.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(report)
