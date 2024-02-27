##Consideraciones protocolo http

Es muy simple, extensible, sin estados pero con el manejo de sesiones (maneja cada solicitud como independiente pero almacena información temporalmente útil para la comunicación con el usuario)

###Contenido de las solicitudes

- Un método para la implementación de la acción (get, head, post, put, delete, connect)
- una ruta donde se encuentra el acceso al servicio
- versión del protocolo (importante pues define la intervención con el servidor)
