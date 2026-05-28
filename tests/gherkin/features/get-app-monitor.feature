Feature: El usuario desea conocer el estado de salud de las aplicacines registradas

    Scenario: El usuario desea conocer el estado de salud de las aplicaciones monitoreadas
        Given el usuario hace una peticio get a /api/v1/health
        Then el servidor evalua la salud de las aplicaciones registradas
        And el servidor responde con un json con el estado de salud de las aplicaciones registradas

    Scenario: El usuario desea conocer el estado de salud de las aplicaciones monitoreadas
        Given el usuario hace una peticio get a /api/v1/health
        Then el servidor evalua la salud de las aplicaciones registradas
        But no hay aplicaciones registradas
        And el servidor responde con un json vacio