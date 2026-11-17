import csv, html as H, json, re
from pathlib import Path
from collections import Counter
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.opc.constants import RELATIONSHIP_TYPE as RT
from references import PATHS
from registers import REQUIREMENTS, QUESTIONS

ROOT=Path(__file__).parent
rows=json.loads((ROOT/'library/manifest.json').read_text(encoding='utf-8'))
summary=json.loads((ROOT/'collection-summary.json').read_text(encoding='utf-8'))
good={r['url']:r for r in rows if r['status']=='ok'}
refs={alias:good['https://speedautosystems.com/'+path] for alias,path in PATHS.items()}
assets=json.loads((ROOT/'library/assets-manifest.json').read_text(encoding='utf-8'))
video_count=len({v for r in good.values() for v in r['videos']})
stats=f'حُفظت {summary["saved"]} صفحة من {summary["attempted"]} رابطًا جرى فحصه، مع {summary["assets_saved"]} ملفًا مساعدًا، بينها ملف تعريفي واحد. تضم الصفحات {video_count} رابط فيديو مختلفًا. تعذر فتح {len(summary["errors"])} رابط صفحة وتحميل {summary["assets_errors"]} ملفات مساعدة. الأعداد تصف نجاح الحصول على المحتوى، ولا تثبت اكتمال كل صفحة أو حداثتها.'
body=(ROOT/'guide_body.md').read_text(encoding='utf-8').replace('{{COLLECTION_STATS}}',stats)
ref_list='\n\n'.join(f'- المصدر {r["id"]} [فتح المرجع الرسمي](%s)\n\n%s' % (r['url'],r['title']) for r in refs.values())
body=body.replace('{{REFERENCE_LIST}}',ref_list)
for alias,r in refs.items():body=body.replace('{{'+alias+'}}',f'[المصدر {r["id"]}]({r["url"]})')
assert '{{' not in body
(ROOT/'Speed_Analysis_Guide.md').write_text(body,encoding='utf-8')

def blocks(text):
    lines=text.splitlines();i=0
    while i<len(lines):
        line=lines[i].strip()
        if not line:i+=1;continue
        if line.startswith('#'):
            m=re.match(r'^(#+) (.*)',line);yield ('heading',len(m[1]),m[2]);i+=1
        elif line.startswith('|'):
            table=[]
            while i<len(lines) and lines[i].strip().startswith('|'):
                vals=[x.strip() for x in lines[i].strip().strip('|').split('|')]
                if not all(re.fullmatch(r'[: -]+',v) for v in vals):table.append(vals)
                i+=1
            yield ('table',table)
        elif line.startswith('- '):yield ('bullet',line[2:]);i+=1
        else:
            p=[line];i+=1
            while i<len(lines) and lines[i].strip() and not lines[i].startswith(('#','|','- ')):
                p.append(lines[i].strip());i+=1
            yield ('p',' '.join(p))

def html_inline(text):
    out=[];start=0
    for m in re.finditer(r'\[([^]]+)\]\(([^)]+)\)',text):
        out.append(H.escape(text[start:m.start()]))
        url=m[2];local='library/'+good[url]['local_path'] if url in good else url
        out.append(f'<a href="{H.escape(local)}" title="{H.escape(url)}">{H.escape(m[1])}</a>');start=m.end()
    out.append(H.escape(text[start:]));return ''.join(out)

parts=[];toc=[];section=0;in_list=False
for b in blocks(body):
    if in_list and b[0]!='bullet':parts.append('</ul>');in_list=False
    if b[0]=='heading':
        level,txt=b[1:]
        if level==2:
            section+=1;toc.append((f's{section}',txt))
        anchor=f' id="s{section}"' if level==2 else ''
        parts.append(f'<h{level}{anchor}>{H.escape(txt)}</h{level}>')
    elif b[0]=='p':parts.append('<p dir="auto">'+html_inline(b[1])+'</p>')
    elif b[0]=='bullet':
        if not in_list:parts.append('<ul>');in_list=True
        parts.append('<li>'+html_inline(b[1])+'</li>')
    elif b[0]=='table':
        parts.append('<div class="table-scroll"><table><thead><tr>'+''.join('<th>'+html_inline(x)+'</th>' for x in b[1][0])+'</tr></thead><tbody>')
        for row in b[1][1:]:parts.append('<tr>'+''.join('<td>'+html_inline(x)+'</td>' for x in row)+'</tr>')
        parts.append('</tbody></table></div>')
if in_list:parts.append('</ul>')
toc_html='<nav aria-label="فهرس الدليل"><h2>فهرس الدليل</h2><ol>'+''.join(f'<li><a href="#{a}">{H.escape(t)}</a></li>' for a,t in toc)+'</ol></nav>'
css='''body{margin:0;background:#f7f8fa;color:#1c2731;font:18px/1.85 Arial,sans-serif}main{max-width:1030px;background:white;margin:auto;padding:35px 48px}h1{font-size:35px;line-height:1.4}h2{font-size:26px;margin-top:2em;line-height:1.5}h3{font-size:21px;line-height:1.5}h1,h2,h3{color:#000}a{color:#065c91}p{margin:14px 0}nav{padding:10px 0}nav ol{columns:2;column-gap:45px}table{border-collapse:collapse;width:100%;font-size:16px;line-height:1.65;margin:20px 0}th,td{border:1px solid #d9d9d9;padding:11px;text-align:right;vertical-align:middle}th{background:#e6edf2;color:black}tbody tr:nth-child(even){background:#f8fafb}.table-scroll{overflow-x:auto}.tools{position:sticky;top:0;background:#edf2f6;padding:10px 16px;z-index:2;border-bottom:1px solid #d9d9d9}button,input{font:inherit;padding:6px 10px}button{cursor:pointer}.tools a{margin:0 8px}mark{background:#ffe78c}@media(max-width:700px){main{padding:20px}nav ol{columns:1}table{min-width:650px}}@media print{body{background:white;font-size:11pt}main{padding:0}.tools{display:none}nav ol{columns:2}h2,h3{break-after:avoid}tr{break-inside:avoid}a{color:black}}'''
script='''const input=document.getElementById('find');let last='';function findText(){let q=input.value.trim();if(q)window.find(q,false,false,true,false,false,false)}document.getElementById('search').onclick=findText;input.addEventListener('keydown',e=>{if(e.key==='Enter')findText()});'''
page='<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>دليل تحليل منظومة سبيد</title><style>'+css+'</style><div class="tools"><a href="library/index.html">مكتبة المصادر</a><a href="#contents">الفهرس</a><label>بحث <input id="find" type="search" placeholder="اكتب كلمة للبحث"></label> <button id="search">بحث عن التالي</button></div><main>'
parts.insert(3,'<section id="contents">'+toc_html+'</section>')
page+=''.join(parts)+'</main><script>'+script+'</script></html>'
(ROOT/'Speed_Analysis_Guide.html').write_text(page,encoding='utf-8')

def set_bidi(p,enable=True):
    pp=p._p.get_or_add_pPr();x=OxmlElement('w:bidi');x.set(qn('w:val'),'1' if enable else '0');pp.append(x)
    jc=pp.find(qn('w:jc'))
    if jc is None:jc=OxmlElement('w:jc');pp.append(jc)
    jc.set(qn('w:val'),'start')
def format_run(r,size=12,bold=False,color='000000'):
    r.font.name='Arial';r.font.size=Pt(size);r.font.bold=bold;r.font.color.rgb=RGBColor.from_string(color)
    rp=r._r.get_or_add_rPr();fonts=rp.find(qn('w:rFonts'))
    if fonts is None:fonts=OxmlElement('w:rFonts');rp.insert(0,fonts)
    for a in ['ascii','hAnsi','cs','eastAsia']:fonts.set(qn('w:'+a),'Arial')
    lang=OxmlElement('w:lang');lang.set(qn('w:val'),'ar-EG');lang.set(qn('w:bidi'),'ar-EG');rp.append(lang)
    sz=OxmlElement('w:szCs');sz.set(qn('w:val'),str(round(size*2)));rp.append(sz)
def hyperlink(p,label,url=None,anchor=None):
    link=OxmlElement('w:hyperlink')
    if url:link.set(qn('r:id'),p.part.relate_to(url,RT.HYPERLINK,is_external=True))
    if anchor:link.set(qn('w:anchor'),anchor)
    run=OxmlElement('w:r');rp=OxmlElement('w:rPr');fonts=OxmlElement('w:rFonts')
    for x in ['ascii','hAnsi','cs']:fonts.set(qn('w:'+x),'Arial')
    rp.append(fonts)
    col=OxmlElement('w:color');col.set(qn('w:val'),'065C91');rp.append(col)
    for x in ['sz','szCs']:
        z=OxmlElement('w:'+x);z.set(qn('w:val'),'22');rp.append(z)
    run.append(rp);txt=OxmlElement('w:t');txt.text=label;run.append(txt);link.append(run);p._p.append(link)
def doc_inline(p,text,size=12):
    last=0
    for m in re.finditer(r'\[([^]]+)\]\(([^)]+)\)',text):
        if m.start()>last:format_run(p.add_run(text[last:m.start()]),size)
        hyperlink(p,m[1],m[2]);last=m.end()
    if last<len(text):format_run(p.add_run(text[last:]),size)

doc=Document();sec=doc.sections[0]
sec.page_width=Inches(8.27);sec.page_height=Inches(11.69)
sec.top_margin=sec.bottom_margin=Inches(.70);sec.left_margin=sec.right_margin=Inches(.76)
sec.header_distance=sec.footer_distance=Inches(.30)
for name,size in [('Normal',12),('Title',26),('Subtitle',14),('Heading 1',19),('Heading 2',15)]:
    st=doc.styles[name];st.font.name='Arial';st.font.size=Pt(size);st.font.color.rgb=RGBColor(0,0,0)
    for old in list(st.element.xpath('.//w:pBdr')):old.getparent().remove(old)
    rp=st.element.get_or_add_rPr()
    for tag in ['color','szCs']:
        for old in list(rp.findall(qn('w:'+tag))):rp.remove(old)
    z=OxmlElement('w:color');z.set(qn('w:val'),'000000');rp.append(z)
    z=OxmlElement('w:szCs');z.set(qn('w:val'),str(size*2));rp.append(z)
    st.paragraph_format.space_after=Pt(7)
doc.styles['Normal'].paragraph_format.line_spacing=1.14
for name in ['Heading 1','Heading 2']:
    doc.styles[name].paragraph_format.keep_with_next=True
    doc.styles[name].paragraph_format.space_before=Pt(15)

# Cover and a static, clickable table of contents.
title=doc.add_paragraph(style='Title');set_bidi(title)
format_run(title.add_run('دليل تحليل منظومة سبيد\nلإدارة المركبات والتأجير'),26,True)
p=doc.add_paragraph();set_bidi(p);format_run(p.add_run('مرجع لفريق تحليل الأعمال والمنتج'),15)
p=doc.add_paragraph();set_bidi(p);format_run(p.add_run('٢٧ أكتوبر ٢٠٢٦'),12)
p=doc.add_paragraph();set_bidi(p);doc_inline(p,'يربط هذا الدليل دورات التأجير والأسطول والفحص والمالية بمصادرها، ويحدد البيانات والعلاقات والقرارات المطلوبة لتطوير مواصفات العمل.')
p=doc.add_paragraph();set_bidi(p);doc_inline(p,stats)
p=doc.add_paragraph();set_bidi(p);doc_inline(p,'تتضمن الحزمة مكتبة المصادر وسجلًا للمتطلبات المبدئية وسجلًا للأسئلة. تعتمد القرارات المالية والتعاقدية على السياسة التي تقرها الشركة.')
doc.add_page_break()
p=doc.add_paragraph(style='Heading 1');set_bidi(p);format_run(p.add_run('فهرس الدليل'),19,True)
for anchor,txt in toc:
    p=doc.add_paragraph();set_bidi(p);p.paragraph_format.space_after=Pt(3);hyperlink(p,txt,anchor=anchor)
doc.add_page_break()

section=0;skip_intro=0
for b in blocks(body):
    if b[0]=='heading' and b[1]==1:skip_intro=2;continue
    if skip_intro and b[0]=='p':skip_intro-=1;continue
    if b[0]=='heading':
        level,txt=b[1:];style='Heading 1' if level==2 else 'Heading 2'
        p=doc.add_paragraph(style=style);set_bidi(p);format_run(p.add_run(txt),19 if level==2 else 15,True)
        if level==2:
            section+=1;name='s'+str(section)
            start=OxmlElement('w:bookmarkStart');start.set(qn('w:id'),str(section));start.set(qn('w:name'),name)
            end=OxmlElement('w:bookmarkEnd');end.set(qn('w:id'),str(section));p._p.insert(0,start);p._p.append(end)
    elif b[0] in {'p','bullet'}:
        p=doc.add_paragraph();txt=b[1];arabic=bool(re.search('[\u0600-\u06ff]',txt));set_bidi(p,arabic)
        if b[0]=='bullet':txt='• '+txt;p.paragraph_format.right_indent=Inches(.12)
        if txt.startswith('المراجع:'):p.paragraph_format.space_after=Pt(10)
        doc_inline(p,txt,11 if txt.startswith('المراجع:') else 12)
    elif b[0]=='table':
        grid=b[1];n=len(grid[0]);table=doc.add_table(rows=1,cols=n);table.alignment=WD_TABLE_ALIGNMENT.CENTER;table.autofit=False
        props=table._tbl.tblPr
        bidi=OxmlElement('w:bidiVisual');props.append(bidi)
        borders=OxmlElement('w:tblBorders')
        for side in ['top','left','bottom','right','insideH','insideV']:
            z=OxmlElement('w:'+side);z.set(qn('w:val'),'single');z.set(qn('w:sz'),'5');z.set(qn('w:color'),'D9D9D9');borders.append(z)
        props.append(borders)
        margins=OxmlElement('w:tblCellMar')
        for side in ['top','left','bottom','right']:
            z=OxmlElement('w:'+side);z.set(qn('w:w'),'95');z.set(qn('w:type'),'dxa');margins.append(z)
        props.append(margins)
        widths=([1.27,2.68,2.75] if n==3 else [1.3,1.5,1.9,2.0])
        if grid[0][0]=='الرمز':widths=[.53,2.95,3.22]
        for col,w in zip(table.columns,widths):col.width=Inches(w)
        for idx,row in enumerate(grid):
            cells=table.rows[0].cells if idx==0 else table.add_row().cells
            trpr=cells[0]._tc.getparent().get_or_add_trPr()
            keep=OxmlElement('w:cantSplit');trpr.append(keep)
            if idx==0:
                repeat=OxmlElement('w:tblHeader');trpr.append(repeat)
            for j,(cell,txt) in enumerate(zip(cells,row)):
                cell.width=Inches(widths[j]);cell.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER
                shade=OxmlElement('w:shd');shade.set(qn('w:fill'),'E6EDF2' if idx==0 else ('F7F9FB' if idx%2==0 else 'FFFFFF'));cell._tc.get_or_add_tcPr().append(shade)
                p=cell.paragraphs[0];set_bidi(p);p.paragraph_format.line_spacing=1.05;p.paragraph_format.space_after=Pt(3);p.paragraph_format.space_before=Pt(2)
                doc_inline(p,txt,10.5)
                if idx==0:
                    p.paragraph_format.keep_with_next=True
                    for r in p.runs:r.bold=True
        doc.add_paragraph().paragraph_format.space_after=Pt(2)

footer=sec.footer.paragraphs[0];footer.alignment=WD_ALIGN_PARAGRAPH.CENTER
format_run(footer.add_run('دليل تحليل سبيد  |  '),9)
field=OxmlElement('w:fldSimple');field.set(qn('w:instr'),'PAGE');footer._p.append(field)
doc.core_properties.title='دليل تحليل منظومة سبيد لإدارة المركبات والتأجير'
doc.core_properties.subject='تحليل الوحدات ودورات العمل والبيانات والقرارات والمصادر'
doc.core_properties.author='فريق تحليل الأعمال'
doc.core_properties.keywords='Speed, leasing, rental, fleet, analysis'
doc.save(ROOT/'Speed_Analysis_Guide.docx')

def write_csv(name,fields,records):
    with (ROOT/name).open('w',encoding='utf-8-sig',newline='') as f:
        w=csv.writer(f);w.writerow(fields);w.writerows(records)
write_csv('Requirements_Register.csv',['رقم المتطلب','المجال','موضوع المتطلب المبدئي','نوع الدليل','المصدر','رابط المصدر','الأولوية','القرار أو التفصيل المطلوب','حالة الاعتماد','معيار القبول التفصيلي'],[(f'R{i:03}',domain,req,kind,refs[src]['id'],refs[src]['url'],priority,decision,'مطروح للتحليل','') for i,(domain,req,src,kind,priority,decision) in enumerate(REQUIREMENTS,1)])
write_csv('Decision_Questions.csv',['رقم السؤال','المجال','السؤال المطلوب حسمه','المالك المقترح','الأولوية','المصدر','رابط المصدر','الإجابة المعتمدة','تاريخ الاعتماد'],[(f'Q{i:03}',domain,q,owner,priority,refs[src]['id'],refs[src]['url'],'','') for i,(domain,q,owner,src,priority) in enumerate(QUESTIONS,1)])
write_csv('Collection_Issues.csv',['النوع','الرابط','نتيجة التحميل'],[('صفحة',r['url'],r['error']) for r in rows if r['status']!='ok']+[('ملف مساعد',a['url'],a['error']) for a in assets if a['status']!='ok'])
write_csv('Video_Index.csv',['المصدر','عنوان الصفحة','رابط الصفحة','رابط الفيديو','حالة المعالجة'],[(r['id'],r['title'],r['url'],v,'رابط فقط دون تنزيل أو تفريغ') for r in good.values() for v in r['videos']])
coverage=[]
for product,count in summary['products'].items():
    c=Counter(r['kind'] for r in good.values() if r['product']==product)
    coverage.append((product,count,c['user-guide'],c['tutorial'],c['product-reference']))
write_csv('Coverage.csv',['المنتج','إجمالي الصفحات','دليل مستخدم','شرح تعليمي','مرجع منتج'],coverage)
readme=f'''# حزمة تحليل سبيد

تاريخ الإعداد ٢٧ أكتوبر ٢٠٢٦

ابدأ بفتح **Speed_Analysis_Guide.docx** للقراءة في وورد، أو **Speed_Analysis_Guide.html** للقراءة والبحث في المتصفح.

افتح **library/index.html** للبحث في جميع الصفحات المحفوظة بالإنجليزية والتصفية بحسب المنتج ونوع المادة. روابط المصادر في نسخة الدليل على المتصفح تفتح النسخ المحلية، وفي نسخة وورد تفتح المصادر الرسمية.

{stats}

محتويات التحليل:

- دليل عربي في ٢٢ فصلًا يشرح الدورات والبيانات والعلاقات والمالية والحالات والتقارير والتكاملات.
- سجل أولي يضم {len(REQUIREMENTS)} موضوع متطلب مع مصدره ونوع دليله والقرارات المطلوبة.
- سجل يضم {len(QUESTIONS)} سؤال قرار مع المالك المقترح وخانة للإجابة المعتمدة.
- فهرس المصادر وفهرس الفيديوهات وسجل التغطية وسجل أخطاء الجمع.
- مجلد صور وملفات مساعدة وصفحات محلية ونسخ مصدرية خام وبيانات توثيق الجمع.

المكتبة مرجع عام وليست توثيقًا لإصدار مثبت على نظام عميل. تتفاوت المواد بين شرح إجرائي وخاصية معلنة. المقترحات والأسئلة والسيناريوهات في الدليل أدوات تحليل تحتاج اعتمادًا. لم تُنفذ اختبارات على برنامج سبيد، ولم تُفرغ الفيديوهات، ولم تُستخرج وثائق تتطلب تسجيل الدخول.

الحقوق الأصلية للنصوص والصور والمواد محفوظة لأصحابها. روابطها موثقة للاستخدام المرجعي والتحليل الداخلي.
'''
(ROOT/'README_AR.md').write_text(readme,encoding='utf-8')
print(json.dumps({'docx':str(ROOT/'Speed_Analysis_Guide.docx'),'chapters':section,'requirements':len(REQUIREMENTS),'questions':len(QUESTIONS),'references':len(refs),'words':len(body.split())},ensure_ascii=False))
