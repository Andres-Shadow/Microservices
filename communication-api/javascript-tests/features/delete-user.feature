Feature: La API proporsional al usuario la funcinalidad de registrase

  Background:
    Given un usario llamado pepe que ya ha pasado por el proceso de registrarse
    And pepe ya se ha autenticado

  Scenario: pepe desea eliminar un registro en la base de datos
    Given pepe proporsiona su correo electrónico en el cuerpo de la petición de eliminado
    When pepe hace una petición DELETE a /api/v1/users 
    And la aplicación encuentra su registro
    Then la aplicación elimina el registro de la base de datos
    And el mensaje de respuesta del servidor contiene un estado 200

  Scenario: pepe desea eliminar un registro en la base de datos
    Given pepe no proporsiona un correo electrónico valido en el cuerpo de la peticion
    When pepe hace una petición DELETE a /api/v1/users
    And el mensaje de respuesta del servidor contiene un estado 404

  Scenario: pepe desea eliminar un registro en la base de datos
    Given pepe no proporsiona un correo electrónico en el cuerpo de la petición
    When pepe hace una petición DELETE a /api/v1/users
    And el mensaje de respuesta del servidor contiene un estado 404

  Scenario: pepe desea eliminar un registro de la base de datos
    Given pepe ingresa un correo electrónico diferente al suyo
    When pepe hace una petición DELETE a /api/v1/users
    And la aplicación no encuentra un registro con ese correo
    And el mensaje de respuesta del servidor contiene un estado 404

  Scenario: pepe desea eliminar un registro de la base de datos
    Given pepe no proporsiona un token jwt de autenticación
    When pepe hace una petición DELETE a /api/v1/users
    And el mensaje de respuesta del servidor contiene un estado 401
