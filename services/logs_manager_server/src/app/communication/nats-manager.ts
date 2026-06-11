import { connect, NatsConnection, StringCodec } from 'nats';
import logsServices from '../logs-services/logs-services';

class NATSManager {
    private connection: NatsConnection | null = null;
    private readonly stringCodec = StringCodec();

    constructor(private readonly url: string) {}

    async connect(): Promise<void> {
        try {
            this.connection = await connect({ servers: this.url });
            console.log('Connected to NATS at', this.url);
            this.subscribe();
        } catch (error) {
            console.error('Failed to connect to NATS:', error);
        }
    }

    async testConnection(): Promise<boolean> {
        try {
            const conn = await connect({ servers: this.url });
            await conn.close();
            return true;
        } catch (error) {
            console.error('NATS connection test failed:', error);
            return false;
        }
    }

    async sendTestMessage(): Promise<boolean> {
        try {
            const conn = await connect({ servers: this.url });
            const sc = StringCodec();
            const message = JSON.stringify({
                source:    'logs-manage-api',
                message:   'Test message from logs-manage-api',
                timestamp: new Date().toISOString(),
            });
            conn.publish('test', sc.encode(message));
            await conn.close();
            return true;
        } catch (error) {
            console.error('Failed to send NATS test message:', error);
            return false;
        }
    }

    private subscribe(): void {
        if (!this.connection) return;

        const sc = StringCodec();
        const sub = this.connection.subscribe('MicroservicesLogs');

        (async () => {
            for await (const m of sub) {
                try {
                    const data = JSON.parse(sc.decode(m.data));
                    logsServices.mapJSONToDataLogs(data);
                } catch (err) {
                    console.error('Error processing NATS message:', err);
                }
            }
            console.log('NATS subscription closed');
        })();
    }
}

export default NATSManager;
