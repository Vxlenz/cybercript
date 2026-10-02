"""Package the editable project, excluding credentials and local tooling."""
from pathlib import Path
import zipfile

root = Path(__file__).resolve().parent.parent
target = root.parent / 'cybercript-actualizado.zip'
with zipfile.ZipFile(target, 'w', zipfile.ZIP_DEFLATED) as archive:
    for name in ['README.md', 'PUBLICAR-VERCEL.md', 'firestore.rules', '.gitignore', 'vercel.json']:
        archive.write(root / name, 'cybercript/' + name)
    for folder in ['scripts', 'dist']:
        for file in sorted((root / folder).rglob('*')):
            relative = file.relative_to(root)
            if not file.is_file() or any(part.startswith('.') for part in relative.parts):
                continue
            archive.write(file, 'cybercript/' + str(relative))
    archive.write(root / 'dist/.vercelignore', 'cybercript/dist/.vercelignore')
print(f'Paquete actualizado: {target.name}')
