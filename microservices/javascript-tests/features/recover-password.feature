Feature: La API proporsional al usuario la funcinalidad de registrase

    Background:
        Given un usario llamado pepe que ya se ha registrado
        And pepe por correo electronico a@gmail.com

    Scenario: pepe desea actualizar su contraseña
        When pepe hace una solicitud a la ruta GET /api/v1/users/password/?email="a@gmail.com"
        Then si existe un registro con ese correo
        And la aplicación responde con un token jwt valido por 30 minutos
        And la respuesta tendrá un código 200

    Scenario: pepe desea actualizar su contraseña
        When pepe hace una solicitud a la ruta GET /api/v1/users/password/?email="z@gmail.com"
        And si no existe un registro con esos datos
        Then la aplicación responde con un mensaje de error
        And la respuesta envida tendrá un código 404

    Scenario: pepe desea actualizar su contraseña
        When pepe hace una solicitud a la ruta GET /api/v1/users/password/
        And se envía un correo electrónico no valido
        Then la aplicación responde con un mensaje de error
        And la respuesta envida tendrá un código 404


