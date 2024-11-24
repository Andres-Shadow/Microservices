Feature: El usuario desea actualizar los datos de una aplicacion monitoreada

    Scenario: El usuario desea actualizar el contenido de una aplicacion monitoreada
        Given El usuario ingresa correctamente el cuerpo de la aplicacion a actualizar
        When El usuario hace una peticion PUT a /api/v1/health
        Then el servidor encuentra la aplicacion y actualiza sus datos
        And el servidor responde con un mensaje
        And el mensaje del servidor monitor tiene un codigo 200

    Scenario: El usuario desea actualizar el contenido de una aplicacion monitoreada pero no ingresa correctamente el cuerpo
        Given El usuario no ingresa correctamente el cuerpo de la aplicacion a actualizar
        When El usuario hace una peticion PUT a /api/v1/health
        Then el servidor no encuentra la aplicacion y no actualiza sus datos
        And el servidor responde con un mensaje
        And el mensaje del servidor monitor tiene un codigo 400

    Scenario: El usuario desea actualizar el contenido de una aplicacion monitoreada pero no ingresa el cuerpo de la peticion
        Given El usuario no ingresa el cuerpo de la aplicacion a actualizar
        When El usuario hace una peticion PUT a /api/v1/health
        Then el servidor no encuentra la aplicacion y no actualiza sus datos
        And el servidor responde con un mensaje
        And el mensaje del servidor monitor tiene un codigo 400