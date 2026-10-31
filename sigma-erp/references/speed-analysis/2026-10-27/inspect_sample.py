from lxml import html
from pathlib import Path
root=html.fromstring((Path(__file__).parent/'sample.html').read_bytes())
main=root.xpath('//main')[0]
print(html.tostring(main,encoding='unicode')[:19000])
