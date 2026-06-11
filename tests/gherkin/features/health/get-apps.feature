Feature: El usuario desea conocer el estado de salud de las aplicaciones registradas

  Scenario: El usuario desea conocer el estado de salud de las aplicaciones monitoreadas
    Given el usuario hace una peticion GET a /api/v1/apps
    Then el servidor evalua la salud de las aplicaciones registradas
    And el servidor responde con un json con el estado de salud de las aplicaciones registradas

  Scenario: El usuario desea conocer el estado de salud pero no hay aplicaciones registradas
    Given el usuario hace una peticion GET a /api/v1/apps
    Then el servidor evalua la salud de las aplicaciones registradas
    But no hay aplicaciones registradas
    And el servidor responde con un json vacio
