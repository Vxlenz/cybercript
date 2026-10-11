# Revisión del diseño de circuitos · 11/10/2026

Estado: implementación y pruebas locales completas; revisión visual de esta versión en navegador pendiente por rechazo de permiso. No se afirma certificación de un motor externo ni nueva revisión independiente.

## Cambios y evidencia

La versión conserva siete módulos, catálogo modal, navegación plegable, autenticación, sincronización y autoría. Incluye paleta azul/cian, circuitos SVG originales, nuevos estados de botón, tarjeta de acceso y tipografía local.

scripts/validate-update.cjs: PASS para aislamiento de invitado, reanudación y progreso, migración, foco móvil/modal, contraseña y errores. PASS para registro/verificación/reset/refresh simulados, reanudación en dos dispositivos, escrituras serializadas, conflictos y aislamiento por dueño. No se probó envío real de correo.

SVG: XML válido. ZIP: contiene CSS y nuevos gráficos. JavaScript: node --check sin errores.

## Contraste por cálculo

| Combinación | Ratio |
| --- | --- |
| Blanco sobre botón azul #1269a8 | 5.81:1 |
| Secundario #506578 sobre papel #f1f6fa | 5.56:1 |
| Cian #70e0dc sobre tinta #10243b | 10.01:1 |
| Texto #bad3e1 sobre tinta #10243b | 10.09:1 |
| Borde #7e93a3 sobre blanco | 3.19:1 |

Los dos hallazgos de contraste de la revisión anterior tienen reglas explícitas actuales: subtítulo de lección con var(--muted), foco del hero cian sobre tinta. No se afirma comprobación visual de estos selectores en esta versión.

## Revisión de movimiento con Emil Design Engineering

| Before | After | Why |
| --- | --- | --- |
| Disclosure 320ms | 240ms reversible | Respuesta más breve conservando la continuidad |
| Cierre modal ease-in | Ease-out 160ms | Respuesta inmediata |
| Entradas de todas las secciones | Contenido visible sin entradas repetidas | Navegación frecuente sin espera |
| Sin respuesta de pulsación propia | Scale(.98), desactivado con reduced motion | Confirmación breve de interacción |
| Teclado con animación de disclosure/modal | Teclado y Escape inmediatos | No retrasar navegación por teclado |

La altura animada del cuerpo de la navegación es una excepción consciente para recolocar los grupos sin saltos. El ancho de sidebar nunca se anima y conserva 16rem.

## Auditoría Web Design Guidelines

dist/app.js:24 - duración de disclosure corregida a 240ms.
dist/app.js:127 - ease-in de cierre sustituido por ease-out.
dist/entry.js:8 - dimensiones del logo, name y spellcheck de correo añadidos.
dist/interface.js:82 - campos de contraseña reciben name.
dist/index.html:2 - theme-color alineado a #10243b.
dist/design.css - foco, reduced motion, overscroll de modal, cifras tabulares, pulsación y wrapping añadidos.

Se conservaron etiquetas, autocomplete, skip link, botones semánticos, aislamiento de datos y navegación por hash. Se revisó CSS para los breakpoints existentes; las medidas reales y la captura de la nueva interfaz no pudieron verificarse por el bloqueo de permiso del navegador.
