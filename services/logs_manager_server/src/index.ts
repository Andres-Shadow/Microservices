import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import projectRoutes from './app/routes/project-routes';
import { DataLog } from './app/database/database';
import NATSManager from './app/communication/nats-manager';
import healthServices from './app/logs-services/health-services';

async function main(): Promise<void> {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(morgan('dev'));
    app.use(express.json());

    // Registrar el tiempo de inicio para el uptime
    healthServices['startTime' as keyof typeof healthServices];

    // Rutas
    app.use(projectRoutes);

    // Sincronizar modelo con la base de datos (crea la tabla si no existe)
    await DataLog.sync({ alter: true });
    console.log('Tabla logs sincronizada.');

    // Conectar a NATS
    const natsHost = process.env.NATS_SERVER ?? 'localhost';
    const natsManager = new NATSManager(`nats://${natsHost}:4222`);
    await natsManager.connect();

    // Arrancar servidor HTTP
    const port = parseInt(process.env.PUERTO ?? '9091', 10);
    const server = http.createServer(app);

    server.listen(port, () => {
        console.log(`Logs manager listening on port ${port}`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string): Promise<void> => {
        console.log(`${signal} received — shutting down...`);
        server.close(async () => {
            console.log('HTTP server closed.');
            process.exit(0);
        });
        // Forzar salida si tarda más de 10s
        setTimeout(() => process.exit(1), 10_000).unref();
    };

    process.on('SIGINT',  () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch(err => {
    console.error('Fatal error during startup:', err);
    process.exit(1);
});
