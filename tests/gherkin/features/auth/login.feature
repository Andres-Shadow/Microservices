Feature: la API provee al usuario la funcionalidad de ingresar con sus credenciales previamente registradas

  Background:
    Given : un usuario ya registrado de forma exitosa en la base de datos de la aplicación
    And este usuario tiene por nombre pepe

  Scenario: pepe quiere autenticarse dentro de la aplicación
    When invoca el método de autenticación en /api/v1/login
    Then se obtiene el mensaje de respuesta 200
    And se obtiene el token jwt de autenticación

  Scenario: pepe quiere autenticarse dentro de la aplicación
    Given los datos diligenciados no existen en la base de datos
    When invoca el método de autenticación en /api/v1/login
    Then se obtiene el mensaje de respuesta 404
    And se obtiene el mensaje de error "Usuario no encontrado"

  Scenario: pepe quiere autenticarse dentro de la aplicación
    Given la contraseña ingresada no coincide con los registrados en la base de datos
    When invoca el método de autenticación en /api/v1/login
    Then se obtiene el mensaje de respuesta 404

  Scenario: pepe quiere autenticarse dentro de la aplicación
    Given los datos diligenciados no cumplen con el formato esperado
    When invoca el método de autenticación en /api/v1/login
    Then se obtiene el mensaje de respuesta 404
    And se obtiene el mensaje de error "Datos no válidos"
