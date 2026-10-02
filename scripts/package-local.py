from pathlib import Path
import zipfile
root=Path(__file__).resolve().parent.parent
with zipfile.ZipFile(root/'dist/cybercript-local.zip','w',zipfile.ZIP_DEFLATED) as archive:
    for name in ['index.html','style.css','favicon.svg','learning.js','history.js','account.js','entry.js','stages.js','interface.js',*[str(p.relative_to(root/'dist')) for p in sorted((root/'dist/imagenes').glob('*.svg'))]]:
        archive.write(root/'dist'/name,name)
    archive.writestr('firebase-config.js',"window.CYBERCRIPT_FIREBASE = {apiKey:'', projectId:''};\n")
    app=(root/'dist/app.js').read_text()
    app=app.replace('<a class="btn wide" href="./cybercript-local.zip" download>Descargar para uso local ↓</a>','<div class="notice">Estás usando el paquete local. Conserva esta carpeta para volver a practicar.</div>')
    archive.writestr('app.js',app)
    archive.write(root/'README.md','LEEME.md')
    archive.write(root/'firestore.rules','firestore.rules')
print('Paquete local actualizado.')
