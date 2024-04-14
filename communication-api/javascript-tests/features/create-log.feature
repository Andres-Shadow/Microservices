Feature: Creacion de un log nuevo realizado manualmente

    Scenario: El usuario realiza una peticion post a /api/v1/logs/
        Given el usuario diligencia en el cuerpo de la petición de forma correcta los campos
        When se hace una petición post a /api/v1/logs/
        Then se debe retornar un status code 200
        And el servidor envia un mensaje de respuesta
    Scenario: El usuario realiza una peticion post a /api/v1/logs/
        Given el usuario no diligencia en el cuerpo de la petición de forma correcta los campos
        When se hace una petición post a /api/v1/logs/
        Then se debe retornar un status code 400
        And el servidor envia un mensaje de respuesta
    Scenario: El usuario realiza una peticion post a /api/v1/logs/
        Given el usuario diligencia en el cuerpo con un tipo de dato diferente a los permitidos
        When se hace una petición post a /api/v1/logs/
        Then se debe retornar un status code 400
        And el servidor envia un mensaje de respuesta