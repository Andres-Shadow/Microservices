import { connect, NatsConnection, Msg, Subscription, StringCodec } from 'nats';
import logsServices from '../logs-services/logs-services';

class NATSManager {

    private connection: NatsConnection | null = null;
    private readonly stringCodec = StringCodec();


    constructor(private readonly url: string) { }

    async connect(): Promise<void> {

        try {
            this.connection = await connect({ servers: this.url });
            console.log('Conectado a NATS en', this.url);
            this.subscribe();
        } catch (error) {
            console.error('Error al conectar a NATS:', error);
        }
    }

    async testConnection(): Promise<boolean> {
        try {
            const testConnection = await connect({ servers: this.url });
            await testConnection.close(); // Cerramos la conexión de prueba
            return true; // Si se conecta y cierra sin errores, es exitoso
        } catch (error) {
            console.error('Error al probar conexión a NATS:', error);
            return false; // Si falla, devolvemos falso
        }
    }

    async sendTestMessage(): Promise<boolean> {
        const stringCodec = StringCodec(); // Inicializa el codec para convertir entre cadenas y buffers

        try {
            // Conexión a NATS
            const testConnection = await connect({ servers: this.url });
            if (!testConnection) {
                throw new Error('No hay conexión a NATS');
            }

            // Define el objeto JSON que quieres enviar
            const jsonMessage = {
                source: "logs-manage-api",
                message: "Test message from logs-manage-api",
                timestamp: new Date().toISOString(), // Agrega una marca de tiempo
            };

            // Convierte el objeto JSON a una cadena
            const jsonString = JSON.stringify(jsonMessage);

            // El asunto a donde enviarás el mensaje
            const subject = "test"; // Cambia esto al asunto correcto

            try {
                // Publica el mensaje en el subject
                await testConnection.publish(subject, stringCodec.encode(jsonString)); // Envía el mensaje JSON codificado
            } catch (error) {
                console.error('Error al publicar el mensaje en NATS:', error);
            }

            await testConnection.close(); // Cierra la conexión
            return true;
        } catch (error) {
            console.error('Error al enviar mensaje a NATS:', error); // Muestra el error en caso de fallo
            return false;
        }
    }


    private subscribe(): void {
        if (!this.connection) return;

        const sc = StringCodec();
        // create a simple subscriber and iterate over messages
        // matching the subscription
        const sub = this.connection.subscribe("MicroservicesLogs");
        (async () => {
            for await (const m of sub) {
                //console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
                let data = JSON.parse(sc.decode(m.data));
                console.log(data);
                logsServices.mapJSONToDataLogs(data);
            }
            console.log("subscription closed");
        })();
    }
}

export default NATSManager;
