import { connect, NatsConnection, Msg, Subscription, StringCodec } from 'nats';

class NATSManager {
    private connection: NatsConnection | null = null;

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

    private subscribe(): void {
        if (!this.connection) return;

        const sc = StringCodec();
        // create a simple subscriber and iterate over messages
        // matching the subscription
        const sub = this.connection.subscribe("MicroservicesLogs");
        (async () => {
            for await (const m of sub) {
                console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
            }
            console.log("subscription closed");
        })();
    } // Add the subscription options

    // Manejar cierre del cliente

}



export default NATSManager;
