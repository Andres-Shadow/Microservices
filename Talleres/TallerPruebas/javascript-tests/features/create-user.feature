Feature: La API proporsional al usuario la funcinalidad de registrase

  Background: 
    Given un usario llamado pepe totalmente nuevo que no se ha registrado en la base de datos de la aplicación
    And pepe ingresa los siguientes datos:
      | Name | Email       | Password |
      | pepe | a@gmail.com |     1234 |

  Scenario: pepe intenta registrarse en la base de datos
    When el cliente envia una solicitud POST a /api/v1/users
    Then el codigo de respuesta debe ser 200
    And el cuerpo de la respuesta debe contener los detalles del usuario registrado

  Scenario: pepe intenta registrarse en la base de datos
    When el cliente envia una solicitud POST a /api/v1/users
    And el cuerpo de la solicitud de creación no contiene los datos requeridos
    Then el codigo de respuesta debe ser 400
    And el cuerpo de la respuesta debe contener un mensaje de error

  Scenario: pepe intenta registrarse en la base de datos
    When el cliente envia una solicitud POST a /api/v1/users
    And el email ya se encuentra registrado
    Then el codigo de respuesta debe ser 400
    And el cuerpo de la respuesta debe contener un mensaje de error

  Scenario: pepe intenta registrarse en la base de datos
    When el cliente envia una solicitud POST a /api/v1/users
    And el tipado de los datos ingresados no coincide con el esquema de bases de datos
    Then el codigo de respuesta debe ser 400
    And el cuerpo de la respuesta debe contener un mensaje de error
