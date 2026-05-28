Feature: El usuario desea comprobar la integración 

    Scenario: un usuario desea verificar la integración de los servicio de autenticacion y perfiles
        Given el usuario hace una peticion POSt a la api de autenticacion con un correo determinado
        Then la api guarda el usuario en la base de datos y notifica su creacion
        Then la api de perfiles recibe el mensaje y crea un usuario nuevo
        When se hace una peticion GET al servidor de perfiles con el correo del usuario
        Then debe existir un registro con esos datos

        