Feature: el usuario desea listar las notificaciones almacenadas en la base de datos

    Scenario: El usuario desea lista las notificaciones almacenadas en la base de datos
        Given el usuario hace una peticion get a la ruta /api/v1/notification
        Then el servidor responde con un listado de notificaciones registradas
        And el codigo de respuesta es 200