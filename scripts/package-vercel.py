"""Create a root-level static upload for the existing Vercel project."""
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parent.parent
target = root.parent / 'cybercript-publicacion.zip'
with zipfile.ZipFile(target, 'w', zipfile.ZIP_DEFLATED) as archive:
    for file in sorted((root / 'dist').rglob('*')):
        relative = file.relative_to(root / 'dist')
        if not file.is_file() or any(part.startswith('.') for part in relative.parts):
            continue
        archive.write(file, str(relative))
print(f'Paquete para Vercel: {target.name}')
