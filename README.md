# Skin Tone Lab

## Ajuste de muestras e iluminación — versión más reciente

- Las propuestas de pelo se colocan más arriba: a 0,32 de la altura facial por encima del landmark superior, en lugar de 0,14. **Sigue siendo una aproximación geométrica**, no segmentación de pelo. El deslizador «Altura de las muestras de pelo» permite ajustar entre 0,14 y 0,60 según el peinado y encuadre. Al moverlo, las propuestas automáticas vuelven a requerir confirmación. Se conservan los puntos manuales y se omiten propuestas fuera de imagen o solapadas con ellos.
- En modo manual, selecciona Piel o Pelo y **arrastra un círculo** para recolocarlo. No se añade una muestra duplicada. Al mover una propuesta de pelo se considera una elección manual confirmada. Puedes usar Limpiar selección y volver a marcar si necesitas cambiar el radio.
- Si las muestras de piel discrepan más de ΔE2000 6 respecto a su mediana, aparece una comparación por zona y la confianza queda limitada a 44/100 (baja). El resultado se etiqueta como coincidencia **en esta foto**. El rango mostrado corresponde a las coincidencias por zona, no a un intervalo estadístico ni al tono real calibrado.
- No se oscurece artificialmente la piel para ajustarla a una impresión visual; el cálculo continúa comparando el color medido. La piel a la sombra y la iluminada pueden coincidir con tonos distintos.

Prueba real adicional con la foto de 800 × 589 enviada por el usuario: antes el pelo salía Dark Brown Hair 2 porque las propuestas caían en la línea del cabello y contenían piel; ahora las tres coinciden con **Black Hair 3**, ΔE combinado 1,26, confianza 66/100. Las zonas de piel dan **14 / 14 / 16**: la mediana sigue en Tone 14, ΔE 2,74, pero la confianza baja de 63 a 44 y se muestra claramente la discrepancia. Esto no determina el tono intrínseco de la persona.

Regresión: **30/30 escenarios en Chrome y 30/30 en Edge**, incluidas recolocación, cambio de altura e iluminación desigual; las pruebas matemáticas siguen pasando. La foto original anterior conserva Black Hair 2 como primera coincidencia, ahora con confianza 44/100 tras la nueva posición. Las fotos no se incluyen en el ZIP.

## Versión revisada tras pruebas intensivas

Consulta `AUDITORIA.md` para los errores encontrados, sus correcciones y el alcance de las pruebas. Los puntos manuales del mismo tipo no pueden solaparse: evita contar repetidamente los mismos píxeles y aumentar artificialmente la confianza. El radio mínimo es ahora 3 px. La navegación de teclado continúa desde el último clic.

La carga de archivos y la detección se cancelan de forma independiente. Una imagen nueva sustituye a una carga anterior pendiente; cambiar el selector no pierde la foto durante la carga. Se conservan dimensiones mínimas de 1 px al reducir imágenes muy estrechas. Los controles de análisis quedan desactivados durante la decodificación.

Si un reintento no encuentra caras, se eliminan las zonas automáticas anteriores y se conservan las manuales. El detector puede reintentar una descarga fallida sin recargar toda la página. Los temporizadores de detección se liberan al finalizar.

## Actualización: Hair Color

La web incluye los 20 Skin Tones y los 18 Hair Colors proporcionados, con resultados independientes, Top 3, ΔE2000 y confianza heurística para cada uno.

Al detectar el rostro se proponen tres óvalos violetas por encima de la frente. **No es segmentación automática de cabello**: revisa los óvalos y pulsa **Confirmar zonas de pelo** solamente si todos están sobre pelo visible. Hasta confirmarlos no intervienen en el resultado. Si contienen fondo, un gorro o cuero cabelludo, elige **Pelo** en el selector, pulsa **Limpiar selección** y marca zonas manualmente. En personas sin pelo visible no debes confirmar las propuestas; deja el resultado sin muestras.

El selector **Muestrear → Piel / Pelo** determina dónde se añaden puntos y qué grupo se limpia o deshace. Se admiten hasta 12 zonas por tipo. Cambiar de grupo conserva el otro resultado. Volver a detectar el rostro sustituye las zonas de ambos grupos; subir otra fotografía reinicia ambos análisis. Piel usa turquesa y pelo violeta, además de números en la imagen.

El pelo usa la misma conversión LAB, recorte de luminancia y comparación CIEDE2000, pero conserva los píxeles oscuros: el filtro de piel excluiría erróneamente `Black Hair 3 #020306`. Se penalizan las muestras casi negras por falta de información de exposición. Reflejos, mechas, canas y tintes pueden hacer que un único color sea poco representativo. La confianza no verifica que la muestra sea cabello; debes comprobarlo visualmente.

Se ha priorizado el hexadecimal de **Grey Hair 3 #605f5f**, equivalente a **R:96 G:95 B:95**, ante la discrepancia con el RGB 95/95/95 de la lista. Los demás colores coinciden con sus valores RGB. La paleta de pelo está en `hairPalette` dentro de `color.js`.

Web estática en español para comparar el color de piel observado en una fotografía con los 20 Skin Tones proporcionados. HTML/CSS/JavaScript, sin backend, claves API ni compilación.

## Publicar en GitHub Pages

1. Descomprime el ZIP en tu equipo.
2. Crea un repositorio en GitHub (público si tu plan requiere repositorios públicos para Pages).
3. En **Add file → Upload files**, sube el contenido de `skin-tone-lab`: `index.html` debe quedar en la raíz del repositorio, junto con `styles.css`, `app.js`, `color.js` y `favicon.svg`. Incluye `.nojekyll` si tu herramienta muestra archivos ocultos; la web también funciona sin él.
4. Guarda los archivos en la rama `main`.
5. Ve a **Settings → Pages → Build and deployment**. Selecciona **Deploy from a branch**, rama **main**, carpeta **/(root)** y pulsa **Save**.
6. Espera a que termine la publicación. GitHub mostrará la URL, normalmente `https://TU-USUARIO.github.io/TU-REPOSITORIO/`.

No subas el ZIP sin descomprimir. No hace falta ejecutar npm ni configurar GitHub Actions. Todas las rutas internas son relativas, por lo que funciona dentro de un subdirectorio de GitHub Pages.

Guía oficial: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Ejecutar en tu equipo

Sirve esta carpeta con cualquier servidor estático. Si tienes Python, ejecuta `python -m http.server 8000` dentro de la carpeta y abre `http://localhost:8000`. También puedes usar Live Server en VS Code. No uses doble clic sobre `index.html`: los módulos JavaScript requieren HTTP/HTTPS.

## Uso

- Sube o arrastra JPG, PNG o WebP, hasta 25 MB. Se reduce el lado mayor a 1600 píxeles para limitar el trabajo.
- Al abrirla se intenta detectar el rostro. Si hay varios, se elige el de mayor área y aparece un aviso; recorta la imagen si necesitas otro.
- Los óvalos numerados muestran frente y mejillas. Comprueba que caigan sobre piel limpia. Los óvalos naranjas carecen de suficientes píxeles válidos.
- **Muestreo manual** permite añadir hasta 12 zonas, incluso sin conexión al detector. Ajusta el radio antes de añadir un punto. **Limpiar zonas** permite reemplazar todas las muestras; **Deshacer punto** elimina la última.
- En la foto, las flechas mueven el cursor de teclado; Mayús + flecha mueve más rápido y Enter añade una muestra. El radio se expresa en píxeles de la imagen procesada.
- Consulta el Top 3, ΔE2000, la confianza heurística y los avisos. Un ΔE menor significa mayor cercanía perceptual.

## Método y límites

1. MediaPipe Face Landmarker, modo IMAGE, hasta 3 rostros. Se utiliza el de mayor área.
2. Óvalos alrededor de landmarks 151, 50 y 280, escalados y girados según el ancho facial. No hay segmentación semántica de piel, cuerpo, barba o tatuajes: las zonas son aproximaciones geométricas que debes revisar. Perfiles fuertes, oclusiones, pelo o barbas pueden contaminarlas.
3. Cada zona se analiza por separado. Se descartan transparencia, blancos casi recortados y negros casi recortados; no se aplica un umbral racial o un rango fijo de color de piel.
4. Conversión sRGB → RGB lineal → XYZ D65 → CIELAB, observador 2°. Se conserva el 50 % central de luminosidad de cada zona (recorte del 25 % en cada extremo).
5. Mediana por componente LAB y eliminación adicional de valores atípicos por distancia ΔE2000 usando mediana y desviación absoluta mediana. Se requiere un mínimo de 16 píxeles iniciales válidos y 8 retenidos.
6. Mediana por componente de las zonas válidas, con igual peso por zona para evitar que una muestra grande domine. Comparación CIEDE2000, factores kL=kC=kH=1, contra los 20 colores exactos.
7. Confianza heurística: empieza en 90 y resta penalizaciones por distancia al mejor tono, discrepancia entre zonas, dispersión interna, escasez de zonas/píxeles, recorte de extremos y empate entre candidatos. Se limita a 5–90. No está calibrada estadísticamente y NO es una probabilidad de acierto.

La salida describe el color observado, no una reflectancia intrínseca ni una categoría étnica. Una sola foto sin referencia neutra no permite corregir de manera fiable exposición o balance de blancos. No se inventa esa corrección. Luces de color, maquillaje, bronceado, compresión y filtros pueden alterar el resultado. Las alertas describen señales medibles; no garantizan detectar todos estos problemas. Prefiere luz difusa neutra y varias fotos consistentes.

## Privacidad y dependencias

Las imágenes se decodifican en memoria en el navegador. No se envían, guardan ni incorporan al repositorio. No hay analítica, cookies ni almacenamiento persistente. La foto original del caso de prueba no se distribuye en el ZIP.

El modo automático necesita acceso a jsDelivr y Google Storage para descargar JavaScript, WASM y el modelo. Esos proveedores reciben las solicitudes de recursos (incluidos metadatos normales de red), pero no la fotografía. El modo manual usa únicamente archivos propios. No se promete funcionamiento automático sin conexión; para autoalojar el detector, descarga los recursos y cambia las URL de `getModel()` en `app.js` conservando sus licencias.

- MediaPipe Tasks Vision: versión fijada `0.10.22-rc.20250304`, licencia Apache-2.0 para el código del proyecto MediaPipe. Recursos externos sujetos a sus correspondientes términos y avisos.
- Modelo: `face_landmarker/float16/1/face_landmarker.task`.
- Documentación oficial: https://developers.google.com/edge/mediapipe/solutions/vision/face_landmarker/web_js
- Proyecto y licencia: https://github.com/google-ai-edge/mediapipe

## Archivos

- `index.html`: interfaz accesible en español.
- `styles.css`: diseño adaptable a móvil y escritorio.
- `app.js`: carga de imagen, detector, muestras, visualización y confianza.
- `color.js`: paleta, conversiones y CIEDE2000 sin dependencias.
- `tests.mjs`, `package.json`: pruebas opcionales con Node (`npm test` o `node tests.mjs`). No necesitan instalación.
- `VALIDACION.md`: resultados y alcance de las verificaciones.

## Mantenimiento

La paleta está en `color.js`. Si cambias versiones de MediaPipe, actualiza conjuntamente las URL del módulo y WASM, y vuelve a probar el detector con fotos. Los navegadores modernos Chromium son la referencia de validación; otros motores pueden variar en soporte WASM y color. Imágenes muy grandes pueden agotar la memoria durante su decodificación antes del redimensionado; utiliza fotos reducidas si el dispositivo tiene pocos recursos.
