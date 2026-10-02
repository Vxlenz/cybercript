# CyberCript
Laboratorio virtual de prevención de riesgos digitales creado por Brayan Fernando Arango Córdoba (2026).

## Contenido
- Diagnóstico inicial y evaluación final: seis preguntas comparables, con explicación posterior.
- Seis escenarios de phishing ficticios y sin enlaces activos.
- Evaluador didáctico de contraseñas de ejemplo: longitud y detección básica de patrones. No consulta filtraciones ni garantiza fortaleza criptográfica.
- Visualizador de cifrado César y práctica real AES-256-GCM mediante Web Crypto. Claves e IV aleatorios, claves no exportables y solo en memoria.
- Resultados por competencia, comparación en puntos porcentuales y descarga CSV.
- Cuatro módulos de ampliación (privacidad, malware, redes y copias de seguridad), organizados por etapas: tres ideas presentadas de una en una, reto 1, reto 2, reto 3 y resumen. Sus primeras respuestas se conservan y se exportan; revisar los tres retos completa un módulo aunque haya errores.
- Historia digital: 18 hitos desde los primeros usos conocidos de escritura reservada hasta la criptografía poscuántica, con filtros, ilustraciones diferentes, contexto y fuentes originales. Incluye una explicación visual de las lámparas de lava y la entropía de Cloudflare, más cuatro casos documentados de grandes filtraciones (PlayStation Network, Yahoo, Equifax y MOVEit), cada uno con una ilustración propia y una lección. Disponible sin conexión excepto las lecturas externas.
- Cuenta opcional por correo: registro, verificación, inicio de sesión, recuperación de contraseña, nombre visible y cambio de contraseña. El progreso se sincroniza por cuenta cuando el servicio de Firebase está configurado; el uso sin conexión conserva una copia local.
- Bienvenida animada a pantalla completa, acceso con aceptación expresa de términos y modo invitado sin almacenamiento persistente.
- Invitado: estado solo en memoria; se pierde al recargar, salir o cerrar. No se leen ni escriben los registros anónimos de versiones anteriores.
- Navegación lateral con apertura y cierre animados, control de teclado y respeto por la preferencia de movimiento reducido.
- Inicio con una introducción a CyberCript, guía breve y acceso al catálogo. Ventana con los siete módulos, estados de progreso y navegación directa, disponible desde el inicio y el menú lateral; admite Escape, cierre exterior y retorno del foco.
- Módulos con una tarjeta por pantalla: concepto, decisión y explicación separados; barra de porcentaje y navegación anterior/siguiente.

## Activar cuentas y base de datos
El proyecto `cybercript-7e884` ya está creado en el plan Spark gratuito. Email/Password está habilitado, Firestore `(default)` está creada en `nam5`, las reglas privadas de este repositorio están publicadas y `cybercript-brayan.netlify.app` y `cybercript-brayan.vercel.app` figuran como dominios autorizados. La configuración pública está incorporada en `dist/firebase-config.js`. Analytics y Gemini no se activaron. La versión conectada está publicada en `https://cybercript-brayan.vercel.app/`.

Para configurar otro proyecto o revisar la conexión:

1. Crear o elegir un proyecto Firebase, habilitar **Authentication → Email/Password** y crear la primera base **Cloud Firestore** en modo de producción. No activar Analytics para esta función.
2. Copiar las reglas de [firestore.rules](firestore.rules) al editor de reglas de Firestore y publicarlas **antes** de habilitar cuentas en la página. Solo el dueño de cada documento verificado puede leerlo o modificarlo.
3. Tomar de la configuración pública de la aplicación web `apiKey` y `projectId`, y colocarlos en `dist/firebase-config.js`. Estos dos valores son públicos: jamás poner una cuenta de servicio, una clave privada ni un token en archivos publicados.
4. Volver a publicar la carpeta `dist/` en el proyecto de alojamiento existente. Probar con dos cuentas de correo de prueba: una debe poder leer su avance y no el de la otra. Confirmar que funciona el correo de verificación y el restablecimiento de contraseña antes de invitar a otras personas.

Con los campos vacíos, «Mi cuenta» muestra que la activación está pendiente y deshabilita los formularios. Las prácticas siguen disponibles. Firebase Authentication envía las contraseñas al proveedor de identidad por HTTPS; CyberCript no las almacena. Los tokens de sesión se guardan solo en `sessionStorage` y se eliminan al cerrar sesión o la pestaña. El progreso se guarda en `progress/{uid}` de Firestore y en una copia de este navegador separada por cuenta. Tras un periodo sin internet, si hay cambios en otro equipo, se pide elegir qué copia conservar. El modo invitado no utiliza localStorage ni sessionStorage para guardar respuestas. La selección de modo y la aceptación de términos permanecen en memoria. Las versiones antiguas de progreso anónimo no se importan automáticamente ni se borran.

El paquete local trae `firebase-config.js` sin configuración para evitar que una copia compartida del ZIP conecte a la base de datos. Si se abre sin internet, se puede practicar como invitado. Al recargar o cerrar se pierde el progreso temporal.

## Abrir sin conexión
Descarga `cybercript-local.zip` desde la Guía del laboratorio y extrae su contenido. El ZIP contiene `index.html`, `app.js`, `learning.js`, `history.js`, `account.js`, `entry.js`, `stages.js`, `interface.js`, `firebase-config.js`, `style.css`, `favicon.svg` y esta guía. Abre `index.html` en un navegador actualizado. No hay dependencias externas para las actividades.

Para una disponibilidad consistente de Web Crypto, utiliza HTTPS o localhost. En algunos navegadores `file://` permite Web Crypto, en otros no. El sitio informa de la limitación y conserva el módulo César.

## Servir en el equipo o en la red local
Requisito: Python 3 instalado en el computador que servirá los archivos.

Desde la carpeta descomprimida:

    python -m http.server 8080 --bind 0.0.0.0

En el servidor, abre http://localhost:8080. En los otros equipos de la misma red abre http://DIRECCION-IP-DEL-SERVIDOR:8080. El responsable de sistemas debe permitir el puerto solo en la red privada. Detén el servidor con Ctrl+C.

AES requiere HTTPS en los clientes de red local. HTTP con una dirección IP de LAN no es un contexto seguro. Configurar un certificado confiable y HTTPS corresponde al responsable técnico. Los demás módulos funcionan con HTTP en la LAN. No expongas el servidor educativo directamente a internet.

## Aplicación en clase
1. El docente revisa y valida las preguntas propuestas antes de usarlas en una investigación.
2. Iniciar una nueva sesión por estudiante en cada navegador. Se pueden asignar códigos anónimos fuera del sitio.
3. Realizar el diagnóstico antes de las prácticas.
4. Completar los tres módulos fundamentales: responder seis escenarios, crear una frase de ejemplo aceptada y cifrar/descifrar un mensaje.
5. Realizar la evaluación final sobre esos tres fundamentos; los nuevos módulos tienen resultados separados.
6. Descargar el CSV y renombrarlo con el código anónimo en el registro del docente.
7. Reiniciar la sesión antes de entregar el equipo a otro estudiante.

Sin una cuenta activada, los resultados no se sincronizan. El docente puede reunir los CSV descargados voluntariamente para comparar el aprendizaje. Borrar datos del navegador elimina el progreso local, pero el de una cuenta verificada puede recuperarse desde la nube.

## Privacidad
Las contraseñas **de ejemplo** y los mensajes de las prácticas se procesan en memoria y no se guardan ni se envían. Las contraseñas de **inicio de sesión** se envían por HTTPS solo a Firebase Authentication cuando la cuenta está configurada; no se guardan en el navegador. El progreso de cada cuenta puede sincronizarse con Firestore. El sitio no usa analítica. Los enlaces de consulta externos son opcionales.

## Código
Los archivos de `dist/` se sirven directamente. No requiere instalación ni compilación. Mantener `app.js`, `account.js`, `entry.js`, `stages.js`, `interface.js`, `firebase-config.js`, `learning.js`, `history.js`, `style.css`, `favicon.svg` e `index.html` en la misma carpeta.

## Alcance académico
La herramienta materializa los módulos e instrumentos propuestos en el documento. No sustituye la instalación física, la revisión pedagógica de instrumentos, la autorización institucional ni la evaluación de campo.

## Autoría
© 2026 Brayan Fernando Arango Córdoba. Todos los derechos reservados.

Los registros anteriores se conservan: se incorpora el campo `lessons` sin cambiar el cuestionario inicial ni su puntuación. El progreso total ahora abarca siete módulos.

## Validación de la actualización del 29/09/2026
Se probaron con DOM simulado los 70 pasos de los siete módulos, la aceptación requerida, el aislamiento entre acceso con cuenta e invitado, la ausencia de escrituras de progreso en modo invitado, el reinicio tras restaurar la página, la alternativa de movimiento reducido y el cifrado/descifrado César y AES-GCM con Web Crypto. Se comprobó en la página pública la bienvenida, el formulario de registro, un avance del módulo de phishing y el reinicio del invitado al recargar.

## Conexión Firebase del 29/09/2026
La consola confirmó Email/Password habilitado y las reglas publicadas. En Rules Playground se verificó que una lectura sin autenticar es rechazada, que el propietario con correo verificado puede leer su documento y que ese mismo propietario no puede leer el documento de otra cuenta. Son simulaciones de reglas: el registro real, la entrega de correos y la sincronización desde la página pública todavía requieren una prueba de extremo a extremo tras el despliegue. No se crearon cuentas de usuario de prueba ni documentos de progreso.

## Mejoras del 30/09/2026
- En pantallas de hasta 760 px, el menú lateral se abre como un panel modal desde «Menú». Conserva las secciones desplegables y permite abrir el catálogo de módulos.
- «Continuar aprendiendo» recupera el último módulo y la etapa. Las cuentas guardan la posición en su copia local y, tras verificar el correo, en la nube. El invitado solo la conserva durante la sesión. Las claves y los mensajes de práctica siguen siendo temporales; al retomar un ejercicio de cifrado se vuelve al paso que permite recrearlos.
- Las siete tarjetas muestran «Sin empezar», «En curso» o «Completado», su avance y un enlace para continuar. La barra refleja las etapas visitadas y llega al 100 % al completar la actividad; la puntuación se consulta en Mis resultados.
- Los formularios de acceso, registro y cambio de contraseña permiten mostrar u ocultar cada clave. Se incorporan estados de carga, confirmación de recuperación y errores accesibles.
- Se refuerzan la legibilidad, el contraste, los objetivos táctiles y el foco de teclado. Se mantiene la opción de movimiento reducido.
- La mejora visual conserva el verde, la estructura y la identidad anteriores, con cuadrículas discretas, bordes, sombras suaves y detalles de interfaz tecnológica.

La cola de sincronización serializa los cambios rápidos para impedir que dos escrituras del mismo navegador generen un conflicto falso. Las respuestas de una sesión anterior se descartan al salir o cambiar de cuenta. Se mantienen las condiciones de versión para detectar cambios reales de otro dispositivo.

## Validación del 30/09/2026
`scripts/validate-update.cjs` prueba los 70 pasos, el aislamiento del invitado, la migración de registros anteriores, la restauración de posición, los estados del catálogo, el foco de ambos paneles, el control de contraseñas y los errores de acceso con jsdom. Para ejecutarlo, instala jsdom y usa `CYBERCRIPT_JSDOM=/ruta/al/paquete/jsdom node scripts/validate-update.cjs`.

El cliente de cuentas se prueba contra un servidor simulado: registro, verificación, restablecimiento, cambio de contraseña, renovación de tokens, lectura desde un segundo dispositivo, escrituras rápidas, conflicto entre dispositivos y aislamiento por propietario. Estas pruebas pasan, pero **no prueban el envío de correos ni sustituyen una prueba real de extremo a extremo de Firebase**. No crean usuarios ni documentos en producción.

Para terminar esa comprobación tras publicar: registrar una cuenta de prueba, confirmar el enlace recibido, avanzar un módulo, iniciar sesión con esa misma cuenta en otro navegador y comprobar «Continuar aprendiendo». Solicitar también el restablecimiento y comprobar que el enlace permite entrar con la nueva contraseña. La persona que realiza la prueba debe introducir sus credenciales y aceptar los términos.

## Publicación desde GitHub
Los cambios del 30/09/2026 están incorporados y las pruebas locales pasan. El repositorio de trabajo es `Vxlenz/cybercript`. Para publicar mediante Git, conecta ese repositorio al proyecto existente `cybercript-brayan` en Vercel y usa `main` como rama de producción. La raíz del proyecto debe ser la raíz del repositorio; `vercel.json` selecciona `dist` como carpeta de salida sin instalación ni compilación. `PUBLICAR-VERCEL.md` incluye los detalles y las alternativas de publicación.

Una actualización se considera publicada después de comprobar el estado Ready del despliegue y la versión servida en el dominio habitual. La entrega real de correos y la sincronización entre navegadores requieren la comprobación de Firebase descrita arriba; las pruebas simuladas no sustituyen esa validación.
