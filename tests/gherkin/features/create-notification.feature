Feature: El usuario desea crear una notificacion

    Scenario: El usuario envia correctamente la peticion para crear la notificacion
    Given el usuario define correctamente los campos de la peticion
    When el usuario envia una peticion post a /api/v1/notification
    Then el sistema envia la notificacion
    And responde con un codigo de estado 200

    Scenario: El usuario envia incorrectamente la peticion para crear la notificacion
    Given el usuario define incorrectamente los campos de la peticion
    When el usuario envia una peticion post a /api/v1/notification
    Then el sistema no envia la notificacion
    And responde con un codigo de estado 400