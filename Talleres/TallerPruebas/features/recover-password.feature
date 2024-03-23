Feature: La API proporsional al usuario la funcinalidad de registrase

    Background:
        Given un usario llamado pepe totalmente nuevo que no se ha registrado en la base de datos de la aplicación
        And pepe ingresa los siguientes datos:
            | Name | Email       | Password |
            | pepe | a@gmail.com | 1234     |

    Scenario: pepe desea actualizar su contraseña
        When pepe hace una solicitud a la ruta GET /api/v1/users/password/?email=a@gmail.com
        And si existe un registro con esos datos
        And la aplicación responde con un token jwt valido por 30 minutos

    Scenario: pepe desea actualizar su contraseña
        When pepe hace una solicitud a la ruta GET /api/v1/users/password/?email=z@gmail.com
        And si no existe un registro con esos datos
        Then la aplicación responde con un mensaje de error
        And la respuesta envida tendrá un código 400

    Scenario: pepe desea actualizar su contraseña
        When pepe hace una solicitud a la ruta GET /api/v1/users/password/
        And se envía un correo electrónico no valido
        Then la aplicación responde con un mensaje de error
        And la respuesta envida tendrá un código 400


