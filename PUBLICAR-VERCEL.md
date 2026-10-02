# Publicar la actualización en el proyecto existente

La aplicación está preparada en `dist/`. Se conserva Firebase y el dominio `https://cybercript-brayan.vercel.app/`.

## Actualizaciones desde GitHub

Repositorio: `Vxlenz/cybercript`. En el proyecto existente `cybercript-brayan`, abre Settings → Git y conecta ese repositorio. Usa `main` como rama de producción. La raíz del proyecto debe ser la raíz del repositorio; `vercel.json` selecciona `dist` como carpeta de salida, sin instalación ni compilación. Los cambios posteriores en `main` se publican mediante la integración Git de Vercel cuando esté conectada.

No subas `.env*`, `.vercel/`, tokens ni credenciales al repositorio. La configuración en `firebase-config.js` corresponde a la aplicación web pública; las reglas de Firestore controlan el acceso a cada documento.

## Subida directa al proyecto existente

Genera el paquete con `python scripts/package-vercel.py`. Abre `https://vercel.com/xdddbrayan002-8758/cybercript-brayan` en la cuenta propietaria y arrastra `cybercript-publicacion.zip` sobre ese panel. Revisa que el destino sea `cybercript-brayan` y completa la publicación. El ZIP contiene `index.html` en la raíz y conserva la configuración pública de Firebase; excluye credenciales y archivos ocultos.

La página general `/drop` muestra un formulario para crear otro proyecto. Para conservar la dirección habitual, usa el panel del proyecto existente. Espera el estado Ready y comprueba el dominio después de publicar.

## Publicación mediante CLI

Con Node.js instalado, abre una terminal en la carpeta extraída y ejecuta:

```bash
cd dist
npx vercel@61.1.0 login
npx vercel@61.1.0 link --yes --project cybercript-brayan --scope xdddbrayan002-8758
npx vercel@61.1.0 deploy --prod --yes --scope xdddbrayan002-8758
```

Inicia sesión en la cuenta propietaria del proyecto. Comprueba que `link` indique el proyecto existente `cybercript-brayan` antes de desplegar. La carpeta de publicación no requiere compilación. `.vercelignore` excluye las credenciales y la configuración local de la CLI.

Tras publicar, comprueba en la dirección habitual el acceso, el menú móvil, la ventana de módulos y la continuación por etapa. La entrega de correos y la recuperación desde otro navegador requieren la prueba real indicada al final de `README.md`.
