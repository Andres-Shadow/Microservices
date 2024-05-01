Feature: El usuario desea agregar una aplicacion para ser monitoreada por el sistema

    Scenario: El usuario diligencia correctamente la petición de la aplicacion
        When el usuario ingresa todos requeridos en la peticion de monitoreo
        Given el usuario realiza una peticion POST a /api/v1/health
        Then el sistema guarda la aplicacion en la base de datos
        And el mensaje de respuesta contiene un codigo de repuesta 200
        And el servidor regresa un mensaje de respuesta

    Scenario: El usuario no completa el diligenciamiento de la peticion de la aplicacion
        When el usuario no ingresa todos los campos requeridos en la peticion de monitoreo
        Given el usuario realiza una peticion POST a /api/v1/health
        Then el sistema no guarda la aplicacion en la base de datos
        And el mensaje de respuesta contiene un codigo de repuesta 400
        And el servidor regresa un mensaje de respuesta

    Scenario: El usuario ingresa un campo incorrecto en la peticion de la aplicacion
        When el usuario ingresa un campo incorrecto en la peticion de monitoreo
        Given el usuario realiza una peticion POST a /api/v1/health
        Then el sistema no guarda la aplicacion en la base de datos
        And el mensaje de respuesta contiene un codigo de repuesta 400
        And el servidor regresa un mensaje de respuesta