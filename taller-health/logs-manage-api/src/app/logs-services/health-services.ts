import sequelize from '../database/connection';
import NATSManager from '../communication/nats-manager';

class healthServices {

    private static startTime: number = Date.now(); // Declarar como estático
    static async verifyDatabaseConnection() {
        try {
            await sequelize.authenticate(); // Fix: Call the authenticate method directly
            return true
        } catch (error) {
            return false
        }
    }

    static async verifyNatsConnection() {
        const natsManager = new NATSManager('nats://localhost:4222');
        const isConnected = await natsManager.testConnection();

        if (isConnected) {
            // console.log('Conexión a NATS exitosa');
            return true;
        } else {
            //console.error('No se pudo conectar a NATS');
            return false;
        }
    }

    static getUptime() {
        let now = Date.now();
        let uptime = now - this.startTime;
        // Fix: Return the uptime in seconds
        let uptimeSeconds = (uptime / 1000).toFixed(2);
        return uptimeSeconds + " Sg";
    }

    static async verifyDatabaseReady() {
        try {
            // ejecutar una consulta de prueba
            await sequelize.query('SELECT 1');
            return true
        } catch (error) {
            return false
        }
    }

    static async verifyNatsReady() {
        const natsManager = new NATSManager('nats://localhost:4222');
        const isConnected = await natsManager.sendTestMessage();

        if (isConnected) {
            // console.log('Conexión a NATS exitosa');
            return true;
        } else {
            //console.error('No se pudo conectar a NATS');
            return false;
        }
    }
}

export default healthServices;