# Extrait les pages d'un PDF scanné en images JPG lisibles (une image par page).
# usage : python -I extract_pages.py <pdf> <dossier sortie> [premiere] [derniere] [--reverse]
#  - pages numérotées comme dans le PDF (1 = première page du fichier)
#  - si une page est découpée en bandes de même largeur, elles sont recollées verticalement ;
#    --reverse les recolle dans l'ordre inverse (à utiliser si la page lue est en désordre)
import sys, os, io
import pypdf
from PIL import Image

args = [a for a in sys.argv[1:] if not a.startswith('--')]
rev = '--reverse' in sys.argv
pdf, out = args[0], args[1]
r = pypdf.PdfReader(pdf)
first = int(args[2]) if len(args) > 2 else 1
last = int(args[3]) if len(args) > 3 else len(r.pages)
os.makedirs(out, exist_ok=True)
for i in range(first - 1, min(last, len(r.pages))):
    dest = os.path.join(out, f'p{i + 1:03d}.jpg')
    if os.path.exists(dest):
        continue
    ims = []
    for im in r.pages[i].images:
        try:
            ims.append(Image.open(io.BytesIO(im.data)).convert('RGB'))
        except Exception:
            pass
    if not ims:
        print('page', i + 1, ': aucune image'); continue
    big = max(ims, key=lambda x: x.size[0] * x.size[1])
    strips = [x for x in ims if x.size[0] == big.size[0]]
    if len(strips) > 1 and big.size[1] < big.size[0]:  # bandes horizontales
        if rev: strips = strips[::-1]
        H = sum(x.size[1] for x in strips)
        page = Image.new('RGB', (big.size[0], H), 'white'); y = 0
        for x in strips: page.paste(x, (0, y)); y += x.size[1]
    else:
        page = big
    w, h = page.size
    if w > 1400:
        page = page.resize((1400, int(h * 1400 / w)))
    page.save(dest, quality=85)
print('OK', out, first, '-', last)
