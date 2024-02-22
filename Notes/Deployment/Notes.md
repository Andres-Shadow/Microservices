#Deployment

¿Cual es el problema a resolver?
empaquetar los servicios con la finalidad de quedar alojados en un host

##beneficios

- eficiencia en la utilización de los recursos del host
  ##dificultades
- riesgo de conflictos por el uso de recursos
- riesgo de conflictos entre versiones de las dependencias
- gestión de recursos compleja (dificl limitar el consumo)
- dificultad en el aislamiento de las instancias.
- dificultad para unificar las versiones que son implementadas

###service instance per host
##beneficios

- la instancia de servicios estan aisladas unas de otras
- no hay posibilidad de conflicto entre requisitos de recursos o versiones de dependencia
- una instancia de servicio solo puede consumir como maximo los recursos de un unico host
- es sencillo supervisar, gestionar y volver a desplegar cada instancia de servicio
  ##dificultades
- utiizacion potencialmente menos eficiente de los recursos en comparación con los servicios múltiples por host, ya que hay más host

##Service instance per vm

empaqueta el servicio como una imagen de maquina virtual y despliegue cada instancia de servicio como una maquina virtual por serparado.
##beneficios

- rapido escalamiento
- plantillas de maquinas virtuales preparadas
- cada instancia esta aislada
- la maquina virtual impone limite de cpu y memoria
- variadad de proveedores de las iaas maduros donde se puede desplegar

##dificultades

- construir una imagen de maquina virtual es lento y lleva mucho tiempo.

##service instance per container
en lugar de vm usar contenedores, casualmente los microservicios se dieron en auje cuando nacieron los contenedores

busca que cada servicio sea desplegado de forma única dentro de un contenedor

##beneficios

- sencillo de escalar
- el contenedor encapsula los detalles de la tecnología
- cada instancia del servicio esta aislada
- es posible limitar el consumo de los recursos

##dificultades
- existen muchas más alternativas para la implementación de maquinas virtuales que para la implementación de contenedores.
- pueden existir problemas de seguridad al utilizar las imagenes

##serverless deployment

nacen alrededor de 2o17, son una alternativa que utiliza una infraestructura de implementación de oculta cualquier concepto de servicores. La infraestructura toma el código de su servicio y lo ejecuta. Se le cobra por cada solicitud en función del consumo de recursos.

nos hata de manos pues se crea una dependencia con los proveedores

##beneficios
- reduce la carga administrativa de gestión de infraestructura
- escala automaticamente de acuerdo a la carga
- se paga por solicitud

##dificultades
- limitaciones según el proveedor
- fuentes de entrada limitadas
- tardan tiempo en iniciar (el proveedor demora x tiempo en recibir el proyecto y su posterior compilación para implementar)
- riesgo de alta latencia en el servicio