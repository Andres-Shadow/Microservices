Feature: El usuario desea actualizar de forma manual la información de un Log

    Scenario: el usuario actualiza un log de forma manual
        Given el usuario diligencia de forma correcta en el cuerpo de la peticion la informacion a actualizar
        When el usuario envia la peticion PUT a /api/v1/logs/
        Then el servidor responde con un codigo de respuesta igual a 200
        And el servidor envia un mensaje de respuesta con informacion

    Scenario: el usuario actualiza un log de forma manual con informacion incorrecta
        Given el usuario diligencia de forma incorrecta en el cuerpo de la peticion la informacion a actualizar
        When el usuario envia la peticion PUT a /api/v1/logs/
        Then el servidor responde con un codigo de respuesta igual a 400
        And el servidor envia un mensaje de respuesta con informacion

    Scenario: el usuario actualiza un log de forma manual con informacion faltante
        Given el usuario no diligencia la informacion a actualizar en la base de datos de logs
        When el usuario envia la peticion PUT a /api/v1/logs/
        Then el servidor responde con un codigo de respuesta igual a 400
        And el servidor envia un mensaje de respuesta con informacion