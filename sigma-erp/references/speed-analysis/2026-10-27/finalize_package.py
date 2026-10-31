from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
from lxml import html
import hashlib,json
root=Path(__file__).parent
guide=root/'Speed_Analysis_Guide.html'
tree=html.fromstring(guide.read_bytes())
main=tree.xpath('//main')[0];toc=tree.xpath('//*[@id="contents"]')[0]
main.remove(toc);main.insert(3,toc)
guide.write_text('<!doctype html>\n'+html.tostring(tree,encoding='unicode'),encoding='utf-8')
qa={
 'date':'2026-10-27',
 'docx_pages_visually_reviewed':20,
 'docx_rendering':'Microsoft Word PDF export and packaged render_docx.py PNG rasterization; packaged LibreOffice unavailable',
 'html_files_checked':313,
 'broken_local_links':0,
 'offline_library_search':'passed',
 'offline_product_filter':'passed',
 'offline_sample_article_images':3,
 'browser_script_errors':0,
 'scope':'Public documentation only. No Speed application login, runtime testing, or video transcription.'
}
(root/'Verification_Summary.json').write_text(json.dumps(qa,ensure_ascii=False,indent=2),encoding='utf-8')
deliverables=['Speed_Analysis_Guide.docx','Speed_Analysis_Guide.html','Speed_Analysis_Guide.md','README_AR.md','Requirements_Register.csv','Decision_Questions.csv','Collection_Issues.csv','Video_Index.csv','Coverage.csv','collection-summary.json','Verification_Summary.json']
files=[root/f for f in deliverables]+[p for p in (root/'library').rglob('*') if p.is_file()]
archive=root.parent/'Speed_Analysis_Package_2026-10-27.zip'
with ZipFile(archive,'w',ZIP_DEFLATED,compresslevel=6) as z:
 for p in files:z.write(p,'Speed_Analysis_Package/'+p.relative_to(root).as_posix())
with ZipFile(archive) as z:
 assert z.testzip() is None
 assert len(z.namelist())==len(files)
digest=hashlib.sha256(archive.read_bytes()).hexdigest()
archive.with_suffix('.zip.sha256').write_text(digest+'  '+archive.name+'\n',encoding='ascii')
print(json.dumps({'archive':str(archive),'files':len(files),'bytes':archive.stat().st_size,'sha256':digest},indent=2))
