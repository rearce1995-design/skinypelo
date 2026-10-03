# Validación · 2 de octubre de 2026

## Ampliación de pelo

Probada con la misma foto original. Se inspeccionaron visualmente las tres propuestas violetas antes de confirmarlas. Resultado:

| Orden | Hair Color | ΔE2000 |
|---|---|---|
| 1 | Black Hair 2 · #1f1b17 | 3,38 |
| 2 | Black Hair 3 · #020306 | 4,08 |
| 3 | Black Hair 1 · #2c2d2f | 8,25 |

Confianza heurística **52/100 (media)**, con avisos de escaso detalle y proximidad entre los dos primeros candidatos. LAB 6,3 / 0,0 / 1,3; 55 píxeles retenidos entre las tres zonas. El resultado de piel se mantuvo en Skin Tone 12, con 35/100.

Comprobado en navegador: propuestas pendientes no generan resultado hasta confirmarlas; análisis de piel conservado al confirmar pelo, añadir pelo manualmente, limpiar pelo y deshacer; muestreo de pelo con teclado cuando el detector está bloqueado; vista móvil de 390 px sin desbordamiento horizontal; sin excepciones JavaScript. Capturas de escritorio y móvil revisadas.

Pruebas matemáticas adicionales: los 18 Hair Colors se reconocen a sí mismos después de filtrar; `#020306` se conserva en pelo y continúa excluyéndose del filtro de piel; Grey Hair 3 usa RGB 96/95/95 según el hexadecimal solicitado. Las pruebas previas de piel y CIEDE2000 siguen pasando.

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
