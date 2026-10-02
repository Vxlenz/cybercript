# Interfaz adaptable de CyberCript

La mejora aplica las recomendaciones de legibilidad, jerarquía, navegación, separación de controles y diseño adaptable de [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill). Se mantienen los colores verde oscuro y lima, la tipografía del sistema, los módulos y los flujos existentes.

## Decisiones de diseño

- Barra lateral de 15.5 rem, o 14 rem en escritorio compacto. La base flexible y los límites de ancho son iguales; el espacio del scrollbar se reserva incluso cuando un desplegable está cerrado.
- Navegación mediante diálogo a partir de 960 px. El umbral coincide en CSS y JavaScript, de modo que tablets y teléfonos usan el mismo control funcional.
- Catálogo con una columna hasta 600 px, dos en tamaños intermedios y tres en escritorio amplio. El icono queda arriba de la descripción en teléfonos.
- Texto principal móvil de 1 rem, interlineado de 1.65–1.75 y controles principales de al menos 3 rem. Las acciones consecutivas tienen un espacio de 0.75 rem.
- Iconos SVG decorativos de tamaño y trazo consistentes, sin añadir dependencias. Los controles mantienen sus nombres y estados accesibles.
- El gráfico decorativo del acceso se omite en móvil para dar prioridad al formulario. El contenido se adapta a las áreas seguras; se conserva el respeto por movimiento reducido.

## Verificación

La revisión visual usa pantallas de 320, 375, 768 y 1100 px, con copias aisladas de la interfaz sin cuentas ni escrituras de Firebase. Las vistas de prueba se mantienen en la rama de revisión y no forman parte del sitio de producción.

`validate-update.cjs` comprueba navegación, catálogo, foco, los 70 pasos de aprendizaje, progreso y flujos de cuenta con un servicio simulado. No comprueba entrega real de correo.
