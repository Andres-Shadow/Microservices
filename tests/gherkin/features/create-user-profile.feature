Feature: El usuario desea crear un perfil de usuario de forma manual

    Scenario: el usuario desea crear su perfil de usuario de forma manual
        Given el usuario proporsiona de forma completa su informacion el cuerpo de la peticion
        When el usuario hace una peticion POST a /api/v1/users
        Then el sistema de usuarios responde con el cuerpo del usuario creado
        And el sistema de usuarios responde con el codigo de estado 201
    
    Scenario: el usuario desea crear el perfil de usuario de forma manual pero no ingresa todos los campos necesarios
        Given el usuario no proporsiona de forma completa su informacion el cuerpo de la peticion
        When el usuario hace una peticion POST a /api/v1/users
        Then el sistema de usuarios responde con el mensaje de error
        And el sistema de usuarios responde con el codigo de estado 400

    Scenario: el usuario desea crear el perfil de usuario de forma manual pero el correo ya esta registrado
        Given el usuario proporsiona de forma completa su informacion el cuerpo de la peticion
        And el correo ya esta registrado
        When el usuario hace una peticion POST a /api/v1/users
        Then el sistema de usuarios responde con el mensaje de error
        And el sistema de usuarios responde con el codigo de estado 400

    Scenario: el usuario desea crear el perfil de usuario de forma manual pero no ingresa correctamente los datos
        Given el usuario proporsiona de forma erronea su informacion el cuerpo de la peticion
        When el usuario hace una peticion POST a /api/v1/users
        Then el sistema de usuarios responde con el mensaje de error
        And el sistema de usuarios responde con el codigo de estado 400

    Scenario: el usuario desea crear el perfil de usuario de forma manual pero no proporsiona su información
        Given el usuario no proporsiona su informacion el cuerpo de la peticion
        When el usuario hace una peticion POST a /api/v1/users
        Then el sistema de usuarios responde con el mensaje de error
        And el sistema de usuarios responde con el codigo de estado 400

    