# Atlas de La Liga

Misión M2 · Async Odyssey — Web Development I.

## Cómo probarlo

Explora los clubes busca en tiempo real, ordena con filtros, marca tus favoritos  y haz clic en una tarjeta para ver la historia completa. 


## Uso de IA
Usé Gemini como pareja de programación
Ejemplo de prompt real: "¿Cómo transformo la respuesta cruda de TheSportsDB en TypeScript sin usar any ?" 
Verifiqué cada cambio mirando la consola de Vite, revisando la pestaña Network de las DevTools para comprobar que la caché evitaba llamadas de red innecesarias, gran parte del css se construyó utilizando IA
Escribí/Corregí a mano: el control de errores  para no pintar campos que no devolvian datos,

## Autopsia
1. Creación de nodos con `document.createElement` y `.textContent` en lugar de usar cadenas con innerHTML.
2. Lectura y guardado de datos en localStorage en api.ts antes de hacer el fetch. Descarté hacer peticiones de red en cada recarga para optimizar el rendimiento
