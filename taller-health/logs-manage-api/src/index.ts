import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import projectRoutes from './app/routes/project-routes';
import { DataLog } from './app/database/database';
import NATSManager from './app/communication/nats-manager';
import healthServices from './app/logs-services/health-services';

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
}

main();
