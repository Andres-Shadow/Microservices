import sequelize from '../database/connection';
import NATSManager from '../communication/nats-manager';

const natsUrl = (): string => {
    const host = process.env.NATS_SERVER ?? 'localhost';
    return `nats://${host}:4222`;
};

class healthServices {
    private static startTime: number = Date.now();

    static async verifyDatabaseConnection(): Promise<boolean> {
        try {
            await sequelize.authenticate();
            return true;
        } catch {
            return false;
        }
    }

    static async verifyNatsConnection(): Promise<boolean> {
        const natsManager = new NATSManager(natsUrl());
        return natsManager.testConnection();
    }

    static getUptime(): string {
        const uptimeMs = Date.now() - this.startTime;
        return (uptimeMs / 1000).toFixed(2) + 's';
    }

    static async verifyDatabaseReady(): Promise<boolean> {
        try {
            await sequelize.query('SELECT 1');
            return true;
        } catch {
            return false;
        }
    }

    static async verifyNatsReady(): Promise<boolean> {
        const natsManager = new NATSManager(natsUrl());
        return natsManager.sendTestMessage();
    }
}

export default healthServices;
