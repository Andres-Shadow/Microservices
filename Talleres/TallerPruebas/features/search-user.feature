Feature: La API proporsional al usuario la funcinalidad de buscar un usuario especifico

  Background: 
    Given un usario llamado pepe totalmente nuevo que no se ha registrado en la base de datos de la aplicación
    And pepe ingresa los siguientes datos:
      | Name | Email       | Password |
      | pepe | a@gmail.com |     1234 |
    And existe un segundo usuario ya registrado llamado pipo
    And pipo ingresa los siguientes datos:
      | Name | Email       | Password |
      | pipo | b@gmail.com |    12345 |

  Scenario: pepe desea buscar un usuario puntual en la base de datos
    When pepe hace una peticion get a /api/v1/users/b2@gmail.com
    And el email ingresado no se encuentra en la base de datos
    Then la aplicacion le muestra un mensaje de error

  Scenario: pepe desea buscar un usuario puntual en la base de datos
    When pepe hace una peticion get a /api/v1/users/b@gmail.com
    And el email ingresado se encuentra en la base de datos
    Then la aplicacion le muestra los datos del usuario

