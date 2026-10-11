---
name: CyberCript
description: Laboratorio educativo de ciberseguridad y criptografía.
colors:
  ink: "#10243b"
  primary: "#1269a8"
  primary-hover: "#0b4e82"
  circuit: "#70e0dc"
  circuit-dark: "#081828"
  paper: "#f1f6fa"
  white: "#ffffff"
  muted: "#506578"
  line: "#ccdde6"
  blue: "#e2eff5"
  field-border: "#7e93a3"
  sidebar-muted: "#bad3e1"
typography:
  display: "Sora 600; clamp(2.4rem,3.4vw,3.3rem); line-height 1.12"
  body: "Source Sans 3 400; 17px; line-height 1.6"
rounded:
  button: ".5rem"
  field: ".625rem"
  module: ".875rem"
  panel: "1rem"
  hero: "1.25rem"
spacing:
  page: "clamp(1rem,3.2vw,3rem)"
  panel: "1.5rem"
  section: "2rem"
---

# Design System: CyberCript

## Overview

Dirección: un laboratorio de conexiones protegidas. La portada muestra el monograma CC como procesador, enlazado mediante pistas de circuito a mensajes, documentos y dispositivos. Navegación, acceso y portada comparten el mismo azul profundo y cian; las prácticas son un espacio claro de lectura y experimentación.

Fuente de verdad: `dist/design.css`, cargada después de `dist/style.css`. El usuario delegó las decisiones y autorizó cambios drásticos. No se ejecutó un motor de diseño externo.

## Colors

Azul profundo para identidad y texto; azul activo para acciones sobre fondos claros; cian para circuitos, navegación seleccionada y CTA sobre tinta. Fondo frío y gris azul para contenido. Conservar colores semánticos de éxito, advertencia y error con explicación textual. Foco azul sobre claro y cian sobre oscuro. Nunca utilizar cian como texto pequeño sobre blanco.

## Typography

Sora 600/700 en títulos, Source Sans 3 400/600/700 en lectura, alojadas localmente con SIL OFL. Títulos equilibrados con `text-wrap:balance`; párrafos `pretty` y máximo general 65ch. Cuerpo de 17px. Números de resultados y progreso con cifras tabulares. Sin etiquetas decorativas en mayúsculas. Se conservan las tres numeraciones porque explican un proceso ordenado.

## Layout

Sidebar siempre 16rem/256px cuando está visible; width, min-width, max-width y flex-basis coinciden. Altura 100dvh. Hasta 960px se usa menú móvil. Portada con dos columnas hasta 600px y una en teléfono. Catálogo de 3/2/1 columnas según espacio. Márgenes de 1.25rem en móvil y 1rem hasta 360px. Campos y títulos deben envolver sin cortar ni ensanchar el documento. La ilustración de acceso se oculta hasta 960px para acercar el formulario.

## Elevation & Depth

Circuitos SVG ligeros con baja opacidad, conexiones ortogonales y nodos; sin telemetría inventada. Ilustración principal vectorial sin imagen de fondo fotográfica. Superficies de lectura blancas, bordes fríos y sombra leve solo en hover del catálogo. Diálogos con backdrop de tinta y desenfoque de 4px.

## Shapes

Controles de radio .5rem, campos .625rem, tarjetas .875rem y portada 1.25rem. El catálogo puede heredar 15px por especificidad de su contenedor. Iconos SVG de trazo uniforme; se conserva la geometría del logo CC. Circuitos y módulos comparten colores, pero cada ilustración de módulo explica un concepto distinto.

## Components

Botones principales azules con texto blanco; portada y reanudación cian con texto tinta. Pulsación scale(.98), sin movimiento con reduced motion. Catálogo conserva modal con cierre, Escape y retorno de foco. Navegación con disclosure reversible de 240ms; teclado expande instantáneamente. Se conserva animación de altura limitada al cuerpo de la navegación para que el contenido de los grupos se recoloque sin saltos; no se anima el ancho. Modal entra 240ms, sale 160ms con ease-out, Escape cierra instantáneamente. No hay animación repetida de cada sección ni ripple decorativo. Acceso tiene tarjeta de formulario propia, etiquetas visibles, autocompletado y controles de 44px o mayores.

## Do's and Don'ts

- Mantener la lectura de prácticas clara y la navegación de ancho estable.
- Reservar circuitos para identidad y áreas visuales; evitar líneas detrás del texto de lectura.
- Conservar contraste, teclado, reduced motion, aislamiento de invitado y sincronización de cuenta.
- No introducir métricas ficticias, glitches, parallax o animación continua.
- No publicar fixtures, mocks, archivos de entorno ni metadata de Vercel.
- No sustituir la función de botones por decoración.

## Skills y aplicación

Fuentes consultadas desde los dos catálogos facilitados por el usuario:

- Frontend Design: https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
- UI UX Pro Max: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- Redesign Existing Projects: https://github.com/Leonxlnx/taste-skill/blob/main/skills/redesign-skill/SKILL.md
- Emil Design Engineering: https://github.com/emilkowalski/skills/blob/main/skills/emil-design-eng/SKILL.md
- Web Design Guidelines: https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md
- Reglas actuales de revisión: https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md

UI UX Pro Max: las dos consultas de sistema global resultaron en estilos cyberpunk/AI que no encajaban con aprendizaje accesible. No se persistieron. Se aplicaron sus prioridades generales de accesibilidad y el resultado verificado de UX sobre movimiento reducido y sensibilidad al movimiento. Huashu Design se leyó para determinar alcance: excluye aplicaciones web de producción con backend. Impeccable fue utilizado en la revisión anterior; no se afirma ejecución de su launcher o detector.
