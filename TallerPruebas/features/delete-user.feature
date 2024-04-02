Feature: La API proporsional al usuario la funcinalidad de registrase

  Background: 
    Given un usario llamado pepe totalmente nuevo que no se ha registrado en la base de datos de la aplicación
    And pepe ingresa los siguientes datos:
      | Name | Email       | Password |
      | pepe | a@gmail.com |     1234 |

  Scenario: pepe desea eliminar un registro en la base de datos
    When pepe hace una petición DELETE a /api/v1/users con los siguientes datos:
      | email       |
      | b@gmail.com |
    And la aplicación encuentra un registro con ese correo
    Then la aplicación elimina el registro de la base de datos
    And la aplicación responde con un mensaje de éxito

  Scenario: pepe desea eliminar un registro en la base de datos
    When pepe hace una petición DELETE a /api/v1/users sin proporcionar un correo electrónico valido
    Then la aplicación responde con un mensaje de error

  Scenario: pepe desea eliminar un registro en la base de datos
    When pepe hace una petición DELETE a /api/v1/users sin proporcionar un correo electrónico
    Then la aplicación responde con un mensaje de error

  Scenario: pepe desea eliminar un registro de la base de datos
    When pepe hace una petición DELETE a /api/v1/users con un correo electrónico válido
    And la aplicación no encuentra un registro con ese correo
    Then la aplicación responde con un mensaje de error

  Scenario: pepe desea eliminar un registro de la base de datos
    When pepe hace una petición DELETE a /api/v1/users con un correo electrónico válido
    But pepe no ha proporcionado el token jwt de autenticación
    Then la aplicación responde con un mensaje de error
