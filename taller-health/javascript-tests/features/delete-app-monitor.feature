Feature: El usuario desea eliminar una aplicacion que se encuentre monitoreada

    Scenario: el usuario elimina de forma exitosa una aplicacion monitoreada
        When el usuario configura el nombre de la aplicacion en la url
        Given el usuario hace una peticion delte a /api/v1/health?name
        Then el servidor procesa la eliminacion
        And el servidor responde con un mensaje de exitosa

    Scenario: el usuario intenta eliminar una aplicacion que no se encuentra monitoreada
        When el usuario no configura el nombre de la aplicacion en la url
        Given el usuario hace una peticion delte a /api/v1/health?name
        Then el servidor responde con un mensaje de error

    Scenario: el usuario no diligencia el nombre de la aplicacion monitoreada
        Given el usuario hace una peticion delte a /api/v1/health
        Then el servidor responde con un mensaje de error
        And el mensaje tiene un codigo de error 400