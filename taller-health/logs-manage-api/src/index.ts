import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import projectRoutes from './app/routes/project-routes';
import { DataLog } from './app/database/database';
import NATSManager from './app/communication/nats-manager';
import healthServices from './app/logs-services/health-services';
import { collectDefaultMetrics, Registry, Counter, Gauge } from 'prom-client';


// Crear un registro para Prometheus
const registry = new Registry();

// Medidas personalizadas
const healthRequests = new Counter({
    name: 'health_requests_total',
    help: 'Total de solicitudes de verificación de salud.',
});

const dbStatusGauge = new Gauge({
    name: 'database_status',
    help: 'Estado de la conexión a la base de datos (1 = READY, 0 = DOWN).',
});

const natsStatusGauge = new Gauge({
    name: 'nats_status',
    help: 'Estado de la conexión a NATS (1 = READY, 0 = DOWN).',
});

// Registrar métricas predeterminadas y personalizadas
collectDefaultMetrics({ register: registry });
registry.registerMetric(healthRequests);
registry.registerMetric(dbStatusGauge);
registry.registerMetric(natsStatusGauge);



async function main() {
    const app = express();

    // Middleware
    app.use(cors());
    app.use(morgan('dev'));
    app.use(express.json()); // Este middleware analiza el cuerpo de la solicitud en formato JSON

    //ejecuta la toma de tiempo
    const hServices = new healthServices();

    // Rutas
    app.use(projectRoutes);

    // Ruta para métricas de Prometheus
    app.get('/api/v1/metrics', async (req, res) => {
        res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
        res.send(await registry.metrics());
    });


    // Obtener el valor de una variable de entorno
    var port = parseInt(process.env.PUERTO ?? '9091');

    //const port = 9091;
    app.listen(port, () => {
        console.log("Escuchando en el puerto ", port);
    });

    // Sync de la tabla de logs
    DataLog.sync();

    // conexion de NATS

    let natsHost = process.env.NATS_SERVER ?? 'localhost'

    // Crear una instancia de NATSManager y conectar a NATS
    const natsManager = new NATSManager('nats://' + natsHost + ':4222');
    await natsManager.connect();

    // Actualizar los estados de las métricas según el estado del sistema
    healthRequests.inc(); // Incrementar el contador de solicitudes de verificación de salud

    const dbConnectionStatus = await healthServices.verifyDatabaseConnection()// Implementa esta función para verificar la conexión
    dbStatusGauge.set(dbConnectionStatus ? 1 : 0); // 1 para READY, 0 para DOWN

    const natsConnectionStatus = await healthServices.verifyNatsConnection()// Verificar conexión a NATS
    natsStatusGauge.set(natsConnectionStatus ? 1 : 0); // 1 para READY, 0 para DOWN
}

main();
