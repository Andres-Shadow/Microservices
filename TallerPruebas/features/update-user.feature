Feature: La API proporsional al usuario la funcinalidad de listar los usuarios dentro de la base de datos con paginación

  Background: 
    Given un usario llamado pepe registrado en la base de datos que ya se ha autenticado
    And pepe proporsiona el token jwt en las cabeceras de las peticiones

  Scenario: pepe desea actualizar los datos de un usuario
    When pepe realiza una petición POST a /api/v1/users
    And el cuerpo de la petición corresponde a los datos almacenados en la base dedatos
    Then el servidor actualiza los datos del usuario
    And el servidor responde con un json con la información del usuario actualizada

  Scenario: pepe desea actualizar los datos de un usuario que no existe
    When pepe realiza una petición POST a /api/v1/users
    And el cuerpo de la petición corresponde a los datos de un usuario que no existe
    Then el servidor responde con un json con un mensaje de error
    And el servidor responde con un código de estado 404

  Scenario: pepe desea actualizar los datos de un usuario
    When pepe realiza una petición POST a /api/v1/users
    And el token jwt ingresado se encuentra vencido
    Then el servidor responde con un json con un mensaje de error
    And el servidor responde con un código de estado 401
