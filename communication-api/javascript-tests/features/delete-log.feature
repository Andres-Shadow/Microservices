Feature: El usuario desea eliminar un log de forma manual de la base de datos

    Scenario: Eliminar un log de la base de datos
        Given el id existe en la base de datos
        Given el usuario hace una peticion delete a /api/v1/logs/?id
        When el usuario envia la peticion
        And el servidor valida que se encuentre el log
        Then el servidor de logs responde con estado 200
        And el servidor de logs responde con el log eliminado
    Scenario: El usuario no ingresa el id a eliminar en los logs
        Given el usuario no proporciona un id
        When el usuario hace una peticion delete a /api/v1/logs/
        When el usuario envia la peticion
        Then el servidor de logs envia un mensaje
        And el servidor responde con estado 400
    Scenario: El usuario ingresa un id no valido en los logs
        Given el usuario hace una peticion delete a /api/v1/logs/?id
        And el id no existe en la base de datos
        When el usuario envia la peticion
        Then el servidor de logs envia un mensaje
        And el servidor responde con estado 404
    Scenario: El usuario ingresa un id no valido en los logs
        Given el usuario hace una peticion delete a /api/v1/logs/?id
        And el usuario no proporciona un id valido de logs
        When el usuario envia la peticion
        Then el servidor de logs envia un mensaje
        And el servidor responde con estado 404