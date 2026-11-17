"""Use the canonical PNG renderer with a Word-exported PDF on this Windows host.

The packaged LibreOffice executable is unavailable here. Word performs only the
DOCX-to-PDF step; render_docx.py owns page image generation and naming.
"""
import importlib.util, os
from pathlib import Path
skill=Path('C:/Users/user/.codex/plugins/cache/openai-primary-runtime/documents/26.1025.11240/skills/documents')
root=Path(__file__).parent
os.environ['PATH']=str(Path('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin'))+os.pathsep+os.environ['PATH']
spec=importlib.util.spec_from_file_location('render_docx',skill/'render_docx.py')
renderer=importlib.util.module_from_spec(spec);spec.loader.exec_module(renderer)
renderer.convert_to_pdf=lambda *args,**kwargs:(str(root/'qa/Speed_Analysis_Guide.pdf'),'PDF exported through Microsoft Word COM')
pages=renderer.rasterize(str(root/'Speed_Analysis_Guide.docx'),str(root/'qa'),125,False,False)
print('Rendered pages',len(pages))
