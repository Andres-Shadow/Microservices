Feature: La API proporsional al usuario la funcinalidad de cambiar de contraseña

  Background:
    Given un usario llamado pepe que ya ha realizado el registro
    And pepe quiere actualizar su contraseña a 12345

  Scenario: actualización de contraseña exitosa
    Given pepe diligencia su correo en el cuerpo de la petición
    When pepe hace una solicitud a la ruta PATCH /api/v1/users/password
    Then la aplicación lo busca en la base de datos
    And si existe un registro con esos dados actauliza la contraseña
    And el servidor retorna un codigo de estado 200

  Scenario: actualización de contraseña fallida
    Given pepe diligencia un correo que no está registrado en la base de datos
    When pepe hace una solicitud a la ruta PATCH /api/v1/users/password
    Then la aplicación busca su registro en la base de datos
    And si no existe un registro con esos dados
    And el servidor retorna un codigo de estado 404

  Scenario: actualización de contraseña sin jwt
    When pepe hace una solicitud a la ruta PATCH /api/v1/users/password
    But pepe no proporsiona el token de verificación jwt
    Then el servidor retorna un codigo de estado 404
