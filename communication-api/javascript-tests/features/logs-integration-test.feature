Feature: Validacion de integracion entre los microservicios

    Scenario: El usuario valida la integracion
        Given El usuario se registra en la aplicación de usuarios
        And Si el registro es exitoso
        Then el servidor de usuario genera un log con su correo electronico y asociado al evento de creacion
        Then el usuario realiza una peticion get con ese correo al servidor de logs
        And si existe un log asociado a este correo
        Then el servidor de logs responde con el log asociado
        And el mensaje de respuesta tiene un 200