# Validación · 2 de octubre de 2026

## Foto de la conversación original

Probada la imagen original recuperada de «Saludo inicial» (399 × 501 px) con Microsoft Edge/Chromium, MediaPipe CPU y la aplicación servida por HTTP local.

La detección facial funcionó y localizó tres zonas: frente y ambas mejillas. Resultado automático:

| Orden | Tono | ΔE2000 |
|---|---|---|
| 1 | Skin Tone 12 · #c39071 | 4,04 |
| 2 | Skin Tone 10 · #c59c80 | 5,74 |
| 3 | Skin Tone 11 · #c49069 | 6,58 |

Confianza heurística: **35/100, baja**. LAB combinado: 63,6 / 16,1 / 18,0. Píxeles retenidos por zona: 20, 20 y 21. Las zonas individualmente produjeron tonos 12, 15 y 6, por lo que se mostró el aviso de discrepancia/iluminación desigual y de escaso detalle.

Este caso verifica la ejecución y sus avisos; no demuestra exactitud del tono real del futbolista. No hay referencia colorimétrica calibrada. El modo manual sobre otra zona de la misma foto produjo un resultado distinto, consistente con la sensibilidad al lugar muestreado.

La imagen no está incluida en la distribución para evitar publicarla accidentalmente en GitHub. Para repetir la prueba, carga el archivo original desde tu equipo.

## Pruebas realizadas

- Cinco pares de referencia CIEDE2000, incluyendo colores neutros y transición de ángulo, con tolerancia 0,0001; simetría e identidad.
- Conversión de blanco y negro sRGB a LAB D65.
- Los 20 colores de paleta se reconocen a sí mismos.
- Los 20 colores se mantienen al añadir extremos blancos y negros y aplicar el filtro robusto.
- Muestras totalmente blancas o transparentes se rechazan.
- Carga de la foto, detección real, Top 3, muestreo manual, limpiar y deshacer.
- Bloqueo simulado de recursos externos: aparece el aviso y se activa el modo manual.
- Capturas de escritorio (1360 px) y móvil (390 px) revisadas; sin desbordamiento horizontal en móvil.
- Sin excepciones JavaScript de la página durante el recorrido validado.

Las pruebas matemáticas pueden repetirse con `node tests.mjs`. No se ha validado exhaustivamente Safari, Firefox, todas las poses faciales ni una colección amplia de tonos y condiciones de iluminación. El despliegue real en una cuenta de GitHub no forma parte de esta entrega: el ZIP contiene el proyecto preparado para ello.
