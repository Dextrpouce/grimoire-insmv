# Rend des pages d'un PDF (texte vectoriel) en images JPG avec pypdfium2.
# usage : python -I render_pages.py <pdf> <dossier sortie> <première> <dernière>
import sys, os
import pypdfium2 as pdfium
pdf, out, a, b = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
os.makedirs(out, exist_ok=True)
doc = pdfium.PdfDocument(pdf)
for i in range(a - 1, min(b, len(doc))):
    dest = os.path.join(out, f'r{i + 1:03d}.jpg')
    if os.path.exists(dest): continue
    img = doc[i].render(scale=2).to_pil()
    w, h = img.size
    if w > 1400: img = img.resize((1400, int(h * 1400 / w)))
    img.convert('RGB').save(dest, quality=85)
print('OK', out, a, '-', b)
