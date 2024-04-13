Feature: Comunicación entre go_server y logs API

    Scenario: Envío de mensaje desde go_server a logs API
        Given que la API go_server está funcionando en localhost:9093/api/v1/users/
        And que la API logs está funcionando en localhost:9091/api/v1/logs/
        When se realiza una acción de CRUD en go_server
        Then el mensaje debe ser enviado correctamente a logs
