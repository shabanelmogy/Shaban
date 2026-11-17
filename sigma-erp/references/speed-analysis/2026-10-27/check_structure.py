from pathlib import Path
from collect import key
from lxml import html
for path in ['limo-software/web-app/','vehicle-leasing-software/features/','e-toll-download-system/','financial-system/features/']:
    doc=html.fromstring((Path(__file__).parent/'library'/'source'/(key('https://speedautosystems.com/'+path)+'.html')).read_bytes())
    print(path)
    for t in doc.xpath('//*[@id="main"]|//main|//*[@id="footer"]|//*[@id="socket"]'):
        print(t.tag,t.get('id'),t.get('class'),len(t.text_content()))
    print('H1',[(t.text_content(),t.getparent().tag,t.getparent().get('class')) for t in doc.xpath('//h1')])
