import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import projectRoutes from './app/routes/project-routes';
import { DataLog } from './app/database/database';
import NATSManager from './app/communication/nats-manager';

async function main(): Promise<void> {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(morgan('dev'));
    app.use(express.json());

    // Routes
    app.use(projectRoutes);

    // Sync database model (creates table if not exists)
    await DataLog.sync({ alter: true });
    console.log('Logs table synchronized.');

    // Connect to NATS
    const natsHost = process.env.NATS_SERVER ?? 'localhost';
    const natsManager = new NATSManager(`nats://${natsHost}:4222`);
    await natsManager.connect();

    // Start HTTP server
    const port = parseInt(process.env.PUERTO ?? '9091', 10);
    const server = http.createServer(app);

    server.listen(port, () => {
        console.log(`Logs manager listening on port ${port}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string): Promise<void> => {
        console.log(`${signal} received — shutting down...`);
        server.close(() => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
        setTimeout(() => process.exit(1), 10_000).unref();
    };

    process.on('SIGINT',  () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch(err => {
    console.error('Fatal error during startup:', err);
    process.exit(1);
});
