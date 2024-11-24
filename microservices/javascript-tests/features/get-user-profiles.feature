Feature: El usuario desea listar los registros del servidor de perfiles de usuario

    Scenario: el usuario desea listar los registros limitando la cantidad que puede ver
        Given el usuario hace una peticion get a la url /api/v1/users?page=1&limit=10
        When el servidor de perfiles recibe la peticion
        Then el servidor responde con los registros

    Scenario: el usuario desea listar los registros sin especificar la paginacion
        Given el usuario hace una peticion get a la url /api/v1/users
        When el servidor de perfiles recibe la peticion
        Then el servidor responde con los registros