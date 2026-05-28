Feature: La API proporsional al usuario la funcinalidad de listar los usuarios dentro de la base de datos con paginación

  Background: 
    Given un usario llamado pepe registrado en la base de datos 
    And pepe proporsiona el token jwt 

    Scenario: pepe desea listar todos los usuarios registrados en la base de datos
        When pepe hace un petición get a la ruta /api/v1/users?page=1&limit=10
        Then la API le responde con una lista de usuarios registrados en la base de datos con paginación
        And la API le responde con un status code 200
    
    Scenario: pepe desea listar todos los usuarios registrados en la base de datos
        When pepe hace una petición get a la ruta /api/v1/users
        Then la aplicación internamente define el tamaño de la paginación a mostrar
        And la API le responde con una lista de usuarios registrados en la base de datos con paginación
        And la API le responde con un status code 200
    
    Scenario: pepe desea listar todos los usuarios registrados en la base de datos
        And la base de datos se encuentra vacía
        When pepe hace una petición get a la ruta /api/v1/users
        Then la API le responde con una lista vacía
        And la API le responde con un status code 200
    @Test
    Scenario: pepe desea listar todos los usuarios registrados en la base de datos
        And el token jwt ingresado se encuentra caducado
        When pepe hace una petición get a la ruta /api/v1/users
        Then la API le responde con un mensaje de error
        And la API le responde con un status code 401
        
    