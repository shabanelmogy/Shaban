from docx import Document
from lxml import etree
from docx.oxml.ns import qn
from pathlib import Path
d=Document(Path(__file__).parent/'Speed_Analysis_Guide.docx')
for p in d.paragraphs[:4]:print(p.text,etree.tostring(p._p.pPr,encoding='unicode'))
for name in ['Normal','Title','Heading 1']:
    s=d.styles[name]
    print(name,etree.tostring(s.element,encoding='unicode'))
