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



        try {
            const testConnection = await connect({ servers: this.url });
            if (!testConnection) {
                throw new Error('No hay conexión a NATS');
            }

            let subject = "Test message"
            let message = "Test message from logs-manage-api"
            await testConnection.publish(subject, this.stringCodec.encode(message)); // Envía el mensaje
            //console.log(`Mensaje enviado a ${subject}: ${message}`);
            await testConnection.close();
            return true;
        } catch (error) {
            //console.error('Error al enviar mensaje a NATS:', error);
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
