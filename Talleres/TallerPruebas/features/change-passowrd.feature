Feature: La API proporsional al usuario la funcinalidad de registrase

  Background: 
    Given un usario llamado pepe totalmente nuevo que no se ha registrado en la base de datos de la aplicación
    And pepe ingresa los siguientes datos:
      | Name | Email       | Password |
      | pepe | a@gmail.com |     1234 |

    Scenario: pepe desea actualizar su contraseña
    When pepe hace una solicitud a la ruta PUT /api/v1/users/password
    And pepe ingresa los siguientes datos:
      | Name | Email       | Password |
      | pepe | a@gmail.com |     4321 |
    Then la aplicación busca su registro en la base de datos
    And si existe un registro con esos dados actauliza la contraseña
    And la aplicación responde con un mensaje de éxito

    Scenario: pepe desea actualizar la contraseña
    When pepe hace una solicitud a la ruta PUT /api/v1/users/password
    And pepe ingresa los siguientes datos:
      | Name | Email       | Password |
      | pepe | a@gmail.com |     4321 |
    Then la aplicación busca su registro en la base de datos
    And si no existe un registro con esos dados 
    And la aplicación responde con un mensaje de error

    Scenario: pepe desea actualizar la contraseña
    When pepe hace una solicitud a la ruta PUT /api/v1/users/password
    But pepe no proporsiona el token de verificación jwt
    Then la aplicación responde con un mensaje de error