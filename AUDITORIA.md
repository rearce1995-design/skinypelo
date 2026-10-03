# Auditoría general · 2 de octubre de 2026

Se probaron cálculos, entradas inválidas, estado de interfaz, concurrencia, separación de piel/pelo, recuperación de red, teclado, tamaños de pantalla y despliegue bajo un subdirectorio. Se corrigieron siete bugs reproducidos con pruebas que fallaban antes del cambio.

## Errores encontrados y corregidos

| Prioridad | Error reproducido | Corrección y regresión |
|---|---|---|
| Alta | Tres clics sobre el mismo punto elevaban la confianza de 72 a 90 sin aportar información nueva. | Se rechazan muestras manuales del mismo tipo que se solapen. El resultado no cambia al repetir el clic. |
| Alta | Cambiar Piel/Pelo durante la decodificación podía cancelar silenciosamente la carga y dejar «Abriendo fotografía…». | La carga tiene su propia revisión independiente de la detección; los controles de análisis se bloquean mientras se decodifica. Se prueba también que la última foto gana si dos cargas se superponen. |
| Media | Una imagen de 1 × 5000 se reducía a un lienzo de ancho cero. | Cada dimensión resultante tiene un mínimo de 1 px. La foto se puede mostrar; sigue siendo demasiado estrecha para un muestreo útil. |
| Media | El radio mínimo de 2 px nunca alcanzaba los 16 píxeles válidos requeridos en una muestra circular interior. | Radio mínimo de 3 px; la prueba verifica el mínimo real del control. Las muestras recortadas en bordes todavía pueden ser insuficientes y muestran un aviso. |
| Media | Tras una descarga fallida, reintentar reutilizaba el error almacenado de la importación del detector. | Los reintentos usan una URL nueva del mismo módulo y versión fijada, evitando reutilizar ese error. Probado con una descarga bloqueada seguida de una respuesta disponible. |
| Media | Cuando un nuevo intento devolvía cero rostros, permanecían resultados y propuestas automáticas anteriores. | Se retiran las zonas automáticas y su aviso de múltiples caras; las muestras manuales se conservan. |
| Baja | Tras hacer clic, las flechas y Enter continuaban desde el centro de la imagen, no desde el punto elegido. | El cursor de teclado se actualiza al último clic. Se comprueba la continuidad combinando ratón y teclado. |

También se liberan los temporizadores al terminar una detección y se anuncian los cambios de resultado de piel mediante una región accesible, al igual que los de pelo.

## Verificaciones matemáticas

- Los **34 pares de referencia publicados** por Sharma, Wu y Dalal pasan con tolerancia de 0,0001 en ΔE2000. Fuente: https://hajim.rochester.edu/ece/sites/gsharma/ciede2000/dataNprograms/ciede2000testdata.txt
- **10.000 pares de colores pseudoaleatorios** verifican finitud, no negatividad, simetría e identidad. Son pruebas de propiedades, no 10.000 valores de referencia independientes.
- Los **38 colores** se reconocen a sí mismos, también con ruido pequeño y píxeles descartables añadidos.
- Probados blanco/negro D65, transparencia, muestras vacías y umbral de 15/16 píxeles.
- `Black Hair 3 #020306` se conserva en pelo y se excluye correctamente del filtro específico de piel.
- `Grey Hair 3` conserva el hexadecimal solicitado `#605f5f` (96/95/95).

## Pruebas de navegador

**Resultado final: 27/27 escenarios aprobados en Microsoft Edge y 27/27 en Google Chrome (54 ejecuciones de escenario).**

Los resultados por escenario están en `qa/browser-results-msedge.json` y `qa/browser-results-chrome.json`. Se probaron los 38 colores a través del lienzo y de la interfaz, además de los cálculos aislados.

Cobertura: estado inicial; muestreo de ambos tipos; independencia de resultados; limpiar/deshacer; límites de 12 zonas por tipo; exclusión de pelo pendiente de confirmar; radio mínimo; duplicados; archivos corruptos, formatos inválidos y más de 25 MB; PNG/JPEG/WebP; arrastrar y soltar; cargar el mismo archivo de nuevo; blanco/transparencia/pelo casi negro; imágenes estrechas, anchas y altas; cargas simultáneas; cancelación de resultados tardíos; cero/uno/varios rostros; fallo de descarga y recuperación; timeout; teclado y límites del lienzo; ausencia de desbordamiento horizontal en 320/390/768/1280 px; ampliación de fuente raíz y zoom de página; nombre largo de pelo; ausencia de solicitudes que envíen bytes de fotografía.

Los escenarios automatizados de detección usan un **doble de prueba de MediaPipe**, interceptado únicamente por Playwright. Permite provocar fallos y carreras de forma repetible; no valida la precisión del modelo. La prueba de privacidad comprueba el tráfico del recorrido cubierto, no constituye una auditoría formal de los proveedores externos.

## Prueba con MediaPipe real

Se repitió en Edge la carga del detector real y la foto original de 399 × 501 px. No se distribuye la imagen privada dentro del ZIP.

| Análisis | Resultado | Alternativas | Confianza heurística |
|---|---|---|---|
| Piel | Skin Tone 12 · ΔE 4,04 | 10 / 11 | 35/100 |
| Pelo, tras revisar y confirmar sus zonas | Black Hair 2 · ΔE 3,38 | Black Hair 3 / Black Hair 1 | 52/100 |

También pasaron el muestreo manual de pelo, la conservación del resultado de piel al limpiar/deshacer pelo, la vista móvil y el respaldo de teclado con el detector bloqueado. No hubo excepciones JavaScript en los recorridos comprobados.

## Límites del resultado

- Chrome y Edge comparten motor Chromium. No se probaron Safari, Firefox ni dispositivos móviles físicos; las vistas móviles se emularon en escritorio.
- No se midió exactitud contra tonos reales calibrados ni contra un conjunto representativo de fotos. La confianza sigue siendo heurística.
- El pelo se propone geométricamente y requiere revisión humana. No hay segmentación semántica de cabello.
- Una foto con iluminación sesgada, filtros, maquillaje, tintes, reflejos o poca resolución puede dar un color distinto del observado bajo luz neutra.
- La carga de fotos de muchísimos megapíxeles aún depende de la memoria disponible al decodificar. El límite de 25 MB de archivo no equivale a un límite de memoria descomprimida.
- Se verificó el comportamiento servido bajo `/project/`; no se publicó en una cuenta real de GitHub durante esta auditoría.

Las pruebas aprobadas no garantizan ausencia absoluta de bugs. No quedaron fallos pendientes entre los escenarios ejecutados; los límites anteriores siguen vigentes.
