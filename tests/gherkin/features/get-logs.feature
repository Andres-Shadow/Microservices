Feature: El usuario desea listar los logs del sistema

    Scenario: El usuario lista los logs del sistema
        Given El usuario realiza una petición GET a la URL /api/v1/logs/
        When El usuario envía la petición
        Then El sistema responde con un código de estado 200
        And El sistema responde con una lista de logs


    Scenario: El usuario lista los logs del sistema
        Given El usuario realiza una petición GET a la URL /api/v1/logs/?page=1&pageSize=10
        When El usuario envía la petición
        Then El sistema responde con un código de estado 200
        And El sistema responde con una lista de logs



