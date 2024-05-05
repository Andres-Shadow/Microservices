Feature: El usuario desea actualizar de forma manual su usuario en el servidor

    Scenario: El usuario realiza de forma correcta la solicitud de actualización
        Given el usuario diligencia el cuerpo de la peticion a actualizar con su nombre de usuario
        When el usuario envía una solicitud put a /api/v1/users
        Then el sistema actualiza la información
        And el mensaje de respuesta del servidor de perfiles tiene un codigo 200

    Scenario: El usuario realiza la solicitud de actualización pero intenta actualizar el correo electronico
        Given el usuario diligencia el cuerpo de la peticion intentando actualizar su correo electronico
        When el usuario envía una solicitud put a /api/v1/users
        Then el servidor de perfiles responde con un mensaje de error
        And el mensaje de respuesta del servidor de perfiles tiene un codigo 400

    Scenario: el usuario realiza la solicitud de actualización con un nombre de usuario no registrado
        Given el usuario diligencia el cuerpo de la peticion con un nombre de usuario no registrado en la base de datos
        When el usuario envía una solicitud put a /api/v1/users
        Then el servidor de perfiles responde con un mensaje de error
        And el mensaje de respuesta del servidor de perfiles tiene un codigo 404