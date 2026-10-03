# Pruebas repetibles

## Matemáticas (sin dependencias)

Desde la carpeta de la web: `npm test`.

Ejecuta las pruebas originales y `qa/math.mjs`: 34 pares publicados CIEDE2000, 10.000 pares pseudoaleatorios con semilla fija, ruido en los 38 colores y límites del filtrado.

## Navegador

Necesita Node, Playwright y Microsoft Edge instalado. Ejecuta `npm run test:browser`. Para Chrome establece la variable de entorno `QA_CHANNEL=chrome`. Si Playwright está instalado en otra carpeta, `QA_PLAYWRIGHT` puede apuntar a su módulo.

El servidor de pruebas se abre en un puerto local efímero y se cierra al terminar. Sirve la aplicación bajo `/project/`, equivalente al despliegue en un subdirectorio. Las imágenes de prueba se generan en memoria, sin guardar fotos personales. Cada escenario abre un contexto de navegador independiente.

Los escenarios de esta suite **sustituyen MediaPipe por un doble de prueba** para controlar respuestas de cero/uno/varios rostros, retrasos y fallos de descarga. No evalúan precisión de detección real. No hay cambios ni hooks de prueba en la aplicación publicada: la sustitución se hace interceptando solicitudes desde Playwright.

Los resultados se escriben en `browser-results-msedge.json` o `browser-results-chrome.json`. Cada escenario debe pasar y la página no debe registrar excepciones JavaScript. La comprobación manual separada con MediaPipe real y la foto original está documentada en `../AUDITORIA.md`.

Esta carpeta es opcional para el despliegue; no la carga la página. Puedes conservarla en el repositorio para repetir las pruebas.
